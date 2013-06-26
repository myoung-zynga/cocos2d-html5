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
 * The HBox class manages components placing them one after 
 * another horizontally.  
 * <br /><br />
 * Its methods provide the following functionality&#58;
 * <ul>
 * <li><i>To create a new instance of the HBox class</i>, use 
 * <a href="#HBox">HBox()</a>.</li>
 * <li><i>To return the dimensions of the bounding box that fits the child 
 * components of this HBox,</i> call <a href="#doLayout">doLayout()
 * </a>.</li>
 * <li><i>To set the final dimensions of this HBox,</i> use 
 * <a href="#stretchAndAlign">stretchAndAlign()</a>.</li>
 * <li><i>To paint the contents of this HBox,
 * </i> use <a href="#paintContent">drawContent()</a>.</li>
 * <li><i>To return the next Component for a particular traversal,</i> use 
 * <a href="#getNextComponent">getNextComponent()</a>.</li>
 * </ul>
 */
cc.ui.boxes.HBox = cc.ui.Box.extend({
    
    /**
     * The <a name="HBox">HBox()</a> method creates a new instance of the 
     * HBox (horizontal layout) class, which contains components placed one 
     * after another horizontally across the container.
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
     * <li>If a preferred size has been set for the HBox, those dimensions 
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
                                    
            cc.ui.logI("cc.ui.boxes", "HBox.doLayout max size is: " + maxWidth + ", " + maxHeight);
            var children = this._children;
            
            var totalWidth = 0;
            var totalHeight = 0;
            
            var childSize = null;
            var prefSize = null;

            cc.ui.logI("cc.ui.boxes", "HBox, child length is: " + children.length);
            for (var i = 0; i < children.length; i++) {
                if (!children[i] || !cc.ui.instanceOf(children[i], cc.ui.Component)) {
                    continue;
                }

                prefSize = children[i].getPreferredSize();

                // If the child has a preferred size set, we use it, otherwise
                // we lay it out with the max space currently available to it
                // and let it tell us back what size it wants to be
                if (prefSize.width == -1) {
                    prefSize.width = maxWidth - totalWidth;;
                }
                if (prefSize.height == -1) {
                    prefSize.height = maxHeight;
                }

                cc.ui.logI("cc.ui.boxes", "HBox, child prefsize is: " + prefSize.width + ", " + prefSize.height);

                // Layout the child and get its layout size
                childSize = children[i].doLayout(prefSize.width, prefSize.height);

                cc.ui.logI("cc.ui.boxes", "HBox, childsize is: " + childSize.width + ", " + childSize.height);
                    
                // Locate the child within the container
                children[i].setPosition(this.$ibounds.x + totalWidth, 
                                        this.$ibounds.y + maxHeight - childSize.height);
                                                        
                cc.ui.logI("cc.ui.boxes", "HBox, child location set to: " + this.$ibounds.x + ", " + (this.$ibounds.y + maxHeight - childSize.height));
                totalWidth += childSize.width;

                if (childSize.height > totalHeight) {
                    totalHeight = childSize.height;
                }

                if (totalWidth >= maxWidth) {
                    // We've run out of room, so abort early
                    break;
                }
            }

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
            
            return { "width" : this._contentSize.width, "height" : this._contentSize.height };
                                    
        } catch (err) {
            cc.ui.logE("cc.ui.boxes",
                       "HBox.doLayout error: " + err);
        }
        return { "width" : 0, "height" : 0 };
    },

    /**
     * The <a name="stretchAndAlign">stretchAndAlign()</a> method stretches 
     * this Box to the given <i>Width</i> and <i>Height</i> (not 
     * including margin, border, and padding), aligning its child components 
     * within this context based on their individual alignment properties.
     * <br /><br />
     * <b>NOTE&#58;</b> 
     * Following <i>doLayout(),</i> <i>stretchAndAlign()</i> assigns a final 
     * size to this Box. If different than the preferred <i>doLayout()
     * </i> size, the <i>stretchAndAlign()</i> parameters of <i>Width</i> and 
     * <i>Height</i> represent final Box dimensions. The Box should 
     * finalize any pending layout tasks, such as child component alignment, 
     * within the context of those dimensions.
     * 
     * @param width Final width of this HBox, in which this
     *        Box may stretch and align its child components
     * @param height Final height of this HBox, in which this
     *        Box may stretch and align its child components
     */
    stretchAndAlign : function(width, height) {
        try {

            cc.ui.logI("cc.ui.boxes", "HBox.sAnda, old size: " + this._contentSize.width + ", " + this._contentSize.height);
            cc.ui.logI("cc.ui.boxes", "HBox.sAnda, new size: " + width + ", " + height);

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
            
            var leftEdge = this.$ibounds.x;
            
            var rightEdge = this.$ibounds.x + this.$ibounds.w;
            
            var align = null;
            
            var ctrPoint = leftEdge + Math.floor(width / 2);
            var ctrLeft = -1;
            var ctrRight = -1;
            var ctrWidth = 0;
            
            var pos = null;
            
            // Move right to left and align children Horizontally.            
            // This loop first right-justifies components, then attempts
            // to horizontally place components as best it can
            for (var i = children.length - 1; i >= 0; i--) {
                if (!children[i] || !cc.ui.instanceOf(children[i], cc.ui.Component)) {
                    continue;
                }

                size = children[i].getContentSize();
                pos = children[i].getPosition();

                // Default to LEFT alignment for legacy non-ui components
                align = children[i].getHorizAlign();

                switch (align) {
                    case cc.ui.Constants.ALGN_RIGHT:
                        // Right Justified
                        rightEdge -= size.width;
                        if (rightEdge < pos.x) {
                            // Never allow the component to be moved
                            // further right than where it would normally be
                            // (because that means there are other components 
                            // taking up the space left of this one)
                            rightEdge = pos.x;
                        }
                        children[i].setPositionX(rightEdge);
                        break;
                    case cc.ui.Constants.ALGN_CENTER:
                        // Keep track of the indexes of the first 'center' child and
                        // the last 'center' child, as well as the overall width
                        // of all children 'center' aligned
                        if (i > ctrRight) {
                            ctrRight = i;
                        }
                        ctrLeft = i;
                        ctrWidth += size.width;
                        break;
                    case cc.ui.Constants.ALGN_LEFT:
                    default:
                        // Left is default
                        x = pos.x + size.width;
                        if (x > leftEdge) {
                            // Keep track of the right of the 'left' aligned components
                            leftEdge = x;
                        }
                        break;                
                }

                // We stretch and align all child components to be the same
                // height
                if (children[i].shouldStretch()) {
                    children[i].stretchAndAlign(size.width, height);                        
                } else {
                    children[i].stretchAndAlign(size.width, size.height);                    
                    // Align children vertically
                    if (size.height < height) {                                                             
                        switch (children[i].getVertAlign()) {
                            case cc.ui.Constants.ALGN_TOP:
                                break;
                            case cc.ui.Constants.ALGN_MIDDLE:
                                children[i].setPositionY( 
                                    this.$ibounds.y + 
                                    Math.floor((height - size.height) / 2));                                
                                break;
                            case cc.ui.Constants.ALGN_BOTTOM:
                                children[i].setPositionY(this.$ibounds.y);
                                break;
                        }
                    }
                }
            } // first for loop
            
            // We now know the left edge of the right-justified components,
            // left edge of the right-justified components, the combined
            // width of the centered components, and the center point of
            // the container.           
            if (ctrWidth > 0) {
                var minX = leftEdge;
                var maxX = rightEdge;
                var availWidth = rightEdge - leftEdge;
                console.log("HBOX CENTERED, rightEdge: " + rightEdge + ", leftEdge: " + leftEdge);
                console.log("HBOX CENTERED, available width: " + availWidth);
                console.log("HBOX CENTERED, need width: " + ctrWidth);
                if (availWidth > ctrWidth) {
                    var space = Math.floor((availWidth - ctrWidth) / 2);
                    x = leftEdge + space;
                } else {
                    x = leftEdge;
                }
                console.log("HBOX, ctrLeft: " + ctrLeft + ", ctrRight: " + ctrRight);
                for (i = ctrLeft; i <= ctrRight; i++) {
                    if (!children[i] || !cc.ui.instanceOf(children[i], cc.ui.Component)) {
                        continue;
                    }
                    children[i].setPositionX(x);
                    size = children[i].getContentSize();
                    x += size.width;
                }
            }
            
        } catch (err) {
            cc.ui.logE("cc.ui.boxes",
                       "HBox.stretchAndAlign error: " + err);
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
     * @param dir Traversal direction, defined in mobiJAX.ui.Constants&#58;
     *            TRVS_UP, TRVS_DOWN, TRVS_LEFT, or TRVS_RIGHT
     */
    getNextComponent : function(component, dir) {
        // If the default traversal has been overridden, return that
        var newOwner = this._super(component, dir);
        if (newOwner != null) {
            return newOwner;
        }
        
        // The horizontal layout traversal algorithm is represented by the
        // following 5 states:
        // 0 : Focus is not currently in this layout, or null, and the
        //     traverse is right or forward
        // 1 : Focus is not currently in this layout, or null, and the
        //     traverse is left or backward
        // 2 : Focus is not currently in this layout, or null, and the
        //     traverse is up or down
        // 3 : Focus is currently in this layout, and the traverse is
        //     up or down
        // 4 : Focus is currently in this layout, and the traverse is
        //     left or right or forward or backward
        
        // The 5 states are split between focus being in this layout or
        // outside of it (or null)
        var inLayout = 
            (component != null && this.isAncestor(component));
        var children = this._children;
        
        if (inLayout) {
            // States 3 and 4
            switch (dir) {
                case cc.ui.Constants.TRVS_RIGHT:
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
                            } else if (cc.ui.instanceOf(children[i], cc.ui.Bpx)) {
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
                case cc.ui.Constants.TRVS_LEFT:
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
                case cc.ui.Constants.TRVS_UP:
                case cc.ui.Constants.TRVS_DOWN:
                    // Return null;
                    break;                  
            }
        } else {
            // States 0-2
            switch (dir) {
                case cc.ui.Constants.TRVS_RIGHT:
                case cc.ui.Constants.TRVS_FWD:
                    // Basic default traverse to the left element
                    newOwner = this.__getFirstFocusableComponent(component, dir);
                    break;
                case cc.ui.Constants.TRVS_LEFT:
                case cc.ui.Constants.TRVS_BKWD:
                    // Basic default traverse to the right element
                    newOwner = this.__getLastFocusableComponent(component, dir);
                    break;
                case cc.ui.Constants.TRVS_DOWN:
                case cc.ui.Constants.TRVS_UP:
                    // Advanced traverse - if there is an existing focused
                    // element, use it to determine which element in this
                    // layout is on the closest vertical plane. Otherwise,
                    // return the left element.
                    if (component != null) {
                        // Determine the closest component in the set to the
                        // current component's y axis
                        var c = null;
                        var xDelta = -1;
                        var d = 0;
                        var p1 = component.getLocationOnScreen();
                        var p2 = null;
                        
                        for (var i = 0; i < children.length; i++) {
                            if (!children[i] || !children[i].isVisible()) {
                                continue;
                            }
                            if (children[i].isFocusable()) {
                                p2 = children[i].getLocationOnScreen();
                                d = Math.abs(p1.x - p2.x);
                                if (d < xDelta || xDelta == -1) {
                                    newOwner = children[i];
                                    xDelta = d;                                 
                                }   
                            } else if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                                var e = children[i].getNextComponent(component, dir);
                                if (e != null) {
                                    p2 = e.getLocationOnScreen(); 
                                    d = Math.abs(p1.x - p2.x);
                                    if (d < xDelta || xDelta == -1) {
                                        newOwner = e;
                                        xDelta = d;
                                    }
                                }
                            }
                        }
                    } else {
                        // Return the left component
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
