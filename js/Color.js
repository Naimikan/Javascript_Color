(function (window, undefined) {
	var Color = function (/* red, green, blue | red, green, blue, opacity | rgbArray | hexString | colorJson */) {
		// Static method (via http://stackoverflow.com/a/5624139)
		Color.hexadecimalToRGB = function (hexadecimalColor) {
			// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
			var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hexadecimalColor = hexadecimalColor.replace(shorthandRegex, function (m, r, g, b) {
		        return r + r + g + g + b + b;
		    });

		    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexadecimalColor);
		    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 1] : undefined;
		};

		// Private attribute
		var RGBA = [];

		// Random Color
		if (arguments.length == 0) {
			RGBA = [Math.random() * 256, Math.random() * 256, Math.random() * 256, 1].map(function (x) {
				return Math.round(x/2.0);
			});
		} else if (arguments.length == 3) {
			// Red, Green, Blue
			var red = arguments[0];
			var green = arguments[1];
			var blue = arguments[2];

			if (isInteger(red) && isInteger(green) && isInteger(blue)) {
				RGBA = [red, green, blue, 1];
			} else {
				throw 'Invalid input type';
			}
		} else if (arguments.length == 4) {
			// Red, Green, Blue, Opacity
			var red = arguments[0];
			var green = arguments[1];
			var blue = arguments[2];
			var opacity = arguments[3];

			if (isInteger(red) && isInteger(green) && isInteger(blue)) {
				var checkedOpacity = checkOpacityValue(opacity);
				RGBA = [red, green, blue, checkedOpacity];
			} else {
				throw 'Invalid input type';
			}
		} else if (arguments.length == 1) {
			var argument = arguments[0];

			var argumentType = Object.prototype.toString.call(argument);

			switch (argumentType) {
				case "[object Array]":
					// rgbArray
					arrayConstructor(argument);
					break;

				case "[object String]":
					// hexString
					stringConstructor(argument);
					break;

				case "[object Object]":
					// colorJson ({ R: , G: , B:, A: optional })
					objectConstructor(argument);
					break;

				default:
					throw 'Invalid constructor';
					break;
			}
		} else {
			throw 'Invalid constructor';
		}

		// Public methods
		Color.prototype.toArray = function () {
			// Format [red, green, blue, alpha]
			return RGBA;
		};

		Color.prototype.toJson = function () {
			return {
				r: RGBA[0]
				, g: RGBA[1]
				, b: RGBA[2]
				, a: RGBA[3]
			};
		};

		Color.prototype.toRGBA = function () {
			return "rgba(" + RGBA.join(",") + ")";
		};

		Color.prototype.toRGB = function () {
			return "rgb(" + RGBA[0] + "," + RGBA[1] + "," + RGBA[2] + ")";
		};

		Color.prototype.toHexadecimal = function () {
			return "#" + ((1 << 24) + (RGBA[0] << 16) + (RGBA[1] << 8) + RGBA[2]).toString(16).slice(1);
		};

		Color.prototype.changeOpacity = function (newOpacity) {
			var checkedOpacity = checkOpacityValue(newOpacity);
			RGBA[3] = checkedOpacity;
		};

		/*Color.prototype.applyBrightness = function (brightnessToApply) {
			if (brightnessToApply !== undefined) {
				var brightnessMatrix = [];
				var validValue = false;

				if (isInteger(brightnessToApply)) {
					validValue = true;
				} else if (Object.prototype.toString.call(brightnessToApply) == '[object String]') {
					var tempTransform = brightnessToApply << 0;
					if (tempTransform == brightnessToApply) {
						brightnessToApply = tempTransform;
						if (isInteger(brightnessToApply)) {
							validValue = true;
						} else {
							throw 'Invalid brightness value';
						}
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

						RGBA = [RGBA[0] + brightnessMatrix[0], RGBA[1] + brightnessMatrix[1], RGBA[2] + brightnessMatrix[2], RGBA[3]];

						RGBA = [RGBA[0] + brightnessMatrix[0], RGBA[1] + brightnessMatrix[1], RGBA[2] + brightnessMatrix[2], RGBA[3]].map(function (x) {
					    	return Math.round(x/2.0);
						});
					} else {
						throw 'Invalid brightness value (0 to 5)';
					}
				}
			} else {
				throw 'Brightness required';
			}
		};*/

		// Private method's
		function isInteger (numberToCheck) {
			return (typeof numberToCheck === 'number' && isFinite(numberToCheck) && Math.floor(numberToCheck) === numberToCheck);
		}

		function isFloat (numberToCheck) {
			return (typeof numberToCheck === 'number' && isFinite(numberToCheck) && Math.floor(numberToCheck) !== numberToCheck);
		}

		function isValidNumber (numberToCheck) {
			return (typeof numberToCheck === 'number' && isFinite(numberToCheck));
		}

		function checkOpacityValue (opacity) {
			var checkedOpacity = 1;

			if (opacity !== undefined) {
				// Opacity format 0 to 1
				if (isValidNumber(opacity) && (opacity >= 0 && opacity <= 1)) {
					checkedOpacity = opacity;
				} else if (Object.prototype.toString.call(opacity) == '[object String]') {
					// Percentage value
					if (opacity.indexOf('%') !== -1) {
						opacity = opacity.replace("%", "");
						if (opacity.length > 0) {
							var tempTransform = opacity << 0;
							if (tempTransform == opacity) {
								opacity = tempTransform;
								if (isInteger(opacity) && (opacity >= 0 && opacity <= 100)) {
									checkedOpacity = opacity/100;
								} else {
									throw 'Invalid opacity value';
								}
							} else {
								throw 'Invalid opacity value';
							}
						} else {
							throw 'Invalid opacity value';
						}
					} else {
						throw 'Invalid opacity format';
					}
				} else {
					throw 'Invalid opacity value';
				}
			} else {
				throw 'Opacity required';
			}

			return checkedOpacity;
		}

		function arrayConstructor (argument) {
			if (argument.length >= 3) {
				var red = argument[0];
				var green = argument[1];
				var blue = argument[2];

				if (isInteger(red) && isInteger(green) && isInteger(blue)) {
					RGBA = [red, green, blue];

					var opacity = argument[3];
					if (opacity !== undefined) {
						var checkedOpacity = checkOpacityValue(opacity);
						RGBA[3] = checkedOpacity;
					} else {
						RGBA[3] = 1;
					}
				} else {
					throw 'Invalid input type';
				}
			} else {
				throw 'Invalid input format';
			}
		}

		function stringConstructor (argument) {
			var transformedColor = Color.hexadecimalToRGB(argument);
			if (transformedColor !== undefined) {
				RGBA = transformedColor;
			} else {
				throw 'Invalid hex color';
			}
		}

		function objectConstructor (argument) {
			if (argument.hasOwnProperty('r') && argument.hasOwnProperty('g') && argument.hasOwnProperty('b')) {
				if (isInteger(argument.r) && isInteger(argument.g) && isInteger(argument.b)) {
					RGBA = [argument.r, argument.g, argument.b];

					if (argument.hasOwnProperty('a')) {
						var checkedOpacity = checkOpacityValue(argument.a);
						RGBA[3] = checkedOpacity;
					} else {
						RGBA[3] = 1;
					}
				} else {
					throw 'Invalid input type';
				}
			} else {
				throw 'Invalid input format';
			}
		}
	};

	// NodeJS
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Color;
	} else {
		window.Color = Color;
	}
})(window);
