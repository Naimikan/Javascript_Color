'use strict';

(function (window, undefined) {
	// typeof rgbArray --> Array
	// typeof hexString --> String
	var Color = function (/* red, green, blue | rgbArray | hexString */) {
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
			if (typeof argument == 'Array') {
				RGB = argument;
			}

			// hexString
			if (typeof argument == 'String') {

			}
		} else {
			throw 'Invalid constructor';
		}

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

		Color.prototype.applyBrightness = function (brightnessToApply) {
			// brightnessToApply --> 0 to 5
			if (brightnessToApply !== void 0) {
				var brightnessMatrix = [];

				if (typeof brightnessToApply == 'Number') {
					brightnessMatrix = [brightnessToApply * 51, brightnessToApply * 51, brightnessToApply * 51];
				} else if (typeof brightnessToApply == 'String') {
					if (!isNaN(parseInt(brightnessToApply)) {
						brightnessMatrix = [brightnessToApply * 51, brightnessToApply * 51, brightnessToApply * 51];
					} else {
						throw 'Invalid brightness value';
					}
				} else {
					throw 'Invalid input type';
				}

				RGB = [RGB[0] + brightnessMatrix[0], RGB[1] + brightnessMatrix[1], RGB[2] + brightnessMatrix[2]].map(function (x) {
					return Math.round(x/2.0);
				});
			} else {
				throw 'Brightness required';
			}
		};
	};
})(window);