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

	var themeHeaderLab = labelMainGrp.add('statictext', undefined, 'EXIBIR:');
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

	new themeDivider(PAL_prefW);

	//

	var colorsMainGrp = PAL_prefW.add('group');
	colorsMainGrp.orientation = 'column';
	colorsMainGrp.alignChildren = ['left', 'center'];
	colorsMainGrp.spacing = 16;

	var colorHeaderLab = colorsMainGrp.add('statictext', undefined, 'CORES:');
	setFgColor(colorHeaderLab, normalColor1);

	var swatchesMainGrp = colorsMainGrp.add('group');
	swatchesMainGrp.orientation = 'row';
	swatchesMainGrp.spacing = 2;

	var swatchesGrp = swatchesMainGrp.add('group');
	swatchesGrp.orientation = 'column';
	swatchesGrp.spacing = 3;

	// var ctrlGrp = swatchesMainGrp.add('group');
	// ctrlGrp.orientation = 'column';
	// ctrlGrp.spacing = 0;

	var tempSwatchesArray = loadProjectPalette().swatchesArray;
	var tempLabelsArray = loadProjectPalette().labelsArray;
	var swatchList = swatchesMainGrp.add(
		'listbox',
		[0, 0, 200, tempLabelsArray.length * 31 + 1],
		tempLabelsArray,
		// {
		// 	multiselect: true
		// numberOfColumns: 3,
		// showHeaders: true,
		// columnTitles: ["English", "French", "Dutch"],
		// columnWidths: [30,30,100]
		// }
	);
	swatchList.itemSize = [160, 30];
	// var swatchesCtrlGrp = swatchesMainGrp.add('group');
	// swatchesCtrlGrp.orientation = 'column';
	// swatchesCtrlGrp.alignment = 'fill';
	// swatchesCtrlGrp.spacing = 3;

	// var upBtn = swatchesCtrlGrp.add('statictext', undefined, '▲');
	// // var upBtn = swatchesCtrlGrp.add('statictext', undefined, '⤒');
	// upBtn.justify = 'center';
	// upBtn.alignment = ['center', 'top'];
	// upBtn.preferredSize = [20, 20];
	// upBtn.helpTip = lClick + 'subir cores selecionadas';
	// setCtrlHighlight(upBtn, normalColor1, highlightColor1);

	// var downBtn = swatchesCtrlGrp.add('statictext', undefined, '▼');
	// // var upBtn = swatchesCtrlGrp.add('statictext', undefined, '⤒');
	// downBtn.justify = 'center';
	// downBtn.alignment = ['center', 'bottom'];
	// downBtn.preferredSize = [20, 20];
	// downBtn.helpTip = lClick + 'descer cores selecionadas';
	// setCtrlHighlight(downBtn, normalColor1, highlightColor1);

	for (var s = 0; s < tempSwatchesArray.length; s++) {

		// var tempCtrlGrp = swatchesCtrlGrp.add('group');
		// tempCtrlGrp.orientation = 'column';
		// tempCtrlGrp.spacing = 0;

		// var upBtn = tempCtrlGrp.add('statictext', undefined, '▲');
		// // var upBtn = swatchesCtrlGrp.add('statictext', undefined, '⤒');
		// upBtn.justify = 'center';
		// upBtn.alignment = ['center', 'top'];
		// upBtn.preferredSize = [20, 14];
		// upBtn.helpTip = lClick + 'subir cores selecionadas';
		// setCtrlHighlight(upBtn, normalColor1, highlightColor1);

		// var downBtn = tempCtrlGrp.add('statictext', undefined, '▼');
		// // var upBtn = swatchesCtrlGrp.add('statictext', undefined, '⤒');
		// downBtn.justify = 'center';
		// downBtn.alignment = ['center', 'bottom'];
		// downBtn.preferredSize = [20, 14];
		// downBtn.helpTip = lClick + 'descer cores selecionadas';
		// setCtrlHighlight(downBtn, normalColor1, highlightColor1);


		var colorGrp = swatchesGrp.add('group');
		var swatchProperties = {
			color: tempSwatchesArray[s],
			label: tempLabelsArray[s],
			width: 8,
			height: 28,
			noEvents: true,
			index: s
		};
		var color = new colorSwatch(colorGrp, swatchProperties);

		// color.swatch.onClick = function () {
		// 	var colorGrp = this.parent;
		// 	var swatchesGrp = colorGrp.parent;
		// 	swatchList.selection = null;
		// 	swatchList.selection = [this.index];

		// 	try {
		// 		this.swatchColor = new colorPicker(this.swatchColor);
		// 		swatchList.items[this.index].text = rgbToHEX(this.swatchColor);
		// 		drawColorSwatch(this, false);
		// 		saveProjectPalette(swatchesGrp);
		// 	} catch (err) { }
		// };

		// color.swatch.addEventListener('mouseover', function () {
		// 	swatchList.selection = null;
		// 	swatchList.selection = [this.index];
		// });

		// color.swatch.addEventListener('mouseout', function () {
		// 	swatchList.selection = null;
		// });
	}

	var nameTxt = PAL_prefW.add('edittext', [0, 0, 212, 32]);

	var btnGrp = PAL_prefW.add('group');
	btnGrp.orientation = 'stack';
	btnGrp.alignment = 'fill';
	btnGrp.margins = [0, 32, 0, 0]; // Margens do grupo de botões (15 pixels em cima)

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

	// var upBtn = new themeButton(rBtnGrp, {
	// 	text: '▲',
	// 	width: 40,
	// 	height: 34
	// });

	// var downBtn = new themeButton(rBtnGrp, {
	// 	text: '▼',
	// 	width: 40,
	// 	height: 34
	// });

	// var delBtn = new themeButton(rBtnGrp, {
	// 	text: 'X',
	// 	width: 40,
	// 	height: 34
	// });

	var save = new themeButton(rBtnGrp, {
		text: 'salvar paleta',
		width: 100,
		height: 34,
		buttonColor: normalColor1,
		textColor: bgColor1
	});

	setBgColor(PAL_prefW, bgColor1);

	function updateList(labelsArray) {

		while (swatchList.items.length > 0) {
			swatchList.remove(swatchList.items[0]);
		}

		for (var i = 0; i < labelsArray.length; i++) {

			swatchList.add('item', labelsArray[i]);
		}
	}

	hsbRdo.onClick = rgbRdo.onClick = hexRdo.onClick = function () {
		labelType = this.text;
		PAL_preferencesObj.labelType = this.text;

		saveDefaultPreferences();
	};

	//---------------------------------------------------------

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

	swatchList.onChange = function () {
		nameTxt.text = this.selection != null ? this.selection : '';
	};

	cancel.button.onClick = function () {
		PAL_prefW.close();
	};

	nameTxt.onEnterKey = nameTxt.onChange = function () {

		var tempSelection = swatchList.selection.index;
		var tempName = this.text.trim().replace(/[:\-\s]+/g, ' ');

		this.text = tempName;
		tempLabelsArray[tempSelection] = tempName;
		updateList(tempLabelsArray);
		swatchesGrp.children[tempSelection].children[0].label = tempName;
		swatchList.selection = [tempSelection];
		// swatchList.active = true;
	};

	swatchList.onDoubleClick = function () {

		// var colorGrp = this.parent;
		var swatchesGrp = this.parent.children[0];
		var swatch = swatchesGrp.children[this.selection.index].children[0];
		// swatchList.selection = null;
		// swatchList.selection = [this.index];

		try {
			var tempName = this.selection.text;
			var isHex = tempName.length == 7 && tempName.match(/^#[A-F0-9]{6}/i);

			swatch.swatchColor = new colorPicker(swatch.swatchColor);
			this.selection.text = isHex ? rgbToHEX(swatch.swatchColor) : tempName;
			swatch.label = this.selection.text;
			drawColorSwatch(swatch, false);

		} catch (err) { }
	};

	save.button.onClick = function () {
		saveProjectPalette(swatchesGrp);
		PAL_prefW.close();
	}
	PAL_prefW.show();
}
