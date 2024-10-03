/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function PALETTERO_UTL(thisObj) {
	// Declaração da versão do script 'O Padeiro'
	var scriptName = 'PALETTERO';
	var scriptVersion = 'v0.1b';

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

	function colorBtn(sectionGrp, ctrlProperties) {
		var newUiCtrlObj = {};

		newUiCtrlObj.swatch = sectionGrp.add('customButton');
		newUiCtrlObj.swatch.width = ctrlProperties.width;
		newUiCtrlObj.swatch.height = ctrlProperties.height;
		newUiCtrlObj.swatch.text = ctrlProperties.color;
		newUiCtrlObj.swatch.buttonColor = ctrlProperties.color;
		newUiCtrlObj.swatch.textColor = '#FFFFFF';

		newUiCtrlObj.swatch.size = [
			newUiCtrlObj.swatch.width,
			newUiCtrlObj.swatch.height
		];
		newUiCtrlObj.swatch.minimumSize = [60, 20];
		newUiCtrlObj.swatch.helpTip = ctrlProperties.color;

		drawColorButton(newUiCtrlObj.swatch, false);

		newUiCtrlObj.swatch.addEventListener('mouseover', function () {
			drawColorButton(this, true);
		});

		newUiCtrlObj.swatch.addEventListener('mouseout', function () {
			drawColorButton(this, false);
		});

		newUiCtrlObj.swatch.onClick = function () {
			this.parent.children[0].notify();
		};

		newUiCtrlObj.swatch.addEventListener('click', function (c) {
			if (c.button == 2) this.parent.children[1].notify();
		});

		return newUiCtrlObj;
	}

	function drawColorButton(button, hover) {
		var g = button.graphics;
		var textPen = g.newPen(g.PenType.SOLID_COLOR, hexToRGB(button.textColor), 1);
		var pathPen = g.newPen(g.PenType.SOLID_COLOR, hexToRGB(button.buttonColor), 1);
		var fillBrush = g.newBrush(g.BrushType.SOLID_COLOR, hexToRGB(button.buttonColor));
		var textSize = g.measureString(button.text);

		if (hover) {
			pathPen = g.newPen(g.PenType.SOLID_COLOR, [1, 1, 1, 1], 4);
		}

		button.onDraw = function () {

			var h = this.height;
			var w = this.width;
			g.newPath();
			g.fillPath(fillBrush);
			g.rectPath(0, 0, w, h);
			g.fillPath(fillBrush);
			g.strokePath(pathPen);

			g.drawString(this.text, textPen, (w - textSize.width) / 2, h / 2 - textSize.height);
		};
	}

	var labels = [
		'#F44336',
		'#E81D62',
		'#9B26AF',
		'#6639B6',
		'#3E50B4',
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

	function PAL_WINDOW(thisObj) {
		var PAL_w = thisObj;

		if (!(thisObj instanceof Panel)) PAL_w = new Window('palette', scriptName + ' ' + scriptVersion);//, undefined, { resizeable: true }); // Cria uma nova janela
		PAL_w.minimumSize = [labels.length * 60 + 16, 36];
		PAL_w.margins = 8;

		var cGrp1 = PAL_w.add('group');
		cGrp1.spacing = 0;

		for (var c = 0; c < labels.length; c++) {
			var ctrlProperties = {
				width: 80,
				height: 80,
				color: labels[c],
			}

			var btn = new colorBtn(cGrp1, ctrlProperties);

			btn.swatch.onClick = function () {
				alert(this.text);
			};
		}
		PAL_w.layout.layout(true);

		PAL_w.onShow = function () {
			PAL_w.layout.layout(true);
		};

		PAL_w.onResizing = PAL_w.onResize = function () {

			for (var s = 0; s < cGrp1.children.length; s++) {

				cGrp1.children[s].width = [
					(PAL_w.width - 16) / cGrp1.children.length,
					PAL_w.height - 16
				];
			}
			PAL_w.layout.layout(true);
			PAL_w.layout.resize();
		};
	
		return PAL_w;
	}

	var PALETTERO_WINDOW = PAL_WINDOW(thisObj);

	if (!(PALETTERO_WINDOW instanceof Panel)) PALETTERO_WINDOW.show();

	return PALETTERO_WINDOW;
}

// Executa tudo... ヽ(✿ﾟ▽ﾟ)ノ
PALETTERO_UTL(this);
