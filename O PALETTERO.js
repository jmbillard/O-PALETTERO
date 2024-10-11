/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function O_PALETTERO_UTL(thisObj) {
	// Declaração da versão do script 'O Padeiro'
	var scriptName = 'O PALETTERO';
	var scriptVersion = 'v0.1b';

	#include 'utils/colorPicker.js';
	#include 'utils/prefs ui.js';
	#include 'libraries/color lib.js';
	#include 'libraries/metadata lib.js';

	// Emojis e mensagens (opcional)
	var lol = 'Σ(っ °Д °;)っ        ';
	var relax = 'ヽ(✿ﾟ▽ﾟ)ノ        ';
	var appV = parseInt(app.buildName.substring(0, 2));

	var lClick = '◖  →  ';
	var rClick = ' ◗  →  ';
	var dClick = '◖◖ →  ';

	// Cores do Style Guide GLOBO
	var bgColor1 = '#0B0D0E';
	var bgColor2 = '#060F13';
	var divColor1 = '#002133';
	var divColor2 = '#004266';
	var monoColor0 = '#F2F2F2';
	var monoColor1 = '#C7C8CA';
	var monoColor2 = '#939598';
	var monoColor3 = '#4B4C4E';
	var normalColor1 = '#05A6FF';
	var normalColor2 = '#80D2FF';
	var highlightColor1 = '#8800f8';
	var highlightColor2 = '#8640BF';

	// Caminhos para as preferências do script e pasta temporária
	var scriptPreferencesPath = Folder.userData.fullName + '/O PALETTERO script';
	var scriptPreferencesFolder = new Folder(scriptPreferencesPath);
	if (!scriptPreferencesFolder.exists) scriptPreferencesFolder.create();

	// Define os valores padrão das preferências do usuário.
	var PAL_defaultPreferencesObj = {
		swatches: [
			'#F13333',
			'#FF4D4D',
			'#FE674C',
			'#FF8F4D',
			'#FFC44E',
			'#5DE6A2',
			'#80C0FE',
			'#B5ADFF',
			'#FF8CCD',
			'#FF739A',
			'#FF5A68',
		],

		showLabels: true,
		labelType: '#HEX'
	};

	var PAL_preferencesObj = loadDefaultPreferences();
	var showLabels = PAL_preferencesObj.showLabels;
	var labelType = PAL_preferencesObj.labelType;

	function loadDefaultPreferences() {

		var JSONPreferencesFile = new File(scriptPreferencesPath + '/preferences.json');
		var tempPreferencesObj = {};

		if (JSONPreferencesFile.exists) {
			var JSONContent = readFileContent(JSONPreferencesFile);

			try {
				tempPreferencesObj = JSON.parse(JSONContent);

			} catch (err) {
				alert('Falha ao carregar as preferências... ' + lol + '\n' + err.message);
			}
		}

		for (var o in PAL_defaultPreferencesObj) {
			if (!tempPreferencesObj.hasOwnProperty(o)) {
				tempPreferencesObj[o] = PAL_defaultPreferencesObj[o];
			}
		}
		showLabels = tempPreferencesObj.showLabels;
		labelType = tempPreferencesObj.labelType;

		return tempPreferencesObj;
	}

	function saveDefaultPreferences() {

		if (!scriptPreferencesFolder.exists) scriptPreferencesFolder.create();

		for (var o in PAL_preferencesObj) {
			if (!PAL_defaultPreferencesObj.hasOwnProperty(o)) delete PAL_preferencesObj[o];
		}

		var fileContent = JSON.stringify(PAL_preferencesObj, null, "\t");
		var filePath = scriptPreferencesPath + '/preferences.json';

		return saveTextFile(fileContent, filePath);
	}

	function readFileContent(file) {
		var fileContent;

		file.open('r');
		file.encoding = 'UTF-8';
		fileContent = file.read();
		file.close();

		return fileContent.toString();
	}

	function writeFileContent(newFile, fileContent) {
		newFile.open('w');
		newFile.write(fileContent);
		newFile.close();

		return newFile;
	}

	function saveTextFile(fileContent, filePath) {
		var newFile = new File(filePath);

		newFile.encoding = 'UTF-8';
		return writeFileContent(newFile, fileContent);
	}

	// ---------------------------------------------------------------------------------

	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (element, startPoint) {
			var k;

			if (this == null) {
				throw new TypeError(
					'"this" é nulo (null) ou não foi definido (undefined)',
				);
			}
			var O = Object(this);
			var aSize = O.length >>> 0;

			if (aSize == 0) return -1;

			var n = +startPoint || 0;

			if (Math.abs(n) == Infinity) n = 0;

			if (n >= aSize) return -1;

			k = Math.max(n >= 0 ? n : aSize - Math.abs(n), 0);

			while (k < aSize) {
				if (k in O && O[k] == element) return k;

				k++;
			}
			return -1;
		};
	}

	// ---------------------------------------------------------------------------------

	function saveProjectPalette(sectionGrp) {

		var tempSwatchesArray = [];
		var swatchesCount = sectionGrp.children.length;

		for (var s = 0; s < swatchesCount; s++) {

			var colorGrp = sectionGrp.children[s];
			var swatch = colorGrp.children[0];
			var tempHEX = rgbToHEX(swatch.swatchColor);

			tempSwatchesArray.push(tempHEX);
		}

		var mData = new XMPMeta(app.project.xmpPacket);
		var schemaNS = XMPMeta.getNamespaceURI("xmp");
		var propName = "xmp:Label";

		try {
			if (swatchesCount > 0) {

				mData.setProperty(schemaNS, propName, tempSwatchesArray.join('-'));
			} else {

				mData.deleteProperty(schemaNS, propName);
			}

		} catch (err) {
			alert(lol + '#PAL_01 - ' + err.message);
		}
		app.project.xmpPacket = mData.serialize();
	}

	function loadProjectPalette() {

		var mData = new XMPMeta(app.project.xmpPacket);
		var schemaNS = XMPMeta.getNamespaceURI("xmp");
		var propName = "xmp:Label";

		var swatchesArray = PAL_preferencesObj.swatches

		try {
			var propVal = mData.getProperty(schemaNS, propName);
			var tempSwatchesArray = propVal.toString().split('-');

			if (tempSwatchesArray.length > 0 || propVal == 'null') swatchesArray = tempSwatchesArray;

		} catch (err) { }

		return swatchesArray;
	}

	function buildColorGrp(colorGrp, color) {

		var tempArray = [
			{ color: color }
		];

		for (var c = 0; c < tempArray.length; c++) {
			new colorSwatch(colorGrp, tempArray[c]);
		}
	};

	function buildPalette(sectionGrp) {

		var tempSwatchesArray = loadProjectPalette();

		for (var s = 0; s < tempSwatchesArray.length; s++) {

			var colorGrp = sectionGrp.add('group');
			colorGrp.orientation = 'column';
			colorGrp.spacing = 0;

			buildColorGrp(colorGrp, tempSwatchesArray[s]);
		}
	}

	function sortPalette() {

		var tempSwatchesArray = sortHex(loadProjectPalette());

		var mData = new XMPMeta(app.project.xmpPacket);
		var schemaNS = XMPMeta.getNamespaceURI("xmp");
		var propName = "xmp:Label";

		try {
			if (tempSwatchesArray.length > 0) {
				mData.setProperty(schemaNS, propName, tempSwatchesArray.join('-'));

			} else {
				mData.deleteProperty(schemaNS, propName);
			}

		} catch (err) {
			alert(lol + '#PAL_02 - ' + err.message);
		}
		app.project.xmpPacket = mData.serialize();
	}

	// ---------------------------------------------------------------------------------

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
		btnGrp1.alignment = btnAlignment;
		btnGrp2.orientation = btnOrientation;
		btnGrp2.alignment = btnAlignment;

		var swatchesCount = swatchesGrp.children.length;

		var mainSwatchWidth = isRow ? (w - btnGrpWidth) / swatchesCount : w;
		var mainSwatchHeight = isRow ? h : (h - btnGrpHeight) / swatchesCount;

		for (var s = 0; s < swatchesCount; s++) {

			var colorGrp = swatchesGrp.children[s];
			colorGrp.orientation = btnOrientation;

			var swatch = colorGrp.children[0];
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

			swatch.helpTip = tempLab;
			// swatch.helpTip += [
			// 	'\n-----------------',
			// 	lClick + 'aplicar Fill',
			// 	rClick + 'editar cor',
			// 	'Alt + ' + rClick + 'excluir cor',
			// ].join('\n');

			if (showLabels) {
				if (mainSwatchHeight < 60) tempLab = tempLab.replace(/\n/g, ', ');

				swatch.text = tempLab;
				
				if (isRow) {
					
					if (labelType == '#HEX' && mainSwatchWidth < 60) swatch.text = '';
					if (labelType != '#HEX' && mainSwatchWidth < 50) swatch.text = '';
				}
				if (!isRow) {
					
					if (mainSwatchHeight < 32) swatch.text = '';
					if (mainSwatchWidth < 60) swatch.text = '';
					if (labelType != '#HEX' && mainSwatchWidth < 100) swatch.text = '';
				}
			}

			swatch.minimumSize = isRow ? [20, btnGrpHeight] : [btnGrpWidth, 20];

			swatch.size = [mainSwatchWidth, mainSwatchHeight];

			colorGrp.layout.layout(true);
			swatchesGrp.layout.layout(true);
		}
		win.minimumSize = isRow ? [swatchesCount * 20 + btnGrpWidth, btnGrpHeight] : [btnGrpWidth, swatchesCount * 20 + btnGrpHeight];
		win.layout.layout(true);
		win.layout.resize();
	}

	// ---------------------------------------------------------------------------------

	function themeDivider(sectionGrp) {
		var newDiv = sectionGrp.add('customButton', [0, 0, 1, 1]);
		newDiv.alignment = ['fill', 'center'];
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
		var hexCode = isHEX ? color : rgbToHEX(color);
		var rgbArray = isHEX ? hexToRgb(color) : color;

		newUiCtrlObj.swatch = sectionGrp.add('customButton');
		newUiCtrlObj.swatch.text = '';
		newUiCtrlObj.swatch.swatchColor = rgbArray;

		drawColorSwatch(newUiCtrlObj.swatch, false);

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

				if (!ScriptUI.environment.keyboardState.altKey) {
					var newColor = new colorPicker(this.swatchColor);
					new colorSwatch(colorGrp, { color: newColor });
					colorGrp.remove(this);

				} else {
					swatchesGrp.remove(colorGrp);
				}
				saveProjectPalette(swatchesGrp);
				PAL_layout(win);
			}
		});

		return newUiCtrlObj;
	}

	function drawColorSwatch(button, hover) {

		var isDark = luminance(button.swatchColor) < 0.4;

		var textColor = isDark ? [1, 1, 1, 0.5] : [0, 0, 0, 0.5];

		var g = button.graphics;
		var textPen = g.newPen(g.PenType.SOLID_COLOR, textColor, 1);
		var pathPen = g.newPen(g.PenType.SOLID_COLOR, button.swatchColor, 2);
		var fillBrush = g.newBrush(g.BrushType.SOLID_COLOR, button.swatchColor);

		button.onDraw = function () {

			var h = this.size.height;
			var w = this.size.width;

			if (hover) pathPen = g.newPen(g.PenType.SOLID_COLOR, hexToRgb(normalColor1), 2);

			g.newPath();
			g.rectPath(0, 0, w, h);
			g.fillPath(fillBrush);
			g.strokePath(pathPen);

			if (!showLabels) return;

			var textLinesArray = this.text.split('\n');

			for (var l = 0; l < textLinesArray.length; l++) {

				var px = 10; //l == 0 ? 14 : 10;
				var py = l == 0 ? 0 : py += 16;

				if (appV > 24 && l == 0) py += 10;

				g.drawString(textLinesArray[l], textPen, px, py);
			}
		};
	}

	// ---------------------------------------------------------------------------------

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

	// ---------------------------------------------------------------------------------

	function getPropertyColors(property, array) {

		var excludeArray = [
			'ADBE Material Options Group',
			'ADBE Plane Options Group',
			'ADBE Vector Materials Group'
		];

		for (var i = 1; i <= property.numProperties; i++) {

			var prop = property.property(i);

			if (excludeArray.indexOf(prop.matchName) >= 0) continue;
			if (!prop.enabled) continue;

			if (prop.numProperties > 0) {
				getPropertyColors(prop, array);

			} else {

				try {

					if (prop.propertyValueType == 6418) {
						var refHEX = rgbToHEX(prop.value);

						if (array.indexOf(refHEX) >= 0) continue;
						if (refHEX == '#FF0000' && !prop.isModified) continue;

						// alert(prop.name + ': ' + prop.parentProperty.matchName);
						array.push(refHEX);
					}
				} catch (err) { }
			}
		}

		return array;
	}

	// ---------------------------------------------------------------------------------

	function applyFillColor(layer, color) {

		var effects = layer.property('ADBE Effect Parade');
		var fillFx = effects.addProperty('ADBE Fill');
		fillFx.name = rgbToHEX(color);
		fillFx.property('ADBE Fill-0002').setValue(color);
	}

	// ---------------------------------------------------------------------------------

	function PAL_WINDOW(thisObj) {
		var PAL_w = thisObj;

		if (!(thisObj instanceof Panel)) PAL_w = new Window('palette', scriptName + ' ' + scriptVersion, undefined, { resizeable: true }); // Cria uma nova janela
		PAL_w.orientation = 'row';
		PAL_w.spacing = 0;
		PAL_w.margins = 0;

		var btnGrp1 = PAL_w.add('group');
		btnGrp1.orientation = 'column';
		btnGrp1.spacing = 0;

		var addBtn = btnGrp1.add('statictext', undefined, '+');
		addBtn.preferredSize = [32, 32];
		addBtn.justify = 'center';
		addBtn.helpTip = [
			lClick + 'adicionar uma nova cor',
			rClick + 'adicionar todas as cores dos layers selecionados',
		].join('\n');
		setCtrlHighlight(addBtn, normalColor1, highlightColor1);

		var refreshBtn = btnGrp1.add('statictext', undefined, '⟲');
		refreshBtn.justify = 'center';
		refreshBtn.preferredSize = [32, 32];
		refreshBtn.helpTip = [
			lClick + 'atualizar paleta',
			rClick + 'ordenar paleta'
		].join('\n');
		setCtrlHighlight(refreshBtn, normalColor1, highlightColor1);

		var swatchesGrp = PAL_w.add('group');
		swatchesGrp.spacing = 0;

		var btnGrp2 = PAL_w.add('group');
		btnGrp2.orientation = 'column';
		btnGrp2.spacing = 0;

		var prefBtn = btnGrp2.add('statictext', undefined, '≡');
		prefBtn.justify = 'center';
		prefBtn.preferredSize = [32, 32];
		setCtrlHighlight(prefBtn, normalColor1, highlightColor1);
		// prefBtn.enabled = false;

		setBgColor(PAL_w, bgColor1);
		buildPalette(swatchesGrp);

		// ---------------------------------------------------------------------------------

		addBtn.addEventListener('click', function (c) {

			var aItem = app.project.activeItem;
			var selLayers = aItem != null ? aItem.selectedLayers : [];
			var refArray = loadProjectPalette();
			var newColorsArray = loadProjectPalette();

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

				} catch (err) { }
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

		// ---------------------------------------------------------------------------------

		PAL_w.onShow = PAL_w.onResizing = PAL_w.onResize = function () {
			PAL_layout(PAL_w);
		};

		return PAL_w;
	}

	var O_PALETTERO_WINDOW = PAL_WINDOW(thisObj);

	if (!(O_PALETTERO_WINDOW instanceof Panel)) O_PALETTERO_WINDOW.show();

	return O_PALETTERO_WINDOW;
}

// Executa tudo... ヽ(✿ﾟ▽ﾟ)ノ
O_PALETTERO_UTL(this);
