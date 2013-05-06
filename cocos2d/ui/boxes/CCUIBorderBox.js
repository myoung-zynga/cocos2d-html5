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

cc.ui.boxes = cc.ui.boxes || {};

/**
 * The BorderBox allows to layout Components at NORTH, SOUTH, WEST, EAST and
 * CENTER locations. Components added to a BorderBox have to use one 
 * the following five locations defined as constants&#58;
 * NORTH, SOUTH, WEST, EAST, or CENTER.
 */
cc.ui.boxes.BorderBox = cc.ui.Box.extend({
    
    /**
     * Constant to be used when a Component is added at the top (north)
     * of the Container.
     */
    NORTH : 0,

    /**
     * Constant to be used when a Component is added at the bottom (south)
     * of the Container.
     */    
    SOUTH : 1,

    /**
     * Constant to be used when a Component is added on the left (west)
     * of the Container (under the top Component and above bottom Component 
     * if those are present).
     */    
    WEST : 2,

    /**
     * Constant to be used when a Component is added on the right (east)
     * of the Container (under the top Component and above bottom Component 
     * if those are present).
     */ 
    EAST : 3,

    /**
     * Constant to be used when a Component is added to the Container's center.
     */    
    CENTER : 4,
    
    // Cached preferred sizes of the child components
    $northSize : null,
    $southSize : null,
    $westSize : null,
    $eastSize : null,
    $ctrSize : null,

    $prefWidth : 0,
    $prefHeight : 0,

    /**
     * Creates a new  instance of a BorderBox, which arranges components placed
     * at the top, bottom, sides, and center of the Box. 
     */
    ctor : function() {
        this._super();
    },

    /**
     * Overrides <a href="./mobiJAX.ui.Layout.html#a_doLayout">
     * mobiJAX.ui.Layout.doLayout()</a> method to layout Container's children
     * correctly at the locations to which those were added
     * within the given <i>maxWidth</i> and <i>maxHeight</i> limits.
     * 
     * @param maxWidth Maximum width available to the BorderLayout in 
     *                 pixels (not including margin, border, and padding)
     * @param maxHeight Maximum height available to the BorderLayout in 
     *                  pixels (not including margin, border, and padding)
     * @return dimensions required to arrange the content of the Container with 
     *                  this BorderLayout, in 
     *                  the form&#58; 
     *                  <pre>
     *                  &#123 width : #, height: # &#125
     *                  </pre>
     */    
    doLayout : function(maxWidth, maxHeight) {
        try {
            this._super(maxWidth, maxHeight);

            // Remove margins, padding and border from overall size dimensions
            maxWidth -= (this.$margin.l + this.$margin.r + this.$padding.l + this.$padding.r);
            maxHeight -= (this.$margin.t + this.$margin.b + this.$padding.t + this.$padding.b);
            if (this.$border != null) {
                var bw = this.$border.getWidths();
                maxWidth -= (bw.left + bw.right);
                maxHeight -= (bw.top + bw.bottom);
            }

            cc.ui.logI("cc.ui.boxes", "BorderBox.doLayout max size is: " + maxWidth + ", " + maxHeight);
            var children = this._children;        
            
            var NORTH = this.NORTH;
            var SOUTH = this.SOUTH;
            var WEST = this.WEST;
            var EAST = this.EAST;
            var CENTER = this.CENTER;       
    
            var availWidth = maxWidth;
            var availHeight = maxHeight;
        
            // The preferred height of a BorderLayout is the preferred height 
            // of the northern component + the southern component + the 
            // center component
            this.$northSize = null;
            if (children[NORTH]) {
                var prefSize = children[NORTH].getPreferredSize();
                if (prefSize.width == -1) {
                    prefSize.width = availWidth;
                }
                if (prefSize.height == -1) {
                    prefSize.height = availHeight;
                }
                this.$northSize = 
                    children[NORTH].doLayout(prefSize.width, prefSize.height);
            }
            if (this.$northSize) {
                availHeight -= this.$northSize.height;
                if (availHeight < 0) {
                    availHeight = 0;
                }
            }
            this.$southSize = null;
            if (children[SOUTH]) {
                var prefSize = children[SOUTH].getPreferredSize();
                if (prefSize.width == -1) {
                    prefSize.width = availWidth;
                }
                if (prefSize.height == -1) {
                    prefSize.height = availHeight;
                }
                this.$southSize = 
                    children[SOUTH].doLayout(prefSize.width, prefSize.height);
            }
            if (this.$southSize) {
                availHeight -= this.$southSize.height;
                if (availHeight < 0) {
                    availHeight = 0;
                }
            }
            // The preferred width of a BorderLayout is the preferred width of
            // the western component + the eastern component + the center 
            // component
            this.$westSize = null;
            if (children[WEST]) {
                var prefSize = children[WEST].getPreferredSize();
                if (prefSize.width == -1) {
                    prefSize.width = availWidth;
                }
                if (prefSize.height == -1) {
                    prefSize.height = availHeight;
                }
                this.$westSize = 
                    children[WEST].doLayout(prefSize.width, prefSize.height);
            }
            if (this.$westSize) {
                availWidth -= this.$westSize.width;
                if (availWidth < 0) {
                    availWidth = 0;
                }
            }
            this.$eastSize = null;
            if (children[EAST]) {
                var prefSize = children[EAST].getPreferredSize();
                if (prefSize.width == -1) {
                    prefSize.width = availWidth;
                }
                if (prefSize.height == -1) {
                    prefSize.height = availHeight;
                }
                this.$eastSize = 
                    children[EAST].doLayout(prefSize.width, prefSize.height);
            }
            if (this.$eastSize) {
                availWidth -= this.$eastSize.width;
                if (availWidth < 0) {
                    availWidth = 0;
                }
            }
            
            this.ctrSize = null;
            if (children[CENTER]) {
                var prefSize = children[CENTER].getPreferredSize();
                if (prefSize.width == -1) {
                    prefSize.width = availWidth;
                }
                if (prefSize.height == -1) {
                    prefSize.height = availHeight;
                }
                this.$ctrSize = 
                    children[CENTER].doLayout(prefSize.width, prefSize.height);
            }
            
            this.prefWidth = 0;
            if (this.$ctrSize) {
                this.prefWidth = this.$ctrSize.width;
            }
            if (this.$eastSize) {
                this.prefWidth += this.$eastSize.width;
            }
            if (this.$westSize) {
                this.prefWidth += this.$westSize.width;
            }
            // After we add up the widths of the center components (west, 
            // center, east), we check to see if the widths of the north/south
            // components are greater.
            if (this.$northSize) {
                this.prefWidth = Math.max(this.prefWidth, this.$northSize.width);
            }
            if (this.$southSize) {
                this.prefWidth = Math.max(this.prefWidth, this.$southSize.width);
            }
            
            this.prefHeight = 0;
            if (this.$ctrSize) {
                this.prefHeight = this.$ctrSize.height;
            }
            if (this.$westSize) {
                this.prefHeight = Math.max(this.prefHeight, this.$westSize.height);
            }
            if (this.$eastSize) {
                this.prefHeight = Math.max(this.prefHeight, this.$eastSize.height);
            }
            if (this.$northSize) {
                this.prefHeight += this.$northSize.height;
            }
            if (this.$southSize) {
                this.prefHeight += this.$southSize.height;
            }
            return { "width" : this.prefWidth, "height" : this.prefHeight };
            
        } catch (err) {
            cc.ui.logE("cc.ui.boxes", 
                       "BorderBox.doLayout error: " + err);
        }
        return { "width" : 0, "height" : 0 };
    },

    /**
     * Overrides <a href="./mobiJAX.ui.Layout.html#a_stretchAndAlign">
     * mobiJAX.ui.Layout.stretchAndAlign()</a> method to stretch
     * the corresponding Container's content to the given <i>width</i> and <i>height</i> 
     * (not including Container's margin, border, and padding), 
     * aligning its child components 
     * within this context based on their individual alignment properties.
     * 
     * @param width Granted width (not including margin, border, and padding) 
     *        of this BorderLayout's Container (in which 
     *        this BorderLayout may stretch and align its child components)
     * @param height Granted height (not including margin, border, and padding)
     *        of this BorderLayout's Container (in 
     *        which this BorderLayout may stretch and align its child 
     *        components)
     */
    stretchAndAlign : function(width, height) {
        try {

            cc.ui.logI("cc.ui.boxes", "VBox.sAnda, old size: " + this._contentSize.width + ", " + this._contentSize.height);
            cc.ui.logI("cc.ui.boxes", "VBox.sAnda, new size: " + width + ", " + height);

            // Do any default re-sizing
            this._super(width, height);

            // Remove margins, padding and border from overall size dimensions
            width -= (this.$margin.l + this.$margin.r + this.$padding.l + this.$padding.r);
            height -= (this.$margin.t + this.$margin.b + this.$padding.t + this.$padding.b);
            if (this.$border != null) {
                var bw = this.$border.getWidths();
                width -= (bw.left + bw.right);
                height -= (bw.top + bw.bottom);
            }

            var children = this._children;     
            if (!children || children.length == 0) {
                return;
            }
    
            var NORTH = this.NORTH;
            var SOUTH = this.SOUTH;
            var WEST = this.WEST;
            var EAST = this.EAST;
            var CENTER = this.CENTER;
                
            // For keeping track of the available width, height and
            // x/y offsets for alignment
            var availHeight = height;
            var availWidth = width;
            var leftLocation = this.$ibounds.x;
            var botLocation = this.$ibounds.y;
            var topLocation = botLocation + this.$ibounds.h;

            var xOffset = 0;
            var yOffset = 0;
            
            // First we fit the North component
            if (this.$northSize) {
    
                if (this.$northSize.width > availWidth) {
                    this.$northSize.width = availWidth;
                }
                if (this.$northSize.height > availHeight) {
                    this.$northSize.height = availHeight;
                }
                
                // If the Component stretches, we stretch it to be the 
                // available width
                if (children[NORTH].shouldStretch() && 
                        this.$northSize.width < availWidth) 
                {
                    this.$northSize.width = availWidth;
                }
                
                children[NORTH].stretchAndAlign(this.$northSize.width,
                                                this.$northSize.height);
                                                                       
                if (this.$northSize.width < availWidth) {
                    // We align the north component horizontally
                    switch (children[NORTH].getHorizAlign()) {
                        case cc.ui.Constants.ALGN_LEFT:
                            xOffset = 0;
                            break;
                        case cc.ui.Constants.ALGN_CENTER:
                            if (availWidth > this.$northSize.width) {
                                xOffset = Math.floor(
                                    (availWidth - this.$northSize.width) / 2);
                            } else {
                                xOffset = 0;
                            }
                            break;
                        case cc.ui.Constants.ALGN_RIGHT:
                            if (availWidth > this.$northSize.width) {
                                xOffset = availWidth - this.$northSize.width;
                            } else {
                                xOffset = 0;
                            }
                            break;
                    }                           
                }                           
                
                // We locate the North component            
                children[NORTH].setPosition(leftLocation + xOffset, 
                                            topLocation - this.$northSize.height);
                // Update the available height left
                availHeight -= this.$northSize.height;
                // Update the top location
                topLocation -= this.$northSize.height;
            }
            
            // Reset the xOffset
            xOffset = 0;
            
            // Next we fit the South Component
            if (this.$southSize) {
    
                if (this.$southSize.width > availWidth) {
                    this.$southSize.width = availWidth;
                }
                if (this.$southSize.height > availHeight) {
                    this.$southSize.height = availHeight;
                }
                
                // If the Component stretches, we stretch it to be the 
                // available width
                if (children[SOUTH].shouldStretch() && 
                        this.$southSize.width < availWidth) 
                {
                    this.$southSize.width = availWidth;
                }
                
                children[SOUTH].stretchAndAlign(this.$southSize.width,
                                                this.$southSize.height);
                                            
                if (this.$southSize.width < availWidth) {
                    // We'll align the south component horizontally if possible
                    switch (children[SOUTH].getHorizAlign()) {
                        case cc.ui.Constants.ALGN_LEFT:
                            xOffset = 0;
                            break;
                        case cc.ui.Constants.ALGN_CENTER:
                            if (availWidth > this.$southSize.width) {
                                xOffset = Math.floor(
                                    (availWidth - this.$southSize.width) / 2);
                            } else {
                                xOffset = 0;
                            }
                            break;
                        case cc.ui.Constants.ALGN_RIGHT:
                            if (availWidth > this.$southSize.width) {
                                xOffset = availWidth - this.$southSize.width;
                            } else {
                                xOffset = 0;
                            }
                            break;
                    }                            
                }
                // We locate the South component            
                children[SOUTH].setPosition(leftLocation + xOffset,
                                            botLocation);

                // Update the available height left
                availHeight -= this.$southSize.height;
                // Update the bottom location
                botLocation += this.$southSize.height;
            }
            
            // Reset the xOffset
            xOffset = 0;
            
            // Next we fit the West component
            if (this.$westSize) {
                
                if (this.$westSize.width > availWidth) {
                    this.$westSize.width = availWidth;
                }
                if (this.$westSize.height > availHeight) {
                    this.$westSize.height = availHeight;
                }
                
                if (children[WEST].shouldStretch() && 
                        this.$westSize.height < availHeight)
                {
                    this.$westSize.height = availHeight;
                }
                    
                children[WEST].stretchAndAlign(this.$westSize.width,
                                               this.$westSize.height);
    
                if (this.$westSize.height < availHeight) {                                            
                    // We'll align the west component vertically if possible
                    switch (children[WEST].getVertAlign()) {
                        case cc.ui.Constants.ALGN_TOP:
                            yOffset = 0;
                            break;
                        case cc.ui.Constants.ALGN_MIDDLE:
                            if (availHeight > this.$westSize.height) {
                                yOffset = Math.floor(
                                    (availHeight - this.$westSize.height) / 2);
                            } else {
                                yOffset = 0;
                            }
                            break;
                        case cc.ui.Constants.ALGN_BOTTOM:
                            if (availHeight > this.$westSize.height) {
                                yOffset = availHeight - this.$westSize.height;
                            } else {
                                yOffset = 0;
                            }
                            break;
                    }                            
                }
                // We locate the West component            
                children[WEST].setPosition(this.$ibounds.x, 
                                           topLocation - this.$westSize.height - yOffset);
                
                cc.ui.logI("cc.ui.boxes",
                           "BorderBox, placing WEST: " + this.$ibounds.x + ", " + (topLocation - this.$westSize.height - yOffset) + ":" + topLocation +":" + this.$westSize.height + ":" + yOffset);
                // Update the available width left            
                availWidth -= this.$westSize.width;
                // Update the left location
                leftLocation += this.$westSize.width;
            }            
            
            // Reset the yOffset
            yOffset = 0;
    
            // Next we fit the East component
            if (this.$eastSize) {
                
                if (this.$eastSize.width > availWidth) {
                    this.$eastSize.width = availWidth;
                }
                if (this.$eastSize.height > availHeight) {
                    this.$eastSize.height = availHeight;
                }
                
                if (children[EAST].shouldStretch() &&
                        this.$eastSize.height < availHeight) 
                {
                    // We stretch the Container to be the available height
                    this.$eastSize.height = availHeight;    
                }
                    
                children[EAST].stretchAndAlign(this.$eastSize.width,
                                               this.$eastSize.height);
                                          
                if (this.$eastSize.height < availHeight) {  
                    // We'll align the east component vertically if possible
                    switch (children[EAST].getVertAlign()) {
                        case cc.ui.Constants.ALGN_TOP:
                            yOffset = 0;
                            break;
                        case cc.ui.Constants.ALGN_MIDDLE:
                            if (availHeight > this.$eastSize.height) {
                                yOffset = Math.floor(
                                    (availHeight - this.$eastSize.height) / 2);
                            } else {
                                yOffset = 0;
                            }
                            break;
                        case cc.ui.Constants.ALGN_BOTTOM:
                            if (availHeight > this.$eastSize.height) {
                                yOffset = availHeight - this.$eastSize.height;
                            } else {
                                yOffset = 0;
                            }
                            break;
                    }                            
                }
                // We locate the East component            
                children[EAST].setPosition(
                    this.$ibounds.x + this.$ibounds.w - this.$eastSize.width, 
                    topLocation - this.$eastSize.height - yOffset);
                    
                // Update the available width left            
                availWidth -= this.$eastSize.width;
            }
            
            // Reset the yOffset
            yOffset = 0;
    
            // Finally we fit the Center component        
            if (this.$ctrSize) {
    
                if (this.$ctrSize.width > availWidth) {
                    this.$ctrSize.width = availWidth;
                }
                if (this.$ctrSize.height > availHeight) {
                    this.$ctrSize.height = availHeight;
                }
                
                if (children[CENTER].shouldStretch()) {
                    // We stretch the Container to be the available 
                    // width and height
                    this.$ctrSize.width = availWidth;
                    this.$ctrSize.height = availHeight;    
                }
                children[CENTER].stretchAndAlign(this.$ctrSize.width,
                                                 this.$ctrSize.height);                
                
                if (this.$ctrSize.width < availWidth) {
                    // We'll align the center component horizontally if possible
                    switch (children[CENTER].getHorizAlign()) {
                        case cc.ui.Constants.ALGN_LEFT:
                            xOffset = 0;
                            break;
                        case cc.ui.Constants.ALGN_CENTER:
                            if (availWidth > this.$ctrSize.width) {
                                xOffset = Math.floor(
                                    (availWidth - this.$ctrSize.width) / 2);
                            } else {
                                xOffset = 0;
                            }
                            break;
                        case cc.ui.Constants.ALGN_RIGHT:
                            if (availWidth > this.$ctrSize.width) {
                                xOffset = availWidth - this.$ctrSize.width;
                            } else {
                                xOffset = 0;
                            }
                            break;
                    }
                }
                if (this.$ctrSize.height < availHeight) {
                    // We'll align the center component vertically if possible
                    switch (children[CENTER].getVertAlign()) {
                        case cc.ui.Constants.ALGN_TOP:
                            yOffset = 0;
                            break;
                        case cc.ui.Constants.ALGN_MIDDLE:
                            if (availHeight > this.$ctrSize.height) {
                                yOffset = Math.floor(
                                    (availHeight - this.$ctrSize.height) / 2);
                            } else {
                                yOffset = 0;
                            }
                            break;
                        case cc.ui.Constants.ALGN_BOTTOM:
                            if (availHeight > this.$ctrSize.height) {
                                yOffset = availHeight - this.$ctrSize.height;
                            } else {
                                yOffset = 0;
                            }
                            break;
                    }                            
                }
                // We locate the Center component            
                children[CENTER].setPosition(leftLocation + xOffset, 
                                             topLocation - this.$ctrSize.height - yOffset);
            }
        } catch (err) {
            cc.ui.logE("cc.ui.boxes",                
                       "BorderBox.stretchAndAlign error: " + err);
        }
    },

    
    /**
     * Overrides <a href="./mobiJAX.ui.Layout.html#a_getNetComponent">
     * mobiJAX.ui.Layout.getNextComponent()</a> method to
     * return the next focusable component (if any) for that traversal
     * starts from 
     * a given <i>component</i>, at a given direction of traversal <i>cir</i>.
     * <br /><br /> 
     * If Component is null, the TraversalPolicy should assume an initial 
     * traversal into Container in the given direction.</li>
     * If no next focusable Component in the given direction, this method 
     * returns null.
     * 
     * @param component Component from which traversal originates; null, if no 
     *                  such Component 
     * @param dir Traversal direction, defined in mobiJAX.ui.Constants&#58;
     *            TRVS_UP, TRVS_DOWN, TRVS_LEFT, or TRVS_RIGHT
     */
    getNextComponent : function(component, dir) {
        // If the default traversal has been overridden, return that
        var newOwner = this.$base(component, dir);
        if (newOwner != null) {
            return newOwner;
        }

        var inLayout = 
            (component != null && this.container.isAncestor(component));
        var children = this.container.children;
 
        var NORTH = mobiJAX.ui.layouts.BorderLayout.NORTH;
        var SOUTH = mobiJAX.ui.layouts.BorderLayout.SOUTH;
        var WEST = mobiJAX.ui.layouts.BorderLayout.WEST;
        var EAST = mobiJAX.ui.layouts.BorderLayout.EAST;
        var CENTER = mobiJAX.ui.layouts.BorderLayout.CENTER;
        
        // Traversal amongst the children of a BorderLayout is basically
        // a contest between each of the 5 children. We'll look for candidates
        // from each of the children, then pick the best one
        var candidates = new Array(5);
        var locations = new Array(5);
        
        var inNorth = false;
        var inEast = false;
        var inCenter = false;
        var inWest = false;
        var inSouth = false;
        
        if (inLayout) {
            // Ugly code here, but we need to check to see if there is a
            // component in the location, if that component is the currently
            // focused component, or if that component is a container and
            // is the ancestor of the currently focused component
            if (children[NORTH] != null) {
                inNorth = (children[NORTH] === component || children[NORTH].isAncestor(component));
            }
            if (children[EAST] != null) {
                inEast = (children[EAST] === component || children[EAST].isAncestor(component));
            }
            if (children[CENTER] != null) {
                inCenter = (children[CENTER] === component || children[CENTER].isAncestor(component));
            }
            if (children[WEST] != null) {
                inWest = (children[WEST] === component || children[WEST].isAncestor(component));
            }
            if (children[SOUTH] != null) {
                inSouth = (children[SOUTH] === component || children[SOUTH].isAncestor(component));
            }
        }
                    
        if (!inNorth && children[NORTH] && children[NORTH].isVisible()) {
            if (children[NORTH].isFocusable()) {
                candidates[NORTH] = children[NORTH];
            } else if ($class.instanceOf(children[NORTH], mobiJAX.ui.Container)) {
                var tP = children[NORTH].getTraversalPolicy();
                candidates[NORTH] = tP.getNextComponent(component, dir);
            }
        }    
        if (!inEast && children[EAST] && children[EAST].isVisible()) {
            if (children[EAST].isFocusable()) {
                candidates[EAST] = children[EAST];
            } else if ($class.instanceOf(children[EAST], mobiJAX.ui.Container)) {                        
                var tP = children[EAST].getTraversalPolicy();
                candidates[EAST] = tP.getNextComponent(component, dir);
            }
        }
        if (!inCenter && children[CENTER] && children[CENTER].isVisible()) {
            if (children[CENTER].isFocusable()) {
                candidates[CENTER] = children[CENTER];
            } else if ($class.instanceOf(children[CENTER], mobiJAX.ui.Container)) {
                var tP = children[CENTER].getTraversalPolicy();
                candidates[CENTER] = tP.getNextComponent(component, dir);
            }
        }
        if (!inWest && children[WEST] && children[WEST].isVisible()) {
            if (children[WEST].isFocusable()) {
                candidates[WEST] = children[WEST];
            } else if ($class.instanceOf(children[WEST], mobiJAX.ui.Container)) {
                var tP = children[WEST].getTraversalPolicy();
                candidates[WEST] = tP.getNextComponent(component, dir);
            }
        }
        if (!inSouth && children[SOUTH] && children[SOUTH].isVisible()) {
            if (children[SOUTH].isFocusable()) {
                candidates[SOUTH] = children[SOUTH];
            } else if ($class.instanceOf(children[SOUTH], mobiJAX.ui.Container)) {
                var tP = children[SOUTH].getTraversalPolicy();
                candidates[SOUTH] = tP.getNextComponent(component, dir);
            }
        }
        
        if (inLayout) {
                    
            var hotZone = -1;
            if (inNorth) {
                hotZone = NORTH;
            } else if (inEast) {
                hotZone = EAST;
            } else if (inCenter) {
                hotZone = CENTER;
            } else if (inWest) {
                hotZone = WEST;
            } else if (inSouth) {
                hotZone = SOUTH;
            }
            
            var order = null;
            switch (dir) {
                case mobiJAX.ui.Constants.TRVS_UP:
                    switch (hotZone) {
                        case NORTH:
                            if (this.wrapTraverse[dir]) {
                                order = [SOUTH, CENTER, WEST, EAST];
                            } else {
                                order = [];
                            }
                            break;
                        case EAST:
                        case CENTER:
                        case WEST:
                            if (this.wrapTraverse[dir]) {
                                order = [NORTH, SOUTH];
                            } else {
                                order = [NORTH];
                            }
                            break;
                        case SOUTH:
                               order = [CENTER, WEST, EAST, NORTH];
                               break;
                     }
                    break;
                case mobiJAX.ui.Constants.TRVS_DOWN:
                    switch (hotZone) {
                        case NORTH:
                            order = [CENTER, WEST, EAST, SOUTH];
                            break;
                        case EAST:
                        case CENTER:
                        case WEST:
                            if (this.wrapTraverse[dir]) {
                                order = [SOUTH, NORTH];
                            } else {
                                order = [SOUTH];
                            }
                            break;
                        case SOUTH:
                            if (this.wrapTraverse[dir]) {
                                order = [NORTH, CENTER, WEST, EAST];
                            } else {
                                order = [];
                            }
                            break;
                    }
                    break;
                case mobiJAX.ui.Constants.TRVS_RIGHT:
                    switch (hotZone) {
                        case NORTH:
                            order = [];
                            break;
                        case EAST:
                            if (this.wrapTraverse[dir]) {
                                order = [WEST, CENTER];
                            } else {
                                order = [];
                            }
                            break;
                        case CENTER:
                            if (this.wrapTraverse[dir]) {
                                order = [EAST, WEST];
                            } else {
                                order = [EAST];
                            }
                            break;
                        case WEST:
                            order = [CENTER, EAST];
                            break;
                        case SOUTH:
                            order = [];
                            break;
                    }
                    break;
                case mobiJAX.ui.Constants.TRVS_FWD:
                    switch (hotZone) {
                        case NORTH:
                            order = [WEST, CENTER, EAST, SOUTH];
                            break;
                        case EAST:
                            if (this.wrapTraverse[dir]) {
                                order = [SOUTH, NORTH, WEST, CENTER];
                            } else {
                                order = [SOUTH];
                            }
                            break;
                        case CENTER:
                            if (this.wrapTraverse[dir]) {
                                order = [EAST, SOUTH, NORTH, WEST];
                            } else {
                                order = [EAST, SOUTH];
                            }
                            break;
                        case WEST:
                            if (this.wrapTraverse[dir]) {
                                order = [CENTER, EAST, SOUTH, NORTH];
                            } else {
                                order = [CENTER, EAST, SOUTH];
                            }
                            break;
                        case SOUTH:
                            if (this.wrapTraverse[dir]) {
                                order = [NORTH, WEST, CENTER, EAST];
                            } else {
                                order = [];
                            }
                            break;
                    }
                    break;
                case mobiJAX.ui.Constants.TRVS_LEFT:
                    switch (hotZone) {
                        case NORTH:
                            order = [];
                            break;
                        case EAST:
                            order = [CENTER, WEST];
                            break;
                        case CENTER:
                            if (this.wrapTraverse[dir]) {
                                order = [WEST, EAST];
                            } else {
                                order = [WEST];
                            }
                            break;
                        case WEST:
                            if (this.wrapTraverse[dir]) {
                                order = [EAST, CENTER];
                            } else {
                                order = [];
                            }
                            break;
                        case SOUTH:
                            order = [];
                            break;
                    }
                    break;
                case mobiJAX.ui.Constants.TRVS_BKWD:
                    switch (hotZone) {
                        case NORTH:
                            if (this.wrapTraverse[dir]) {
                                order = [SOUTH, EAST, CENTER, WEST];
                            } else {
                                order = [];
                            }
                            break;
                        case EAST:
                            if (this.wrapTraverse[dir]) {
                                order = [CENTER, WEST, NORTH, SOUTH];
                            } else {
                                order = [CENTER, WEST, NORTH];
                            }
                            break;
                        case CENTER:
                            if (this.wrapTraverse[dir]) {
                                order = [WEST, NORTH, SOUTH, EAST];
                            } else {
                                order = [WEST, NORTH];
                            }
                            break;
                        case WEST:
                            if (this.wrapTraverse[dir]) {
                                order = [NORTH, SOUTH, EAST, CENTER];
                            } else {
                                order = [NORTH];
                            }
                            break;
                        case SOUTH:
                            order = [EAST, CENTER, WEST, NORTH];
                            break;
                    }
                    break;
            }
            
            for (var i = 0; i < order.length; i++) {
                if (candidates[order[i]]) {
                    newOwner = candidates[order[i]];
                    break;
                }
            }
            
        } else {
            if (component == null) {
                // If there is no reference component, we'll decide which
                // candidate by order based on traversal direction
                var order = null;
                switch (dir) {
                    case mobiJAX.ui.Constants.TRVS_UP:
                    case mobiJAX.ui.Constants.TRVS_BKWD:
                        order = [SOUTH, CENTER, WEST, EAST, NORTH];
                        break;
                    case mobiJAX.ui.Constants.TRVS_DOWN:
                    case mobiJAX.ui.Constants.TRVS_FWD:
                        order = [NORTH, CENTER, WEST, EAST, SOUTH];
                        break;
                    case mobiJAX.ui.Constants.TRVS_RIGHT:
                        order = [WEST, CENTER, NORTH, SOUTH, EAST];
                        break;
                    case mobiJAX.ui.Constants.TRVS_LEFT:
                        order = [EAST, CENTER, NORTH, SOUTH, WEST];
                        break;
                }
                
                for (var i = 0; i < order.length; i++) {
                    if (candidates[order[i]]) {
                        newOwner = candidates[order[i]];
                        break;
                    }
                }
                
            } else {
                // If there is a reference component, we'll decide which
                // candidate by distance
                    
                // Get all the locations
                var distance = null;
                var p1 = component.getLocationOnScreen();
                var p2 = null;
                var d = null;
                var index = -1;
                
                for (var i = 0; i < candidates.length; i++) {
                    if (candidates[i]) {
                        p2 = candidates[i].getLocationOnScreen();
                        d = mobiJAX.ui.Utilities.distance(p1.x, p1.y, p2.x, p2.y);
                        if (d < distance || distance == null) {
                            distance = d;
                            index = i;
                        }        
                    }
                }
                if (index >= 0) {
                    newOwner = candidates[index];
                }
            }                        
        }   
        return newOwner;
    },

});

