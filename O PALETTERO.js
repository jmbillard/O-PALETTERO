/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

function O_PALETTERO_UTL(thisObj) {

	var scriptName = 'O PALETTERO';
	var scriptVersion = 'v0.3b';

	#include 'source/libraries/JSON lib.js';
	#include 'source/libraries/color lib.js';
	#include 'source/libraries/general lib.js';
	#include 'source/libraries/metadata lib.js';
	#include 'source/libraries/ui lib.js';
	#include 'source/utils/colorPicker.js';
	#include 'source/utils/preferences ui.js';
	#include 'source/globals.js';
	#include 'source/main ui.js';

	// ---------------------------------------------------------------------------------

	var O_PALETTERO_WINDOW = PAL_WINDOW(thisObj);

	if (!(O_PALETTERO_WINDOW instanceof Panel)) O_PALETTERO_WINDOW.show();

	return O_PALETTERO_WINDOW;
}

// Executa tudo... ヽ(✿ﾟ▽ﾟ)ノ
O_PALETTERO_UTL(this);
