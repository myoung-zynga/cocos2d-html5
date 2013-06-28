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
cc.ui.Background = cc.Class.extend({

	/**
	 * Background constructor
	 */
    ctor : function() 
    {
        
    },
    
    /**
     * Paints this Background to the specified <i>surface</i>, using the given 
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
     * therefore, this Background must properly render itself within the given 
     * bounding box, providing any necessary clipping.
     * 
     * @param x the x coordinate of the outer bounding box of the Background
     * @param y the y coordinate of the outer bounding box of the Background
     * @param w the outside width of the outer bounding box of the Background
     * @param h the outside height of the outer bounding box of the Background
     * @param pressed true if the component for this Background is currently in a
                      pressed state
     * @param context the render context on which to draw the Background
     */     
    draw : function(x, y, w, h, pressed, context)
    {
    	// Do stuff
    	
    	if (this.$hasImage)
    	{
    		drawImageBackground();
    	}
    	else
    	{
    		drawColorBackground();
    	}
    },
    
    drawColorBackground : function(x, y, w, h, pressed, context)
    {
    	
    },
    
    drawImageBackground : function(x, y, w, h, pressed, context)
    {
    	
    },

});
