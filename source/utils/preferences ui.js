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

	var showHeaderLab = labelMainGrp.add('statictext', [0, 0, 60, 24], 'EXIBIR:');
	setFgColor(showHeaderLab, normalColor1);

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
		undefined,
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
	colorHeaderLabGrp.margins = [28, 0, 0, 0];
	var colorHeaderLab = colorHeaderLabGrp.add('statictext', [0, 0, 172, 24], 'CORES:');
	setFgColor(colorHeaderLab, normalColor1);

	var addBtn = colorHeaderLabGrp.add('statictext', undefined, '+');
	addBtn.size = [24, 24];
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
		var colorGrp = swatchesGrp.add('group');
		colorGrp.spacing = 8;

		var swatchProperties = {
			color: tempSwatchesArray[s],
			label: tempLabelsArray[s],
			width: 8,
			height: 26,
			noEvents: true,
			index: s
		};
		var color = new colorSwatch(colorGrp, swatchProperties);

		txtGrp = colorGrp.add('group');
		txtGrp.orientation = 'stack';

		var colorNameLab = txtGrp.add('statictext', [0, 0, 160, 26], tempLabelsArray[s]);
		setCtrlHighlight(colorNameLab, monoColor0, highlightColor1);

		var colorNameTxt = txtGrp.add('edittext', [0, 0, 160, 26], tempLabelsArray[s]);
		colorNameTxt.visible = false;

		var removeBtn = colorGrp.add('statictext', [0, 0, 8, 26], 'x');
		setCtrlHighlight(removeBtn, normalColor1, highlightColor1);

		removeBtn.addEventListener('click', function () {
			this.parent.parent.remove(this.parent);

			PAL_prefW.layout.layout(true);
			scrollBar.maxvalue = swatchesGrp.size.height - panel.size.height;
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
				saveProjectPalette(swatchesGrp);
			} catch (err) {}
		};
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
		width: 50,
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

	addBtn.addEventListener('click', function (c) {
		if (c.button == 0) {
			try {
				var colorGrp = swatchesGrp.add('group');
				colorGrp.spacing = 8;

				var swatchProperties = {
					color: new colorPicker(),
					label: 'cor ' + swatchesGrp.children.length,
					width: 8,
					height: 26,
					noEvents: true,
					index: swatchesGrp.children.length
				};
				var color = new colorSwatch(colorGrp, swatchProperties);

				txtGrp = colorGrp.add('group');
				txtGrp.orientation = 'stack';

				var colorNameLab = txtGrp.add(
					'statictext',
					[0, 0, 160, 26],
					swatchProperties.label
				);
				setCtrlHighlight(colorNameLab, monoColor0, highlightColor1);

				var colorNameTxt = txtGrp.add('edittext', [0, 0, 160, 26], swatchProperties.label);
				colorNameTxt.visible = false;

				var removeBtn = colorGrp.add('statictext', [0, 0, 8, 26], 'x');
				setCtrlHighlight(removeBtn, normalColor1, highlightColor1);

				removeBtn.addEventListener('click', function () {
					this.parent.parent.remove(this.parent);

					PAL_prefW.layout.layout(true);
					scrollBar.maxvalue = swatchesGrp.size.height - panel.size.height;
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
						saveProjectPalette(swatchesGrp);
					} catch (err) {}
				};
				PAL_prefW.layout.layout(true);

				if (swatchesGrp.children.length > 11) {
					scrollBar.maxvalue = swatchesGrp.size.height - panel.size.height;
					scrollBar.value = scrollBar.maxvalue;
					swatchesGrp.location.y = -1 * scrollBar.value;
				}
			} catch (err) {}
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
