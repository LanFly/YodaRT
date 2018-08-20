'use strict';

/**
 * @namespace light
 * @description Use `light` module to control your LEDs.
 *
 * ```js
 * var light = require('light');
 * light
 *   .fill(20, 20, 20, 0.7)
 *   .pixel(3, 255, 255, 255)
 *   .pixel(3, 233, 233, 200)
 *   .write();
 * ```
 *
 * As you can seen, this module provides the following main methods:
 * - `fill()`: fill the color on all the lights, and write immediately.
 * - `pixel()`: fill the color on the given light by index.
 * - `write()`: write the current buffer.
 */

var native = require('./light.node');

/**
 * Describe the hardware features for the current light.
 * @typedef {Object} light.LightProfile
 * @property {Number} leds - the number of LEDs.
 * @property {Number} format - the color format, commonly 3 means rgb.
 * @property {Number} maximumFps - the maximum fps.
 * @property {Number} micAngle - the mic angle at zero.
 */

var config = native.getProfile();
var length = config.leds * (config.format || 3);
var buffer = new Buffer(length);
var enabled = false;

(function bootstrap() {
  native.enable();
  enabled = true;
})();

module.exports = {

  /**
   * Enable the light write
   * @memberof light
   * @function enable
   * @private
   */
  enable: function() {
    if (!enabled) {
      native.enable();
    }
  },

  /**
   * Disable the light write
   * @memberof light
   * @function disable
   * @private
   */
  disable: function() {
    if (enabled) {
      native.disable();
    }
  },

  /**
   * Render the current buffer
   * @memberof light
   * @function write
   * @param {Buffer} [explict] - if present, use the given buffer to write.
   */
  write: function writeBuffer(explict) {
    native.write(explict || buffer);
    return this;
  },
  
  /**
   * Get the hardware profile data
   * @memberof light
   * @function getProfile
   * @returns {light.LightProfile}
   */
  getProfile: native.getProfile,

  /**
   * Fill all lights with the same color.
   * @memberof light
   * @function fill
   * @param {Number} red - the red number 0-255.
   * @param {Number} green - the green number 0-255.
   * @param {Number} blue - the blue number 0-255.
   * @param {Number} [alpha=1] - the alpha number.
   * @example
   * light.fill(255, 255, 233, 0.3); // this will render rgba(255,255,233,0.3)
   */
  fill: function fillColor(red, green, blue, alpha) {
    if (red === green && green === blue) {
      buffer.fill(red, length);
    } else {
      for (var i = 0; i < config.leds; i++) {
        this._pixel(i, red, green, blue, alpha);
      }
    }
    return this;
  },

  /**
   * Render a pixel with the a color
   * @memberof light
   * @function pixel
   * @param {Number} index - the index of the light LEDs.
   * @param {Number} red - the red number 0-255.
   * @param {Number} green - the green number 0-255.
   * @param {Number} blue - the blue number 0-255.
   * @param {Number} [alpha=1] - the alpha number.
   * @param {Number} [shading=false] - show shadow.
   * @example
   * light.pixel(3, 255, 255, 255) // this will light black on 3rd led.
   */
  pixel: function pixelColor(index, red, green, blue, alpha, shading) {
    this._pixel(index, red, green, blue, alpha);
    if (shading) {
      index = (index === 0) ? (config.leds - 1) : index - 1;
      this._pixel(index, red, green, blue, 0.3);
      index = (index === 0) ? (config.leds - 1) : index - 1;
      this._pixel(index, red, green, blue, 0.1);
    }
    return this;
  },
  
  /**
   * Render a pixel with the a color
   * @memberof light
   * @function _pixel
   * @private
   */
  _pixel: function(index, red, green, blue, alpha) {
    if (typeof alpha === 'number' && alpha >= 0 && alpha < 1) {
      red = Math.floor(alpha * red);
      green = Math.floor(alpha * green);
      blue = Math.floor(alpha * blue);
    }
    buffer.writeUInt8(red,    0 + index * 3);
    buffer.writeUInt8(green,  1 + index * 3);
    buffer.writeUInt8(blue,   2 + index * 3);
  },

  /**
   * Clear the light
   * @memberof light
   * @function clear
   */
  clear: function clearColor() {
    this.fill(0, 0, 0);
    return this;
  },

};