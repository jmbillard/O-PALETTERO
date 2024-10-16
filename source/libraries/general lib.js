// ---------------------------------------------------------------------------------

function getPropertyColors(property, array) {
	var excludeArray = [
		'ADBE Material Options Group',
		'ADBE Plane Options Group',
		'ADBE Vector Materials Group',
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

		tempSwatchesArray.push(tempHEX);
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

	var swatchesArray = [];

	for (var s = 0; s < PAL_preferencesObj.swatches.length; s++) {
		if (!PAL_preferencesObj.swatches[s].hasOwnProperty('color')) continue;

		swatchesArray.push(PAL_preferencesObj.swatches[s].color);
	}

	if (swatchesArray.length == 0) {
		for (var s = 0; s < PAL_defaultPreferencesObj.swatches.length; s++) {
			swatchesArray.push(PAL_defaultPreferencesObj.swatches[s].color);
		}
	}

	try {
		var propVal = mData.getProperty(schemaNS, propName);
		var tempSwatchesArray = propVal.toString().split('-');

		if (tempSwatchesArray.length > 0) swatchesArray = tempSwatchesArray;
	} catch (err) {}

	return swatchesArray;
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
	showLabels = tempPreferencesObj.showLabels;
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

// ---------------------------------------------------------------------------------
