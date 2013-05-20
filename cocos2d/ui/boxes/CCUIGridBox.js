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
 * The GridBox class lays out, sizes, paints, and returns values for  
 * grid-style layouts.
 * <br /><br />
 * Its methods provide the following functionality&#58;
 * <ul>
 * <li><i>To create a new instance of the GridBox class, with given number 
 * of rows and columns</i>, use <a href="#GridBox">GridBox()</a>.</li>
 * <li><i>To set the height of all rows in this entire GridBox</i>, use 
 * <a href="#setRowHeight">setRowHeight()</a>.</li>
 * <li><i>To return the currently set or calculated row height</i>, use 
 * <a href="#getRowHeight">getRowHeight()</a>.</li>
 * <li><i>To set the width of all columns in this entire GridBox</i>, use 
 * <a href="#setColumnWidth">setColumnWidth()</a>.</li>
 * <li><i>To return the currently set or calculated column width</i>, use 
 * <a href="#getColumnWidth">getColumnWidth()</a>.</li>
 * <li><i>To return the dimensions of the bounding box that fits the child 
 * components of this GridBox,</i> use <a href="#doLayout">doLayout()
 * </a>.</li>
 * <li><i>To set the final dimensions of this Box,</i> use 
 * <a href="#stretchAndAlign">stretchAndAlign()</a>.</li>
 * <li><i>To paint the contents of this Box,
 * </i> use <a href="#drawContent">drawContent()</a>.</li>
 * <li><i>To return the next Component for a particular traversal,</i> use 
 * <a href="#getNextComponent">getNextComponent()</a>.</li>
 * </ul>
 */
cc.ui.boxes.GridBox = cc.ui.Box.extend({
    
    // The number of rows/cols
    $rows : 0,
    $cols : 0,

    // The set row,col sizes
    $rowHeight : -1,
    $colWidth : -1,

    // The calculated row,col sizes
    $rowHeightC : 0,
    $colWidthC : 0,

    /**
     * The <a name="GridBox">GridBox()</a> method creates a new instance
     * of the GridBox class, with the given number of <i>Rows</i> and 
     * <i>Cols</i>. 
     * <br /><br />
     * <b>NOTE&#58;</b>
     * Components added to the GridBox are added across columns then 
     * down one row and across again, until the GridBox is filled.
     * 
     * @param rows Integer (number of rows) with which to initialize the 
     *             GridBox
     * @param cols Integer (number of columns) with which to initialize the 
     *             GridBox
     */
    ctor : function(rows, cols) {
        this._super();

        if (rows && typeof rows == "number" && 
                cols && typeof cols == "number") {
                
            this.$rows = rows;
            this.$cols = cols;
        } else {
            throw new Error("Incorrect number of rows or " +
                "columns in GridBox");
        }
    },

    /**
     * The <a name="setRowHeight">setRowHeight()</a> method manually defines 
     * row height for this entire GridBox.
     * 
     * @param rowHeight Numerical value for the height of all rows
     */
    setRowHeight : function(rowHeight) {
        if (rowHeight && typeof rowHeight == "number") {
            this.$rowHeight = rowHeight;
        }
    },
    
    /**
     * The <a name="getRowHeight">getRowHeight()</a> method returns the 
     * currently set or calculated row height. 
     * 
     * @return Row height of all rows in the GridBox
     */
    getRowHeight : function() {
        return (this.$rowHeight >= 0) ? this.$rowHeight : this.$rowHeightC;
    },
    
    /**
     * The <a name="setColumnWidth">setColumnWidth()</a> method manually 
     * defines column width for this entire GridBox.
     * 
     * @param colWidth Numerical value for the width of all columns. 
     */
    setColumnWidth : function(colWidth) {
        if (colWidth && typeof colWidth == "number") {
            this.$colWidth = colWidth;
        }
    },
    
    /**
     * The <a name="getColumnWidth">getColumnWidth()</a> method returns the 
     * currently set or calculated column width.
     * 
     * @return Current column width of all columns in the GridBox
     */
    getColumnWidth : function() {
        return (this.$colWidth >= 0) ? this.$colWidth : this.$colWidthC;
    },

    /**
     * The <a name="doLayout">doLayout()</a> method returns the total Width 
     * and Height required by the child components of this Component, 
     * at their preferred size (given current properties), with the given 
     * <i>MaxWidth</i> and <i>MaxHeight</i> (from the Component's 
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

            cc.ui.logI("cc.ui", "GridBox.doLayout max size is: " + maxWidth + ", " + maxHeight);            
            var children = this._children;

            var width = 0;
            var height = 0;
            
            // Tricky algorithm here: Its possible to override the default sizing
            // by setting the row or column size values using the set methods
            // But if the sizing hasn't been overridden, we calculate the maximum
            // needed row and column sizes by sizing the child components, however
            // we need to constrain them by dividing the passed in values for 
            // maximum width and height by the number of rows and columns.

            // The maximum available size per row/col given the size available            
            var colMax = Math.floor(maxWidth / this.$cols);
            var rowMax = Math.floor(maxHeight / this.$rows);

            var isComponent = false;

            // Case 0: both the row and col size are manually set
            // Casd 1: only the row size is manually set
            // Case 2: only the col size is manually set
            // Case 3: nether the row nor col size is manually set

            if (this.$colWidth > 0 && this.$rowHeight > 0) {
                // Case 0: We size everything based on the settings, and return
                // the dimensions
                
                var cW = (this.$colWidth < colMax) ? this.$colWidth : colMax;
                var rH = (this.$rowHeight < rowMax) ? this.$rowHeight : rowMax;

                for (var i = 0; i < children.length; i++) {
                    if (!children[i]) {
                        continue;
                    }
                    isComponent = cc.ui.instanceOf(children[i], cc.ui.Component);
                    if (isComponent) {
                        children[i].doLayout(cW, rH);
                    }
                }                
                width = this.$cols * cW;
                height = this.$rows * rH;

            } else {

                // Case 1: We size everything based on the set row height and
                // max available column width
                if (this.$rowHeight > 0 && this.$rowHeight < rowMax) {
                    rowMax = this.$rowHeight;
                }
                // Case 2: We size everything based on the set column width and
                // max available row height
                if (this.$colWidth > 0 && this.$colWidth < colMax) {
                    colMax = this.$colWidth;
                }
                // Case 3: We find the largest cell that is not larger than the
                // maximums and we use that to calculate and return the
                // dimensions
                
                var cellWidth = 0;
                var cellHeight = 0;
                
                var childSize = null;
                for (var i = 0; i < children.length; i++) {
                    if (!children[i]) {
                        continue;
                    }
                    isComponent = cc.ui.instanceOf(children[i], cc.ui.Component);

                    childSize = 
                        (isComponent) ? children[i].doLayout(colMax, rowMax) : 
                            children[i].getContentSize();
                    if (childSize.width > cellWidth && childSize.width <= colMax) {
                        cellWidth = childSize.width;
                    }
                    if (childSize.height > cellHeight && childSize.height <= rowMax) {
                        cellHeight = childSize.height;
                    }
                }

                // Now we have to remember to observe the set values if they
                // have been set, as cellWidth/cellHeight now contain the
                // dimensions from the return values to the children.doLayout()
                if (this.$rowHeight > 0) {
                    cellHeight = this.$rowHeight;
                }
                if (this.$colWidth > 0) {
                    cellWidth = this.$colWidth;
                }

                width = this.$cols * cellWidth;
                height = this.$rows * cellHeight;
            }

            // Set the box's content size and internal bounding box to
            // be the size returned from layout. This may change later in
            // the stretchAndAlign call
            // NOTE: No need for 'else' statements here because the contentSize
            // is set to equal the prefSize (when it is not -1) by the base
            // class (Component) doLayout method.
            if (this.$prefSize.w == -1) {
                this.$ibounds.w = width;            
                this._contentSize.width += width;
            }
            if (this.$prefSize.h == -1) {
                this.$ibounds.h = height;
                this._contentSize.height += height;        
            }
            
            return { "width" : this._contentSize.width, "height" : this._contentSize.height };
                
        } catch (err) {
            cc.ui.logE("cc.ui.boxes", 
                       "GridBox.doLayout error: " + err);
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
     * <li>Following <i>doLayout()</i>, <i>stretchAndAlign()</i> assigns a 
     * final size to this Component. If different than the preferred 
     * <i>doLayout()</i> size, the <i>stretchAndAlign()</i> parameters of 
     * <i>Width</i> and <i>Height</i> represent final Component dimensions. The 
     * Component should finalize any pending layout tasks, such as child 
     * component alignment, within the context of those dimensions.</li>
     * </ul>
     * 
     * @param width Final width (in pixels) awarded to this Component by
     *              the layout subsystem
     * @param height Final height (in pixels) awarded to this Component by
     *               the layout subsystem
     */
    stretchAndAlign : function(width, height) {
        try {            

            cc.ui.logI("cc.ui.boxes", "GridBox.sAnda, old size: " + this._contentSize.width + ", " + this._contentSize.height);
            cc.ui.logI("cc.ui.boxes", "GridBox.sAnda, new size: " + width + ", " + height);

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

            // Now we know what our alloted size is, so calculate our 
            // row height and column width
            this.$colWidthC = Math.floor(width / this.$cols);
            this.$rowHeightC = Math.floor(height / this.$rows);
                    
            var index = 0;
            var loc = { "x" : 0, "y" : 0 };
            var calcWidth = 0;
            var calcHeight = 0;
            var childSize = null;
            var isComponent = false;
            var stretch = false;
            var align = null;

            for (var i = 0; i < this.$rows; i++) {
                for (var j = 0; j < this.$cols; j++) {
                    
                    index = (i * this.$cols) + j;
                                        
                    if (index == children.length) {
                        break;
                    }
                    if (!children[index]) {
                        continue;
                    }
                    isComponent = cc.ui.instanceOf(children[index], cc.ui.Component);
                    
                    // These are calculated each time through the
                    // loop because they are adjusted each time for
                    // the cell's alignment values
                    loc.y = this.$ibounds.y + height - (i * this.$rowHeightC);
                    loc.x = (j * this.$colWidthC) + this.$ibounds.x;

                    stretch = (isComponent) ?
                        children[index].shouldStretch() : false;
                        
                    if (stretch) {
                        // If the child in the cell should stretch, then we
                        // stretch it to fill the cell entirely
                        children[index].stretchAndAlign(this.$colWidthC, this.$rowHeightC);
                        loc.y -= this.$rowHeightC;
                    } else {
                        // Otherwise, we let it complete it's layout using its
                        // current size and then calculate where to align it
                        // within the space afforded the cell
                        childSize = children[index].getContentSize();
                        if (isComponent) {
                            children[index].stretchAndAlign(childSize.width,
                                                            childSize.height);
                        }
                        loc.y -= childSize.height;
                        // Then calculate where to align the child within the
                        // cell
                        calcWidth = this.$colWidthC - childSize.width;
                        calcHeight = this.$rowHeightC - childSize.height;
                        
                        if (calcWidth > 0) {
                            // Default to LEFT alignment for legacy non-ui components
                            align = (isComponent) ? 
                                children[index].getHorizAlign() : cc.ui.Constants.ALGN_LEFT;

                            switch (align) {
                                case cc.ui.Constants.ALGN_LEFT:
                                    break;
                                case cc.ui.Constants.ALGN_CENTER:
                                    loc.x += Math.floor(calcWidth / 2);
                                    break;
                                case cc.ui.Constants.ALGN_RIGHT:
                                    loc.x += calcWidth;
                                    break;
                            }
                        }
                        if (calcHeight > 0) {
                            // Default to TOP for legacy non-ui components
                            align = (isComponent) ?
                                children[index].getVertAlign() : cc.ui.Constants.ALGN_TOP;                               

                            switch (align) {
                                case cc.ui.Constants.ALGN_TOP:
                                     break;
                                case cc.ui.Constants.ALGN_MIDDLE:
                                    loc.y -= Math.floor(calcHeight / 2);
                                    break;
                                case cc.ui.Constants.ALGN_BOTTOM:
                                    loc.y -= calcHeight;
                                    break;
                            }
                        }                        
                    }    
                    cc.ui.logI("cc.ui.boxes", "Setting child[" + i + "] position: " + loc.x + ", " + loc.y);
                    children[index].setPosition(loc.x, loc.y);                
                                        
                } // end column loop
            } // end row loop
            
        } catch (err) {
            cc.ui.logE("cc.ui.boxes", 
                       "GridBox.stretchAndAlign error: " + err);
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
        
        var inLayout = 
            (component != null && this.isAncestor(component));
        var children = this._children;
        
        if (inLayout) {
            // Find the row and column the current focus is in
            var index = -1;
            for (var i = 0; i < children.length; i++) {
                if (!children[i] || !cc.ui.instanceOf(children[index], cc.ui.Component)) {
                    continue;
                }
                if (component === children[i] || 
                        children[i].isAncestor(component)) {                    
                    index = i;
                    break;
                }
            }
            
            var row = Math.floor(index / this.$cols);
            var col = index - (row * this.$cols);
            
            // Based on the direction of traversal, find the next component
            // in the row or column, or if it wraps, or if we should return null
            switch (dir) {
                case cc.ui.Constants.TRVS_RIGHT:
                    // Loop through the remainder of the row, looking for
                    // a focusable item
                    newOwner = this.__scanRowForward(row, col + 1, this.$cols - 1, component, dir);
                    if (newOwner == null && this.wrapTraverse[dir]) {
                        newOwner = this.__scanRowForward(row, 0, col - 1, component, dir);
                    }
                    break;
                case cc.ui.Constants.TRVS_LEFT:
                    // Loop through the beginning of the row, looking for
                    // a focusable item
                    newOwner = this.__scanRowBackward(row, col - 1, 0, component, dir);
                    if (newOwner == null && this.wrapTraverse[dir]) {
                        newOwner = this.__scanRowBackward(row, this.$cols - 1, col + 1, component, dir);
                    }
                    break;
                case cc.ui.Constants.TRVS_UP:
                    // Loop through the beginning of the column, looking for
                    // a focusable item
                    newOwner = this.__scanColumnUp(col, row - 1, 0, component, dir);
                    if (newOwner == null && this.wrapTraverse[dir]) {
                        newOwner = this.__scanColumnUp(col, this.$rows - 1, row + 1, component, dir);
                    }
                    break;
                case cc.ui.Constants.TRVS_DOWN:
                    // Loop through the remainder of the column, looking for
                    // a focusable item
                    newOwner = this.__scanColumnDown(col, row + 1, this.$rows - 1, component, dir);
                    if (newOwner == null && this.wrapTraverse[dir]) {
                        newOwner = this.__scanColumnDown(col, 0, row - 1, component, dir);
                    }
                    break;
                case cc.ui.Constants.TRVS_FWD:
                    // Loop through the remainder of the grid line by line, 
                    // looking for a focusable item
                    newOwner = this.__scanForward(index + 1, children.length - 1, component, dir);
                    if (newOwner == null && this.wrapTraverse[dir]) {
                        newOwner = this.__scanForward(0, index - 1, component, dir);
                    }
                    break;
                case mobiJAX.ui.Constants.TRVS_BKWD:
                    // Loop through the beginning of the grid line by line,
                    // looking for a focusable item
                    newOwner = this.__scanBackward(index - 1, 0, component, dir);
                    if (newOwner == null && this.wrapTraverse[dir]) {
                        newOwner = this.__scanBackward(children.length - 1, index + 1, component, dir);
                    }
                    break;
            }
            
        } else {
            
            // Traversal is coming into this grid from the outside
            
            if (component != null) {
                // Find the best matching row/col compared to the currently
                // focused component, rather than just searching forward/backward
                var p = component.getLocationOnScreen();
                var p2 = this.getLocationOnScreen();
                
                var row = 0;
                var col = 0;
                
                var xDelta = -1;
                var yDelta = -1;
                
                var z = 0;                                
                
                for (var i = 0; i < this.$rows; i++) {
                    z = Math.abs(p.y - (p2.y + (i * this.$rowHeightC)));
                    if (yDelta == -1 || z < yDelta) {
                        row = i;
                        yDelta = z;
                    }
                }
                for (var j = 0; j < this.$cols; j++) {
                    z = Math.abs(p.x - (p2.x + (j * this.$colWidthC)));
                    if (xDelta == -1 || z < xDelta) {
                        col = j;
                        xDelta = z;
                    }
                }
                
                // Now we have the best matching row and column given the
                // previous component's location on the screen compared with
                // this container. Depending on the traversal direction, we
                // search either that row or column first
                
                switch (dir) {
                    case cc.ui.Constants.TRVS_DOWN:
                        newOwner = this.__scanColumnDown(col, 0, this.$rows - 1, component, dir);
                        break;
                    case cc.ui.Constants.TRVS_UP:
                        newOwner = this.__scanColumnUp(col, this.$rows - 1, 0, component, dir);
                        break;
                    case cc.ui.Constants.TRVS_LEFT:
                        newOwner = this.__scanRowBackward(row, this.$cols - 1, 0, component, dir);
                        break;
                    case cc.ui.Constants.TRVS_RIGHT:
                        newOwner = this.__scanRowForward(row, 0, this.$cols - 1, component, dir);
                        break;
                }
                
                // If the direction is forward or backward, it will fall thru
                // and be caught in the next 'if' statement                
            }
            
            if (newOwner == null) {
                // If its still null, do one final check by just scanning
                // forward or reverse, depending on the direction
                switch (dir) {
                    case cc.ui.Constants.TRVS_DOWN:
                    case cc.ui.Constants.TRVS_RIGHT:
                    case cc.ui.Constants.TRVS_FWD:
                        newOwner = this.__scanForward(0, children.length - 1, component, dir);
                        break;
                    case cc.ui.Constants.TRVS_UP:
                    case cc.ui.Constants.TRVS_LEFT:
                    case cc.ui.Constants.TRVS_BKWD:
                        newOwner = this.__scanBackward(children.length - 1, 0, component, dir);
                        break;
                }
            }
        }
        return newOwner;
    },    
    
    __scanRowForward : function(row, startCol, endCol, comp, dir) {
        if (startCol == this.$cols) {
            return null;
        }
        
        var start = (row * this.$cols) + startCol;
        var end = (row * this.$cols) + endCol;
                
        var children = this._children;
        for (var i = start; i <= end; i++) {
            if (!children[i] || 
                !children[i].isVisible() || 
                    !cc.ui.instanceOf(children[index], cc.ui.Component)) 
            {
                    continue;
            }
            if (children[i].isFocusable()) {
                return children[i];
            } else if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                var c = children[i].getNextComponent(comp, dir);
                if (c != null) {
                    return c;
                }
            }
        }
        return null;
    },
    
    __scanRowBackward : function(row, startCol, endCol, comp, dir) {
        if (startCol == -1) {
            return null;
        }
        
        var start = (row * this.$cols) + startCol;
        var end = (row * this.$cols) + endCol;
        
        var children = this._children;
        for (var i = start; i >= end; i--) {
            if (!children[i] || 
                !children[i].isVisible() || 
                    !cc.ui.instanceOf(children[index], cc.ui.Component)) 
            {
                    continue;
            }
            if (children[i].isFocusable()) {
                return children[i];
            } else if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                var c = children[i].getNextComponent(comp, dir);
                if (c != null) {
                    return c;
                }
            }
        }
        return null;
    },
    
    __scanColumnDown : function(col, startRow, endRow, comp, dir) {
        if (startRow == this.$rows) {
            return null;
        }
        
        var start = (startRow * this.$cols) + col;
        var end = (endRow * this.$cols) + col;
        
        var children = this._children;
        for (var i = start; i <= end; i += this.$cols) {
            if (!children[i] || 
                !children[i].isVisible() || 
                    !cc.ui.instanceOf(children[index], cc.ui.Component)) 
            {
                continue;
            }
            if (children[i].isFocusable()) {
                return children[i];
            } else if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                var c = children[i].getNextComponent(comp, dir);
                if (c != null) {
                    return c;
                }
            }
        }
        return null;
    },

    __scanColumnUp : function(col, startRow, endRow, comp, dir) {
        if (startRow == -1) {
            return null;
        }
        
        var start = (startRow * this.$cols) + col;
        var end = (endRow * this.$cols) + col;
        
        var children = this._children;
        for (var i = start; i >= end; i -= this.$cols) {
            if (!children[i] || 
                    !children[i].isVisible() || 
                        !cc.ui.instanceOf(children[index], cc.ui.Component)) 
            {
                    continue;
            }
            if (children[i].isFocusable()) {
                return children[i];
            } else if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                var c = children[i].getNextComponent(comp, dir);
                if (c != null) {
                    return c;
                }
            }
        }
        return null;
    },
    
    __scanForward : function(start, end, comp, dir) {
        if (start == (this.$rows * this.$cols)) {
            return null;
        }
        
        var children = this._children;
        for (var i = start; i <= end; i++) {
            if (!children[i] || 
                !children[i].isVisible() || 
                    !cc.ui.instanceOf(children[index], cc.ui.Component)) 
            {
                continue;
            }
            if (children[i].isFocusable()) {
                return children[i];
            } else if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                var c = children[i].getNextComponent(comp, dir);
                if (c != null) {
                    return c;
                }
            }
        }
        return null;
    },
    
    __scanBackward : function(start, end, comp, dir) {
        if (start == -1) {
            return null;
        }
        
        var children = this._children;
        for (var i = start; i >= end; i--) {
            if (!children[i] || 
                !children[i].isVisible() || 
                    !cc.ui.instanceOf(children[index], cc.ui.Component)) 
            {
                continue;
            }
            if (children[i].isFocusable()) {
                return children[i];
            } else if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                var c = children[i].getNextComponent(comp, dir);
                if (c != null) {
                    return c;
                }
            }
        }
        return null;
    },
    
});
