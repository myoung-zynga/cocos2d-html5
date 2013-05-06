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

cc.ui.Device = cc.ui.Device || {};

/**
 * Constant for the up key on the device's keyboard.
 */
cc.ui.Device.KEY_UP              = 15;

/**
 * Constant for the down key on the device's keyboard.
 */
cc.ui.Device.KEY_DOWN            = 16;

/**
 * Constant for the right key on the device's keyboard.
 */
cc.ui.Device.KEY_RIGHT           = 17;

/**
 * Constant for the left key on the device's keyboard.
 */
cc.ui.Device.KEY_LEFT            = 18;

/**
 * Constant for the select key on the device's keyboard (such as the enter key).
 */
cc.ui.Device.KEY_SELECT          = 19;

/**
 * Constant for the "Menu" key on the device. Not found on all devices. 
 */
cc.ui.Device.KEY_MENU            = 33;

/**
 * Constant for the "Back / Return" key on the device. 
 * Not found on all devices. 
 */
cc.ui.Device.KEY_BACK            = 34;

/**
 * Constant for the "Volume Up" key on the device. Not found on all devices. 
 */
cc.ui.Device.KEY_VOLUME_UP       = 35;

/**
 * Constant for the "Volume Down" key on the device. Not found on all devices. 
 */
cc.ui.Device.KEY_VOLUME_DOWN     = 36;    

/**
 * Constant for the "Play or Play/Pause" button on the device. Not always 
 * found on all devices. 
 */
cc.ui.Device.KEY_MEDIA_PLAYPAUSE = 37;

/**
 * Constant for the "Stop" button on the device. Not always found on all devices. 
 */
cc.ui.Device.KEY_MEDIA_STOP      = 38;

/**
 * Constant for the "Fast Forward" button on the device. Not always found on all 
 * devices. 
 */
cc.ui.Device.KEY_MEDIA_FORWARD   = 39;

/**
 * Constant for the "Rewind" button on the device. Not always found on all devices. 
 */
cc.ui.Device.KEY_MEDIA_REVERSE   = 40;

/**
 * Constant for the "Jump Forward / Next Chapter" button on the device. Not always 
 * found on all devices. 
 */
cc.ui.Device.KEY_MEDIA_NEXT      = 41;

/**
 * Constant for the "Jump Backward / Previous Chapter" button on the device. Not 
 * always found on all devices. 
 */
cc.ui.Device.KEY_MEDIA_PREVIOUS  = 42;

/**
 * Constant for the "Home" shortcut key on the device. 
 * Not found on all devices. 
 */
cc.ui.Device.KEY_SCUT_HOME       = 43;

/**
 * Constant for the "thumb wheel down" event on the device. 
 * Not found on all devices. 
 */
cc.ui.Device.KEY_TWHEEL_DOWN     = 47;

/**
 * Constant for the "thumb wheel up" event on the device. 
 * Not found on all devices. 
 */
cc.ui.Device.KEY_TWHEEL_UP       = 48;

/**
 * Property identifier for the device's vibration support.
 */
cc.ui.Device.PROP_VIBESUPPORT    = 0;

/**
 * Property identifier for the device's manufacturer name.
 */
cc.ui.Device.PROP_MANUFACTURER   = 10;

/**
 * Property identifier for the device's model name. 
 */
cc.ui.Device.PROP_MODEL          = 11;

/**
 * Property identifier for the device's Operating System type.
 */
cc.ui.Device.PROP_OSTYPE         = 12;
 
/**
 * Property identifier for the device's Operating System version.
 */
cc.ui.Device.PROP_OSVERSION      = 13;

/**
 * Property identifier for the device's battery charging status. This
 * value will either be true if the device is charging or false otherwise.
 */
cc.ui.Device.PROP_CHARGING       = 17;

/**
 * Property identifier for the device's tick count. This value is the
 * number of milliseconds since mobiJAX started.
 */
cc.ui.Device.PROP_TICKS          = 18;

/**
 * Property identifier for the device's memory used.
 */
cc.ui.Device.PROP_MEMORYUSED     = 19;

/**
 * Property identifier for the device's memory size.
 */
cc.ui.Device.PROP_MEMORYSIZE     = 20;

/**
 * Basic touch feedback type - used for pen down events 
 */
cc.ui.Device.TOUCH_FEEDBACK_BASIC      = 0;

/**
 * Sensitive touch feedback - used for changes in focus, 
 * scrolling and dragging 
 */
cc.ui.Device.TOUCH_FEEDBACK_SENSITIVE  = 1;

/**
 * Get the device property for the given identifier.
 * 
 * @param propId the identifier for the device property to retrieve, ie
 *               PROP_MANUFACTURER, PROP_MODEL, etc.
 * @return the value for the requested property
 */
cc.ui.Device.getProperty = function(propId) {
    if (propId == cc.ui.Device.PROP_TICKS) {
        return new Date().getTime();
    } else {
        // TODO FOR OTHER PROPERTIES
        // return __mobi.callSvc("system", "getProp", [ propId ]);
    }
};

/**
 * Activate the device's vibrate function for the given duration. If the
 * device does not support the vibrate function, this call will have no
 * effect.
 * 
 * @param duration the duration to activate the device's vibrate function
 *                 (in milliseconds)
 * @return true if the vibrate function activated, false otherwise
 */
cc.ui.Device.vibrate = function(duration) {
    // TODO
    // return __mobi.callSvc("system", "vibrate", [ duration ]);
};

/**
 * Activate the device's touch feedback function for the given type.
 * Valid types are TOUCH_FEEDBACK_BASIC and TOUCH_FEEDBACK_SENSITIVE
 * 
 * @param type the touch feedback type of event to simulate
 * @return true if the touch feedback function activated, false otherwise
 */
cc.ui.Device.touchFeedback = function(type) {
    // TODO
    // return __mobi.callSvc("input", "touchFB", [ type ]); 
};

/**
 * Function to request a garbage collection
 * 
 * @return true if the GC request was accepted
 */
cc.ui.Device.requestGC = function() {
    // TODO : May want to remove this function entirely but maybe not for
    // implementations on mobile devices
    // return __mobi.callSvc("system", "requestGC");
};

