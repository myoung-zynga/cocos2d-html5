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

/**
 * Window represents top level Component in cc.ui toolkit.
 * It manages size, painting, image tracking, and display 
 * loading  of top level components. 
 * <br /><br />
 * Each Window has a FocusManager that manages input and focus traversal 
 * within that Window.
 */
cc.ui.Window = cc.ui.Box.extend({
 
    ctor : function () {
        this._super();

        // TODO: may need to query for virtual keyboard support

        // By default, a window's bg color is white
        // FIXME: adjust for cocos's color model and opacity
        this.$colors[cc.ui.Constants.COLOR_BG] = "0xFFFFFFFF";
        // By setting a default color we should also set hasBG to true so
        // that the default color gets painted.
        this.$hasBG = true;

        // A bounding rectangle around the dirty region of the window
        // (the region which needs to be repainted) in window's coordinates
        this.$dirtyRect = { "x" : 0, "y" : 0, "w" : 0, "h" : 0 };
        // A shadow copy of the dirty rect
        this.$dR = { "x" : 0, "y" : 0, "w" : 0, "h" : 0 };        
        
        // A flag to tell if this window needs to be painted.
        // needsPaint will be set to true the first time by the repaint() 
        // called from show()        
        this.$needsPaint = false;
        // There is an default traverse needed the first time a window
        // is shown
        this.$needsTraverse = true;        
        // The displaySize variable remembers the dimensions of
        // the display the last time layout was done. Then, if the
        // window is later shown and the display size has changed,
        // layout will be done again.
        this.$displaySize = { "w" : 0, "h" : 0 };
        // Keep track of whether this window is currently showing
        // on the display or not
        this.$showing = false;

        // The set of all Images to be tracked by this window
        this.$trackedImages = new Array();
        // The FocusManager for the window
        // this.$focusManager = new cc.ui.FocusManager(this);
        // By default the window will wait for all images it contains
        // to be loaded before the first paint.
        this.$waitForImages = true;
        // Remember if this is a touch device or not
        // this.$isTouch = cc.ui.Device.getProperty(cc.ui.Device.PROP_TOUCHSUPPORT);        
    },

    /**
     * Returns the <a href="./cc.ui.FocusManager.html"cc.ui.FocusManager</a>
     * instance, which manages traversal and input focus for this Window.
     * 
     * @return FocusManager for this Window
     */
    getFocusManager : function() {
        return this.$focusManager;
    },
    
    /**
     * Overrides <a href="./cc.ui.Component.html#a_sizeChanged">
     * cc.ui.Component.sizeChanged()</a> method to issue a repaint of
     * this Window and as a result of all its children.
     */
    sizeChanged : function() {
        this.super();
        this.$sizeDirty = true;
        this.repaint();
    },

    /**
     * Overrides <a href="./cc.ui.Component.html#a_repaint">
     * cc.ui.Component.repaint()</a> method to 
     * requests repainting of an 
     * area defined by the given set of coordinates (<i>x</i>, <i>y</i>, 
     * <i>w</i>, and <i>h</i>), specifically: 
     * <br /><br />
     * <ul>
     * <li>Upper left: x, y</li>
     * <li>Upper right: x + w, y</li>
     * <li>Lower left: x, y + h</li>
     * <li>Lower right: x + w, y + h</li>
     * </ul>
     * <br /><br />
     * These parameters must be in the Window's own coordinate space (that 
     * is, <i>0,0</i> maps to the top-left corner of the Window) and define the 
     * region of the Window to be repainted.
     * If no parameters are given, the entire Window is repainted (the same 
     * as calling repaint(0, 0, [full width], [full height]).
     *
     * @param x the x coordinate of the origin of the region to be repainted
     * @param y the y coordinate of the origin of the region to be repainted
     * @param w the width of the region to be repainted
     * @param h the height of the region to be repainted
     */
    repaint : function(x, y, w, h) {
        /*
        cc.ui.logI("cc.ui.Window", "");
        cc.ui.logI("cc.ui.Window", "");
        cc.ui.logI("cc.ui.Window", 
                   "Window.repaint: " + x + ", " + y + ", " + w + ", " + h);
        cc.ui.logI("cc.ui.Window", 
                   "Window.$dirtyRect: " + 
                       $dirtyRect.x + ", " +
                       $dirtyRect.y + ", " + 
                       $dirtyRect.w + ", " +
                       $dirtyRect.h);        
        */
        
        // Sanitize the parameters
        x = (x && x >= 0 && x < this.$obounds.w) ? x : 0;
        y = (y && y >= 0 && y < this.$obounds.h) ? y : 0;
        w = (w && w > 0 && w < this.$obounds.w) ? w : this.$obounds.w;
        h = (h && h > 0 && h < this.$obounds.h) ? h : this.$obounds.h;
                
        // Calculate the extent values of the dirty rects
        var y1 = y + h;
        var x1 = x + w;

        if (!this.$needsPaint) {
            this.$needsPaint = true;
            this.$dirtyRect.x = x;
            this.$dirtyRect.y = y;
            this.$dirtyRect.w = w;
            this.$dirtyRect.h = h;
        } else {                        
            // Coalesce the dirty regions
            if (y < $this.dirtyRect.y) {
                this.$dirtyRect.h += (this.$dirtyRect.y - y);
                this.$dirtyRect.y = y;
            }
            if (x < this.$dirtyRect.x) {
                this.$dirtyRect.w += (this.$dirtyRect.x - x);
                this.$dirtyRect.x = x;
            }
            if (y1 > (this.$dirtyRect.y + this.$dirtyRect.h)) {
                this.$dirtyRect.h = (y1 - this.$dirtyRect.y);
            }
            if (x1 > (this.$dirtyRect.x + this.$dirtyRect.w)) {
                this.$dirtyRect.w = (x1 - this.$dirtyRect.x);
            }
        }
        /*
        cc.ui.logI("cc.ui.Window", "");
        cc.ui.logI("cc.ui.Window", "Window.repaint, dirty region is now:");
        cc.ui.logI("cc.ui.Window", "x: " + this.$dirtyRect.x +
              ", y: " + this.$dirtyRect.y +
              ", w: " + this.$dirtyRect.w +
              ", h: " + this.$dirtyRect.h);
        cc.ui.logI("cc.ui.Window", "");        
        */
        
        // TODO: Need a call to the system to refresh the window
    },
    
    /**
     * Overrides <a href="./cc.ui.Component.html#a_paint">
     * cc.ui.Component.paint()</a> method to layout Window before
     * initial painting.
     * 
     * @param surface cc.ui.gfx.Surface on which to draw the Window
     * @return Region of the Surface to be blitted to the physical display,
     *         in the form:
     *         <pre>
     *         &#123; x : #, y : #, w : #, h : # &#125;
     *         </pre>
     */    
    paint : function(surface) {
        // Its important that if a window is shown again after its
        // initial layout, we check that the dimensions of the display 
        // haven't changed. If so, we call our notifyResized() method
        // so that layout will be redone.
        this.prepareToShow(surface.width, surface.height);
          
        if (this.$waitForImages && this.$trackedImages.length != 0) {
            // Means we're waiting on some images to load after laying out,
            // so return an empty blit rectangle early
            return { "x" : 0, "y" : 0, "w" : 0, "h" : 0 };
        }
        // If we ever draw the contents of the window once, we stop waiting
        // for any images loading        
        this.$waitForImages = false;
        
        // TODO: Call the base class to render       
        this._super();       


        // This return rect is the blit rect. Not used by cocos but might
        // be useful in some ports
        return { "x" : this.$obounds.x + this.$dR.x, 
                 "y" : this.$obounds.y + this.$dR.y, 
                 "w" : this.$dR.w, 
                 "h" : this.$dR.h };
    },
    
    /**
     * Called to allow this Window to prepare itself to be shown. The Window
     * can perform its layout and start tracking any images that need to be
     * loaded before it can be displayed.
     */
    prepareToShow : function(width, height) {
        // doLayout
        // stretchAndAlign
        // mark the entire Window as a dirty region

        // Possibly also deal with the on-screen virtual keyboard and shifting
        // the view so that the focus component is visible
    },
    
    /**
     * Notifies this Window that it is being shown on the display. 
     * By default, this method&#58;
     * <br /><br />
     * <ul>
     * <li>Updates state</li>
     * <li>Schedules a repaint to update the display</li>
     * <li>Notifies registered Listeners of a <i>windowState</i>event (with the 
     * <i>isShowing</i> detail property set to "true").</li>
     * </ul>
     */
    show : function() {        
        this.repaint();
        this.$showing = true;
        this.$waitForImages = true;
        
        // Perform a default traverse if needed and if it is not a touch device
        if (this.$needsTraverse && !this.$isTouch) {
            if (this.$focusManager.$focusOwner == null ||
                !this.isAncestor(this.$focusManager.$focusOwner)) {
                this.$focusManager.traverseInto(this);
            }
            this.$needsTraverse = false;
        }
        
        // Notify our listeners of the change in window state
        this.notifyListeners("windowState", { "isShowing" : true } );
    },
    
    /**
     * Notifies this Window that it is no longer being shown on the display. 
     * By default, this method&#58;
     * <br /><br />
     * <ul>
     * <li>Updates state</li>
     * <li>Notifies registered Listeners of a <i>windowState</i>event (with the 
     * <i>isShowing</i> detail property set to "false").</li>
     * </ul>
     */
    hide : function() {
        this.$showing = false;

        // TODO: Hide the system virtual keyboard if necessary

        // Notify our listeners of the change in window state
        this.notifyListeners("windowState", { "isShowing" : false } );
    },
    
    /**
     * Determines whether this Window is currently visible on the display.
     * 
     * @return true, if this Window is currently displayed; otherwise, false
     */
    isShowing : function() {
        return this.$showing;
    },

});
