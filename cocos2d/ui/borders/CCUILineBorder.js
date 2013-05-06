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

// create the subpackage if necessary
cc.ui.borders = cc.ui.borders || {};

/**
 * LineBorder allows a Component to have a border which widths are the same
 * on all four sides of the Component.
 */
cc.ui.borders.LineBorder = cc.ui.Border.extend({
    
    /** 
     * The fill color for this line border. TODO: specify type info
     */
    $color : null,

    /**
     * Creates an instance  of the LineBorder class. 
     * 
     * @param width (Optional) Object containing the width of each side of
     *              the LineBorder&#58;
     * *            <pre>
     *              &#123; t &#58; 1, l &#58; 1, b &#58; 1, r &#58; 1 &#125; 
     *              </pre>
     *              for a 1-pixel border on all sides.<br />
     *              Default is a uniform 3 pixel border.
     * @param color (Optional) Hex color for the border&#58; 
     *              <pre>
     *              &#123; 0xTTRRGGBB  &#125; 
     *              </pre>
     *              where TT is opacity; RR, red; GG, green; BB, blue.
     */
    ctor : function(width, color) {
        this._super();

        this.setWidths(width);
        // TODO: type check color
        this.$color = (color != null) ? color : cc.Color4B(128,128,128,255);
    },
        
    /**
     * Overrides <a href="./mobiJAX.ui.Border.html#a_paint">
     * mobiJAX.ui.Border.paint()</a> method to paint
     * a LineBorder of given coordinates (as <i>x/y</i> and <i>w/h</i>) 
     * to the given Surface. 
     * 
     * @param x X start point of the container (top left, inside the margin)
     * @param y Y start point of the container (top left, inside the margin)
     * @param w Width of container, used to determine the width of the region 
     *          circumscribed by the border
     * @param h Height of container, used to determine the height of the region 
     *          circumscribed by the border
     * @param context the render context on which to draw the border
     */
    draw : function(x, y, w, h, context) {
        try {

            context.fillStyle = "rgba(" + this.$color.r + "," + this.$color.g + ","
                                        + this.$color.b + "," + this.$color.a + ")";

            var x1y1, x2y2, x1y2, x2y1;

            // TODO : is it faster to draw with a stroke or fill a rect?

            // Top Line
            if (this.$widths.t > 0) {
                x1y1 = cc.Vertex2(x, y + h - this.$widths.t);
                x1y2 = cc.Vertex2(x, y + h);
                x2y2 = cc.Vertex2(x + w, y + h);
                x2y1 = cc.Vertex2(x + w, y + h - this.$widths.t);

                cc.drawingUtil.drawPoly([ x1y1, x1y2, x2y2, x2y1 ], 4, false, true);                
            }

            // Bottom Line
            if (this.$widths.b > 0) {
                x1y1 = cc.Vertex2(x, y);
                x1y2 = cc.Vertex2(x, y + this.$widths.b);
                x2y2 = cc.Vertex2(x + w, y + this.$widths.b);
                x2y1 = cc.Vertex2(x + w, y);

                cc.drawingUtil.drawPoly([ x1y1, x1y2, x2y2, x2y1 ], 4, false, true);
            }

            // Left Line
            if (this.$widths.l > 0) {
                x1y1 = cc.Vertex2(x, y + this.$widths.b);
                x1y2 = cc.Vertex2(x, y + h - this.$widths.t);
                x2y2 = cc.Vertex2(x + this.$widths.l, y + h - this.$widths.t);
                x2y1 = cc.Vertex2(x + this.$widths.l, y + this.$widths.b);

                cc.drawingUtil.drawPoly([ x1y1, x1y2, x2y2, x2y1 ], 4, false, true);
            }

            // Right Line
            if (this.$widths.r > 0) {
                x1y1 = cc.Vertex2(x + w - this.$widths.r, y + this.$widths.b);
                x1y2 = cc.Vertex2(x + w - this.$widths.r, y + h - this.$widths.t);
                x2y2 = cc.Vertex2(x + w, y + h - this.$widths.t);
                x2y1 = cc.Vertex2(x + w, y + this.$widths.b);

                cc.drawingUtil.drawPoly([ x1y1, x1y2, x2y2, x2y1 ], 4, false, true);
            }

        } catch (err) {
            cc.ui.LogE("cc.ui.borders.LineBorder", "Error drawing: " + err);
        }
    },

});
