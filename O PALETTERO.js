/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function PALETTERO_UTL(thisObj) {
	// Declaração da versão do script 'O Padeiro'
	var scriptName = 'O PALETTERO';
	var scriptVersion = 'v0.1b';

	#include 'utils/colorPicker.js';
	#include 'libraries/color lib.js';
	#include 'libraries/metadata lib.js';

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

	var colorArray = [
		'#05A6FF',
		'#80D2FF',
		'#8800f8',
		'#8640BF',
		'#004266',
		// '#F44336',
		// '#E81D62',
		// '#9B26AF',
		// '#6639B6',
		// '#3E50B4',
		// '#02A8F3',
		// '#00BBD3',
		// '#009587',
		// '#8AC249',
		// '#CCDB38',
		// '#FEEA3A',
		// '#FE9700',
		// '#FF5722',
		// '#785447',
		// '#9D9D9D',
		// '#5F7C8A'
	]

	// function limitArrayMaxValue(array, limit) {

	// 	for (var i = 0; i < array.length; i++) {

	// 		if (array[i] > limit) array[i] = limit;
	// 	}

	// 	return array;
	// }

	// function limitArrayMinValue(array, limit) {

	// 	for (var i = 0; i < array.length; i++) {

	// 		if (array[i] < limit) array[i] = limit;
	// 	}

	// 	return array;
	// }

	function colorBtn(sectionGrp, color) {
		var newUiCtrlObj = {};

		var isHEX = color.toString().match(/^#/);
		var hexCode = isHEX ? color : rgbToHEX(color);
		var rgbArray = isHEX ? hexToRGB(color) : color;
		var isDark = rgbToHsb(rgbArray)[2] < 80;

		var textColor = isDark ? [1, 1, 1, 0.5] : [0, 0, 0, 0.5];//limitArrayMaxValue(rgbArray * 2, 1) : limitArrayMinValue(rgbArray / 2, 0.1);

		newUiCtrlObj.swatch = sectionGrp.add('customButton');
		newUiCtrlObj.swatch.text = hexCode;
		newUiCtrlObj.swatch.swatchColor = rgbArray;
		newUiCtrlObj.swatch.textColor = textColor;

		newUiCtrlObj.swatch.minimumSize = [20, 20];
		newUiCtrlObj.swatch.helpTip = [
			'HEX: ' + hexCode,
			'RGB: ' + rgbToRGB(rgbArray).join(', ')
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

				try {
					this.swatchColor = colorPicker(this.swatchColor);
					this.text = rgbToHEX(this.swatchColor);
					this.helpTip = [
						'HEX: ' + hexCode,
						'RGB: ' + rgbToRGB(rgbArray).join(', ')
					].join('\n');

					drawColorButton(this, false);
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

			g.drawString(this.text, textPen, (w - textSize.width) / 2, h / 2 - textSize.height);
		};
	}

	// function themeBtn(sectionGrp, ctrlProperties) {
	// 	var newUiCtrlObj = {};

	// 	newUiCtrlObj.button = sectionGrp.add('customButton');
	// 	newUiCtrlObj.button.text = ctrlProperties.text;
	// 	newUiCtrlObj.button.buttonColor = hexToRGB(divColor1);
	// 	newUiCtrlObj.button.textColor = hexToRGB(normalColor1);

	// 	newUiCtrlObj.button.minimumSize = [20, 20];

	// 	drawThemeButton(newUiCtrlObj.button, false);

	// 	newUiCtrlObj.button.addEventListener('mouseover', function () {
	// 		drawThemeButton(this, true);
	// 	});

	// 	newUiCtrlObj.button.addEventListener('mouseout', function () {
	// 		drawThemeButton(this, false);
	// 	});

	// 	return newUiCtrlObj;
	// }

	// function drawThemeButton(button, hover) {
	// 	var g = button.graphics;
	// 	var textPen = g.newPen(g.PenType.SOLID_COLOR, button.textColor, 1);
	// 	var pathPen = g.newPen(g.PenType.SOLID_COLOR, button.buttonColor, 2);
	// 	var fillBrush = g.newBrush(g.BrushType.SOLID_COLOR, button.buttonColor);
	// 	var textSize = g.measureString(button.text);

	// 	button.onDraw = function () {

	// 		var h = this.size.height;
	// 		var w = this.size.width;

	// 		if (hover) {
	// 			textPen = g.newPen(g.PenType.SOLID_COLOR, [1, 1, 1, 1], 1);
	// 			fillBrush = g.newBrush(g.BrushType.SOLID_COLOR, hexToRGB(highlightColor1));
	// 		}
	// 		g.newPath();
	// 		g.rectPath(0, 0, w, h);
	// 		g.fillPath(fillBrush);
	// 		g.strokePath(pathPen);

	// 		g.drawString(this.text, textPen, (w - textSize.width) / 2, (h - textSize.height) / 2);
	// 	};
	// }

	// Altera a cor de fundo da janela.
	function setBgColor(w, hex) {
		var color = hexToRGB(hex);
		var bType = w.graphics.BrushType.SOLID_COLOR;
		w.graphics.backgroundColor = w.graphics.newBrush(bType, color);
	}

	function getPropertyColors(property, array) {

		for (var i = 1; i <= property.numProperties; i++) {

			if (!property.property(i).isModified) continue;
			
			var prop = property.property(i);
			
			if (prop.numProperties > 0) {
				getPropertyColors(prop, array);
				
			} else {
				
				try {
					
					if (prop.propertyValueType == 6418) {
						var val = prop.value;
						val.pop();
						array.push(val);
					}
				} catch (err) { }
			}
		}
		// alert(array);
		return array;
	}

	function getNestedProperties(property, array) {

		for (var i = 1; i <= property.numProperties; i++) {

			// alert(property.property(i).name);
			if (property.property(i).numProperties > 0) {

				getNestedProperties(property.property(i), array);
			} else {
				array.push(property.property(i));
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

		if (!(thisObj instanceof Panel)) PAL_w = new Window('palette', scriptName + ' ' + scriptVersion, undefined, { resizeable: true }); // Cria uma nova janela
		PAL_w.minimumSize = [(colorArray.length + 1) * 20 + 24, 36];
		PAL_w.orientation = 'row';
		PAL_w.spacing = 8;
		PAL_w.margins = 8;

		var btnGrp = PAL_w.add('group');
		btnGrp.orientation = 'column';
		btnGrp.spacing = 4;

		// var addBtn = new themeBtn(btnGrp, { text: '+' });
		// var editBtn = new themeBtn(btnGrp, { text: '≡' });
		var addBtn = btnGrp.add('button', undefined, '+');
		addBtn.minimumSize = [20, 8];
		var editBtn = btnGrp.add('button', undefined, '≡');
		editBtn.minimumSize = [20, 8];

		var swatchesGrp = PAL_w.add('group');
		swatchesGrp.spacing = 0;

		for (var c = 0; c < colorArray.length; c++) {

			new colorBtn(swatchesGrp, colorArray[c]);
		}
		setBgColor(PAL_w, bgColor1); // Cor de fundo da janela

		function PAL_layout() {

			var swatchesCount = swatchesGrp.children.length;
			var btnWidth = (PAL_w.size.width - 24) / (swatchesCount + 1);
			var btnHeight = PAL_w.size.height - 16;

			for (var b = 0; b < btnGrp.children.length; b++) {

				var btn = btnGrp.children[b];

				btn.size = [
					btnWidth,
					(btnHeight - 4) / 2
				];
			}
			for (var s = 0; s < swatchesCount; s++) {

				var swatch = swatchesGrp.children[s];
				swatch.text = rgbToHEX(swatch.swatchColor);

				swatch.size = [
					btnWidth,
					btnHeight
				];
				if ((PAL_w.size.width - 16) / swatchesCount < 50) swatch.text = '';
				swatch.notify('onDraw');
			}
			PAL_w.minimumSize = [(swatchesCount + 1) * 20 + 24, 36];
			PAL_w.layout.layout(true);
			PAL_w.layout.resize();
		}

		addBtn.onClick = function () {

			var aItem = app.project.activeItem;
			var selLayers = aItem != null ? aItem.selectedLayers : [];
			var newColorsArray = [];

			if (selLayers.length == 0) new colorBtn(swatchesGrp, new colorPicker());

			for (var i = 0; i < selLayers.length; i++) {

				var selProps = selLayers[i].selectedProperties;

				if (selProps.length == 0) new colorBtn(swatchesGrp, new colorPicker());

				getPropertyColors(selProps[0], newColorsArray);
			}

			if (newColorsArray.length == 0) newColorsArray.push([1, 1, 1, 1]);

			for (var c = 0; c < newColorsArray.length; c++) {

				try {
					new colorBtn(swatchesGrp, new colorPicker(newColorsArray[c]));
				} catch (err) { }
			}
			PAL_layout();
		};

		addBtn.addEventListener('click', function (c) {
			if (c.button == 2) {

				var aItem = app.project.activeItem;
				var selLayers = aItem != null ? aItem.selectedLayers : [];
				var newColorsArray = [];

				if (selLayers.length == 0) return;

				for (var i = 0; i < selLayers.length; i++) {

					var contents = undefined;
					var effects = selLayers[i].property('ADBE Effect Parade');
					var selProps = selLayers[i].selectedProperties;

					if (selProps.length == 0) {

						// for (var e = 1; e <= effects.numProperties; e++) {

						// 	selProps.push(effects.property(e));
						// }
						getPropertyColors(effects, newColorsArray);

						if (selLayers[i] instanceof ShapeLayer) {

							var contents = selLayers[i].property('ADBE Root Vectors Group');
							// var shpPropsArray = getNestedProperties(contents, []);
							getPropertyColors(contents, newColorsArray);
						}

						// 	selProps = selProps.concat(shpPropsArray);
						// 	// alert(selProps.length);
						// 	// getPropertyColors(contents, newColorsArray);
						// 	// alert('é shape layer');
						// 	// for (var e = 1; e <= contents.numProperties; e++) {
						// 	// 	alert(contents.property(e).name);
						// 	// 	selProps.push(contents.property(e));
						// 	// }
						// }
					}

					for (var p = 0; p < selProps.length; p++) {

						getPropertyColors(selProps[p], newColorsArray);
					}
				}

				for (var c = 0; c < newColorsArray.length; c++) {

					try {
						new colorBtn(swatchesGrp, newColorsArray[c]);
					} catch (err) { }
				}
				PAL_layout();
			}
		});

		PAL_w.onShow = PAL_w.onResizing = PAL_w.onResize = function () {
			PAL_layout();
		};

		return PAL_w;
	}

	var PALETTERO_WINDOW = PAL_WINDOW(thisObj);

	if (!(PALETTERO_WINDOW instanceof Panel)) PALETTERO_WINDOW.show();

	return PALETTERO_WINDOW;
}

// Executa tudo... ヽ(✿ﾟ▽ﾟ)ノ
PALETTERO_UTL(this);
