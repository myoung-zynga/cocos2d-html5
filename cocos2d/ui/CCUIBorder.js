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
 * This is a base class from which other Border classes can be derived, such as,
 * <a href="./cc.ui.borders.LineBorder.html">cc.ui.borders.LineBorder</a>
 * and <a href="./cc.ui.borders.BevelBorder.html">cc.ui.borders.BevelBorder</a>.
 * 
 * Each Border object has width and color properties. 
 * The width consists of four values (one per each edge).
 */
cc.ui.Border = cc.Class.extend({

    /**
     * The <i>width </i> object contains the widths (in pixels) 
     * of all four edges of this Border; for example, 
     * <i>&#123 t &#58; 1, l &#58; 1, b &#58; 1, r &#58; 1 &#125</i> 
     * specifies a 1-pixel width for each edge of this Border and
     * t, l, b, and r represent top, left, bottom and right edges.
     * The width object should not be accessed directly, use 
     * <a href="#a_getWidth">getWidth()</a> and 
     * <a href="#a_setWidth">setWidth()</a> instead.
     */
    $widths : null,

    ctor : function() {
        this.$widths = { "t" : 0, "l" : 0, "b" : 0, "r" : 0 };
    },
    
    /**
     * Returns the current width (in pixels) of all four edges of this Border. 
     * Values can be referenced by
     * widths.top, widths.left, widths.bottom, and widths.right.
     * 
     * @return the widths of each edge of this Border as an Object with four
               properties (top, left, bottom, right)
     */
    getWidths : function() {
        return { "top"    : this.$widths.t, 
                 "left"   : this.$widths.l, 
                 "bottom" : this.$widths.b, 
                 "right"  : this.$widths.r };
    },
    
    /**
     * Set the widths of this Border. The argument 
     * <i>width</i> should be either a number or an object with a width
     * value per edge &#58
     * <pre>
     * &#123; t : #, l : #, b : #, r : # &#125;
     * </pre>
     * where <i>t, l, b,</i> and <i>r</i> represent top, left, bottom, and right 
     * edges, and widths are expressed in pixels. 
     * If a single number is passed in as an argument, all edges are set to 
     * the same width. In case of an invalid argument, the width of all edges
     * is set to 0.
     * 
     * @param top new width for the top edge of this Border, 
     * expressed separately for each edge (in pixels), in the format specified. 
     */
    setWidths : function(top, left, bottom, right) {
        if (typeof top == 'number' && typeof left == 'number' && 
              typeof bottom == 'number' && typeof right == 'number') 
        {
            this.$widths.t = top;
            this.$widths.l = left;
            this.$widths.b = bottom;
            this.$widths.r = right;
        } else if (typeof top == 'number') {
            this.$widths.t = this.$widths.l = this.$widths.b = this.$widths.r = top;
        } else if (typeof top === 'object') {
            this.$widths.t = top.t;
            this.$widths.l = top.l;
            this.$widths.b = top.b;
            this.$widths.r = top.r;
        } else {
            this.$widths.t = this.$widths.l = this.$widths.b = this.$widths.r = 0;
            cc.ui.logE("cc.ui",
                       "Border.setWidths: Error setting Border widths: " +
                       "All widths have been set to 0.");
        }

        // Be careful that no widths were set to a negative value
        if (this.$widths.t < 0) this.$widths.t = 0;
        if (this.$widths.l < 0) this.$widths.l = 0;
        if (this.$widths.b < 0) this.$widths.b = 0;
        if (this.$widths.r < 0) this.$widths.r = 0;
    },
    
    /**
     * Paints this Border to the specified <i>surface</i>, using the given 
     * coordinates (<i>x</i>, <i>y</i>, <i>w</i>, <i>h</i>) 
     * as the outer bounding box. The outer bounding box is specified by
     * the coordinates in the following way: 
     * <ul>
     * <li>Lower left: x, y</li>
     * <li>Lower right: x + w, y</li>
     * <li>Upper left: x, y + h</li>
     * <li>Upper right: x + w, y + h</li>
     * </ul>
     * There is no clip in place when this method is called; 
     * therefore, this Border must properly render itself within the given 
     * bounding box, providing any necessary clipping.
     * 
     * @param x the x coordinate of the outer bounding box of the Border
     * @param y the y coordinate of the outer bounding box of the Border
     * @param w the outside width of the outer bounding box of the Border
     * @param h the outside height of the outer bounding box of the Border
     * @param pressed true if the component for this border is currently in a
                      pressed state
     * @param context the render context on which to draw the Border
     */     
    draw : function(x, y, w, h, pressed, context) {
    },

});

