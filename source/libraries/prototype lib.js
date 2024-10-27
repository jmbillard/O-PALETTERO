if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (element, startPoint) {
		var k;

		if (this == null) {
			throw new TypeError('"this" é nulo (null) ou não foi definido (undefined)');
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

if (!Array.prototype.pop) {
	Array.prototype.pop = function () {
		if (this.length == 0) {
			return undefined;
		}
		var lastElement = this[this.length - 1];
		this.length--; // Reduz o tamanho do array
		return lastElement;
	};
}

