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
// function rgbToHEX(rgbArray) {

// 	const r = Math.round(rgbArray[0] * 255);
// 	const g = Math.round(rgbArray[1] * 255);
// 	const b = Math.round(rgbArray[2] * 255);

// 	return ['#',
// 		componentToHex(r),
// 		componentToHex(g),
// 		componentToHex(b)
// 	].join('').toUpperCase();
// }

function rgbToHEX(rgbArray) {
	var a = (rgbArray[0] * 255).toString(16);
	var b = (rgbArray[1] * 255).toString(16);
	var c = (rgbArray[2] * 255).toString(16);
	if (a.length != 2) {
		a = "0" + a;
	}
	if (b.length != 2) {
		b = "0" + b;
	}
	if (c.length != 2) {
		c = "0" + c;
	}
	return ('#' + a + b + c).toUpperCase();
}

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
