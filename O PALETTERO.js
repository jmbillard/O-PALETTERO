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
		'#F44336',
		'#E81D62',
		'#9B26AF',
		'#6639B6',
		'#3E50B4',
		'#02A8F3',
		'#00BBD3',
		'#009587',
		'#8AC249',
		'#CCDB38',
		'#FEEA3A',
		'#FE9700',
		// '#FF5722',
		// '#785447',
		// '#9D9D9D',
		// '#5F7C8A'
	]

	function colorBtn(sectionGrp, color) {
		var newUiCtrlObj = {};

		var isHEX = color.toString().match(/^#/);
		var hexCode = isHEX ? color : rgbToHEX(color);
		var rgbArray = isHEX ? hexToRGB(color) : color;
		var isDark = rgbToHsb(rgbArray)[2] < 80;

		var textColor = isDark ? hexToRGB(monoColor0) : hexToRGB(bgColor1);

		newUiCtrlObj.swatch = sectionGrp.add('customButton');
		newUiCtrlObj.swatch.text = hexCode;
		newUiCtrlObj.swatch.swatchColor = rgbArray;
		newUiCtrlObj.swatch.textColor = textColor;

		newUiCtrlObj.swatch.minimumSize = [20, 20];
		newUiCtrlObj.swatch.helpTip = color;

		drawColorButton(newUiCtrlObj.swatch, false);

		newUiCtrlObj.swatch.addEventListener('mouseover', function () {
			drawColorButton(this, true);
		});

		newUiCtrlObj.swatch.addEventListener('mouseout', function () {
			drawColorButton(this, false);
		});
	
		newUiCtrlObj.swatch.onClick = function () {
			alert('clique esquerdo');
		};

		newUiCtrlObj.swatch.addEventListener('click', function (c) {

			if (c.button == 2) {

				try {
					this.swatchColor = colorPicker(this.swatchColor);
					this.helpTip = this.text = color = rgbToHEX(this.swatchColor);
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
			}
			PAL_w.minimumSize = [(swatchesCount + 1) * 20 + 24, 36];
			PAL_w.layout.layout(true);
			PAL_w.layout.resize();
		}

		addBtn.onClick = function () {

			try {
				new colorBtn(swatchesGrp, new colorPicker());
				PAL_layout();
			} catch (err) { }
		};

		// addBtn.addEventListener('click', function (c) {
		// 	if (c.button == 2) {
		// 		// this.parent.children[1].notify();
		// 	}
		// });
	
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
