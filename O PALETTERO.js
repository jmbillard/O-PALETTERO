/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function PALETTERO_UTL(thisObj) {
	// Declaração da versão do script 'O Padeiro'
	var scriptName = 'O PALETTERO';
	var scriptVersion = 'v0.1b';

	#include 'utils/colorPicker.js';
	#include 'libraries/color lib.js';
	#include 'libraries/metadata lib.js';

	// Emojis e mensagens (opcional)
	var lol = 'Σ(っ °Д °;)っ        ';
	var relax = 'ヽ(✿ﾟ▽ﾟ)ノ        ';

	var lClick = '◖  →  ';
	var rClick = ' ◗  →  ';
	var dClick = '◖◖ →  ';

	// Cores do Style Guide GLOBO
	var bgColor1 = '#0B0D0E';
	var bgColor2 = '#060F13';
	var divColor1 = '#002133';
	var divColor2 = '#004266';
	var monoColor0 = '#F2F2F2';
	var monoColor1 = '#C7C8CA';
	var monoColor2 = '#939598';
	var monoColor3 = '#4B4C4E';
	var normalColor1 = '#05A6FF';
	var normalColor2 = '#80D2FF';
	var highlightColor1 = '#8800f8';
	var highlightColor2 = '#8640BF';

	// indexOf() definition...
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (element, startPoint) {
			var k;

			if (this == null) {
				throw new TypeError(
					'"this" é nulo (null) ou não foi definido (undefined)',
				);
			}
			var O = Object(this);
			var aSize = O.length >>> 0;

			if (aSize == 0) return -1;

			var n = +startPoint || 0;

			if (Math.abs(n) == Infinity) n = 0;

			if (n >= aSize) return -1;

			k = Math.max(n >= 0 ? n : aSize - Math.abs(n), 0);

			while (k < aSize) {
				if (k in O && O[k] == element) return k;

				k++;
			}
			return -1;
		};
	}

	function saveProjectPalette(sectionGrp) {

		var tempSwatchesArray = [];
		var swatchesCount = sectionGrp.children.length;

		if (swatchesCount == 0) return;

		for (var s = 0; s < swatchesCount; s++) {

			var swatch = sectionGrp.children[s];
			var tempHEX = rgbToHEX(swatch.swatchColor);

			tempSwatchesArray.push(tempHEX);
		}

		var mData = new XMPMeta(app.project.xmpPacket);
		var schemaNS = XMPMeta.getNamespaceURI("xmp");
		var propName = "xmp:Label";

		try {
			mData.setProperty(schemaNS, propName, tempSwatchesArray.join('-'));

		} catch (err) {
			alert(lol + '#PAL_01 - ' + err.message);
		}

		app.project.xmpPacket = mData.serialize();
	}

	function loadProjectPalette() {

		var mData = new XMPMeta(app.project.xmpPacket);
		var schemaNS = XMPMeta.getNamespaceURI("xmp");
		var propName = "xmp:Label";

		var swatchesArray = [
			'#05A6FF',
			'#80D2FF',
			'#8800f8',
			'#8640BF',
			'#004266'
		];

		try {
			var tempSwatchesArray = mData.getProperty(schemaNS, propName).toString().split('-');

			if (tempSwatchesArray.length > 0) swatchesArray = tempSwatchesArray;

		} catch (err) { }

		return swatchesArray;
	}

	function PAL_layout(win) {

		var w = win.size.width;
		var h = win.size.height;
		var isRow = w > h;
		var edge = isRow ? w : h;

		var swatchesGrp = win.children[1];
		var btnGrp = win.children[0];

		var grpOrientation = isRow ? 'row' : 'column';
		var btnOrientation = isRow ? 'column' : 'row';

		win.orientation = grpOrientation;
		swatchesGrp.orientation = grpOrientation;
		btnGrp.orientation = btnOrientation;

		var swatchesCount = swatchesGrp.children.length;
		var btnWidth = isRow ? (w - 24) / (swatchesCount + 1) : w - 16;
		var btnHeight = isRow ? h - 16 : (h - 24) / (swatchesCount + 1);

		for (var b = 0; b < btnGrp.children.length; b++) {

			var btn = btnGrp.children[b];

			btn.size = isRow ? [
				btnWidth,
				(btnHeight - 4) / 2
			] : [
				(btnWidth - 4) / 2,
				btnHeight
			];
		}
		for (var s = 0; s < swatchesCount; s++) {

			var swatch = swatchesGrp.children[s];
			swatch.text = rgbToHEX(swatch.swatchColor);

			swatch.minimumSize = isRow ? [20, 44] : [44, 20];
			swatch.size = [
				btnWidth,
				btnHeight
			];
			if ((edge - 16) / swatchesCount < 64) swatch.text = '';
		}
		win.minimumSize = isRow ? [(swatchesCount + 1) * 20 + 24, 36] : [36, (swatchesCount + 1) * 20 + 24];
		win.layout.layout(true);
		win.layout.resize();
	}


	function colorBtn(sectionGrp, color) {

		var newUiCtrlObj = {};

		var isHEX = color.toString().match(/^#/);
		var hexCode = isHEX ? color : rgbToHEX(color);
		var rgbArray = isHEX ? hexToRGB(color) : color;
		var isDark = rgbToHsb(rgbArray)[2] < 80;

		var textColor = isDark ? [1, 1, 1, 0.5] : [0, 0, 0, 0.5];

		newUiCtrlObj.swatch = sectionGrp.add('customButton');
		newUiCtrlObj.swatch.text = hexCode;
		newUiCtrlObj.swatch.swatchColor = rgbArray;
		newUiCtrlObj.swatch.textColor = textColor;

		newUiCtrlObj.swatch.minimumSize = [20, 44];
		newUiCtrlObj.swatch.helpTip = [
			'HEX: ' + hexCode,
			'RGB: ' + rgbToRGB(rgbArray).join(', '),
			'',
			lClick + 'aplicar fill',
			rClick + 'editar cor',
			'',
			'Alt + ' + rClick + 'excluir cor'
		].join('\n');

		drawColorButton(newUiCtrlObj.swatch, false);

		newUiCtrlObj.swatch.addEventListener('mouseover', function () {
			drawColorButton(this, true);
		});

		newUiCtrlObj.swatch.addEventListener('mouseout', function () {
			drawColorButton(this, false);
		});

		newUiCtrlObj.swatch.onClick = function () {

			var aItem = app.project.activeItem;
			var selLayers = aItem != null ? aItem.selectedLayers : [];

			if (selLayers.length == 0) return;

			app.beginUndoGroup('O PALETTERO FILL ' + rgbToHEX(this.swatchColor));

			for (var i = 0; i < selLayers.length; i++) {

				applyFillColor(selLayers[i], this.swatchColor);
			}

			app.endUndoGroup();
		};

		newUiCtrlObj.swatch.addEventListener('click', function (c) {

			if (c.button == 2) {

				if (ScriptUI.environment.keyboardState.altKey) {

					var pGrp = this.parent;
					var win = pGrp.parent;
					var bGrp = win.children[0];
					pGrp.remove(this);

					saveProjectPalette(sectionGrp);
					PAL_layout(win);

					return;
				}

				try {
					this.swatchColor = colorPicker(this.swatchColor);
					this.text = rgbToHEX(this.swatchColor);
					this.helpTip = [
						'HEX: ' + hexCode,
						'RGB: ' + rgbToRGB(rgbArray).join(', '),
						'',
						lClick + 'aplicar fill',
						rClick + 'editar cor',
						'',
						'Alt + ' + lClick + 'excluir cor'
					].join('\n');

					drawColorButton(this, false);
					saveProjectPalette(sectionGrp);

				} catch (err) { }
			}
		});

		return newUiCtrlObj;
	}

	function drawColorButton(button, hover) {
		var g = button.graphics;
		var textPen = g.newPen(g.PenType.SOLID_COLOR, button.textColor, 1);
		var pathPen = g.newPen(g.PenType.SOLID_COLOR, button.swatchColor, 2);
		var fillBrush = g.newBrush(g.BrushType.SOLID_COLOR, button.swatchColor);
		var textSize = g.measureString(button.text);

		button.onDraw = function () {

			var h = this.size.height;
			var w = this.size.width;

			if (hover) pathPen = g.newPen(g.PenType.SOLID_COLOR, hexToRGB(normalColor1), 2);

			g.newPath();
			g.rectPath(0, 0, w, h);
			g.fillPath(fillBrush);
			g.strokePath(pathPen);

			g.drawString(this.text, textPen, 10, 0);
		};
	}

	// Altera a cor de fundo da janela.
	function setBgColor(w, hex) {

		var color = hexToRGB(hex);
		var bType = w.graphics.BrushType.SOLID_COLOR;
		w.graphics.backgroundColor = w.graphics.newBrush(bType, color);
	}

	function getPropertyColors(property, array) {

		for (var i = 1; i <= property.numProperties; i++) {

			var valCheck = property.property(i).value == [1, 0, 0, 1];

			if (!property.property(i).isModified) continue;

			var prop = property.property(i);

			if (prop.numProperties > 0) {
				getPropertyColors(prop, array);

			} else {

				try {
					
					if (prop.propertyValueType == 6418) {
						var val = prop.value;
						val.pop();
						var refHEX = rgbToHEX(val);

						if (array.indexOf(refHEX) >= 0) continue;
						
						array.push(refHEX);
					}
				} catch (err) { }
			}
		}

		return array;
	}

	function applyFillColor(layer, color) {
		// fx...
		var effects = layer.property('ADBE Effect Parade');

		// 'fill' effect...
		var fillFx = effects.addProperty('ADBE Fill');
		fillFx.name = rgbToHEX(color);
		fillFx.property('ADBE Fill-0002').setValue(color);
	}

	function PAL_WINDOW(thisObj) {
		var PAL_w = thisObj;
		var colorArray = loadProjectPalette();

		if (!(thisObj instanceof Panel)) PAL_w = new Window('palette', scriptName + ' ' + scriptVersion, undefined, { resizeable: true }); // Cria uma nova janela
		PAL_w.minimumSize = [(colorArray.length + 1) * 20 + 24, 36];
		PAL_w.orientation = 'row';
		PAL_w.spacing = 8;
		PAL_w.margins = 8;

		var btnGrp = PAL_w.add('group');
		btnGrp.orientation = 'column';
		btnGrp.spacing = 4;

		var addBtn = btnGrp.add('button', undefined, '+');
		addBtn.minimumSize = [20, 20];
		addBtn.helpTip = [
			lClick + 'adicionar uma nova cor',
			'Alt + ' + lClick + 'adicionar cor(es) do layer(s) selecionado(s)',
			rClick + 'recarregar paleta',
		].join('\n');

		// var refreshBtn = btnGrp.add('button', undefined, '≡');
		// var refreshBtn = btnGrp.add('button', undefined, '↺');
		var refreshBtn = btnGrp.add('button', undefined, '⟲');
		refreshBtn.minimumSize = [20, 20];
		refreshBtn.helpTip = 'atualizar paleta';
		// refreshBtn.enabled = false;

		var swatchesGrp = PAL_w.add('group');
		swatchesGrp.spacing = 0;

		for (var c = 0; c < colorArray.length; c++) {

			new colorBtn(swatchesGrp, colorArray[c]);
		}

		setBgColor(PAL_w, bgColor1);

		addBtn.onClick = function () {

			var aItem = app.project.activeItem;
			var selLayers = aItem != null ? aItem.selectedLayers : [];
			var newColorsArray = loadProjectPalette();
			var refArray = loadProjectPalette();

			for (var i = 0; i < selLayers.length; i++) {

				var selProps = selLayers[i].selectedProperties;

				if (selProps.length == 0) continue;

				newColorsArray = getPropertyColors(selProps[0], newColorsArray);
			}

			if (selLayers.length == 0 || newColorsArray == refArray) newColorsArray.push('#FFFFFF');

			for (var c = 0; c < newColorsArray.length; c++) {

				// alert(refArray.indexOf(newColorsArray[c]));
				if (refArray.indexOf(newColorsArray[c]) >= 0) continue;

				try {
					new colorBtn(swatchesGrp, new colorPicker(newColorsArray[c]));
				} catch (err) { }
			}
			saveProjectPalette(swatchesGrp);
			PAL_layout(PAL_w);
		};

		addBtn.addEventListener('click', function (c) {
			if (c.button == 2) {

				var aItem = app.project.activeItem;
				var selLayers = aItem != null ? aItem.selectedLayers : [];
				var refArray = loadProjectPalette();
				var newColorsArray = loadProjectPalette();

				if (selLayers.length == 0) return;

				for (var i = 0; i < selLayers.length; i++) {

					var contents = undefined;
					var effects = selLayers[i].property('ADBE Effect Parade');
					var selProps = selLayers[i].selectedProperties;

					if (selProps.length == 0) {

						newColorsArray = getPropertyColors(effects, newColorsArray);

						if (selLayers[i] instanceof ShapeLayer) {

							var contents = selLayers[i].property('ADBE Root Vectors Group');
							newColorsArray = getPropertyColors(contents, newColorsArray);
						}
					}

					for (var p = 0; p < selProps.length; p++) {

						newColorsArray = getPropertyColors(selProps[p], newColorsArray);
					}
				}

				for (var c = 0; c < newColorsArray.length; c++) {

					if (refArray.indexOf(newColorsArray[c]) >= 0) continue;

					try {
						new colorBtn(swatchesGrp, newColorsArray[c]);
					} catch (err) { }
				}
				saveProjectPalette(swatchesGrp);
				PAL_layout(PAL_w);
			}
		});

		refreshBtn.onClick = function () {

			while (swatchesGrp.children.length > 0) {

				swatchesGrp.remove(swatchesGrp.children[0]);
			}

			colorArray = loadProjectPalette();

			for (var c = 0; c < colorArray.length; c++) {

				new colorBtn(swatchesGrp, colorArray[c]);
			}
			PAL_layout(PAL_w);
		};

		PAL_w.onShow = PAL_w.onResizing = PAL_w.onResize = function () {
			PAL_layout(PAL_w);
		};

		return PAL_w;
	}

	var PALETTERO_WINDOW = PAL_WINDOW(thisObj);

	if (!(PALETTERO_WINDOW instanceof Panel)) PALETTERO_WINDOW.show();

	return PALETTERO_WINDOW;
}

// Executa tudo... ヽ(✿ﾟ▽ﾟ)ノ
PALETTERO_UTL(this);
