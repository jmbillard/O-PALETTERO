function themeButton(sectionGrp, ctrlProperties) {
	if (ctrlProperties.buttonColor === undefined) ctrlProperties.buttonColor = divColor1;
	if (ctrlProperties.textColor === undefined) ctrlProperties.textColor = normalColor1;

	var newUiCtrlObj = {};

	newUiCtrlObj.button = sectionGrp.add('customButton');
	newUiCtrlObj.button.size = [ctrlProperties.width, ctrlProperties.height];
	newUiCtrlObj.button.text = ctrlProperties.text;
	newUiCtrlObj.button.buttonColor = hexToRgb(ctrlProperties.buttonColor);
	newUiCtrlObj.button.textColor = hexToRgb(ctrlProperties.textColor);

	drawThemeButton(newUiCtrlObj.button);

	newUiCtrlObj.button.addEventListener('mouseover', function () {
		this.textColor = [1, 1, 1, 1];
		this.buttonColor = hexToRgb(highlightColor1);
		drawThemeButton(this);
	});

	newUiCtrlObj.button.addEventListener('mouseout', function () {
		this.textColor = hexToRgb(ctrlProperties.textColor);
		this.buttonColor = hexToRgb(ctrlProperties.buttonColor);
		drawThemeButton(this);
	});

	return newUiCtrlObj;
}

function drawThemeButton(button) {
	var g = button.graphics;
	var textPen = g.newPen(g.PenType.SOLID_COLOR, button.textColor, 1);
	var fillBrush = g.newBrush(g.BrushType.SOLID_COLOR, button.buttonColor);
	var margin = 6;

	button.onDraw = function () {
		var h = this.size.height;
		var w = this.size.width;

		g.ellipsePath(0, 0, h, h);
		g.ellipsePath(w - h, 0, h, h);
		g.rectPath(h / 2, 0, w - h, h);
		g.fillPath(fillBrush);

		if (this.text.trim() == '') return;
		if (w < margin * 2 + 6) return;

		var textLinesArray = this.text.split('\n');
		var pyInc = 12;

		for (var l = 0; l < textLinesArray.length; l++) {
			var txtW = g.measureString(textLinesArray[l]).width;

			if (txtW > w - margin * 2) {
				textLinesArray[l] = textLinesArray[l].substring(0, textLinesArray[l].length - 2);

				while (txtW > w - 6 - margin * 2) {
					var end = textLinesArray[l].length - 1;
					textLinesArray[l] = textLinesArray[l].substring(0, end);

					txtW = parseInt(g.measureString(textLinesArray[l]));
				}
				textLinesArray[l] += '...';
			}
			var px = (w - txtW) / 2;
			var py = l == 0 ? (-(textLinesArray.length - 1) / 2) * pyInc : (py += pyInc);

			if (appV > 24 && l == 0) py += 8;

			g.drawString(textLinesArray[l], textPen, px, py);
		}
	};
}

function buildColorGrp(colorGrp, color) {
	var swatchProperties = {
		color: color,
		width: 40,
		height: 18,
		label: 'cor ' + colorGrp.parent.children.length
	};

	// for (var c = 0; c < tempArray.length; c++) {
	new colorSwatch(colorGrp, swatchProperties);
	// }
}

function buildPalette(sectionGrp) {
	var palletObj = new loadProjectPalette();
	var tempSwatchesArray = palletObj.swatchesArray;
	var tempLabelsArray = palletObj.labelsArray;

	// alert(tempSwatchesArray);

	for (var s = 0; s < tempSwatchesArray.length; s++) {
		var colorGrp = sectionGrp.add('group');
		colorGrp.alignment = 'fill';

		var swatchProperties = {
			color: tempSwatchesArray[s],
			label: tempLabelsArray[s],
			width: 64,
			height: 64,
			index: s
		};

		new colorSwatch(colorGrp, swatchProperties);
	}
}

function swatchListItem(swatchesGrp, swatchColor, colorLabel) {

	var colorGrp = swatchesGrp.add('group');
	colorGrp.spacing = 8;

	var swatchProperties = {
		color: swatchColor,
		label: colorLabel,
		width: 8,
		height: 26,
		noEvents: true,
		index: swatchesGrp.children.length
	};
	var color = new colorSwatch(colorGrp, swatchProperties);

	txtGrp = colorGrp.add('group');
	txtGrp.orientation = 'stack';

	var colorNameLab = txtGrp.add('statictext', [0, 0, 160, 26], swatchProperties.label);
	setCtrlHighlight(colorNameLab, monoColor0, highlightColor1);

	var colorNameTxt = txtGrp.add('edittext', [0, 0, 160, 26], swatchProperties.label);
	colorNameTxt.visible = false;

	var removeBtn = colorGrp.add('statictext', [0, 0, 8, 26], 'x');
	setCtrlHighlight(removeBtn, normalColor1, highlightColor1);

	removeBtn.addEventListener('click', function () {
		var colorGrp = this.parent;
		var swatchesGrp = colorGrp.parent;
		var panel = swatchesGrp.parent;

		swatchesGrp.remove(colorGrp);

		panel.layout.layout(true);
		panel.children[0].maxvalue = swatchesGrp.size.height - panel.size.height;
	});

	colorNameLab.addEventListener('click', function () {
		this.visible = false;
		this.parent.children[1].text = this.text;
		this.parent.children[1].visible = true;
		this.parent.children[1].active = true;
	});

	colorNameTxt.onChange = colorNameTxt.onEnterKey = function () {
		this.text = this.text.replace(/[\:\-]/g, ' ');
		this.visible = false;

		this.parent.children[0].text = this.text;
		this.parent.children[0].visible = true;
		this.parent.children[0].active = true;

		this.parent.parent.children[0].label = this.text;
	};

	colorNameTxt.addEventListener('blur', function () {
		this.text = this.text.replace(/[\:\-]/g, ' ');
		this.visible = false;

		this.parent.children[0].text = this.text;
		this.parent.children[0].visible = true;
		this.parent.children[0].active = true;

		this.parent.parent.children[0].label = this.text;
	});

	color.swatch.onClick = function () {
		var colorGrp = this.parent;
		var swatchesGrp = colorGrp.parent;

		try {
			this.swatchColor = new colorPicker(this.swatchColor);
			drawColorSwatch(this, false);
			// saveProjectPalette(swatchesGrp);
		} catch (err) { }
	};
}

function sortPalette() {
	var tempData = sortHex(loadProjectPalette());

	var mData = new XMPMeta(app.project.xmpPacket);
	var schemaNS = XMPMeta.getNamespaceURI('xmp');
	var propName = 'xmp:Label';

	try {
		if (tempData.swatchesArray.length > 0) {
			var tempDataArray = [];

			for (var s = 0; s < tempData.swatchesArray.length; s++) {
				var tempColor = tempData.swatchesArray[s];
				var tempName = tempData.labelsArray[s];

				tempItem = tempName == tempColor ? tempColor : tempColor + ':' + tempName;
				tempDataArray.push(tempItem);
			}
			mData.setProperty(schemaNS, propName, tempDataArray.join('-'));
		} else {
			mData.deleteProperty(schemaNS, propName);
		}
	} catch (err) {
		alert(lol + '#PAL_02 - ' + err.message);
	}
	app.project.xmpPacket = mData.serialize();
}

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

function themeDivider(sectionGrp) {
	var newDiv = sectionGrp.add('customButton', [0, 0, 1, 1]);
	newDiv.alignment = sectionGrp.orientation == 'column' ? ['fill', 'center'] : ['center', 'fill'];

	setUiCtrlColor(newDiv, divColor1);
	newDiv.onDraw = customDraw;

	return newDiv;
}

function customDraw() {
	with (this) {
		graphics.drawOSControl();
		graphics.rectPath(0, 0, size[0], size[1]);
		graphics.fillPath(fillBrush);
	}
}

function setUiCtrlColor(ctrl, hex) {
	var color = hexToRgb(hex);
	var bType = ctrl.graphics.BrushType.SOLID_COLOR;
	ctrl.fillBrush = ctrl.graphics.newBrush(bType, color);
}

function colorSwatch(sectionGrp, swatchProperties) {
	var newUiCtrlObj = {};
	var color = swatchProperties.color;

	var isHEX = color.toString().match(/^#/);
	var rgbArray = isHEX ? hexToRgb(color) : color;

	if (swatchProperties.index == undefined) swatchProperties.index = 0;
	if (swatchProperties.label == undefined) swatchProperties.label = '';

	newUiCtrlObj.swatch = sectionGrp.add('customButton');
	newUiCtrlObj.swatch.alignment = 'fill';
	newUiCtrlObj.swatch.text = '';
	newUiCtrlObj.swatch.size = [swatchProperties.width, swatchProperties.height];
	newUiCtrlObj.swatch.swatchColor = rgbArray;
	newUiCtrlObj.swatch.index = swatchProperties.index;
	newUiCtrlObj.swatch.label = swatchProperties.label;

	drawColorSwatch(newUiCtrlObj.swatch, false);

	if (swatchProperties.noEvents) return newUiCtrlObj;

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
		var colorGrp = this.parent;
		var swatchesGrp = colorGrp.parent;
		var win = swatchesGrp.parent;

		if (c.button == 2) {
			var tempLabel = this.label;

			try {
				if (ScriptUI.environment.keyboardState.altKey) {
					swatchesGrp.remove(colorGrp);
				} else {
					var newColor = new colorPicker(this.swatchColor);
					new colorSwatch(colorGrp, { color: newColor, label: tempLabel });
					colorGrp.remove(this);
				}
				saveProjectPalette(swatchesGrp);
				PAL_layout(win);
			} catch (err) { }
		}
	});

	return newUiCtrlObj;
}

function drawColorSwatch(button, hover) {
	var isDark = luminance(button.swatchColor) < 0.4;
	var margin = 6;

	var textColor = isDark ? [1, 1, 1, 0.5] : [0, 0, 0, 0.5];

	var g = button.graphics;
	var textPen = g.newPen(g.PenType.SOLID_COLOR, textColor, 1);
	var pathPen = g.newPen(g.PenType.SOLID_COLOR, button.swatchColor, 2);
	var fillBrush = g.newBrush(g.BrushType.SOLID_COLOR, button.swatchColor);

	button.onDraw = function () {
		var h = this.size.height;
		var w = this.size.width;

		if (hover) pathPen = g.newPen(g.PenType.SOLID_COLOR, hexToRgb(normalColor1), 2);

		g.rectPath(0, 0, w, h);
		g.fillPath(fillBrush);
		g.strokePath(pathPen);

		if (!showColorInfo) return;
		if (this.text.trim() == '') return;
		if (w < margin * 2 + 6) return;

		var textLinesArray = this.text.split('\n');

		for (var l = 0; l < textLinesArray.length; l++) {

			var txtW = g.measureString(textLinesArray[l]).width;

			if (txtW > w - margin * 2) {
				textLinesArray[l] = textLinesArray[l].substring(0, textLinesArray[l].length - 2);

				while (txtW > w - 6 - margin * 2) {
					var end = textLinesArray[l].length - 1;
					textLinesArray[l] = textLinesArray[l].substring(0, end);

					txtW = parseInt(g.measureString(textLinesArray[l]));
				}
				textLinesArray[l] += '...';
			}
			var px = margin;
			var py = l == 0 ? 2 : (py += 16);

			if (appV > 24 && l == 0) py += 8;

			g.drawString(textLinesArray[l].trim(), textPen, px, py);
		}
	};
}
