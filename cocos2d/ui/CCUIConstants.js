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

cc.ui.Constants = cc.ui.Constants || {};

// ALIGNMENT

/**
 * Constant for left horizontal alignment, set to 1
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.ALGN_LEFT            = 1;

/**
 * Constant for centered horizontal alignment, set to 2
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.ALGN_CENTER          = 2;

/**
 * Constant for right horizontal alignment, set to 4
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.ALGN_RIGHT           = 4;

/**
 * Constant for top vertical alignment, set to 8
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.ALGN_TOP             = 8;

/**
 * Constant for middle vertical alignment, set to 16
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.ALGN_MIDDLE          = 16;

/**
 * Constant for baseline vertical alignment, set to 32
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.ALGN_BASELINE        = 32;

/**
 * Constant for bottom vertical alignment, set to 64
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.ALGN_BOTTOM          = 64;


// TRAVERSAL    

/**
 * Constant for up traversal direction, set to 15
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.TRVS_UP              = 15;

/**
 * Constant for down traversal direction, set to 16
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.TRVS_DOWN            = 16;

/**
 * Constant for right traversal direction, set to 17
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.TRVS_RIGHT           = 17;

/**
 * Constant for left traversal direction, set to 18
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.TRVS_LEFT            = 18;

/**
 * Constant for a "forward" traversal, which moves from the logical 
 * beginning to the logical end, regardless of orientation, set to 19.
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.TRVS_FWD             = 19;

/**
 * Constant for a "backward" traversal, which moves from the logical end 
 * to the logical beginning, regardless of orientation, set to 20.
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.TRVS_BKWD            = 20;    

// COLORS

/**
 * Constant for the background color type, set to 0
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.COLOR_BG             = 0;

/**
 * Constant for the background color type when the Component has
 * input focus, set to 1
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.COLOR_BG_HL          = 1;

/**
 * Constant for the background color type when the Component is
 * pressed, set to 2
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.COLOR_BG_PRESSED     = 2;

/**
 * Constant for the foreground color type, set to 3
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.COLOR_FG             = 3;

/**
 * Constant for the foreground color type when the Component has
 * input focus, set to 4
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.COLOR_FG_HL          = 4;

/**
 * Constant for the foreground color type when the Component is pressed,
 * set to 5
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.COLOR_FG_PRESSED     = 5;

/**
 * Constant for the foreground shadow color type, set to 6
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.COLOR_FG_SHD         = 6;

/**
 * Constant for the foreground shadow color type when the Component
 * has input focus, set to 7
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.COLOR_FG_SHD_HL      = 7;

/**
 * Constant for the foreground shadow color type when the Component
 * is pressed, set to 8
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.COLOR_FG_SHD_PRESSED = 8;

// IMAGES

/**
 * Constant for the background image type, set to 0
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.IMAGE_BG             = 0;

/**
 * Constant for the background image type when the Component
 * has input focus, set to 1
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.IMAGE_BG_HL          = 1;

/**
 * Constant for the background image type when the Component
 * is pressed, set to 2
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.IMAGE_BG_PRESSED     = 2;

/**
 * Constant for the foreground image type, set to 3
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.IMAGE_FG             = 3;

/**
 * Constant for the foreground image type when the Component
 * has input focus, set to 4
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.IMAGE_FG_HL          = 4;

/**
 * Constant for the foreground image type when the Component
 * is pressed, set to 5
 *
 * @constant
 * @type Number
 */
cc.ui.Constants.IMAGE_FG_PRESSED     = 5;
