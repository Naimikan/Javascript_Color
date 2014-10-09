var Color = function (/* red, green, blue | rgbArray | hexString | colorJson */) {
	// Static method (via http://stackoverflow.com/a/5624139)
	Color.hexadecimalToRGB = function (hexadecimalColor) {
		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hexadecimalColor = hexadecimalColor.replace(shorthandRegex, function (m, r, g, b) {
	        return r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexadecimalColor);
	    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
	};

	// Private attribute
	var RGB = [];

	// Random Color
	if (arguments.length == 0) {
		RGB = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
	} else if (arguments.length == 3) {
		// Red, Green, Blue
		var red = arguments[0];
		var green = arguments[1];
		var blue = arguments[2];

		RGB = [red, green, blue];
	} else if (arguments.length == 1) {
		var argument = arguments[0];

		// rgbArray
		if (Object.prototype.toString.call(argument) == '[object Array]') {
			RGB = argument;
		}

		// hexString
		if (Object.prototype.toString.call(argument) == '[object String]') {
			RGB = Color.hexadecimalToRGB(argument);
		}

		// colorJson ({ R: , G: , B: })
		if (Object.prototype.toString.call(argument) == '[object Object]') {
			var tempRGB = [];
			for (var property in argument) {
				tempRGB.push(argument[property]);
			}

			RGB = [tempRGB[0], tempRGB[1], tempRGB[2]];
		}
	} else {
		throw 'Invalid constructor';
	}

	// Public methods
	Color.prototype.toArray = function () {
		// Format [red, green, blue]
		return RGB;
	};

	Color.prototype.toJson = function () {
		return {
			red: RGB[0]
			, green: RGB[1]
			, blue: RGB[2]
		};
	};

	Color.prototype.toRGB = function () {
		return "rgb(" + RGB.join(",") + ")";
	};

	Color.prototype.toHexadecimal = function () {
		return "#" + ((1 << 24) + (RGB[0] << 16) + (RGB[1] << 8) + RGB[2]).toString(16).slice(1);
	};

	Color.prototype.applyBrightness = function (brightnessToApply) {
		if (brightnessToApply !== void 0) {
			var brightnessMatrix = [];
			var validValue = false;

			if (typeof brightnessToApply == 'number') {
				validValue = true;
			} else if (typeof brightnessToApply == 'string') {
				if (!isNaN(parseInt(brightnessToApply))) {
					validValue = true;
				} else {
					throw 'Invalid brightness value';
				}
			} else {
				throw 'Invalid input type';
			}

			if (validValue) {
				// brightnessToApply --> 0 to 5
				if (brightnessToApply >= 0 && brightnessToApply <= 5) {
					brightnessMatrix = [brightnessToApply * 51, brightnessToApply * 51, brightnessToApply * 51];

					RGB = [RGB[0] + brightnessMatrix[0], RGB[1] + brightnessMatrix[1], RGB[2] + brightnessMatrix[2]].map(function (x) {
						return Math.round(x/2.0);
					});
				} else {
					throw 'Invalid brightness value (0 to 5)';
				}
			}
		} else {
			throw 'Brightness required';
		}
	};
};