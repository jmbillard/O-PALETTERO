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
			} catch (err) {}
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

function saveProjectPalette(sectionGrp) {
	var tempSwatchesArray = [];
	var swatchesCount = sectionGrp.children.length;

	for (var s = 0; s < swatchesCount; s++) {
		var colorGrp = sectionGrp.children[s];
		var swatch = colorGrp.children[0];
		var tempHEX = rgbToHEX(swatch.swatchColor);
		var tempName = swatch.label;

		tempSwatchesArray.push(tempHEX + ':' + tempName);
	}

	var mData = new XMPMeta(app.project.xmpPacket);
	var schemaNS = XMPMeta.getNamespaceURI('xmp');
	var propName = 'xmp:Label';

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
	var schemaNS = XMPMeta.getNamespaceURI('xmp');
	var propName = 'xmp:Label';

	var data = {
		swatchesArray: [],
		labelsArray: []
	};

	for (var s = 0; s < PAL_preferencesObj.swatches.length; s++) {
		if (!PAL_preferencesObj.swatches[s].hasOwnProperty('color')) continue;

		var tempColor = PAL_preferencesObj.swatches[s].color;
		data.swatchesArray.push(tempColor);

		if (!PAL_preferencesObj.swatches[s].hasOwnProperty('label')) {
			data.labelsArray.push(tempColor);
		} else {
			data.labelsArray.push(PAL_preferencesObj.swatches[s].label);
		}
	}

	if (data.swatchesArray.length == 0) {
		for (var s = 0; s < PAL_defaultPreferencesObj.swatches.length; s++) {
			var tempColor = PAL_defaultPreferencesObj.swatches[s].color;
			var tempName = PAL_defaultPreferencesObj.swatches[s].label;
			data.swatchesArray.push(tempColor);

			if (tempName.trim() == '') tempName = tempColor;
			data.labelsArray.push(tempName);
		}
	}

	try {
		var propVal = mData.getProperty(schemaNS, propName);
		var tempArray = propVal.toString().split('-');
		var tempData = {
			swatchesArray: [],
			labelsArray: []
		};

		for (var s = 0; s < tempArray.length; s++) {
			var newData = tempArray[s].split(':');
			var tempColor = newData[0];
			var tempName = newData.length > 1 ? newData[1] : '';
			tempData.swatchesArray.push(tempColor);
			tempData.labelsArray.push(tempName);
		}

		if (tempData.swatchesArray.length > 0) data = tempData;
	} catch (err) {}

	return data;
}

// ---------------------------------------------------------------------------------

function loadDefaultPreferences() {
	var filePath = scriptPreferencesPath + '/preferences.json';
	var JSONPreferencesFile = new File(filePath);
	var tempPreferencesObj = {};

	if (JSONPreferencesFile.exists) {
		var JSONContent = readFileContent(JSONPreferencesFile);

		try {
			tempPreferencesObj = JSON.parse(JSONContent);
		} catch (err) {
			alert(lol + '\n' + err.message);
		}
	}

	for (var o in PAL_defaultPreferencesObj) {
		if (!tempPreferencesObj.hasOwnProperty(o)) {
			tempPreferencesObj[o] = PAL_defaultPreferencesObj[o];
		}
	}
	showColorInfo = tempPreferencesObj.showColorInfo;
	labelType = tempPreferencesObj.labelType;

	return tempPreferencesObj;
}

function saveDefaultPreferences() {
	if (!scriptPreferencesFolder.exists) scriptPreferencesFolder.create();

	for (var o in PAL_preferencesObj) {
		if (!PAL_defaultPreferencesObj.hasOwnProperty(o)) {
			delete PAL_preferencesObj[o];
		}
	}

	var fileContent = JSON.stringify(PAL_preferencesObj, null, '\t');
	var filePath = scriptPreferencesPath + '/preferences.json';

	return saveTextFile(fileContent, filePath);
}

// ---------------------------------------------------------------------------------

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

// Abre um URL no navegador padrão do sistema operacional (Windows ou macOS).
function openWebSite(url) {
	if (appOs == 'Win') {
		// Comando para abrir o URL no Windows Explorer (que também pode abrir URLs)
		system.callSystem('explorer ' + url);
	} else if (appOs == 'Mac') {
		// Comando para abrir o URL no navegador padrão do macOS
		system.callSystem('open ' + url);
	}
}

// ---------------------------------------------------------------------------------
