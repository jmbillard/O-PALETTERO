/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function PALETTERO_UTL(thisObj) {
	// Declaração da versão do script 'O Padeiro'
	var scriptName = 'PALETTERO';
	var scriptVersion = 'v0.1b';

	#include 'colorPicker.js';
	// Converte uma string hexadecimal (com ou sem '#') para um array RGB normalizado.
	function hexToRGB(hex) {
		if (hex == undefined) return [Math.random(), Math.random(), Math.random()];

		// Remove o '#' se estiver presente
		hex = hex.replace('#', '');

		// Extrai os componentes RGB do hexadecimal e converte para valores de 0 a 255
		var r = parseInt(hex.substring(0, 2), 16);
		var g = parseInt(hex.substring(2, 4), 16);
		var b = parseInt(hex.substring(4, 6), 16);

		// Retorna o array com os valores RGB normalizados
		return [r / 255, g / 255, b / 255];
	}

	function colorBtn(sectionGrp, color) {
		var newUiCtrlObj = {};
		var colorVal = hexToRGB(color);

		newUiCtrlObj.swatch = sectionGrp.add('customButton');
		newUiCtrlObj.swatch.text = color;
		newUiCtrlObj.swatch.buttonColor = colorVal;
		newUiCtrlObj.swatch.textColor = [1, 1, 1, 1];

		newUiCtrlObj.swatch.minimumSize = [20, 20];
		newUiCtrlObj.swatch.helpTip = color;

		drawColorButton(newUiCtrlObj.swatch, false);

		newUiCtrlObj.swatch.addEventListener('mouseover', function () {
			drawColorButton(this, true);
		});

		newUiCtrlObj.swatch.addEventListener('mouseout', function () {
			drawColorButton(this, false);
		});


		return newUiCtrlObj;
	}

	function drawColorButton(button, hover) {
		var g = button.graphics;
		var textPen = g.newPen(g.PenType.SOLID_COLOR, button.textColor, 1);
		var pathPen = g.newPen(g.PenType.SOLID_COLOR, button.buttonColor, 1);
		var fillBrush = g.newBrush(g.BrushType.SOLID_COLOR, button.buttonColor);
		var textSize = g.measureString(button.text);

		button.onDraw = function () {

			var h = this.size.height;
			var w = this.size.width;

			if (hover) pathPen = g.newPen(g.PenType.SOLID_COLOR, [1, 1, 1, 1], 4);

			g.newPath();
			g.rectPath(0, 0, w, h);
			g.fillPath(fillBrush);
			g.strokePath(pathPen);

			g.drawString(this.text, textPen, (w - textSize.width) / 2, h / 2 - textSize.height);
		};
	}

	// Define a cor de um botão.
	function setUiCtrlColor(ctrl, color) {
		// var color = hexToRGB(hex);                           // Converte a cor hexadecimal em RGB.
		var bType = ctrl.graphics.BrushType.SOLID_COLOR;        // Define o tipo do pincel como cor sólida.
		ctrl.fillBrush = ctrl.graphics.newBrush(bType, color); // Cria um novo pincel com a cor e o aplica ao botão.
	}

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
		'#FF5722',
		'#785447',
		'#9D9D9D',
		'#5F7C8A'
	]

	function PAL_WINDOW(thisObj) {
		var PAL_w = thisObj;

		if (!(thisObj instanceof Panel)) PAL_w = new Window('palette', scriptName + ' ' + scriptVersion, undefined, { resizeable: true }); // Cria uma nova janela
		PAL_w.minimumSize = [colorArray.length * 20 + 16, 36];
		PAL_w.margins = 8;

		var cGrp1 = PAL_w.add('group');
		cGrp1.spacing = 0;

		for (var c = 0; c < colorArray.length; c++) {

			var btn = new colorBtn(cGrp1, colorArray[c]);

			btn.swatch.onClick = function () {
				var newColor = new colorPicker(this.buttonColor.replace('#', ''));
				// alert(newColor);
				setUiCtrlColor(this, newColor);
				this.notify('onDraw');
				// PAL_layout();
			};
		}

		function PAL_layout() {
			for (var s = 0; s < cGrp1.children.length; s++) {

				cGrp1.children[s].text = cGrp1.children[s].buttonColor;

				cGrp1.children[s].size = [
					(PAL_w.size.width - 16) / cGrp1.children.length,
					PAL_w.size.height - 16
				];
				if ((PAL_w.size.width - 16) / cGrp1.children.length < 50) cGrp1.children[s].text = '';
			}
			PAL_w.layout.layout(true);
			PAL_w.layout.resize();
		}

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
