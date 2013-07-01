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
 * The NodeBox class is a wrapper container for Legacy CC Nodes. A Legacy
 * CC Node is defined here as any non-Component node. NodeBox accepts a
 * single Legacy CC Node object and displays it based on its content size.
 * <br /><br />
 * Its methods provide the following functionality&#58;
 * <ul>
 * <li><i>To create a new instance of the NodeBox class</i>, use 
 * <a href="#NodeBox">NodeBox(legacyNode)</a>.</li>
 * <li><i>To return the dimensions of the bounding box that fits the Legacy CC
 * child node of this NodeBox,</i> call <a href="#doLayout">doLayout()
 * </a>.</li>
 * <li><i>To align the legacy node in this Component,</i> use 
 * <a href="#stretchAndAlign">stretchAndAlign()</a>.</li>
 * <li><i>To draw the contents of this Component to a given context,
 * </i> use <a href="#drawContent">drawContent()</a>.</li>
 * </ul>
 */
cc.ui.boxes.NodeBox = cc.ui.Box.extend (
{
    /**
     * The <a name="NodeBox">NodeBox()</a> method creates a new instance of the 
     * NodeBox (legacy node support) class, which contains a single legacy node
     * to display.
     */
    ctor : function(legacyNode) 
    {
        this._super();
        
        // Check if the node is a valid legacy node	
        // If so, add it to the children of this box
        if (legacyNode)
        {
        	var isComponent = cc.ui.instanceOf(legacyNode, cc.ui.Component);
        	
        	if (isComponent)
        	{
        		cc.ui.logW("cc.ui.boxes", "NodeBox constructor received a non-legacy node");
        	}
        	else
        	{
        		this.addChild(legacyNode)
        	}
        }
    },

    /**
     * The <a name="doLayout">doLayout()</a> method returns the total Width 
     * and Height required by the child component of this Container, 
     * based on the Content Size of the Legacy CC Node, with the given 
     * <i>MaxWidth</i> and <i>MaxHeight</i> (from the Container's 
     * parent and the layout policy) as limits.
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
    doLayout : function(maxWidth, maxHeight) 
    {
        try 
        {
            this._super(maxWidth, maxHeight);

            // Remove margins, padding and border from overall size dimensions
            maxWidth -= (this.$margin.l + this.$margin.r + this.$padding.l + this.$padding.r);
            maxHeight -= (this.$margin.t + this.$margin.b + this.$padding.t + this.$padding.b);
            if (this.$border != null) {
                var bw = this.$border.getWidths();
                maxWidth -= (bw.left + bw.right);
                maxHeight -= (bw.top + bw.bottom);
            }

            cc.ui.logI("cc.ui.boxes", "NodeBox.doLayout max size is: " + maxWidth + ", " + maxHeight);
            
            // Check to ensure there is no more than one child
            var maxChildren = this.$hasBG ? 2 : 1;
            if (!this._children || this._children.length > maxChildren)
            {
            	// Something bad happened
            	cc.ui.logE("cc.ui.boxes", "NodeBox may only have one or no children");
            	return;
            }
            
            var child = this.getChildren()[0];
            
            var totalWidth = 0;
            var totalHeight = 0;
            
            var childSize = null;
            var prefSize = null;
            
            var tag = null;

			
			
			tag = child.getTag();
			cc.ui.logI("NodeBox.dolayout: " + tag);
			
			prefSize = child.getContentSize();

			// If the child has a preferred size set, we use it, otherwise
			// we lay it out with the max space currently available to it
			// and let it tell us back what size it wants to be
			if (prefSize.width == -1) 
			{
				prefSize.width = maxWidth;
			}
			if (prefSize.height == -1) 
			{
				prefSize.height = totalHeight;
			}
			
			cc.ui.logI("cc.ui", "NodeBox child prefsize is: " + prefSize.width + ", " + prefSize.height);

			// Since the child is a legacy node, the size is equal to the pref size
			childSize = prefSize;

			cc.ui.logI("cc.ui", "NodeBox childsize is: " + childSize.width + ", " + childSize.height);

			// Locate the child within the container
			child.setPosition(this.$ibounds.x, this.$ibounds.y + totalHeight);
			
			cc.ui.logI("cc.ui", "NodeBox child location set to: " + this.$ibounds.x + ", " + (this.$ibounds.y + totalHeight));
			totalHeight += childSize.height;

			if (childSize.width > totalWidth) 
			{
				totalWidth = childSize.width;
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
			if (this.$prefSize.w == -1) 
			{
				this.$ibounds.w = totalWidth;            
				this._contentSize.width += totalWidth;
			}
			if (this.$prefSize.h == -1) 
			{
				this.$ibounds.h = totalHeight;
				this._contentSize.height += totalHeight;        
			}
			
            cc.ui.logI("cc.ui", "NodeBox return layout size: " + this._contentSize.width + ", " + this._contentSize.height);

            return { "width" : this._contentSize.width, "height" : this._contentSize.height };
                                    
        } 
        catch (err) 
        {
            cc.ui.logE("cc.ui.boxes", "NodeBox.doLayout error: " + err);
        }
        
        // Since an error occurred, just return { 0 , 0 }
        return { "width" : 0, "height" : 0 };
    },
     
     /**
     * The <a name="stretchAndAlign">stretchAndAlign()</a> method simply
     * aligns the child of this component to the top-left of the box. It
     * does not stretch the child component.
     * 
     * @param width Used for default resizing of the NodeBox
     * @param height Used for default resizing of the NodeBox
     */
    stretchAndAlign : function(width, height) 
    {
        try 
        {
            cc.ui.logI("cc.ui.boxes", "NodeBox.sAnda, old size: " + this._contentSize.width + ", " + this._contentSize.height);
            cc.ui.logI("cc.ui.boxes", "NodeBox.sAnda, new size: " + width + ", " + height);

            // Do any default re-sizing
            this._super(width, height);

            // Remove margins, padding and border from overall size dimensions
            width -= (this.$margin.l + this.$margin.r + this.$padding.l + this.$padding.r);
            height -= (this.$margin.t + this.$margin.b + this.$padding.t + this.$padding.b);
            if (this.$border != null) 
            {
                var bw = this.$border.getWidths();
                width -= (bw.left + bw.right);
                height -= (bw.top + bw.bottom);
            }

			// Get the child to align
            var children = this._children;    
            if (!children || children.length != 1) 
            {
                return;
            }
            
            var child = children[0];
            if (!child)
            {
            	return;
            }

            var size = null;
            var loc = null;
            
            // Y axis goes from lower left corner at 0
            var topEdge = this.$ibounds.y + this.$ibounds.h;
            
            var pos = null;
            
            // Align the legacy component in the Top-Left
			size = child.getContentSize();
			pos = child.getPosition();

			// Set the top edge, left edge is automatic
			if (topEdge - size.height > pos.y)
			{
				topEdge -= size.height;
				child.setPositionY(topEdge);
			}
        } 
        catch (err) 
        {
            cc.ui.logE("cc.ui", "NodeBox.stretchAndAlign error: " + err);
        }
    },
       
    /**
     * The <a name="getNextComponent">getNextComponent()</a> method starts from 
     * a given <i>Component</i>, at a given direction of traversal <i>Dir</i>, 
     * to determine the next focusable component (if any) for that traversal. 
     * <br /><br />
     * <b>NOTES&#58;</b> 
     * For the purposes of NodeBox, this method simply returns null.
     * 
     * @param component Component from which traversal originates; null, if no 
     *                  such Component 
     * @param dir Traversal direction, defined in cc.ui.Constants&#58;
     *            TRVS_UP, TRVS_DOWN, TRVS_LEFT, or TRVS_RIGHT
     */
    getNextComponent : function(component, dir) 
    {
        // If the default traversal has been overridden, return that
        var newOwner = this._super(component, dir);
        if (newOwner != null) 
        {
            return newOwner;
        }

		// Otherwise, just return null
        return null;
    },
    
} );
