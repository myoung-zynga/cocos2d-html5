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
    $images : null,
    $spriteBackground : null,
	
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
        this.$images = new Array();
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
				if (this.$images[cc.ui.Constants.IMAGE_BG] != null )
                {
				    this.drawImageBackground(x, y, w, h, context);
				}
				else
				{
				    this.drawColorBackground(x, y, w, h, context);
				}
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
     * Get the image value of this Component for the given image type, 
     * if one was set. If no image has been set for a given image type, 
     * this method will return null.
     * 
     * Acceptable values for the image type parameter are defined in the
     * cc.ui.Constants class and include: 
     * <ul>
     * <li>IMAGE_BG</li>
     * <li>IMAGE_BG_HL</li>
     * </ul>
     *
     * @param imageType the constant image identifier as defined in
     *                  cc.ui.Constants.
     * @return the image of this Component for the given image type, or null
     *         if no value has been set.
     */ 
    getImage : function(imageType) 
    {
        return (this.$images[imageType]) ? this.$images[imageType] : null;
    },

	/**
     * Set the image value of this Component for the given image type. 
     * 
     * Acceptable values for the image type parameter are defined in the
     * cc.ui.Constants class and include: 
     * <ul>
     * <li>IMAGE_BG</li>
     * <li>IMAGE_BG_HL</li>
     * </ul>
     *
     * Currently, the pieces and extension parameters are not used.
     * 
     * @param imageType the constant image identifier as defined in
     *                  cc.ui.Constants.
     * @param image a string of an image file on disk
     * @param pieces this parameter is the number of pieces comprising the
     *               image, for example for 3 or 9 piece background images.
     *               This parameter is only used when the image parameter is
     *               a string and the image must be loaded from disk.
     * @param ext the optional file extension of the image (".png" by default).
     */ 
    setImage : function(imageType, image, pieces, ext) 
    {
        if (imageType >= cc.ui.Constants.IMAGE_BG &&
                imageType <= cc.ui.Constants.IMAGE_FG_PRESSED) 
        {                
            this.$images[imageType] = this.loadImage(imageType, image);
            this.$spriteBackground = cc.Sprite.create(image);
            
            if (imageType <= cc.ui.Constants.IMAGE_BG_PRESSED) 
            {
                if (image != null) 
                {
                    this.$hasBackground = true;
                } 
                else 
                {
                    if (this._colors[cc.ui.Constants.COLOR_BG] != null
                            || this.$colors[cc.ui.Constants.COLOR_BG_HL] != null
                            || this.$colors[cc.ui.Constants.COLOR_BG_PRESSED] != null
                            || this.$images[cc.ui.Constants.IMAGE_BG] != null
                            || this.$images[cc.ui.Constants.IMAGE_BG_HL] != null
                            || this.$images[cc.ui.Constants.IMAGE_BG_PRESSED] != null ) {
                        this.$hasBackground = true;
                    } 
                    else 
                    {
                        this.$hasBackground = false;
                    }
                }
            }            
        }
    },
    
    /**
     * Checks if an image needs to be loaded, and if so performs the operation
     * to load the image passed in.
     * 
     * @param type This is passed on from setImage, and is the constant defined
     * 				in cc.ui.Constants where the image should be placed after
     *				it has finished loading
     * @param filename The file name of the image (with extension) that is to
     *					be loaded in
     * 
     * @return The texture object, if there is one already loaded for the given
     * 			filename. Otherwise, returns null.
     */ 
    loadImage : function (type, filename)
    {
    	var texture = cc.TextureCache.getInstance().textureForKey(cc.FileUtils.getInstance().fullPathForFilename(filename));
    	var that = this;
        if (!texture)
        {
            this._visible = false;
            var loadImg = new Image();
            loadImg.addEventListener("load", function () 
            {
                cc.TextureCache.getInstance().cacheImage(filename, loadImg);
                that.setImage(type, filename);
            });
            loadImg.addEventListener("error", function () 
            {
                cc.log("load failure:" + filename);
            });
            loadImg.src = filename;
            return null;
        } 
        else 
        {
            return texture;
        }
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
    
    /**
     * Called by draw, this method draws the background 
     * as an image based on the current state of the
     * component which owns this Background. Currently, the
     * background is drawn using a sprite, and does not 
     * support tiling.
     * 
     * @param x The x-coordinate to start the background from
     * @param y The y-coordinate to start the background from
     * @param w The width to draw the background with
     * @param h The height to draw the background with
     * @param ctx The screen to draw on
     */
    drawImageBackground : function(x, y, w, h, ctx)
    {
        var context = ctx || cc.renderContext;

        var bgImage = null;
        if (this.$ownsFocus) 
        {
            bgImage = this.$images[cc.ui.Constants.IMAGE_BG_HL];
            if (bgImage == null) 
            {
                bgImage = this.$images[cc.ui.Constants.IMAGE_BG];
            }
        } 
        else 
        {
            bgImage = this.$images[cc.ui.Constants.IMAGE_BG];
        }
        
        if (this.$images[cc.ui.Constants.IMAGE_BG_PRESSED]) 
        {
            bgImage = this.$images[cc.ui.Constants.IMAGE_BG_PRESSED];
        }
        
        if (bgImage != null) 
        {
        	// Setup the sprite background to fit inside the background's rect
            this.$spriteBackground._rect.origin = cc.p(x, y);
            var sw = this.$spriteBackground._contentSize.width;
            var sh = this.$spriteBackground._contentSize.height;
            
            // Only constrain the image if it is smaller than the space given
            if (sw > w)
            {
            	sw = w;
            }
            if (sh > h)
            {
            	sh = h;
            }
            
            this.$spriteBackground._rect.size = cc.size(sw, sh);
            
            // Draw the sprite to the screen directly
            this.$spriteBackground.draw(context);
            
            /* TODO use context.draw instead of the spriteBackground
            context.drawImage(bgImage,
                    this._position.x, this._position.y,
                    this._contentSize.w, this._position.h,
                    0, 0,
                    this._contentSize.w, this._contentSize.h);
            */
        }	
    },
    
    
});

