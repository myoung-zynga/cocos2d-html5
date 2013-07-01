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
 * The Background class does stuff.
 */
cc.ui.Background = cc.Node.extend(
{
	$hasBackground : false,
	$ownsFocus : false,
	$pressed : false,
	$colors : null,
	
	/**
	 * Creates the Background. Sets up the arrays to hold the 
	 * values for the colors and images saved in this background.
	 */
    ctor : function() 
    {
    	this._super();
    	
    	// Setup colors
        this.$colors = new Array();
        this.$colors[cc.ui.Constants.COLOR_FG] = "0xff000000";
    },
    
    /**
     * Paints this Background to the specified <i>surface</i>, using the  
     * coordinates (<i>x</i>, <i>y</i>, <i>w</i>, <i>h</i>), 
     * as the outer bounding box. The outer bounding box is specified by
     * the coordinates in the following way: 
     * <ul>
     * <li>Lower left: x, y</li>
     * <li>Lower right: x + w, y</li>
     * <li>Upper left: x, y + h</li>
     * <li>Upper right: x + w, y + h</li>
     * </ul>
     * <br>
     * These coordinates, (<i>x</i>, <i>y</i>, <i>w</i>, <i>h</i>), are 
     * determined based on the position and content size of the internal
     * bounds of the component which owns this background.
     * <br> <br>
     * If there is an image, then that image is drawn. If there is no image,
     * then the correct color is drawn instead.
     *
     * @param context the render context on which to draw the Background
     */     
    draw : function(context)
    {
    	var x = 0, y = 0; // The position is set in stretch and align
		var w = this._contentSize.width;
		var h = this._contentSize.height;
    	
    	// If there is an image, draw the image, otherwise draw the color
    	if (this.$hasBackground)
    	{
    		try
    		{
				// if (image != null)
				// drawImageBackground(x, y, w, h, context);
			
				// else
				this.drawColorBackground(x, y, w, h, context);
    		}
    		catch (err)
    		{
    			cc.ui.logE("cc.ui.Background", "Draw Error: " + err);
    		}
    	}
    },
    
    /**
     * Sets the parameters <i>ownsFocus</i> and <i>pressed</i> which are
     * bubbled down from the component which owns this background. 
     * They are used in determining which image or color is pulled from
     * the array based on normal, highlighted, or pressed.
     * 
     * @param ownsFocus The ownsFocus property from the Component
     * @param pressed The pressed property from the Component
     */
	setFocusAndPressed : function(ownsFocus, pressed)
	{
		this.$ownsFocus = ownsFocus;
		this.$pressed = pressed;
	},
    
    /**
     * Get the color value of this Component for the given color type, 
     * if one was set. If no color has been set for a given color type, 
     * this method will return -1. Color values are described by their
     * hexadecimal ARGB string representation, such as "0xFF000000" for
     * opaque black.
     * 
     * Acceptable values for the color type parameter are defined in the
     * cc.ui.Constants class and include: 
     * <ul>
     * <li>COLOR_BG</li>
     * <li>COLOR_BG_HL</li>
     * <li>COLOR_FG</li>
     * <li>COLOR_FG_HL</li>
     * <li>COLOR_FG_SHD</li>
     * <li>COLOR_FG_SHD_HL</li>
     * </ul>
     *
     * @param colorType the constant color identifier as defined in
     *                  cc.ui.Constants.
     * @return the color of this Component for the given color type as a 
     *         cc.Color4B, or null if no value has been set.
     */ 
    getColor : function(colorType) 
    {
        return (this.$colors[colorType]) ? this.$colors[colorType] : null;
    },
    
    /**
     * Set the color value of this Component for the given color type. 
     * Color values are described by their hexadecimal ARGB string 
     * representation, such as "0xFF000000" for opaque black.
     * 
     * Acceptable values for the color type parameter are defined in the
     * cc.ui.Constants class and include: 
     * <ul>
     * <li>COLOR_BG</li>
     * <li>COLOR_BG_HL</li>
     * <li>COLOR_FG</li>
     * <li>COLOR_FG_HL</li>
     * <li>COLOR_FG_SHD</li>
     * <li>COLOR_FG_SHD_HL</li>
     * </ul>
     *
     * This method does not automatically cause a repaint, so if a
     * repaint is needed after setting the desired color, the application
     * should call the Component's repaint() method.
     * 
     * @param colorType the constant color identifier as defined in
     *                  cc.ui.Constants.
     * @param color the cc.Color4B color value to use
     */ 
    setColor : function(colorType, color) 
    {
        if (colorType >= cc.ui.Constants.COLOR_BG &&
            colorType <= cc.ui.Constants.COLOR_FG_SHD_HL) 
        {
            if (cc.ui.instanceOf(color, cc.Color4B)) 
            {
                this.$colors[colorType] = color;
                
                if (colorType <= cc.ui.Constants.COLOR_BG_PRESSED) 
                {
                    if (color != null) 
                    {
                        this.$hasBackground = true;
                    } 
                    else 
                    {
                    	// Check if there is another background active
                        if (this.$colors[cc.ui.Constants.COLOR_BG] != null
                            || this.$colors[cc.ui.Constants.COLOR_BG_HL] != null
                            || this.$colors[cc.ui.Constants.COLOR_BG_PRESSED] != null
                            || this.$images[cc.ui.Constants.IMAGE_BG] != null
                            || this.$images[cc.ui.Constants.IMAGE_BG_HL] != null
                            || this.$images[cc.ui.Constants.IMAGE_BG_PRESSED] != null ) 
                        {
                            this.$hasBackground = true;
                        } 
                        else 
                        {
                            this.$hasBackground = false;
                        }
                    }
                }
            } 
            else 
            {
                cc.ui.logW("cc.ui.Background", 
                           "Invalid color param sent to setColor: " + color);
            }
        } 
        else 
        {
            cc.ui.logW("cc.ui.Background",
                       "Invalid colorType param sent to setColor: " + colorType);
        }
    },
    
    /**
     * Called by draw, this method draws the background 
     * as a solid color based on the current state of the
     * component which owns this Background.
     * 
     * @param x The x-coordinate to start the background from
     * @param y The y-coordinate to start the background from
     * @param w The width to draw the background with
     * @param h The height to draw the background with
     * @param ctx The screen to draw on
     */
    drawColorBackground : function(x, y, w, h, ctx)
    {
    	var context = ctx || cc.renderContext;
    	
        var colorIndex = cc.ui.Constants.COLOR_BG;
        
        if (this.$ownsFocus) 
        {
        	colorIndex = cc.ui.Constants.COLOR_BG_HL;

            if (this.$colors[colorIndex] == null) 
            {
                colorIndex = cc.ui.Constants.COLOR_BG;
            }
        }
        else if (this.$pressed && this.$colors[cc.ui.Constants.COLOR_BG_PRESSED]) 
        {
            colorIndex = cc.ui.Constants.COLOR_BG_PRESSED;
        }
        
        // Draw the color, if it is available
        var bgColor = this.$colors[colorIndex];
        
        if (bgColor != null) 
        {
            context.fillStyle = "rgba(" + bgColor.r + "," + bgColor.g + ","
                                        + bgColor.b + "," + bgColor.a + ")";

            var x1y1 = cc.Vertex2(x, y);
            var x1y2 = cc.Vertex2(x, y + h);
            var x2y2 = cc.Vertex2(x + w, y + h);
            var x2y1 = cc.Vertex2(x + w, y);
            
            cc.drawingUtil.drawPoly([ x1y1, x1y2, x2y2, x2y1 ], 4, false, true);
        }
        else
        {
        	cc.ui.logW("cc.ui.Background", "Tried to draw background with a null color");
        }
    },
    
    drawImageBackground : function(x, y, w, h, ctx)
    {

    },

});