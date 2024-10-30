/* eslint-disable no-with */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
/*

---------------------------------------------------------------
> ⚙️ preferences ui
---------------------------------------------------------------

*/

function PAL_preferencesDialog() {
	var scriptName = 'PREFERENCIAS';

	var ckbGrpSpacing = 16;
	var txtSize = [150, 30];

	//---------------------------------------------------------

	var PAL_prefW = new Window('dialog', scriptName + ' ' + scriptVersion);
	PAL_prefW.alignChildren = ['left', 'top'];
	PAL_prefW.spacing = 16;

	var preferencesGrp = PAL_prefW.add('group');
	preferencesGrp.alignChildren = ['left', 'top'];

	var preferencesVGrp1 = preferencesGrp.add('group');
	preferencesVGrp1.orientation = 'column';
	preferencesVGrp1.alignChildren = ['left', 'top'];

	//

	new themeDivider(preferencesGrp);

	//

	var preferencesVGrp2 = preferencesGrp.add('group');
	preferencesVGrp2.orientation = 'column';
	preferencesVGrp2.alignChildren = ['left', 'top'];

	var labelMainGrp = preferencesVGrp1.add('group');
	labelMainGrp.orientation = 'column';
	labelMainGrp.alignChildren = ['left', 'center'];
	labelMainGrp.spacing = 4;

	var showHeaderLabGrp = labelMainGrp.add('group');
	showHeaderLabGrp.spacing = 4;

	var showHeaderLab = showHeaderLabGrp.add('statictext', [0, 0, 164, 24], 'EXIBIR:');
	setFgColor(showHeaderLab, normalColor1);

	var infoSymbol = appV > 23 ? '𝒊' : 'ℹ';
	var infoBtn = showHeaderLabGrp.add('statictext', [0, 0, 24, 24], infoSymbol);
	infoBtn.helpTip = 'ajuda | DOCS';
	setCtrlHighlight(infoBtn, normalColor1, highlightColor1);

	var labelCkbGrp = labelMainGrp.add('group');
	labelCkbGrp.spacing = ckbGrpSpacing;

	var labelCkbLab = labelCkbGrp.add('statictext', undefined, 'informação de cor');
	labelCkbLab.helpTip = 'mostrar informação de cor na paleta principal';
	labelCkbLab.preferredSize = txtSize;

	var labelCkb = labelCkbGrp.add('checkbox', [8, 4, 24, 18]);
	labelCkb.value = showColorInfo;

	var nameCkbGrp = labelMainGrp.add('group');
	nameCkbGrp.spacing = ckbGrpSpacing;

	var nameCkbLab = nameCkbGrp.add('statictext', undefined, 'nome personalizado');
	nameCkbLab.helpTip = 'mostrar nomes na paleta principal';
	nameCkbLab.preferredSize = txtSize;
	nameCkbLab.enabled = showColorInfo;

	var nameCkb = nameCkbGrp.add('checkbox', [8, 4, 24, 18]);
	nameCkb.value = showColorLabels;
	nameCkb.enabled = showColorInfo;

	var labelInfoGrp = labelMainGrp.add('group');
	labelInfoGrp.spacing = 30;
	labelInfoGrp.margins = [0, 8, 0, 4];

	var hexRdo = labelInfoGrp.add('radiobutton', undefined, '#HEX');
	hexRdo.helpTip = 'código hexadecimal';
	hexRdo.value = hexRdo.text == labelType;
	hexRdo.enabled = showColorInfo;

	var rgbRdo = labelInfoGrp.add('radiobutton', undefined, 'RGB');
	rgbRdo.helpTip = 'valores RGB (red, green, blue)';
	rgbRdo.value = rgbRdo.text == labelType;
	rgbRdo.enabled = showColorInfo;

	var hsbRdo = labelInfoGrp.add('radiobutton', undefined, 'HSB');
	hsbRdo.helpTip = 'valores HSB (hue, saturation, brightness)';
	hsbRdo.value = hsbRdo.text == labelType;
	hsbRdo.enabled = showColorInfo;

	//

	new themeDivider(preferencesVGrp1);

	//

	var paletteMainGrp = preferencesVGrp1.add('group');
	paletteMainGrp.orientation = 'column';
	paletteMainGrp.alignChildren = ['left', 'center'];
	paletteMainGrp.spacing = 4;

	var paletteHeaderLab = paletteMainGrp.add('statictext', [0, 0, 56, 24], 'PALETA:');
	setFgColor(paletteHeaderLab, normalColor1);

	var defaultPaletteGrp = paletteMainGrp.add('group');
	defaultPaletteGrp.spacing = 10;

	var defaultPaletteLab = defaultPaletteGrp.add(
		'statictext',
		[0, 0, 140, 24],
		'definir como paleta padrão'
	);
	defaultPaletteLab.helpTip = 'salva a lista de cores exibida ao lado como a paleta padrão';
	defaultPaletteLab.preferredSize = txtSize;

	var defaultPaletteBtn = new themeButton(defaultPaletteGrp, {
		text: '...',
		width: 40,
		height: 34
	});

	//

	var colorsMainGrp = preferencesVGrp2.add('group');
	colorsMainGrp.orientation = 'column';
	colorsMainGrp.alignChildren = ['left', 'top'];
	colorsMainGrp.spacing = 16;

	var colorHeaderLabGrp = colorsMainGrp.add('group');
	colorHeaderLabGrp.spacing = 4;
	colorHeaderLabGrp.margins = [28, 0, 0, 0];

	var colorHeaderLab = colorHeaderLabGrp.add('statictext', [0, 0, 152, 24], 'CORES:');
	setFgColor(colorHeaderLab, normalColor1);

	var refreshBtn = colorHeaderLabGrp.add('statictext', [0, 0, 24, 24], '⇅');
	refreshBtn.helpTip = [
		lClick + 'puxar paleta',
		rClick + 'ordenar paleta',
		'',
		'Alt  + ' + rClick + 'zerar paleta'
	].join('\n');
	setCtrlHighlight(refreshBtn, normalColor1, highlightColor1);

	var addBtn = colorHeaderLabGrp.add('statictext', [0, 0, 24, 24], '+');
	addBtn.helpTip = [
		lClick + 'adicionar uma nova cor',
	].join('\n');
	setCtrlHighlight(addBtn, normalColor1, highlightColor1);

	var panel = colorsMainGrp.add('group');
	panel.orientation = 'row';
	panel.alignChildren = ['left', 'top'];
	panel.spacing = 8;
	panel.preferredSize.height = 326;
	panel.maximumSize.height = 326;

	var scrollBar = panel.add('scrollbar');

	var swatchesGrp = panel.add('group');
	swatchesGrp.orientation = 'column';
	swatchesGrp.spacing = 4;
	swatchesGrp.preferredSize.height = 326;

	var tempSwatchesArray = loadProjectPalette().swatchesArray;
	var tempLabelsArray = loadProjectPalette().labelsArray;

	for (var s = 0; s < tempSwatchesArray.length; s++) {
		new swatchListItem(swatchesGrp, tempSwatchesArray[s], tempLabelsArray[s]);
	}

	var btnGrp = PAL_prefW.add('group');
	btnGrp.orientation = 'stack';
	btnGrp.alignment = 'fill';
	btnGrp.margins = [0, 32, 0, 0];

	var lBtnGrp = btnGrp.add('group');
	lBtnGrp.alignment = 'left';
	lBtnGrp.spacing = 16;

	var rBtnGrp = btnGrp.add('group');
	rBtnGrp.alignment = 'right';
	rBtnGrp.spacing = 16;

	var cancel = new themeButton(lBtnGrp, {
		text: 'cancelar',
		width: 80,
		height: 34
	});

	var save = new themeButton(rBtnGrp, {
		text: 'salvar paleta',
		width: 100,
		height: 34,
		buttonColor: normalColor1,
		textColor: bgColor1
	});

	setBgColor(PAL_prefW, bgColor1);

	hsbRdo.onClick =
		rgbRdo.onClick =
		hexRdo.onClick =
		function () {
			labelType = this.text;
			PAL_preferencesObj.labelType = this.text;

			saveDefaultPreferences();
		};

	//---------------------------------------------------------

	PAL_prefW.onShow = function () {
		scrollBar.size.width = 20;
		scrollBar.size.height = panel.size.height;
		scrollBar.maxvalue = swatchesGrp.size.height - panel.size.height;

		this.layout.layout(true);
	};

	scrollBar.onChanging = function () {
		swatchesGrp.location.y = -1 * this.value;
	};

	infoBtn.addEventListener('click', function (c) {
		if (c.button == 0) {
			openWebSite('https://github.com/jmbillard/O-PALETTERO/blob/main/README.md');
		}
	});

	refreshBtn.addEventListener('click', function (c) {
		var tempData = {
			swatchesArray: [],
			labelsArray: []
		}
		while (swatchesGrp.children.length > 0) {
			var colorGrp = swatchesGrp.children[0];
			var swatch = colorGrp.children[0];
			tempData.swatchesArray.push(rgbToHEX(swatch.swatchColor));
			tempData.labelsArray.push(swatch.label);
			swatchesGrp.remove(colorGrp);
		}
		if (c.button == 2) {

			if (ScriptUI.environment.keyboardState.altKey) {
				panel.layout.layout(true);
				return;
			}

			var sortedData = sortHex(tempData);
			tempSwatchesArray = sortedData.swatchesArray;
			tempLabelsArray = sortedData.labelsArray;

			for (var s = 0; s < tempSwatchesArray.length; s++) {
				new swatchListItem(swatchesGrp, tempSwatchesArray[s], tempLabelsArray[s]);
			}
		}
		if (c.button == 0) {
			tempSwatchesArray = loadProjectPalette().swatchesArray;
			tempLabelsArray = loadProjectPalette().labelsArray;
		
			for (var s = 0; s < tempSwatchesArray.length; s++) {
				new swatchListItem(swatchesGrp, tempSwatchesArray[s], tempLabelsArray[s]);
			}
		}
		PAL_prefW.layout.layout(true);
	});

	addBtn.addEventListener('click', function (c) {
		if (c.button == 0) {
			try {
				new swatchListItem(swatchesGrp, new colorPicker(), 'cor ' + (swatchesGrp.children.length + 1));

				PAL_prefW.layout.layout(true);

				if (swatchesGrp.children.length > 11) {
					scrollBar.maxvalue = swatchesGrp.size.height - panel.size.height;
					scrollBar.value = scrollBar.maxvalue;
					swatchesGrp.location.y = -1 * scrollBar.value;
				}
			} catch (err) { }
		}
	});

	labelCkb.onClick = function () {
		showColorInfo = this.value;
		PAL_preferencesObj.showColorInfo = this.value;

		nameCkb.enabled = this.value;
		nameCkbLab.enabled = this.value;
		hexRdo.enabled = this.value;
		rgbRdo.enabled = this.value;
		hsbRdo.enabled = this.value;

		saveDefaultPreferences();
	};

	nameCkb.onClick = function () {
		showColorLabels = this.value;
		PAL_preferencesObj.showColorLabels = this.value;

		saveDefaultPreferences();
	};

	defaultPaletteBtn.button.onClick = function () {
		var defaultSwatchesArray = [];

		for (var s = 0; s < swatchesGrp.children.length; s++) {
			var tempItem = {
				color: rgbToHEX(swatchesGrp.children[s].children[0].swatchColor),
				label: swatchesGrp.children[s].children[0].label
			};
			defaultSwatchesArray.push(tempItem);
		}
		PAL_preferencesObj.swatches = defaultSwatchesArray;

		saveDefaultPreferences();
		this.text = '✓';
	};

	cancel.button.onClick = function () {
		PAL_prefW.close();
	};

	save.button.onClick = function () {
		saveProjectPalette(swatchesGrp);

		PAL_prefW.close();
	};
	PAL_prefW.show();

	return swatchesGrp.children.length;
}
