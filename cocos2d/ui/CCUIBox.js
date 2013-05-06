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

cc.ui = cc.ui || {};

/**
 * Box is the base class for all containers, including (for example)
 * &#58;  HBox (horizontal), VBox (vertical), GridBox, FlowBox, 
 * CardBox, BorderBox, and AbsoluteBox. A box sizes, 
 * positions, and paints its child components. 
 * <br /><br />
 * Box also provides the default TraversalPolicy. A Box provides default 
 * traversal focus mechanics that can be overriden 
 * using the Box.setTraversalPolicy() method. 
 * <br /><br />ß
 * Applications may also implement their own layout policies by extending this 
 * base class.
 * <br /><br />
 */
cc.ui.Box = cc.ui.Component.extend({
    
    $wrapTraverse : null,

    /**
     * Constructs a new instance of 
     * the default layout manager, with wrapping in all directions (down, up, 
     * forward, backward, left, and right) set to false.
     */
    ctor : function() {
        this._super();

        // Boxes stretch by default
        this.$stretches = true;

        this.$wrapTraverse = new Array();
        this.$wrapTraverse[cc.ui.Constants.TRVS_DOWN] = false;
        this.$wrapTraverse[cc.ui.Constants.TRVS_FWD] = false;
        this.$wrapTraverse[cc.ui.Constants.TRVS_UP] = false;
        this.$wrapTraverse[cc.ui.Constants.TRVS_BKWD] = false;
        this.$wrapTraverse[cc.ui.Constants.TRVS_LEFT] = false;
        this.$wrapTraverse[cc.ui.Constants.TRVS_RIGHT] = false;
    },
    
    /**
     * Returns the first child (not the deepest) of this Box 
     * that contains the given target point (<i>x</i>,<i>y</i>). Returns null, 
     * if no child contains that point. The target point must be in the coordinate 
     * space of this Box.
     * 
     * @param x x-coordinate of the target point
     * @param y y-coordinate of the target point
     * @return the first child found of this Box that contains the target point;
     *         null, if no child of this Box contains that point
     */
    getComponentAt : function(x, y) {
        var children = (this._parent != null) ? this._parent._children : null;
        if (children == null) {
            return null;
        }

        for (var i = 0; i < children.length; i++) {
            if (!children[i]) {
                continue;
            }
            // TODO: This doesn't allow for z-layering and assumes non
            // overlapping children which is probably okay but needs review
            if (children[i].containsPoint(x - children[i]._position.x,
                                          y - children[i]._position.y)) {
                return children[i];
            }
        }
        return null;
    },
    
    /**
     * Recursively descends the children of this Box to return 
     * the deepest-level child (leaf) at the given target point (<i>x</i>,<i>y</i>).
     * Returns null, if no child contains that point.  The target point must be in
     * the coordinate space of this Box.
     *  
     * @param x x-coordinate of the target point
     * @param y y-coordinate of the target point
     * @return the deepest-level child of this Box that contains 
     *         the target point; null, if no child of this Box
     *         contains that point
     */
    findComponentAt : function(x, y) {
        var children = this._children;
        for (var i = 0; i < children.length; i++) {
            if (!children[i] || !cc.ui.instanceOf(children[i], cc.ui.Component)) {
                continue;
            }
            if (children[i].containsPoint(x - children[i]._position.x,
                                          y - children[i]._position.y)) {
                
                if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                    return children[i].findComponentAt(x - children[i]._position.x,
                                                       y - children[i]._position.y);
                } else {
                    return children[i];
                }
            }
        }
        return (this.containsPoint(x, y)) ? this : null;
    },

    /**
     * Returns the total width and 
     * height required by the child components of this Box, at 
     * their preferred size, with the given <i>maxWidth</i> and <i>maxHeight</i>
     * as limits. The subsequent stretchAndAlign() method may grant the 
     * Box more or less space than returned by this method.
     * <br /><br />
     * This method is called automatically by the Box.doLayout() method.
     * By default, this method returns a width and height of 0. To return 
     * dimensions that fit the child components of this Box (in 
     * the context of a specific layout scheme), subclasses must override it.
     *
     * The <i>maxWidth</i> and <i>maxHeight</i> parameters do not 
     * include the space occupied by the Box's margin, border, and 
     * padding. The Box accounts for those items and adjusts the Width and 
     * Height parameters accordingly, before calling this method.
     * 
     * @param maxWidth Maximum Width (in pixels) available to this Box to 
     *                 arrange its components
     * @param maxHeight Maximum Height (in pixels) available to this Box to 
     *                  arrange its components
     * @return dimensions required to arrange the components of this Box, in 
     *                  the form&#58; 
     *                  <pre>
     *                  &#123 width : #, height: # &#125
     *                  </pre>
     */  
    doLayout : function(maxWidth, maxHeight) {
        return this._super(maxWidth, maxHeight);
    },
    
    /** 
     * Stretches this Box's content to the given <i>width</i> and <i>height</i>
     * (not including margin, border, and padding), aligning its child components 
     * within this context based on their individual alignment properties.
     * <br /><br />
     * Following doLayout(), stretchAndAlign() assigns a final size to this 
     * Container. If different than the preferred doLayout() size, the 
     * stretchAndAlign() parameters of <i>width</i> and <i>height</i> represent 
     * final Container dimensions. The Container should finalize any pending 
     * layout tasks, such as component alignment, within the context of those 
     * dimensions.
     * This method has no default implementation and should be 
     * overridden by subclasses.
     * 
     * @param width Granted width of this Layout's Container, in which this
     *              Layout may stretch and align its child components
     * @param height Granted height of this Layout's Container, in which this
     *              Layout may stretch and align its child components
     */
    stretchAndAlign : function(width, height) { 
        return this._super(width, height);       
    },
    
    // ---------------- TraversalPolicy ßmethods---------------
    
    /**
     * Implementation of 
     * <a href="./mobiJAX.ui.TraversalPolicy.html#a_getWrapTraversal">
     * mobiJAX.ui.TraversalPolicy.getWrapTraversal()</a> method.
     * <br><br>
     * Determines if traversal should wrap after
     * reaching the final component in the given 
     * direction <i>dir</i>. Focus can cycle back to the origin of 
     * the traversal without an explicit change in traversal direction; for 
     * example, where a "right" traversal of a horizontal row of components 
     * reaches the right-most component, would the focus wrap back to the 
     * left-most component?
     * 
     * @param dir Traversal direction, defined in mobiJAX.ui.Constants, 
     *            one of&#58; TRVS_UP, TRVS_DOWN, TRVS_LEFT, or TRVS_RIGHT
     */
    getWrapTraversal : function(dir) {
        switch (dir) {
            case cc.ui.Constants.TRVS_DOWN:
            case cc.ui.Constants.TRVS_FWD:
            case cc.ui.Constants.TRVS_UP:
            case cc.ui.Constants.TRVS_BKWD:
            case cc.ui.Constants.TRVS_LEFT:
            case cc.ui.Constants.TRVS_RIGHT:
                return this.$wrapTraverse[dir];
            default:
                return false;      
        }
    },
    
    /**
     * Implementation of 
     * <a href="./mobiJAX.ui.TraversalPolicy.html#a_setWrapTraversal">
     * mobiJAX.ui.TraversalPolicy.setWrapTraversal()</a> method.
     * <br><br>
     * Sets <i>pnOff</i> to specify, for a traversal reaching the final 
     * component in the given direction <i>dir</i>, whether focus should
     * cycle back to the origin of the traversal without an explicit change in 
     * traversal direction; for example, where a "right" traversal of a 
     * horizontal row of components reaches the right-most component, would
     * the focus wrap back to the left-most component?
     * 
     * @param dir Traversal direction, defined in mobiJAX.ui.Constants, one 
     *            of&#58; TRVS_UP, TRVS_DOWN, TRVS_LEFT, or TRVS_RIGHT
     * @param onOff True, if traversal should wrap in the given direction; 
     *              otherwise, false
     */
    setWrapTraversal : function(dir, onOff) {
        switch (dir) {
            case cc.ui.Constants.TRVS_DOWN:
            case cc.ui.Constants.TRVS_FWD:
            case cc.ui.Constants.TRVS_UP:
            case cc.ui.Constants.TRVS_BKWD:
            case cc.ui.Constants.TRVS_LEFT:
            case cc.ui.Constants.TRVS_RIGHT:
                this.$wrapTraverse[dir] = (onOff == true) ? true : false;
                break;
            default:
                break;
        }
    },
    
    /**
     * Implementation of 
     * <a href="./mobiJAX.ui.TraversalPolicy.html#a_getNextComponent">
     * mobiJAX.ui.TraversalPolicy.getNextComponent()</a> method.
     * <br><br>
     * Determines the next focusable Component, if any, starting from
     * a given <i>component</i>, at a given direction of traversal <i>dir</i>. 
     * <br /><br />
     * If the <i>component</i> is null, the TraversalPolicy should assume an 
     * initial traverse into the Container in the given direction.
     * If there is no next focusable Component in the given direction, this 
     * method should return null.
     * <br><br>
     * By default, this method returns any Component set as the next
     * focusable component using the <a href="#a_setNextComponent">
     * setNextComponent()</a> method. Subclasses should first call this 
     * base class to determine whether a Component has been set; otherwise, 
     * they may implement the logic of their own layout scheme.
     * <br><br>
     * @param component Component from which traversal is occurring; null,
     *                  if no Component 
     * @param dir Traversal direction, defined in mobiJAX.ui.Constants,
     *            one of&#58; TRVS_UP, TRVS_DOWN, TRVS_LEFT, or TRVS_RIGHT
     */
    getNextComponent : function(component, dir) {
        return null;               
    },

    /**
     * Implementation of 
     * <a href="./mobiJAX.ui.TraversalPolicy.html#a_setNextComponent">
     * mobiJAX.ui.TraversalPolicy.setNextComponent()</a> method.
     * <br><br>
     * Sets <i>nextComponent</i> to be the next focusable Component, 
     * when traversing at a given direction of traversal <i>dir</i>,
     * starting from a given <i>component</i>. 
     * This method overrides the default behavior of the TraversalPolicy 
     * and modifies a specific traversal order from Component to Component,
     * in a given direction.
     * If <i> component</i> is null, the TraversalPolicy should assume an 
     * initial traverse into the Container in the given direction.
     * The <i>nextComponent</i> parameter can be null too to show that 
     * all traversal in that direction was done.
     * 
     * @param component Component from which traversal originates; null, if 
     *                  no such component
     * @param dir Traversal direction, defined in mobiJAX.ui.Constants,
     *            one of&#58; TRVS_UP, TRVS_DOWN, TRVS_LEFT, or TRVS_RIGHT
     * @param nextComponent Component to receive focus
     */    
    setNextComponent : function(component, dir, nextComponent) {
    },
    
    /**
     * Determines whether this Box is the ancestor of the specified
     * Component. If the Component is nested within this Box true is returned; 
     * otherwise, false.
     * 
     * @param component The Component which ancestor this Box could be
     * @return true if this Box is an ancestor of the given Component  
     */
    isAncestor : function(component) {
        try {
            var cont = null;
            while (component != null) {
                cont = component._parent;
                if (cont === this) {
                    return true;
                }
                component = cont;
            }
        } catch (err) {
            cc.ui.logE("cc.ui",
                       "Container.isAncestor error: " + err);
        }
        return false;
    },

    // --------- END TraversalPolicy methods --------------
   
    /**
     * A helper method to traverse out of the specified Component 
     * that is known to be part of this Container.
     */
    __traverseOut : function(component) {
        var tlc = this.getTopLevelContainer();
            
        if (tlc != null) {
            var focusManager = tlc.getFocusManager();
            var focusOwner = focusManager.getFocusOwner();
            var oldFocusOwner = null;
             
            // First try traversing Backward
            while ((focusOwner === component || component.isAncestor(focusOwner))
                   && oldFocusOwner != focusOwner) {
                oldFocusOwner = focusOwner;
                focusManager.traverse(cc.ui.Constants.TRVS_BKWD);
                focusOwner = focusManager.getFocusOwner();
            }
            
            // Now try traversing Forward
            oldFocusOwner = null;
            while ((focusOwner === component || component.isAncestor(focusOwner)) 
                   && oldFocusOwner != focusOwner) {
                oldFocusOwner = focusOwner;
                focusManager.traverse(cc.ui.Constants.TRVS_FWD);
                focusOwner = focusManager.getFocusOwner();
            }

            // If needed set focus owner to null (nowhere to traverse to)
            if (focusOwner === component || component.isAncestor(focusOwner)) {
                focusManager.setFocusOwner(null,
                                           cc.ui.Constants.TRVS_BKWD);
            }
         }
    },
    
    /**
     * This is 
     * an inner utility method that searches the children array within a given 
     * non-focusable <i>component</i>, to determine the very first focusable 
     * child Component in the given direction <i>dir</i>. 
     * 
     * @param component Non-focusable Container in which to search the 
     *                  children array (in the given direction) for the first 
     *                  focusable child Component.
     * @param dir       Traversal direction in which to search for the first 
     *                  focusable child. 
     * 
     * @return First focusable child Component found; null, if none within 
     *         the parent Container.
     */
    __getFirstFocusableComponent : function(component, dir) {
        var children = this._children;
        for (var i = 0; i < children.length; i++) {
            if (!children[i] || !children[i].isVisible()) {
                continue;
            }
            if (children[i].isFocusable()) {
                return children[i];
            } else if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                var c = children[i].getTraversalPolicy().getNextComponent(component, dir);
                if (c != null) {
                    return c;
                }
            }
        }
        return null;        
    },
    
    /**
     * This is 
     * an inner utility method that searches the children array  
     * within a given non-focusable <i>component</i>, to determine the very 
     * last focusable child Component in the given direction <i>dir</i>. 
     * 
     * @param component Non-focusable Container in which to search the 
     *                  children array (in the given direction) for the last 
     *                  focusable child Component.
     * @param dir       Traversal direction in which to search for the last 
     *                  focusable child. 
     * 
     * @return Last focusable child Component found; null, if none within 
     *         the parent Container.
     */
    __getLastFocusableComponent : function(component, dir) {
        var children = this._children;
        for (var i = children.length - 1; i >= 0; i--) {                        
            if (!children[i] || !children[i].isVisible()) {
                continue;
            }
            if (children[i].isFocusable()) {
                return children[i];
            } else if (cc.ui.instanceOf(children[i], cc.ui.Box)) {
                var c = children[i].getTraversalPolicy().getNextComponent(component, dir);
                if (c != null) {
                    return c;
                }
            }
        }
        return null;        
    },
    
});
