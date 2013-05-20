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
 * The FlowBox arranges Components horizontally in sequence, starting
 * an additional row as space limits require. 
 * <br /><br />
 * This class's methods provide the following functionality&#58;
 * <ul>
 * <li><i>To create an instance of the FlowBox class,</i> use 
 * <a href="#FlowLayout">FlowBox()</a></li>
 * <li><i>To return the dimensions of the bounding box that fits the child 
 * components of this FlowBox,</i> use <a href="#doLayout">doLayout()
 * </a>.</li>
 * <li><i>To set the final dimensions of this Component,</i> use 
 * <a href="#stretchAndAlign">stretchAndAlign()</a>.</li>
 * <li><i>To paint the contents of this Component to a given Surface,
 * </i> use <a href="#paintContent">paintContent()</a>.</li>
 * <li><i>To return the next Component for a particular traversal,</i> use 
 * <a href="#getNextComponent">getNextComponent()</a>.</li>
 * </ul>
 */
cc.ui.boxes.FlowBox = cc.ui.Box.extend({
    
    $rowHeights : null,

    /**
     * The <a name="FlowLayout">FlowLayout()</a> method creates a new instance 
     * of the FlowLayout class. Components added to a flow layout will be 
     * placed first horizontally, then vertically when the component does not 
     * fit on the same line as the last one.
     */
    ctor : function() {
        this._super();
    },
    
    /**
     * The <a name="doLayout">doLayout()</a> method returns the total Width 
     * and Height required by the child components of this Component, 
     * at their preferred size (given current properties), with the given 
     * <i>MaxWidth</i> and <i>MaxHeight </i> (from the Component's 
     * parent Container and the layout policy) as limits. 
     * <br /><br />
     * <b>NOTES&#58;</b>
     * <ul>
     * <li>If a preferred size has been set for the Component, those dimensions 
     * will be passed in as MaxWidth and MaxHeight.</li>
     * <li>This method combines two essential steps in the layout subsystem,
     * returning the desired size of the Component and setting the size of the 
     * Component. The layout subsystem expects a Component to assume its 
     * desired size immediately in doLayout().</li>
     * <li>This Component's stretchAndAlign() method will be called 
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

            cc.ui.logI("cc.ui.boxes", "FlowBox.doLayout max size is: " + maxWidth + ", " + maxHeight);            
            var children = this._children;
            
            var totalWidth = 0;
            var totalHeight = 0;
            var availW = maxWidth;
            var availH = maxHeight;

            var childSize = null;
            var prefSize = null;
            
            var availW = maxWidth;
            
            var rowHeight = 0;
            
            var rowX = 0;
            var rowY = 0;

            var isComponent = false;
            
            this.$rowHeights = new Array();
            
            cc.ui.logI("cc.ui.boxes", "FlowBox, child length is: " + children.length);
            for (var i = 0; i < children.length; i++) {
                if (!children[i]) {
                    continue;
                }
                isComponent = cc.ui.instanceOf(children[i], cc.ui.Component);

                prefSize = (isComponent) ? children[i].getPreferredSize()
                    : children[i].getContentSize();

                // If the child has a preferred size set, we use it, otherwise
                // we lay it out with the max space currently available to it
                // and let it tell us back what size it wants to be
                if (prefSize.width == -1) {
                    prefSize.width = availW;
                }
                if (prefSize.height == -1) {
                    prefSize.height = availH;
                }
                
                // Layout the child and get its preferred size
                childSize = (isComponent) ? 
                    children[i].doLayout(prefSize.width, prefSize.height)
                    : prefSize;

                if (childSize.width > availW) {
                    if (availW < maxWidth) {
                        // Means the child doesn't fit on the line and there
                        // are other children already on that line, so move it
                        // to the next line

                        // cache it for later in stretchAndAlign()
                        this.$rowHeights.push(rowHeight);
                                                                
                        rowY += rowHeight;
                        // Re-set the row variables
                        availW = maxWidth;
                        rowHeight = 0;
                        rowX = 0;
                    } else {
                        // Means the child doesn't fit on the line but there
                        // are no other children on the line so it gets forced
                        // to truncate on that line
                    }
                }
                
                children[i].setPosition(this.$ibounds.x + rowX, 
                                        this.$ibounds.y + maxHeight - rowY - childSize.height);
                
                cc.ui.logI("cc.ui.boxes",
                           "Flow.doLayout, child position: " + (this.$ibounds.x + rowX) + ", " + (this.$ibounds.y + maxHeight - rowY));

                // Note that its possible we run out of available height
                // to fit all the components but we size them all anyway
                // rather than return early
                
                if (childSize.height > rowHeight) {
                    rowHeight = childSize.height;
                }                
                rowX += childSize.width;
                if (rowX > totalWidth) {
                    totalWidth = rowX;
                }
                availW -= childSize.width;

                cc.ui.logI("cc.ui.boxes",
                           "Flow.doLayout, rowHeight: " + rowHeight);
            }

            totalHeight = rowY + rowHeight;
            if (rowHeight > 0) {
                // Have to specifically push the last row's height onto the
                // stack
                this.$rowHeights.push(rowHeight);
            }
            
            cc.ui.logI("cc.ui.boxes",
                       "Flow.doLayout, return size is: " + totalWidth + ", " + totalHeight);

            // Set the box's content size and internal bounding box to
            // be the size returned from layout. This may change later in
            // the stretchAndAlign call
            if (this.$prefSize.w == -1) {
                this.$ibounds.w = totalWidth;            
                this._contentSize.width += totalWidth;
            }
            if (this.$prefSize.h == -1) {
                this.$ibounds.h = totalHeight;
                this._contentSize.height += totalHeight;        
            }

            return { "width" : this._contentSize.width, "height" : this._contentSize.height };
            
        } catch(err) {
            cc.ui.logE("cc.ui.boxes", 
                       "FlowBox.doLayout error: " + err);
        }

        return { "width" : 0, "height" : 0 };
    },

    /**
     * The <a name="stretchAndAlign">stretchAndAlign()</a> method stretches 
     * this Component to the given <i>Width</i> and <i>Height</i> (not 
     * including margin, border, and padding), aligning its child components 
     * within this context based on their individual alignment properties.
     * <br /><br />
     * <b>NOTES&#58;</b> 
     * <ul>
     * <li>Following doLayout(), stretchAndAlign() assigns a final size to this 
     * Component. If different than the preferred doLayout() size, the 
     * stretchAndAlign() parameters of <i>Width</i> and <i>Height</i> represent 
     * final Component dimensions. The Component should finalize any pending 
     * layout tasks, such as child component alignment, within the context of 
     * those dimensions.</li>
     * </ul>
     * 
     * @param width Final width (in pixels) awarded to this Component by
     *              the layout subsystem
     * @param height Final height (in pixels) awarded to this Component by
     *               the layout subsystem
     */
    stretchAndAlign : function(width, height) {
        try {

            cc.ui.logI("cc.ui.boxes", "FlowBox.sAnda, old size: " + this._contentSize.width + ", " + this._contentSize.height);
            cc.ui.logI("cc.ui.boxes", "FlowBox.sAnda, new size: " + width + ", " + height);

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
         
            var size;
            var loc;
            
            var x;
            var y;
            
            var leftEdge;            
            var rightEdge;
            var topEdge;
            var botEdge;

            var align;
            
            var ctrPoint;
            var ctrLeft;
            var ctrRight;
            var ctrWidth;
            
            var pos;
            var isComponent = false;
            var stretch;

            var childIndex = children.length - 1;

            for (var j = this.$rowHeights.length - 1; j >= 0; j--) {

                cc.ui.logI("cc.ui.boxes", "Flow.sAndA row height: " + this.$rowHeights[j]);

                leftEdge = this.$ibounds.x;
                rightEdge = this.$ibounds.x + this.$ibounds.w;
                ctrPoint = leftEdge + Math.floor(width / 2);

                ctrLeft = -1;
                ctrRight = -1;
                ctrWidth = 0;

                topEdge = null;
                bitEdge = null;

                // Move right to left and align children Horizontally.            
                // This loop first right-justifies components, then attempts
                // to horizontally place components as best it can
                for (var i = childIndex; i >= 0; i--) {
                    if (!children[i]) {
                        continue;
                    }
                    isComponent = cc.ui.instanceOf(children[i], cc.ui.Component);

                    size = children[i].getContentSize();
                    pos = children[i].getPosition();
                    align = (isComponent) ? children[i].getHorizAlign()
                        : cc.ui.Constants.ALGN_LEFT; // default LEFT for legacy

                    if (topEdge == null) {
                        topEdge = pos.y + size.height;
                        botEdge = topEdge - this.$rowHeights[j];
                        cc.ui.logI("cc.ui.boxes", "Flow.sAndA: top,bottom edges: " + topEdge + ", " + botEdge);
                    } else if (topEdge != (pos.y + size.height)) {
                        // Done with the current row, break out of the line
                        // and continue
                        childIndex = i;
                        break;
                    }

                    if (align == cc.ui.Constants.ALGN_RIGHT) {
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
                        
                    } else if (align == cc.ui.Constants.ALGN_CENTER) {
                        // Keep track of the indexes of the first 'center' child and
                        // the last 'center' child, as well as the overall width
                        // of all children 'center' aligned
                        if (i > ctrRight) {
                            ctrRight = i;
                        }
                        ctrLeft = i;
                        ctrWidth += size.width;
                    } else { 
                        // Left is default
                        x = pos.x + size.width;
                        if (x > leftEdge) {
                            // Keep track of the right of the 'left' aligned components
                            leftEdge = x;
                        }                   
                    }

                    stretch = (isComponent) ?
                        children[i].shouldStretch() : false;

                    // We stretch and align all child components to be the same
                    // height                    
                    if (stretch) {
                        children[i].stretchAndAlign(size.width, height);                        
                    } else {
                        if (isComponent) {
                            children[i].stretchAndAlign(size.width, size.height);
                        }
                        // Align children vertically
                        if (size.height < height) {                               
                            align = (isComponent) ? children[i].getVertAlign()
                                : cc.ui.Constants.ALGN_TOP; // default LEFT for legacy

                            switch (align) {
                                case cc.ui.Constants.ALGN_TOP:
                                    break;
                                case cc.ui.Constants.ALGN_MIDDLE:
                                    children[i].setPositionY( 
                                        botEdge + 
                                        Math.floor((this.$rowHeights[j] - size.height) / 2));                                
                                    break;
                                case cc.ui.Constants.ALGN_BOTTOM:
                                    children[i].setPositionY(botEdge);
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
                    x = ctrPoint - Math.floor(ctrWidth / 2);
                    
                    if (x < minX) {
                        // The centered components must be shifted right to fit
                        x = minX;
                    } else if (x + ctrWidth > maxX) {
                        // The centered components must be shifted left to fit
                        x = maxX - ctrWidth;
                    }
                    for (i = ctrLeft; i <= ctrRight; i++) {
                        if (!children[i]) {
                            continue;
                        }
                        size = children[i].getContentSize();
                        children[i].setPositionX(x);
                        x += size.width;
                    }
                }    

            } // for loop on rowHeights

        } catch (err) {
            cc.ui.logE("cc.ui.boxes",
                       "FlowBox.stretchAndAlign error: " + err);
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
        var newOwner = this.$base(component, dir);
        if (newOwner != null) {
            return newOwner;
        }
        
        if (this.$rowHeights == null) {
            // no layout was done yet
            return null;
        }

        // The vertical layout traversal algorithm is represented by the
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
            (component != null && this.container.isAncestor(component));
        var children = this.container.children;

        if (inLayout) {
            // States 3 and 4
            switch (dir) {
                case mobiJAX.ui.Constants.TRVS_RIGHT:
                case mobiJAX.ui.Constants.TRVS_FWD:
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
                            } else if ($class.instanceOf(children[i], mobiJAX.ui.Container)) {
                                newOwner = children[i].getTraversalPolicy().getNextComponent(component, dir);
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
                case mobiJAX.ui.Constants.TRVS_LEFT:
                case mobiJAX.ui.Constants.TRVS_BKWD:
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
                            } else if ($class.instanceOf(children[i], mobiJAX.ui.Container)) {
                                newOwner = children[i].getTraversalPolicy().getNextComponent(component, dir);
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
                case mobiJAX.ui.Constants.TRVS_DOWN:
                    var curRow = 0;
                    var curHeight = this.$rowHeights[0];
                    var curChild = null;
                    var index = children.length;
                    var indexRow = this.$rowHeights.length;
                    var indexBegRow = 0;
                    var indexEndRow = 0;
                    for (var i = 0; i < children.length; i++) {
                        if (!children[i]) {
                            continue;
                        }
                        curChild = children[i];
                                                
                        if (curChild === component ||
                            curChild.isAncestor(component)) {
                            if (curRow == (this.$rowHeights.length - 1)) {
                                return null;
                            }
                            index = i;
                            indexRow = curRow;
                        }
     
                        if (curChild.obounds.y + curChild.obounds.h > curHeight) {
                            curRow++;
                            curHeight += this.$rowHeights[curRow];
                            indexBegRow = indexEndRow;
                            indexEndRow = i;
                            
                            // current focus is the beg of the row
                            if (index == i) {
                                indexRow = curRow;
                                if (indexRow == (this.$rowHeights.length - 1)) {
                                    return null;
                                }
                            }
                            if (indexRow + 2 == curRow) {
                                break;
                            }
                        }
                        
                        if (i == children.length - 1) {
                            indexBegRow = indexEndRow;
                            indexEndRow = children.length;
                        }
                    }
                    
                    return this.__findClosestInRow(component, indexBegRow, indexEndRow, dir);
                            
                case mobiJAX.ui.Constants.TRVS_UP:
                
                    // Find the first component in in row above
                    // and the first component in the row where focusOwner is
                    var indexPrevRow = -1;
                    var indexBegRow = -1;
                    var curRow = -1;
                    var curHeight = 0;
                    var curChild = null;
                    var index = children.length;
                    for (var i = 0; i < children.length; i++) {
                        if (!children[i]) {
                            continue;
                        }
                        curChild = children[i];
 
                         if (curChild.obounds.y + curChild.obounds.h > curHeight) {
                            curRow++;
                            curHeight += this.$rowHeights[curRow];
                            indexPrevRow = indexBegRow;
                            indexBegRow = i;
                        }
                                               
                        if (curChild === component ||
                            curChild.isAncestor(component)) {
                            index = i;
                            // focusOwner is at the top row - return null
                            if (curRow == 0) {
                                return null;
                            }
                            break;
                        }
                    }
                    // focusOwner is not among children - should not happen                   
                    if (index == children.length) {
                        return null;
                    }             
                    return this.__findClosestInRow(component, indexPrevRow, indexBegRow, dir);
            }
        } else {
            // States 0-2
            switch (dir) {
                case mobiJAX.ui.Constants.TRVS_RIGHT:
                case mobiJAX.ui.Constants.TRVS_FWD:
                case mobiJAX.ui.Constants.TRVS_DOWN:
                    // Basic default traverse to the top element
                    return this.__getFirstFocusableComponent(component, dir);
 
                case mobiJAX.ui.Constants.TRVS_LEFT:
                case mobiJAX.ui.Constants.TRVS_BKWD:
                case mobiJAX.ui.Constants.TRVS_UP:
                    // Basic default traverse to the bottom element
                    return this.__getLastFocusableComponent(component, dir);
            }
        }
        
        // Everything falls through to here, and we return the new focus
        // owner or null if none was found in this layout
        
        return newOwner;
    },
    
    __findClosestInRow : function(focusOwner, indexBegRow, indexEndRow, dir) {
            var children = this.container.children;
            
            // Find component that is closest horizontally to 
            // the focusOwner in the row above
            var focusX = focusOwner.getLocationOnScreen().x;
            var closestIndex = indexEndRow;
            var deltaX = this.container.ibounds.w;
            var curDelta = 0;
            var curX = 0;
            var child = null;
         
            for (var i = indexBegRow; i < indexEndRow; i++) {
                if (!children[i] || !children[i].isVisible()) {
                    continue;
                }
               if (children[i].isFocusable()) {
                   child = children[i];
                } else if ($class.instanceOf(children[i], mobiJAX.ui.Container)) {              
                   child = children[i].getTraversalPolicy().getNextComponent(focusOwner, dir);
                   if (child == null) {
                       continue;
                   }
                } else {
                   continue;
                }
                
                curX = child.getLocationOnScreen().x;
                if (curX < focusX) {
                    if (focusX - curX < deltaX) {
                       closestIndex = i;
                       deltaX = focusX - curX;
                    }
                } else if (curX + children[i].obounds.w >
                           focusX + focusOwner.obounds.w) {
                    var curDelta = curX + children[i].obounds.w -
                                   focusX - focusOwner.obounds.w;
                    if (curDelta < deltaX) {
                       closestIndex = i;
                       deltaX = curDelta;
                    }
                } else {
                    return child;
                }
            }     
            
            if (closestIndex == indexEndRow) {
                return null;
            }
           
            child = children[closestIndex];
            if (child.isFocusable()) {
                return child;
            } else if ($class.instanceOf(child, mobiJAX.ui.Container)) {
                   return child.getTraversalPolicy().getNextComponent(focusOwner, dir);
            }
            return null; 
    }
    
});
