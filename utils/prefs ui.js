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

	var labelMainGrp = PAL_prefW.add('group');
	labelMainGrp.orientation = 'column';
	labelMainGrp.alignChildren = ['left', 'center'];
	labelMainGrp.spacing = 4;

	var themeHeaderLab = labelMainGrp.add('statictext', undefined, 'RÓTULOS:');
	setFgColor(themeHeaderLab, normalColor1);

	var labelCkbGrp = labelMainGrp.add('group');
	labelCkbGrp.spacing = ckbGrpSpacing;

	var labelCkbLab = labelCkbGrp.add('statictext', undefined, 'mostrar rótulos');
	labelCkbLab.helpTip = 'mostrar rótulos nos botões do menu principal';
	labelCkbLab.preferredSize = txtSize;

	var labelCkb = labelCkbGrp.add('checkbox', [8, 4, 24, 18]);
	labelCkb.value = showLabels;

	var labelInfoGrp = labelMainGrp.add('group');
	labelInfoGrp.spacing = 30;
	labelInfoGrp.margins = [0, 8, 0, 4];

	var hexRdo = labelInfoGrp.add('radiobutton', undefined, '#HEX');
	hexRdo.helpTip = 'código hexadecimal';
	hexRdo.value = hexRdo.text == labelType;

	var rgbRdo = labelInfoGrp.add('radiobutton', undefined, 'RGB');
	rgbRdo.helpTip = 'valores RGB (red, green, blue)';
	rgbRdo.value = rgbRdo.text == labelType;

	var hsbRdo = labelInfoGrp.add('radiobutton', undefined, 'HSB');
	rgbRdo.helpTip = 'valores HSB (hue, saturation, brightness)';
	rgbRdo.value = rgbRdo.text == labelType;

	//

	new themeDivider(PAL_prefW);

	//

	var colorsMainGrp = PAL_prefW.add('group');
	colorsMainGrp.orientation = 'column';
	colorsMainGrp.alignChildren = ['left', 'center'];
	colorsMainGrp.spacing = 16;

	var colorHeaderLab = colorsMainGrp.add('statictext', undefined, 'CORES:');
	setFgColor(colorHeaderLab, normalColor1);

	var swatchesMainGrp = colorsMainGrp.add('group');
	swatchesMainGrp.orientation = 'column';
	swatchesMainGrp.spacing = 4;

	var tempSwatchesArray = loadProjectPalette();

	for (var s = 0; s < tempSwatchesArray.length; s++) {

		var colorGrp = swatchesMainGrp.add('group');
		colorGrp.orientation = 'row';
		colorGrp.spacing = 12;

		var swatchProperties = {
			color: tempSwatchesArray[s],
			width: 40,
			height: 24,
			noEvents: true
		}

		var color = new colorSwatch(colorGrp, swatchProperties);

		var swatchName = colorGrp.add('edittext', undefined, tempSwatchesArray[s]);
		swatchName.preferredSize = [128, 24];
		swatchName.enabled = false;

		var deleteBtn = colorGrp.add('statictext', undefined, 'x');
		setCtrlHighlight(deleteBtn, normalColor1, highlightColor1);

		deleteBtn.addEventListener('click', function (c) {

			if (c.button == 0) {
				var colorGrp = this.parent;
				var swatchesGrp = colorGrp.parent;

				swatchesGrp.remove(colorGrp);
				saveProjectPalette(swatchesGrp);

				PAL_prefW.layout.layout(true);
			}
		});

		color.swatch.onClick = function () {
			var colorGrp = this.parent;
			var swatchesGrp = colorGrp.parent;

			alert('oi');
			this.swatchColor = new colorPicker(this.swatchColor);
			colorGrp.children[1].text = rgbToHEX(this.swatchColor);

			drawColorSwatch(this, false);
			saveProjectPalette(swatchesGrp);
		}
	}

	setBgColor(PAL_prefW, bgColor1);

	/*

	---------------------------------------------------------------
	> ⚙️ preferences events
	---------------------------------------------------------------

	*/

	hsbRdo.onClick = rgbRdo.onClick = hexRdo.onClick = function () {
		labelType = this.text;
		PAL_preferencesObj.labelType = this.text;

		saveDefaultPreferences();
	};

	//---------------------------------------------------------

	labelCkb.onClick = function () {
		showLabels = this.value;
		PAL_preferencesObj.showLabels = this.value;

		saveDefaultPreferences();
	};

	PAL_prefW.show();
}