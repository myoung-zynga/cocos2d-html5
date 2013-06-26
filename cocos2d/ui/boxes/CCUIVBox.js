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
 * The VBox class is a vertically-oriented layout manager. It arranges
 * a container's child components vertically, stretching those that can to
 * be as wide as the container and aligning vertically based on each
 * component's alignment directives, such as ALGN_TOP, ALGN_MIDDLE, and
 * ALGN_BOTTOM.
 * <br /><br />
 * Its methods provide the following functionality&#58;
 * <ul>
 * <li><i>To create a new instance of the VBox class</i>, use 
 * <a href="#VBox">VBox()</a>.</li>
 * <li><i>To return the dimensions of the bounding box that fits the child 
 * components of this VBox,</i> call <a href="#doLayout">doLayout()
 * </a>.</li>
 * <li><i>To set the final dimensions of this Component,</i> use 
 * <a href="#stretchAndAlign">stretchAndAlign()</a>.</li>
 * <li><i>To draw the contents of this Component to a given context,
 * </i> use <a href="#drawContent">drawContent()</a>.</li>
 * <li><i>To return the next Component for a particular traversal,</i> use 
 * <a href="#getNextComponent">getNextComponent()</a>.</li>
 * </ul>
 */
cc.ui.boxes.VBox = cc.ui.Box.extend({
    
    /**
     * The <a name="VBox">VBox()</a> method creates a new instance of the 
     * VBox (vertical layout) class, which contains components placed one 
     * after another vertically down the container.
     */
    ctor : function() {
        this._super();
    },

    /**
     * The <a name="doLayout">doLayout()</a> method returns the total Width 
     * and Height required by the child components of this Container, 
     * at their preferred size (given current properties), with the given 
     * <i>MaxWidth</i> and <i>MaxHeight</i> (from the Container's 
     * parent and the layout policy) as limits. 
     * <br /><br />
     * <b>NOTES&#58;</b>
     * <ul>
     * <li>If a preferred size has been set for the VBox, those dimensions 
     * will be passed in as MaxWidth and MaxHeight.</li>
     * <li>This method combines two essential steps in the layout subsystem,
     * returning the desired size of the Component and setting the size of the 
     * children. The layout subsystem expects every Component to assume its 
     * desired size immediately in <i>doLayout().</i></li>
     * <li>This Component's <i>stretchAndAlign()</i> method will be called 
     * subsequently to inform the Component of the final awarded size.</li>
     * </ul>
     * 
     * @param maxWidth Maximum width available to the Component (in 
     *                 pixels)
     * @param maxHeight Maximum height available to the Component (in 
     *                  pixels)
     * @return New size of this Component as the 
     *         object 
     *         <pre>
     *         &#123; width &#58; #, height&#58; # &#125;
     *         </pre>
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

            cc.ui.logI("cc.ui.boxes", "VBox.doLayout max size is: " + maxWidth + ", " + maxHeight);
            var children = this.getChildren();
            
            var totalWidth = 0;
            var totalHeight = 0;
            
            var childSize = null;
            var prefSize = null;
            
            var tag = null;

            cc.ui.logI("cc.ui", "child length is: " + children.length);
            for (var i = 0; i < children.length; i++) {
                if (!children[i] || !cc.ui.instanceOf(children[i], cc.ui.Component)) {
                    continue;
                }
                prefSize = children[i].getPreferredSize();
                
                // If the child has a preferred size set, we use it, otherwise
                // we lay it out with the max space currently available to it
                // and let it tell us back what size it wants to be
                if (prefSize.width == -1) {
                    prefSize.width = maxWidth;
                }
                if (prefSize.height == -1) {
                    prefSize.height = totalHeight;
                }
                
                cc.ui.logI("cc.ui", "VBox child prefsize is: " + prefSize.width + ", " + prefSize.height);

                // Layout the child and get its layout size
                childSize = 
                    children[i].doLayout(prefSize.width, prefSize.height);
                
                totalHeight -= childSize.height;
                if (totalHeight < 0) {
                    // We've run out of room, so abort early
                    break;
                } 

                cc.ui.logI("cc.ui", "VBox childsize is: " + childSize.width + ", " + childSize.height);

                // Locate the child within the container
                children[i].setPosition(this.$ibounds.x, 
                                        this.$ibounds.y + totalHeight);
                
                cc.ui.logI("cc.ui", "VBox child location set to: " + this.$ibounds.x + ", " + (this.$ibounds.y + totalHeight));
                totalHeight += childSize.height;

                if (childSize.width > totalWidth) {
                    totalWidth = childSize.width;
                }

                if (totalHeight >= maxHeight) {
                    // We've run out of room, so abort early
                    break;
                }
            }
            
            // Now the 'totalHeight' is an offset from the top, so we convert
            // to true height
            // totalHeight = maxHeight - totalHeight;

            // Set the box's content size and internal bounding box to
            // be the size returned from layout. This may change later in
            // the stretchAndAlign call
            // NOTE: No need for 'else' statements here because the contentSize
            // is set to equal the prefSize (when it is not -1) by the base
            // class (Component) doLayout method.
            if (this.$prefSize.w == -1) {
                this.$ibounds.w = totalWidth;            
                this._contentSize.width += totalWidth;
            }
            if (this.$prefSize.h == -1) {
                this.$ibounds.h = totalHeight;
                this._contentSize.height += totalHeight;        
            }
            cc.ui.logI("cc.ui", "VBox return layout size: " + this._contentSize.width + ", " + this._contentSize.height);

            return { "width" : this._contentSize.width, "height" : this._contentSize.height };
                                    
        } catch (err) {
            cc.ui.logE("cc.ui.boxes",
                       "VBox.doLayout error: " + err);
        }
        return { "width" : 0, "height" : 0 };
    },

    /**
     * The <a name="stretchAndAlign">stretchAndAlign()</a> method stretches 
     * this Component to the given <i>Width</i> and <i>Height</i> (not 
     * including margin, border, and padding), aligning its child components 
     * within this context based on their individual alignment properties.
     * <br /><br />
     * <b>NOTE&#58;</b> 
     * Following <i>doLayout()</i>, <i>stretchAndAlign()</i> assigns a final 
     * size to this Component. If different than the preferred <i>doLayout()
     * </i> size, the <i>stretchAndAlign()</i> parameters of <i>Width</i> and 
     * <i>Height</i> represent final Component dimensions. The Component should 
     * finalize any pending layout tasks, such as child component alignment, 
     * within the context of those dimensions.
     * 
     * @param width Final width of this VBox's Container, in which this
     *        VBox may stretch and align its child components
     * @param height Final height of this VBox's Container, in which this
     *        VBox may stretch and align its child components
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

            var size = null;
            var loc = null;
            
            var x = null;
            var y = null;
            
            // Y axis goes from lower left corner at 0
            var topEdge = this.$ibounds.y + this.$ibounds.h;
            console.log("Top edge initialized to: " + topEdge);
            var bottomEdge = this.$ibounds.y;
            
            var align = null;
            
            var ctrTop = -1;
            var ctrBottom = -1;
            var ctrHeight = 0;
            
            var pos = null;

            // Move top to bottom and align children Vertically.            
            // This loop first top-justifies components, then attempts
            // to vertically place components as best it can
            for (var i = children.length - 1; i >= 0; i--) {
                if (!children[i] || !cc.ui.instanceOf(children[i], cc.ui.Component)) {
                    continue;
                }

                size = children[i].getContentSize();
                pos = children[i].getPosition();

                align = children[i].getVertAlign();

                switch (align) {
                    case cc.ui.Constants.ALGN_TOP:
                        // Top Justified
                        if (topEdge - size.height > pos.y) {
                            topEdge -= size.height;
                            children[i].setPositionY(topEdge);
                        }
                        break;
                    case cc.ui.Constants.ALGN_MIDDLE:
                        // Keep track of the indexes of the first 'middle' child and
                        // the last 'middle' child, as well as the overall height
                        // of all children 'middle' aligned
                        if (ctrTop < 0) {
                            ctrTop = i;
                        }
                        ctrBottom = i;
                        ctrHeight += size.height;
                        break;
                    case cc.ui.Constants.ALGN_BOTTOM:
                    default: // BOTTOM is default
                        console.log("Aligned bottom: " + pos.y);
                        if (bottomEdge < (pos.y + size.height)) {
                            // Keep track of the top of the 'bottom' aligned components
                            bottomEdge = pos.y + size.height;
                        }  
                        break;                  
                }

                // We stretch and align all (stretchable) child components to be 
                // the width of the Box
                if (children[i].shouldStretch()) {
                    children[i].stretchAndAlign(width, size.height);                        
                } else {
                    children[i].stretchAndAlign(size.width, size.height);                    
                    // Align children horizontally
                    if (size.width < width) {                                
                        switch (children[i].getHorizAlign()) {
                            case cc.ui.Constants.ALGN_LEFT:
                                break;
                            case cc.ui.Constants.ALGN_CENTER:
                                children[i].setPositionX( 
                                    this.$ibounds.x + 
                                    Math.floor((width - size.width) / 2));                                
                                break;
                            case cc.ui.Constants.ALGN_RIGHT:
                                children[i].setPositionX( 
                                    this.$ibounds.x + width - size.width);;
                                break;
                            case cc.ui.Constants.ALGN_LEFT:
                            default: // LEFT is default
                                break;
                        }
                    }
                }
            } // first for loop
            
            // We now know the bottom edge of the top-justified components,
            // top edge of the bottom-justified components, the combined
            // height of the centered components, and the center point of
            // the container.            
            if (ctrHeight > 0) {
                var maxY = topEdge;
                var minY = bottomEdge;
                var availHeight = topEdge - bottomEdge;
                console.log("VBOX CENTERED, topEdge: " + topEdge + ", bottomEdge: " + bottomEdge);
                console.log("VBOX CENTERED, available height: " + availHeight);
                console.log("VBOX CENTERED, need height: " + ctrHeight);
                if (availHeight > ctrHeight) {
                    var space = Math.floor((availHeight - ctrHeight) / 2);
                    y = bottomEdge + space;
                } else {
                    y = bottomEdge;
                }
                console.log("VBOX, ctrBottom: " + ctrBottom + ", ctrTop: " + ctrTop);
                for (i = ctrBottom; i >= ctrTop; i--) {
                    if (!children[i] || !cc.ui.instanceOf(children[i], cc.ui.Component)) {
                        continue;
                    }
                    children[i].setPositionY(y);
                    size = children[i].getContentSize();
                    y += size.height;
                }
            }
            
        } catch (err) {
            cc.ui.logE("cc.ui",
                       "VBox.stretchAndAlign error: " + err);
        }                
    },
       
    /**
     * The <a name="getNextComponent">getNextComponent()</a> method starts from 
     * a given <i>Component</i>, at a given direction of traversal <i>Dir</i>, 
     * to determine the next focusable component (if any) for that traversal. 
     * <br /><br />
     * <b>NOTES&#58;</b> 
     * <ul>
     * <li>If Component is null, the TraversalPolicy should assume an initial 
     * traversal into Container in the given direction.</li>
     * <li>If no next focusable Component in the given direction, this method 
     * returns null.</li>
     * </ul>
     * 
     * @param component Component from which traversal originates; null, if no 
     *                  such Component 
     * @param dir Traversal direction, defined in cc.ui.Constants&#58;
     *            TRVS_UP, TRVS_DOWN, TRVS_LEFT, or TRVS_RIGHT
     */
    getNextComponent : function(component, dir) {
        // If the default traversal has been overridden, return that
        var newOwner = this._super(component, dir);
        if (newOwner != null) {
            return newOwner;
        }

        // The vertical layout traversal algorithm is represented by the
        // following 5 states:
        // 0 : Focus is not currently in this layout, or null, and the
        //     traverse is down or forward
        // 1 : Focus is not currently in this layout, or null, and the
        //     traverse is up or backward
        // 2 : Focus is not currently in this layout, or null, and the
        //     traverse is left or right
        // 3 : Focus is currently in this layout, and the traverse is
        //     left or right
        // 4 : Focus is currently in this layout, and the traverse is
        //     up or down or forward or backward
        
        // The 5 states are split between focus being in this layout or
        // outside of it (or null)
        var inLayout = 
            (component != null && this.isAncestor(component));
        var children = this._children;

        if (inLayout) {
            // States 3 and 4
            switch (dir) {
                case cc.ui.Constants.TRVS_DOWN:
                case cc.ui.Constants.TRVS_FWD:
                    // Return the next focusable child
                    var index = children.length;
                    for (var i = 0; i < children.length; i++) {
                        if (!children[i]) {
                            continue;
                        }
                        if (children[i] === component || 
                                children[i].isAncestor(component)) {
                            index = i;
                        }
                        if (i > index && children[i].isVisible()) {
                            if (children[i].isFocusable()) {
                                newOwner = children[i];
                                break;
                            } else if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                                newOwner = children[i].getNextComponent(component, dir);
                                if (newOwner != null) {
                                    break;
                                }
                            }
                        }
                    }
                    // If we're at the end, see if we need to wrap
                    if (index != children.length && newOwner == null && this.wrapTraverse[dir]) {
                        // If we wrap forwards, return the first component
                        newOwner = this.__getFirstFocusableComponent(component, dir);
                    }
                    break;
                case cc.ui.Constants.TRVS_UP:
                case cc.ui.Constants.TRVS_BKWD:
                    // Return the previous child
                    var index = -1;
                    for (var i = children.length - 1; i >= 0; i--) {
                        if (!children[i]) {
                            continue;
                        }
                        if (children[i] === component || 
                                children[i].isAncestor(component)) {
                            index = i;
                        }
                        if (i < index && children[i].isVisible()) {
                            if (children[i].isFocusable()) {
                                newOwner = children[i];
                                break;
                            } else if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                                newOwner = children[i].getNextComponent(component, dir);
                                if (newOwner != null) {
                                    break;
                                }
                            }
                        }
                    }
                    // If we're at the beginning, see if we need to wrap
                    if (index != -1 && newOwner == null && this.wrapTraverse[dir]) {
                        // if we wrap backwards, return the bottom element
                        newOwner = this.__getLastFocusableComponent(component, dir);
                    }
                    break;
                case cc.ui.Constants.TRVS_LEFT:
                case cc.ui.Constants.TRVS_RIGHT:
                    // Return null;
                    break;                    
            }
        } else {
            // States 0-2
            switch (dir) {
                case cc.ui.Constants.TRVS_DOWN:
                case cc.ui.Constants.TRVS_FWD:
                    // Basic default traverse to the top element
                    newOwner = this.__getFirstFocusableComponent(component, dir);
                    break;
                case cc.ui.Constants.TRVS_UP:
                case cc.ui.Constants.TRVS_BKWD:
                    // Basic default traverse to the bottom element
                    newOwner = this.__getLastFocusableComponent(component, dir);
                    break;
                case cc.ui.Constants.TRVS_RIGHT:
                case cc.ui.Constants.TRVS_LEFT:
                    // Advanced traverse - if there is an existing focused
                    // element, use it to determine which element in this
                    // layout is on the closest horizontal plane. Otherwise,
                    // return the top element.
                    if (component != null) {
                        // Determine the closest component in the set to the
                        // current component's y axis
                        var c = null;
                        var yDelta = -1;
                        var d = 0;
                        var p1 = component.getLocationOnScreen();
                        var p2 = null;
                        
                        for (var i = 0; i < children.length; i++) {
                            if (!children[i] || !children[i].isVisible()) {
                                continue;
                            }
                            if (children[i].isFocusable()) {
                                p2 = children[i].getLocationOnScreen();
                                d = Math.abs(p1.y - p2.y);
                                if (d < yDelta || yDelta == -1) {
                                    newOwner = children[i];
                                    yDelta = d;                                    
                                }    
                            } else if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                                var e = children[i].getNextComponent(component, dir);
                                if (e != null) {
                                    p2 = e.getLocationOnScreen(); 
                                    d = Math.abs(p1.y - p2.y);
                                    if (d < yDelta || yDelta == -1) {
                                        newOwner = e;
                                        yDelta = d;
                                    }
                                }
                            }
                        }
                    } else {
                        // Return the first component
                        newOwner = this.__getFirstFocusableComponent(component, dir);
                     }
                    break;                
            }
        }
        
        // Everything falls through to here, and we return the new focus
        // owner or null if none was found in this layout
        
        return newOwner;
    },
    
});
