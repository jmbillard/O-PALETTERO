function PAL_layout(win) {
	var w = win.size.width;
	var h = win.size.height;
	var isRow = w > h;

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
	btnGrp2.orientation = btnOrientation;
	btnGrp1.alignment = btnAlignment;
	btnGrp2.alignment = btnAlignment;

	var swatchesCount = swatchesGrp.children.length;
	var swatchWidth = isRow ? (w - btnGrpWidth) / swatchesCount : w;
	var swatchHeight = isRow ? h : (h - btnGrpHeight) / swatchesCount;
	var labelOffset = showColorLabels ? 16 : 0;

	for (var s = 0; s < swatchesCount; s++) {
		var colorGrp = swatchesGrp.children[s];
		colorGrp.orientation = btnOrientation;

		var swatch = colorGrp.children[0];
		swatch.minimumSize = isRow ? [20, btnGrpHeight] : [btnGrpWidth, 20];

		swatch.size = [swatchWidth, swatchHeight];

		var tempLab = '';

		if (labelType == '#HEX') tempLab = rgbToHEX(swatch.swatchColor);
		if (labelType == 'RGB') tempLab = rgbToRGB(swatch.swatchColor);
		if (labelType == 'HSB') tempLab = rgbToHsb(swatch.swatchColor);

		if (labelType != '#HEX') {
			for (var l = 0; l < tempLab.length; l++) {
				tempLab[l] = labelType[l] + ':' + tempLab[l];
			}
			tempLab = tempLab.join('\n');
		}

		swatch.helpTip = swatch.label + '\n' + tempLab;

		if (showColorInfo) {
			if (swatchHeight - labelOffset < 60) tempLab = tempLab.replace(/\n/g, ', ');
			if (isRow && swatchWidth > 120) tempLab = tempLab.replace(/\n/g, ', ');

			swatch.text = tempLab;

			if (isRow) {
				if (labelType == '#HEX' && swatchWidth < 60) swatch.text = '';
			}
			if (!isRow) {
				if (swatchWidth < 60) swatch.text = '';
				if (swatchHeight - labelOffset < 32) swatch.text = '';
			}
			if (labelType != '#HEX' && swatchWidth < 110 && swatchHeight - labelOffset < 60) swatch.text = '';
			if (showColorLabels) swatch.text = swatch.label + '\n' + swatch.text;
			
			if (swatchHeight < 32 || swatchWidth < 50) swatch.text = '';
		}

		colorGrp.layout.layout(true);
		swatchesGrp.layout.layout(true);
	}
	var rowSize = [swatchesCount * 20 + btnGrpWidth, btnGrpHeight];
	var columnSize = [btnGrpWidth, swatchesCount * 20 + btnGrpHeight];
	win.minimumSize = isRow ? rowSize : columnSize;
	win.layout.layout(true);
	win.layout.resize();
}

// ---------------------------------------------------------------------------------

function PAL_WINDOW(thisObj) {
	var PAL_w = thisObj;

	if (!(thisObj instanceof Panel)) {
		PAL_w = new Window('palette', scriptName + ' ' + scriptVersion, undefined, {
			resizeable: true
		});
	}
	PAL_w.size = [800, 100];
	PAL_w.orientation = 'row';
	PAL_w.spacing = 0;
	PAL_w.margins = 0;

	var btnGrp1 = PAL_w.add('group');
	btnGrp1.spacing = 0;

	var addBtn = btnGrp1.add('statictext', undefined, '+');
	addBtn.preferredSize = [32, 32];
	addBtn.justify = 'center';
	addBtn.helpTip = [
		lClick + 'adicionar uma nova cor',
		rClick + 'adicionar todas as cores dos layers selecionados'
	].join('\n');
	setCtrlHighlight(addBtn, normalColor1, highlightColor1);

	var refreshBtn = btnGrp1.add('statictext', undefined, '⟲');
	refreshBtn.justify = 'center';
	refreshBtn.preferredSize = [32, 32];
	refreshBtn.helpTip = [lClick + 'atualizar paleta', rClick + 'ordenar paleta'].join('\n');
	setCtrlHighlight(refreshBtn, normalColor1, highlightColor1);

	var swatchesGrp = PAL_w.add('group');
	swatchesGrp.spacing = 0;

	var btnGrp2 = PAL_w.add('group');
	btnGrp2.spacing = 0;

	var prefBtn = btnGrp2.add('statictext', undefined, '≡');
	prefBtn.justify = 'center';
	prefBtn.preferredSize = [32, 32];
	prefBtn.helpTip = 'configurações';
	setCtrlHighlight(prefBtn, normalColor1, highlightColor1);

	var infoBtn = btnGrp2.add('statictext', undefined, '🛈');
	infoBtn.justify = 'center';
	infoBtn.preferredSize = [32, 32];
	infoBtn.helpTip = 'ajuda | DOCS';
	setCtrlHighlight(infoBtn, normalColor1, highlightColor1);

	setBgColor(PAL_w, bgColor1);

	buildPalette(swatchesGrp);
	PAL_layout(PAL_w);

	// ---------------------------------------------------------------------------------

	addBtn.addEventListener('click', function (c) {
		var aItem = app.project.activeItem;
		var selLayers = aItem != null ? aItem.selectedLayers : [];
		var refArray = new loadProjectPalette().swatchesArray;
		var newColorsArray = new loadProjectPalette().swatchesArray;

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
			} catch (err) {}
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

	prefBtn.addEventListener('click', function (c) {
		if (c.button == 0) {
			PAL_preferencesDialog();
		}
		while (swatchesGrp.children.length > 0) {
			swatchesGrp.remove(swatchesGrp.children[0]);
		}
		buildPalette(swatchesGrp);
		PAL_layout(PAL_w);
	});

	infoBtn.addEventListener('click', function (c) {
		if (c.button == 0) {
			openWebSite('https://github.com/jmbillard/O-PALETTERO/blob/main/README.md')
		}
	});

	// ---------------------------------------------------------------------------------

	PAL_w.onResizing = PAL_w.onResize = function () {
		PAL_layout(this);
	};

	return PAL_w;
}
