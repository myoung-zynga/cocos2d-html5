/****************************************************************************
 Copyright (c) 2013      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

cc.ui = cc.ui || {};

// Define some constants

/**
 * Log level for informational log messages
 *
 * @constant
 * @type Number
 */
cc.ui.LOG_INFO = 10;

/**
 * Log level for warning log messages
 *
 * @constant
 * @type Number
 */
cc.ui.LOG_WARNING = 20;

/**
 * Log level for error log messages
 *
 * @constant
 * @type Number
 */
cc.ui.LOG_ERROR = 30;

// Utility functions

/**
 * Sends debug message with given level number and channel.
 * 
 * @param level   The level of the error, which must be above the current
 *                threshold for anything to take place.
 * @param channel The channel through which the error took place.
 * @param message The debug message.
 */    
cc.ui.log = function(level, channel, message) {
    console.log(level + ", " + channel + ", " + message);
};

/**
 * Convenience function to log an informational level message
 *
 * @param channel The channel through which the error took place.
 * @param message The debug message.
 */
cc.ui.logI = function(channel, message) {
    cc.ui.log(cc.ui.LOG_INFO, channel, message);
};

/**
 * Convenience function to log a warning level message
 *
 * @param channel The channel through which the error took place.
 * @param message The debug message.
 */
cc.ui.logW = function(channel, message) {
    cc.ui.log(cc.ui.LOG_WARNING, channel, message);
};

/**
 * Convenience function to log an error level message
 *
 * @param channel The channel through which the error took place.
 * @param message The debug message.
 */
cc.ui.logE = function(channel, message) {
    cc.ui.log(cc.ui.LOG_ERROR, channel, message);
};

/**
 * Calculates whether 
 * the given two given regions, <i>rect1</i> and <i>rect1</i>, intersect. 
 * 
 * @param rect1 Object with properties x, y, w, and h; for example,
 *              <pre>
 *              &#123; x &#58; 0, y &#58; 0, w &#58; 21, h &#58; 30 &#125;
 * @param rect2 Object with properties x, y, w, and h; for example,
 *              <pre>
 *              &#123; x &#58; 0, y &#58; 0, w &#58; 21, h &#58; 30 &#125;
 *              </pre>
 * 
 * @return true, if the regions overlap; otherwise, false
 */
cc.ui.intersects = function(rect1, rect2) {
    try {
		rect1.x2 = rect1.x + rect1.w;
		rect1.y2 = rect1.y + rect1.h;
		rect2.x2 = rect2.x + rect2.w;
		rect2.y2 = rect2.y + rect2.h;

		var x = !(rect2.x >= rect1.x2 || rect2.x2 <= rect1.x 
				|| rect2.y >= rect1.y2 || rect2.y2 <= rect1.y);
				 
		return x;
	} catch (err) {
		cc.ui.logE("cc.ui", 
                   "intersects error: " + err);
	}
	return false;
};

/**
 * Returns the distance (in pixels) between two given points with coordinates:
 * <i>x1, y1</i> and <i>x2, y2</i>.
 *
 * @param x1 The x coordinate of the first point
 * @param y1 The y coordinate of the first point
 * @param x2 The x coordinate of the second point
 * @param y2 The y coordinate of the second point
 * @return distance between 2 points.
 */
cc.ui.distance = function(x1, y1, x2, y2) {
	try {
		var a = Math.pow((x2 - x1), 2);
		var b = Math.pow((y2 - y1), 2);
		return Math.sqrt(a + b);
	} catch (err) {
		cc.ui.logE("cc.ui",
                   "Utilities.distance: Error calculating distance: " + err);
	}
	return null;
};
	
/**
 * Special enhancement of the JavaScript instanceOf method. Handles additional
 * cases of null/Null, Numbers, Strings, Booleans, Functions, and Undefined.
 *
 * @param obj the object to test
 * @param type the type to test against
 * @return true if the obj is an instance of the given type
 */
cc.ui.instanceOf = function(obj, type) {

    switch (typeof obj) {
        case "object":
        return (obj instanceof type) ||
             // special case for null
             (obj === null && type == Null);

        case "number":
        return (type == Number);

        case "string":
        return (type == String);

        case "boolean":
        return (type == Boolean);

        case "function":
        return (type == Function) ||
             // see if it's really a RegExp (because typeof identifies regular
             // expressions as functions in Firefox)
             (type == RegExp) && (obj instanceof RegExp);

        case "undefined":
        return (type == undefined);
    }

    return false;
};
