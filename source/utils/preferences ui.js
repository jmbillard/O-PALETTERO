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

	var ckbGrpSpacing = 20;
	var txtSize = [150, 30];

	//---------------------------------------------------------

	var PAL_prefW = new Window('dialog', scriptName + ' ' + scriptVersion);
	PAL_prefW.alignChildren = ['left', 'top'];
	PAL_prefW.spacing = 16;

	var preferencesGrp = PAL_prefW.add('group');
	preferencesGrp.alignChildren = ['left', 'top'];

	var preferencesVGrp1 = preferencesGrp.add('group');
	preferencesVGrp1.orientation = 'column';
	var preferencesVGrp2 = preferencesGrp.add('group');
	preferencesVGrp2.orientation = 'column';

	var labelMainGrp = preferencesVGrp1.add('group');
	labelMainGrp.orientation = 'column';
	labelMainGrp.alignChildren = ['left', 'center'];
	labelMainGrp.spacing = 4;

	var themeHeaderLab = labelMainGrp.add('statictext', [0, 0, 60, 24], 'EXIBIR:');
	setFgColor(themeHeaderLab, normalColor1);

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

	// new themeDivider(preferencesVGrp1);

	//

	var colorsMainGrp = preferencesVGrp2.add('group');
	colorsMainGrp.orientation = 'column';
	colorsMainGrp.alignChildren = ['left', 'top'];
	colorsMainGrp.spacing = 16;

	var colorHeaderLab = colorsMainGrp.add('statictext', [0, 0, 220, 24], 'CORES:');
	setFgColor(colorHeaderLab, normalColor1);

	var panel = colorsMainGrp.add('group');
	panel.orientation = 'row';
	panel.alignChildren = ['left', 'top'];
	panel.spacing = 8;
	panel.minimumSize.height = 116;
	panel.maximumSize.height = 326;

	var scrollBar = panel.add('scrollbar');

	var swatchesMainGrp = panel.add('group');
	swatchesMainGrp.orientation = 'row';
	swatchesMainGrp.spacing = 2;

	var swatchesGrp = swatchesMainGrp.add('group');
	swatchesGrp.orientation = 'column';
	swatchesGrp.spacing = 4;

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

			// colorHeaderLab.location = panel.children.length < 12 ? [14, 0] : [0, 0];
			// scrollBar.size.width = panel.children.length < 12 ? 0 : 20;
			if (panel.children.length < 11) {

				panel.size.height -= 30;
				// scrollBar.size.width = 0;
				scrollBar.size.height = panel.size.height;
			}
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

			this.visible = false;

			this.parent.children[0].text = this.text;
			this.parent.children[0].visible = true;
			this.parent.children[0].active = true;

			this.parent.parent.children[0].label = this.text;
		}

		colorNameTxt.addEventListener('blur', function () {
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
			} catch (err) { }
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
		width: 100,
		height: 34,
		buttonColor: normalColor1,
		textColor: bgColor1
	});

	setBgColor(PAL_prefW, bgColor1);

	hsbRdo.onClick = rgbRdo.onClick = hexRdo.onClick = function () {
		labelType = this.text;
		PAL_preferencesObj.labelType = this.text;

		saveDefaultPreferences();
	};

	//---------------------------------------------------------

	PAL_prefW.onShow = function () {
		scrollBar.size.width = 20; //panel.children.length < 12 ? 0 : 20;
		scrollBar.size.height = panel.size.height + 2;
		scrollBar.maxvalue = swatchesGrp.size.height - panel.size.height;

		this.layout.layout(true);
	};

	scrollBar.onChanging = function () {
		swatchesMainGrp.location.y = -1 * this.value;
	}

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

	cancel.button.onClick = function () {
		PAL_prefW.close();
	};

	save.button.onClick = function () {
		saveProjectPalette(swatchesGrp);
		PAL_prefW.close();
	}
	PAL_prefW.show();
}
