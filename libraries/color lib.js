/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/*

---------------------------------------------------------------
> 🖌️ color and conversions
---------------------------------------------------------------

*/
// Converte uma string hexadecimal (com ou sem '#') para um array RGB normalizado.
function hexToRGB(hex) {
	if (hex == undefined) return [Math.random(), Math.random(), Math.random()];

	// Remove o '#' se estiver presente
	hex = hex.replace('#', '');

	// Extrai os componentes RGB do hexadecimal e converte para valores de 0 a 255
	var r = parseInt(hex.substring(0, 2), 16);
	var g = parseInt(hex.substring(2, 4), 16);
	var b = parseInt(hex.substring(4, 6), 16);

	// Retorna o array com os valores RGB normalizados
	return [r / 255, g / 255, b / 255];
}

// Converte um componente de cor (0-255) para hexadecimal
function componentToHex(c) {

	const hex = c.toString(16);

	return hex.length == 1 ? '0' + hex : hex;
}

// Converte um array RGB normalizado [0-1] para uma hexadecimal
function rgbToHEX(rgbArray) {

	const r = Math.round(rgbArray[0] * 255);
	const g = Math.round(rgbArray[1] * 255);
	const b = Math.round(rgbArray[2] * 255);

	return ['#',
		componentToHex(r),
		componentToHex(g),
		componentToHex(b)
	].join('').toUpperCase();
}

function rgbToRGB(rgbArray) {

	var RGBArray = [];

	for (var i = 0; i < rgbArray.length; i++) {

		RGBArray.push(Math.round(rgbArray[i] * 255));
	}
	return RGBArray;
}

// function rgbToHEX(rgbArray) {
// 	var a = (rgbArray[0] * 255).toString(16);
// 	var b = (rgbArray[1] * 255).toString(16);
// 	var c = (rgbArray[2] * 255).toString(16);
// 	if (a.length != 2) {
// 		a = "0" + a;
// 	}
// 	if (b.length != 2) {
// 		b = "0" + b;
// 	}
// 	if (c.length != 2) {
// 		c = "0" + c;
// 	}
// 	return ('#' + a + b + c).toUpperCase();
// }

function hsbToRgb(hsbArray) {

	var rgbArray = [];
	hsbArray = [hsbArray[0], hsbArray[1] / 100, hsbArray[2] / 100];
	for (var offset = 240, i = 0; i < 3; i++, offset -= 120) {
		x = Math.abs((hsbArray[0] + offset) % 360 - 240);
		if (x <= 60) {
			rgbArray[i] = 255;
		} else if (60 < x && x < 120) {
			rgbArray[i] = ((1 - (x - 60) / 60) * 255);
		} else {
			rgbArray[i] = 0;
		}
	}
	for (var i = 0; i < 3; i++) {
		rgbArray[i] += (255 - rgbArray[i]) * (1 - hsbArray[1]);
	}
	for (var i = 0; i < 3; i++) {
		rgbArray[i] *= hsbArray[2];
	}
	return [rgbArray[0], rgbArray[1], rgbArray[2]]
}

function rgbToHsb(rgbArray) {

	rgbArray = [rgbArray[0] * 255, rgbArray[1] * 255, rgbArray[2] * 255]
	var hsbArray = [];
	var rearranged = rgbArray.slice(0);
	var maxIndex = 0;
	var minIndex = 0;

	rearranged.sort(function (a, b) {
		return a - b;
	})
	for (var i = 0; i < 3; i++) {
		if (rearranged[0] == rgbArray[i]) minIndex = i;
		if (rearranged[2] == rgbArray[i]) maxIndex = i;
	}
	if (rearranged[2] != 0) {
		hsbArray[2] = rearranged[2] / 255;
		hsbArray[1] = 1 - rearranged[0] / rearranged[2];
		if (hsbArray[1] != 0) {
			hsbArray[0] = maxIndex * 120 + 60 * (rearranged[1] / hsbArray[1] / rearranged[2] + (1 - 1 / hsbArray[1])) * ((maxIndex - minIndex + 3) % 3 == 1 ? 1 : -1);
			hsbArray[0] = (hsbArray[0] + 360) % 360;
		} else {
			hsbArray[0] = 0;
		}
	} else {
		hsbArray[2] = 0;
		hsbArray[1] = 0;
		hsbArray[0] = 0;
	}
	return [Math.round(hsbArray[0]), Math.round(hsbArray[1] * 100), Math.round(hsbArray[2] * 100)];
}

function hexToHsl(hex) {
	var r = parseInt(hex.slice(1, 3), 16) / 255;
	var g = parseInt(hex.slice(3, 5), 16) / 255;
	var b = parseInt(hex.slice(5, 7), 16) / 255;

	var max = Math.max(r, g, b);
	var min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}

	return [h, s, l];
}

function sortHex(colorArray) {

	return colorArray.sort(function (a, b) {
		var hslA = hexToHsl(a);
		var hslB = hexToHsl(b);

		if (Math.abs(hslA[0] - hslB[0]) < 0.25) {
			return hslA[0] - hslB[0];
		} else {
			return hslA[2] - hslB[2];
		}
	});
}

// Calcular a luminância relativa
function luminance(r, g, b) {
	r = r / 255;
	g = g / 255;
	b = b / 255;
	r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
	g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
	b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
	return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

function isLightColor(bgColor) {

	var rgb = hexToRGB(bgColor) * 255;
	var bgLum = luminance(rgb.r, rgb.g, rgb.b);

	// Luminância de branco (#FFFFFF) e preto (#000000)
	var whiteLum = luminance(255, 255, 255);
	var blackLum = luminance(0, 0, 0);

	// Razão de contraste (o mais alto é melhor)
	var contrastWithWhite = (whiteLum + 0.05) / (bgLum + 0.05);
	var contrastWithBlack = (bgLum + 0.05) / (blackLum + 0.05);

	// Verificar se o contraste com branco é suficiente
	var isWhiteLegible = contrastWithWhite >= 4.5;
	var isBlackLegible = contrastWithBlack >= 4.5;

	return isWhiteLegible ? true : !isBlackLegible;
}