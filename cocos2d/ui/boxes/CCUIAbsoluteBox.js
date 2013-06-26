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
 * The AbsoluteBox provides for absolutely positioned and sized Components,
 * yet still provides the same Box framework supporting traversal, input,
 * density scaling, etc. When using an AbsoluteBox, applications must manually
 * set the preferred size and location of each Component added to the Box.
 * AbsoluteBox will call the doLayout() and stretchAndAlign() methods on each
 * Component as part of the standard layout process, but will not alter the
 * set preferred size and position of each Component.
 */
cc.ui.boxes.AbsoluteBox = cc.ui.Box.extend({

    /**
     * Creates an empty AbsoluteLayout.
     */    
    ctor : function () {
        this._super();
    },
    
    /**
     * Overrides <a href="./cc.ui.Box.html#a_doLayout">
     * cc.ui.Box.doLayout()</a> method to layout AbsoluteBox's components
     * within the given <i>maxWidth</i> and <i>maxHeight</i> limits.
     * <br><br>
     * AbsoluteBox assumes its components have all had their preferred sizes
     * positions manually set, but it still will walk through the layout
     * algorithm and call doLayout and stretchAndAlign on those components
     * (using their preferred sizes as dimensions).
     * 
     * @param maxWidth Maximum width available to the AbsoluteBox in 
     *                 pixels 
     * @param maxHeight Maximum height available to the AbsoluteBox in 
     *                  pixels 
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

            cc.ui.logI("cc.ui.boxes", "AbsoluteBox.doLayout max size is: " + maxWidth + ", " + maxHeight);
            var children = this._children;        
        
            for (var i = 0; i < children.length; i++) {
                if (!children[i] || !cc.ui.instanceOf(children[i], cc.ui.Component)) {
                    continue;
                }

                prefSize = children[i].getPreferredSize();

                // The child should have a preferred size set and if it does
                // we use it, otherwise we use the max size and it should 
                // return it's desired size
                if (prefSize.width == -1) {
                    prefSize.width = maxWidth;
                }
                if (prefSize.height == -1) {
                    prefSize.height = totalHeight;
                }
                

                children[i].doLayout(prefSize.width, prefSize.height);

                // We skip any placement of the child and rely that setPosition
                // has already been called
            }

            // We return that we want to be whatever dimensions were passed
            // in. Presumably, this absolute box has already had its own
            // preferred size set, or is stretchable and will do the right
            // thing based on how the developer is using it

            // NOTE: No need for 'else' statements here because the contentSize
            // is set to equal the prefSize (when it is not -1) by the base
            // class (Component) doLayout method.
            if (this.$prefSize.w == -1) {
                this.$ibounds.w = maxWidth;            
                this._contentSize.width += maxWidth;
            }
            if (this.$prefSize.h == -1) {
                this.$ibounds.h = maxHeight;
                this._contentSize.height += maxHeight;        
            }

            return { "width" : this._contentSize.width, "height" : this._contentSize.height };
            
        } catch (err) {
            cc.ui.logE("cc.ui.boxes",
                       "AbsoluteBox.doLayout error: " + err);
        }
        return { "width" : 0, "height" : 0 };
    },

    /**
     * Overrides <a href="./cc.ui.Box.html#a_stretchAndAlign">
     * cc.ui.Box.stretchAndAlign()</a> method to stretch content of 
     * the Box to the given <i>width</i> and <i>height</i>. Normally, a Box
     * will also align its children in this step, but AbsoluteLayout assumes
     * the children have already been positioned correctly.
     * 
     * @param width the width granted to this AbsoluteBox
     * @param height the height granted to this AbsoluteBox
     */
    stretchAndAlign : function(width, height) {
        try {

            cc.ui.logI("cc.ui.boxes", "AbsoluteBox.sAnda, old size: " + this._contentSize.width + ", " + this._contentSize.height);
            cc.ui.logI("cc.ui.boxes", "AbsoluteBox.sAnda, new size: " + width + ", " + height);

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
            if (!children) {
                return;
            }

            var size = null;
            for (var i = 0; i < children.length; i++) {
                if (!children[i] || !cc.ui.instanceOf(children[i], cc.ui.Component)) {
                    continue;
                }

                
                size = children[i].getContentSize();
                children[i].stretchAndAlign(size.width, size.height);

                
            }
        } catch (err) {
            cc.ui.logE("cc.ui.boxes", 
                       "AbsoluteBox.stretchAndAlign error: " + err);
        }
    },

    /**
     * Overrides <a href="./cc.ui.Box.html#a_getNextComponent">
     * cc.ui.Box.getNextComponent()</a> method to get the next focusable 
     * component (if any) for that traversal starting from 
     * a given <i>component</i>, at a given direction of traversal <i>dir</i>.
     * If Component is null, assume an initial traversal into the Box in the
     * given direction.</li> If no next focusable Component in the given 
     * direction, this method returns null.
     * <br><br>
     * This  gets the next focusable component within the current Box.
     * 
     * @param component Component from which traversal originates; null, if no 
     *                  such Component 
     * @param dir Traversal direction, defined in cc.ui.Constants&#58;
     *            TRVS_UP, TRVS_DOWN, TRVS_LEFT, or TRVS_RIGHT
     */
    getNextComponent : function(component, dir) {
        var newOwner = null;
        try {
            // If the default traversal has been overridden, return that
            newOwner = this.$base(component, dir);
            if (newOwner != null) {
                return newOwner;
            }
            
            // By default AbsoluteBox supports basic traversal among its
            // immediate children.
            // There are two main cases - the 'component' is null and there is
            // no focused component in this AbsoluteBox yet, or the 'component'
            // is non-null and we have to find which one of the Box's 
            // immediate children is the ancestor of that component. From there
            // in either case we select the next child in the appropriate
            // direction.

            var children = this.container.children;
            if (children == null || children.length == 0) {
                return null;
            }
            
            var index = -1;
            if (component != null) {
                // Find the immediate child in the container which is the
                // ancestor of the focused component
                for (var i = 0; i < children.length; i++) {
                    if (!children[i] || !cc.ui.instanceOf(children[i], cc.ui.Component)) {
                        continue;
                    }
                    if (children[i] === component || children[i].isAncestor(component)) {
                        index = i;
                        break;
                    }                
                }
            }

            if (dir == mobiJAX.ui.Constants.TRVS_FWD ||
                dir == mobiJAX.ui.Constants.TRVS_DOWN ||
                dir == mobiJAX.ui.Constants.TRVS_RIGHT) 
            {
                // Return the 1st focusable child of the container
                for (var i = 0; i < children.length; i++) {
                    if (!children[i] || !cc.ui.instanceOf(children[i], cc.ui.Component)) {
                        continue;
                    }
                    if (i > index && children[i].isVisible()) {
                        if (children[i].isFocusable()) {
                            return children[i];
                        } else if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                            var newOwner = 
                                children[i].getNextComponent(null, cc.ui.Constants.TRVS_FWD);
                            if (newOwner != null) {
                                return newOwner;
                            }
                        }
                    }
                }
            } else {
                // Return the last focusable child of the container
                if (index == -1) {
                    index = children.length;
                }
                for (var i = children.length - 1; i >= 0; i--) {
                    if (!children[i] || !cc.ui.instanceOf(children[i], cc.ui.Component)) {
                        continue;
                    }
                    if (i < index && children[i].isVisible()) {
                        if (children[i].isFocusable()) {                        
                            return children[i];
                        } else if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                            var newOwner = 
                                children[i].getNextComponent(null, cc.ui.Constants.TRVS_FWD);
                            if (newOwner != null) {
                                return newOwner;
                            }
                        }
                    }
                }
            }
           
        } catch (err) {
            cc.ui.logE("cc.ui.boxes",
                       "AbsoluteLayout.getNextComponent error: " + err);
        }
        return newOwner;
    },
    
    /**
     * Overrides <a href="./cc.ui.Box.html#a_getComponentAt">
     * mobiJAX.ui.Layout.getComponentAt()</a> method to
     * return the 
     * Component of this CardLayout that contains the given point (as the 
     * coordinates <i>x</i> and <i>y</i>). This method only finds the first 
     * child of this Layout that contains the point (not the deepest); null, 
     * if no child of this CardLayout contains the point. 
     * <br /><br />
     * The point should be in the coordinate space of this CardBox
     * and be contained within it.
     * 
     * @param x X-coordinate of the target point
     * @param y Y-coordinate of the target point
     * @return Child of this CardLayout that contains the point; null,
     *         if no child contains the point
     */
    getComponentAt : function(x, y) {
        var children = this._children;
        if (children && 
            children.length > 0 && 
                this.$activeIndex < children.length) 
        {
            var child = children[this.$activeIndex];
            var pos = child.getPosition();
            if (cc.ui.instanceOf(child, cc.ui.Box)) {
                return child.getComponentAt(x, y);
            } else if (child.containsPoint(x - pos.x, 
                                           y - pos.y)) {
                return child;
            }
        }
        return (this.containsPoint(x, y)) ? this : null;
    },
    
    /**
     * Overrides <a href="./mobiJAX.ui.Layout.html#a_findComponentAt">
     * mobiJAX.ui.Layout.findComponentAt()</a> method to
     * find the 
     * deepest level Component of this CardLayout that contains the
     * given point (as the coordinates <i>X</i> and <i>Y</i>). This method 
     * recursively descends the children of this CardLayout to find the 
     * deepest-level Component (leaf) containing the given point.
     * 
     * @param x X-coordinate of the target point
     * @param y Y-coordinate of the target point
     * @return Child of this CardLayout that contains the point; null,
     *         if no child contains the point
     */
    findComponentAt : function(x, y) {
        var children = this._children;
        if (children && 
            children.length > 0 &&
                this.$activeIndex < children.length) 
        {
            var child = children[this.$activeIndex];
            var pos = child.getPosition();
            if (child.containsPoint(x - pos.x, y - pos.y)) {
                if (cc.ui.instanceOf(child, cc.ui.Box)) {
                    return child.findComponentAt(x - pos.x,
                                                 y - pos.y);
                } else {
                    return child;
                }
            }
        }
        
        return (this.containsPoint(x, y)) ? this : null;   
    },
    
    
});
