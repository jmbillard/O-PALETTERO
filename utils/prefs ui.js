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
	var btnGrpSpacing = 10;
	var drpGrpSpacing = 2;
	var txtSize = [120, 30];
	var dropSize = [85, 24];

	//---------------------------------------------------------

	var PAL_prefW = new Window('dialog', scriptName + ' ' + scriptVersion);
	PAL_prefW.alignChildren = ['left', 'top'];
	PAL_prefW.spacing = 10;

	var labelMainGrp = PAL_prefW.add('group');
	labelMainGrp.orientation = 'column';
	labelMainGrp.alignChildren = ['left', 'center'];
	labelMainGrp.spacing = 2;

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
	labelInfoGrp.spacing = 60;
	labelInfoGrp.margins = [0, 8, 0, 4];

	var hexRdo = labelInfoGrp.add('radiobutton', undefined, '#HEX');
	hexRdo.helpTip = 'código hexadecimal';
	hexRdo.value = hexRdo.text == labelType;

	var rgbRdo = labelInfoGrp.add('radiobutton', undefined, 'RGB');
	rgbRdo.helpTip = 'array de valores RGB';
	rgbRdo.value = rgbRdo.text == labelType;

	//

	setBgColor(PAL_prefW, bgColor1);

	/*

	---------------------------------------------------------------
	> ⚙️ preferences events
	---------------------------------------------------------------

	*/

	rgbRdo.onClick = hexRdo.onClick = function () {
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