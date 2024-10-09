/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function O_PALETTERO_UTL(thisObj) {
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

	// ---------------------------------------------------------------------------------

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

	// ---------------------------------------------------------------------------------

	function saveProjectPalette(sectionGrp) {

		var tempSwatchesArray = [];
		var swatchesCount = sectionGrp.children.length;

		for (var s = 0; s < swatchesCount; s++) {

			var colorGrp = sectionGrp.children[s];
			var swatch = colorGrp.children[0];
			var tempHEX = rgbToHEX(swatch.swatchColor);

			tempSwatchesArray.push(tempHEX);
		}

		var mData = new XMPMeta(app.project.xmpPacket);
		var schemaNS = XMPMeta.getNamespaceURI("xmp");
		var propName = "xmp:Label";

		try {
			if (swatchesCount > 0) {

				mData.setProperty(schemaNS, propName, tempSwatchesArray.join('-'));
			} else {

				mData.deleteProperty(schemaNS, propName);
			}

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
			'#F13333',
			'#FF4D4D',
			'#FE674C',
			'#FF8F4D',
			'#FFC44E',
			'#5DE6A2',
			'#80C0FE',
			'#B5ADFF',
			'#FF8CCD',
			'#FF739A',
			'#FF5A68',
		];

		try {
			var propVal = mData.getProperty(schemaNS, propName);
			var tempSwatchesArray = propVal.toString().split('-');

			if (tempSwatchesArray.length > 0 || propVal == 'null') swatchesArray = tempSwatchesArray;

		} catch (err) { }

		return swatchesArray;
	}

	function buildColorGrp(colorGrp, color) {

		var tempArray = [
			// {
			// 	color: secColor(color, 1.2),
			// 	secSwatch: true
			// },
			{
				color: color
			}
			// {
			// 	color: secColor(color, 0.8),
			// 	secSwatch: true
			// }
		];

		for (var c = 0; c < tempArray.length; c++) {
			new colorSwatch(colorGrp, tempArray[c]);
		}
	};

	function buildPalette(sectionGrp) {

		var tempSwatchesArray = loadProjectPalette();

		for (var s = 0; s < tempSwatchesArray.length; s++) {

			var colorGrp = sectionGrp.add('group');
			colorGrp.orientation = 'column';
			colorGrp.spacing = 0;

			buildColorGrp(colorGrp, tempSwatchesArray[s]);
		}
	}

	function sortPalette() {

		var tempSwatchesArray = sortHex(loadProjectPalette());

		var mData = new XMPMeta(app.project.xmpPacket);
		var schemaNS = XMPMeta.getNamespaceURI("xmp");
		var propName = "xmp:Label";

		try {
			if (tempSwatchesArray.length > 0) {
				mData.setProperty(schemaNS, propName, tempSwatchesArray.join('-'));

			} else {
				mData.deleteProperty(schemaNS, propName);
			}

		} catch (err) {
			alert(lol + '#PAL_02 - ' + err.message);
		}
		app.project.xmpPacket = mData.serialize();
	}

	// ---------------------------------------------------------------------------------

	function PAL_layout(win) {

		var w = win.size.width;
		var h = win.size.height;
		var isRow = w > h;
		var edge = isRow ? w : h * 1.8;

		var btnGrp1 = win.children[0];
		var swatchesGrp = win.children[1];
		var btnGrp2 = win.children[2];

		var grpOrientation = isRow ? 'row' : 'column';
		var btnOrientation = isRow ? 'column' : 'row';
		var btnAlignment = isRow ? ['center', 'top'] : 'center';

		btnCount = Math.max(btnGrp1.children.length, btnGrp2.children.length);
		btnGrpWidth = isRow ? 64 : btnCount * 32;
		btnGrpHeight = isRow ? btnCount * 32 : 64;

		win.orientation = grpOrientation;
		swatchesGrp.orientation = grpOrientation;
		btnGrp1.orientation = btnOrientation;
		btnGrp1.alignment = btnAlignment;
		btnGrp2.orientation = btnOrientation;
		btnGrp2.alignment = btnAlignment;

		var swatchesCount = swatchesGrp.children.length;

		var mainSwatchWidth = isRow ? (w - btnGrpWidth) / swatchesCount : w;
		var mainSwatchHeight = isRow ? h : (h - btnGrpHeight) / swatchesCount;

		// var secSwatchWidth = isRow ? mainSwatchWidth : 20;
		// var secSwatchHeight = isRow ? 20 : mainSwatchHeight;

		for (var s = 0; s < swatchesCount; s++) {

			var colorGrp = swatchesGrp.children[s];
			colorGrp.orientation = btnOrientation;

			// var swatch0 = colorGrp.children[0];
			var swatch1 = colorGrp.children[0];
			// var swatch2 = colorGrp.children[2];

			// swatch0.text = '';
			swatch1.text = rgbToHEX(swatch1.swatchColor);
			// swatch2.text = '';

			// swatch0.minimumSize = isRow ? [20, 20] : [20, 20];
			swatch1.minimumSize = isRow ? [20, btnGrpHeight] : [btnGrpWidth, 20];
			// swatch2.minimumSize = isRow ? [20, 20] : [20, 20];

			// swatch0.size = [secSwatchWidth, secSwatchHeight];
			swatch1.size = [mainSwatchWidth, mainSwatchHeight];
			// swatch2.size = [secSwatchWidth, secSwatchHeight];

			if ((edge - 64) / swatchesCount < 60) swatch1.text = '';
			colorGrp.layout.layout(true);
			swatchesGrp.layout.layout(true);
		}
		win.minimumSize = isRow ? [swatchesCount * 20 + btnGrpWidth, btnGrpHeight] : [btnGrpWidth, swatchesCount * 20 + btnGrpHeight];
		win.layout.layout(true);
		win.layout.resize();
	}

	// ---------------------------------------------------------------------------------

	function colorSwatch(sectionGrp, swatchProperties) {

		var newUiCtrlObj = {};
		var color = swatchProperties.color;

		var isHEX = color.toString().match(/^#/);
		var hexCode = isHEX ? color : rgbToHEX(color);
		var rgbArray = isHEX ? hexToRgb(color) : color;

		newUiCtrlObj.swatch = sectionGrp.add('customButton');
		newUiCtrlObj.swatch.text = hexCode;
		newUiCtrlObj.swatch.swatchColor = rgbArray;

		if (swatchProperties.secSwatch == undefined) swatchProperties.secSwatch = false;
		newUiCtrlObj.swatch.secSwatch = swatchProperties.secSwatch;

		// newUiCtrlObj.swatch.helpTip = [
		// 	'HEX: ' + hexCode,
		// 	'RGB: ' + rgbToRGB(rgbArray).join(', '),
		// 	'',
		// 	lClick + 'aplicar fill'
		// ].join('\n');

		// if (!swatchProperties.secSwatch) newUiCtrlObj.swatch.helpTip += [
		// 	'',
		// 	rClick + 'editar cor',
		// 	'',
		// 	'Alt + ' + rClick + 'excluir cor'
		// ].join('\n');

		drawColorSwatch(newUiCtrlObj.swatch, false);

		newUiCtrlObj.swatch.addEventListener('mouseover', function () {
			drawColorSwatch(this, true);
		});

		newUiCtrlObj.swatch.addEventListener('mouseout', function () {
			drawColorSwatch(this, false);
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

			if (this.secSwatch) return;

			var colorGrp = this.parent;
			var swatchesGrp = colorGrp.parent;
			var win = swatchesGrp.parent;
			if (c.button == 2) {

				if (ScriptUI.environment.keyboardState.altKey) {

					swatchesGrp.remove(colorGrp);

					saveProjectPalette(swatchesGrp);
					PAL_layout(win);

					return;
				}

				try {
					// var swatch0 = this.parent.children[0];
					// var swatch2 = this.parent.children[2];

					this.swatchColor = new colorPicker(this.swatchColor);
					// swatch0.swatchColor = hexToRgb(secColor(this.swatchColor, 1.2));
					// swatch2.swatchColor = hexToRgb(secColor(this.swatchColor, 0.8));

					this.text = rgbToHEX(this.swatchColor);
					// this.helpTip = [
					// 	'HEX: ' + hexCode,
					// 	'RGB: ' + rgbToRGB(rgbArray).join(', '),
					// 	'',
					// 	lClick + 'aplicar fill',
					// 	rClick + 'editar cor',
					// 	'',
					// 	'Alt + ' + lClick + 'excluir cor'
					// ].join('\n');

					drawColorSwatch(this, false);
					// drawColorSwatch(swatch0, false);
					// drawColorSwatch(swatch2, false);

					saveProjectPalette(swatchesGrp);

				} catch (err) { }
			}
		});

		return newUiCtrlObj;
	}

	function drawColorSwatch(button, hover) {

		var isDark = luminance(button.swatchColor) < 0.4;

		var textColor = isDark ? [1, 1, 1, 0.5] : [0, 0, 0, 0.5];

		var g = button.graphics;
		var textPen = g.newPen(g.PenType.SOLID_COLOR, textColor, 1);
		var pathPen = g.newPen(g.PenType.SOLID_COLOR, button.swatchColor, 2);
		var fillBrush = g.newBrush(g.BrushType.SOLID_COLOR, button.swatchColor);
		// var textSize = g.measureString(button.text);

		button.onDraw = function () {

			var h = this.size.height;
			var w = this.size.width;

			if (hover) pathPen = g.newPen(g.PenType.SOLID_COLOR, hexToRgb(normalColor1), 2);

			g.newPath();
			g.rectPath(0, 0, w, h);
			g.fillPath(fillBrush);
			g.strokePath(pathPen);

			if (!this.secSwatch) g.drawString(this.text, textPen, 10, 0);
		};
	}

	// ---------------------------------------------------------------------------------

	function setFgColor(ctrl, hex) {
		var color = hexToRgb(hex);
		var pType = ctrl.graphics.PenType.SOLID_COLOR;
		ctrl.graphics.foregroundColor = ctrl.graphics.newPen(pType, color, 1);
	}

	function setCtrlHighlight(ctrl, normalColor1, highlightColor1) {
		setFgColor(ctrl, normalColor1);

		ctrl.addEventListener('mouseover', function () {

			setFgColor(ctrl, highlightColor1);
		});
		ctrl.addEventListener('mouseout', function () {

			setFgColor(ctrl, normalColor1);
		});
	}

	// Altera a cor de fundo da janela.
	function setBgColor(w, hex) {

		var color = hexToRgb(hex);
		var bType = w.graphics.BrushType.SOLID_COLOR;
		w.graphics.backgroundColor = w.graphics.newBrush(bType, color);
	}

	// ---------------------------------------------------------------------------------

	function getPropertyColors(property, array) {

		var excludeArray = [
			'ADBE Material Options Group',
			'ADBE Plane Options Group',
			'ADBE Vector Materials Group'
		];

		for (var i = 1; i <= property.numProperties; i++) {

			var prop = property.property(i);

			if (excludeArray.indexOf(prop.matchName) >= 0) continue;
			if (!prop.enabled) continue;

			if (prop.numProperties > 0) {
				getPropertyColors(prop, array);

			} else {

				try {

					if (prop.propertyValueType == 6418) {
						var refHEX = rgbToHEX(prop.value);

						if (array.indexOf(refHEX) >= 0) continue;
						if (refHEX == '#FF0000' && !prop.isModified) continue;
						
						// alert(prop.name + ': ' + prop.parentProperty.matchName);
						array.push(refHEX);
					}
				} catch (err) { }
			}
		}

		return array;
	}

	// ---------------------------------------------------------------------------------

	function applyFillColor(layer, color) {

		var effects = layer.property('ADBE Effect Parade');
		var fillFx = effects.addProperty('ADBE Fill');
		fillFx.name = rgbToHEX(color);
		fillFx.property('ADBE Fill-0002').setValue(color);
	}

	// ---------------------------------------------------------------------------------

	function PAL_WINDOW(thisObj) {
		var PAL_w = thisObj;

		if (!(thisObj instanceof Panel)) PAL_w = new Window('palette', scriptName + ' ' + scriptVersion, undefined, { resizeable: true }); // Cria uma nova janela
		PAL_w.orientation = 'row';
		PAL_w.spacing = 0;
		PAL_w.margins = 0;

		var btnGrp1 = PAL_w.add('group');
		btnGrp1.orientation = 'column';
		btnGrp1.spacing = 0;

		var addBtn = btnGrp1.add('statictext', undefined, '+');
		addBtn.preferredSize = [32, 32];
		addBtn.justify = 'center';
		addBtn.helpTip = [
			lClick + 'adicionar uma nova cor',
			rClick + 'adicionar todas as cores dos layers selecionados',
		].join('\n');
		setCtrlHighlight(addBtn, normalColor1, highlightColor1);

		var refreshBtn = btnGrp1.add('statictext', undefined, '⟲');
		refreshBtn.justify = 'center';
		refreshBtn.preferredSize = [32, 32];
		refreshBtn.helpTip = [
			lClick + 'atualizar paleta',
			rClick + 'ordenar paleta'
		].join('\n');
		setCtrlHighlight(refreshBtn, normalColor1, highlightColor1);

		var swatchesGrp = PAL_w.add('group');
		swatchesGrp.spacing = 0;

		var btnGrp2 = PAL_w.add('group');
		btnGrp2.orientation = 'column';
		btnGrp2.spacing = 0;

		var prefBtn = btnGrp2.add('statictext', undefined, '≡');
		prefBtn.justify = 'center';
		prefBtn.preferredSize = [32, 32];
		prefBtn.enabled = false;
		// setCtrlHighlight(prefBtn, normalColor1, highlightColor1);

		setBgColor(PAL_w, bgColor1);
		buildPalette(swatchesGrp);

		// ---------------------------------------------------------------------------------

		addBtn.addEventListener('click', function (c) {

			var aItem = app.project.activeItem;
			var selLayers = aItem != null ? aItem.selectedLayers : [];
			var refArray = loadProjectPalette();
			var newColorsArray = loadProjectPalette();

			if (c.button == 0) {

				for (var i = 0; i < selLayers.length; i++) {

					var selProps = selLayers[i].selectedProperties;

					for (var p = 0; p < selProps.length; p++) {

						newColorsArray = getPropertyColors(selProps[p], newColorsArray);
					}
				}
			}

			if (c.button == 2) {

				if (selLayers.length == 0) return;

				for (var i = 0; i < selLayers.length; i++) {

					var contents = undefined;
					var effects = selLayers[i].property('ADBE Effect Parade');

					newColorsArray = getPropertyColors(effects, newColorsArray);

					if (selLayers[i] instanceof ShapeLayer) {

						var contents = selLayers[i].property('ADBE Root Vectors Group');
						newColorsArray = getPropertyColors(contents, newColorsArray);
					}
					if (selLayers[i] instanceof TextLayer) {

						var text = selLayers[i].property('ADBE Text Properties');
						var textDoc = text.property('ADBE Text Document').value;

						if (textDoc.applyFill) {

							var tempHex = rgbToHEX(textDoc.fillColor);
							if (newColorsArray.indexOf(tempHex) < 0) newColorsArray.push(tempHex);
						}
						if (textDoc.applyStroke) {

							var tempHex = rgbToHEX(textDoc.strokeColor);
							if (newColorsArray.indexOf(tempHex) < 0) newColorsArray.push(tempHex);
						}

						newColorsArray = getPropertyColors(text, newColorsArray);
					}
				}
			}

			if (newColorsArray.length > refArray.length) {

				for (var c = 0; c < newColorsArray.length; c++) {

					if (refArray.indexOf(newColorsArray[c]) >= 0) continue;

					var colorGrp = swatchesGrp.add('group');
					colorGrp.orientation = 'column';
					colorGrp.spacing = 0;

					buildColorGrp(colorGrp, newColorsArray[c]);
				}
			}

			if (newColorsArray.length == refArray.length) {
				try {
					var tempHex = rgbToHEX(new colorPicker());

					var colorGrp = swatchesGrp.add('group');
					colorGrp.orientation = 'column';
					colorGrp.spacing = 0;

					buildColorGrp(colorGrp, tempHex);

				} catch (err) { }
			}
			saveProjectPalette(swatchesGrp);
			PAL_layout(PAL_w);
		});

		// ---------------------------------------------------------------------------------

		refreshBtn.addEventListener('click', function (c) {

			while (swatchesGrp.children.length > 0) {

				swatchesGrp.remove(swatchesGrp.children[0]);
			}

			if (c.button == 2) sortPalette();

			buildPalette(swatchesGrp);
			PAL_layout(PAL_w);
		});

		// ---------------------------------------------------------------------------------

		// sortBtn.addEventListener('click', function (c) {

		// 	if (c.button == 0) {

		// 		while (swatchesGrp.children.length > 0) {

		// 			swatchesGrp.remove(swatchesGrp.children[0]);
		// 		}
		// 		sortPalette(swatchesGrp);
		// 		saveProjectPalette(swatchesGrp);
		// 		PAL_layout(PAL_w);
		// 	}
		// });

		// ---------------------------------------------------------------------------------

		PAL_w.onShow = PAL_w.onResizing = PAL_w.onResize = function () {
			PAL_layout(PAL_w);
		};

		return PAL_w;
	}

	var O_PALETTERO_WINDOW = PAL_WINDOW(thisObj);

	if (!(O_PALETTERO_WINDOW instanceof Panel)) O_PALETTERO_WINDOW.show();

	return O_PALETTERO_WINDOW;
}

// Executa tudo... ヽ(✿ﾟ▽ﾟ)ノ
O_PALETTERO_UTL(this);
