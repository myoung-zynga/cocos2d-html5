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
 * The CardBox class manages stack of cards (Components), including order, traversal,
 * painting, and Box. One card can be current and be put at the top
 * of the stack. That current card (Component) is visible (the rest are not).
 * CardBox sizes itself to the largest card (Component) in the stack.
 * When asked to traverse to the next component traversal is done within 
 * the current card (Component).
 */

cc.ui.boxes.CardBox = cc.ui.Box.extend({
    
    $activeIndex : 0,
    $nextIndex : 0,
    $loops : false,
    $listeners : null,

    /**
     * Creates an empty CardBox.
     */    
    ctor : function () {
        this._super();

        this.$listeners = new Object();
    },

    /**
     * Returns the number of cards (Components)  in the CardBox's stack. 
     * 
     * @return number of cards (Components) in the CardBox's stack
     */
    numCards : function() {
        try {
            return this._children.length;
        } catch (err) {
            cc.ui.logE("cc.ui.boxes",
                       "CardBox.numCards error: " + err);
        }
        return 0;
    },
    
    /**
     * Returns the  index value of the card currently 
     * at the top of the CardBox's stack (visible).
     * 
     * @return Index value of the top-most card in the CardBox's stack
     */
    getCurrentIndex : function() {
        return this.$activeIndex;
    },
    
    /**
     * Returns the card currently at the top of the CardBox's stack (visible).
     * 
     * @return the top-most card in the CardBox's stack
     */
    getCurrentCard : function() {
        try {
            return this._children[this.$activeIndex];
        } catch (err) {
            cc.ui.logE("cc.ui.boxes",
                       "CardBox.getCurrentCard error: " + err);
        }
        return null;
    },
    
    /**
     * Determines whether this CardBox loops its traversal. Default is false.
     * 
     * @return true, if this CardBox loops its traversal; otherwise, false
     */
    doesLoop : function() {
        return this.$loops;
    },
    
    /**
     * Sets whether this CardBox loops its traversal or 
     * not depending on the given <i>onOff</i> boolean. 
     * If true, it loops from end to the beginning and beginning to end when 
     * calling <a href="#a_slideCards">slideCards()</a>.
     * 
     * @param onOff If true, this CardBox loops its traversal; 
     *              otherwise, not
     */
    setLoops : function (onOff) {
        this.$loops = (onOff == true);
    },
    
    /**
     * Sets the card with  
     * the given <i>cardIndex</i> to be pushed to the visible top 
     * of the card stack.
     * <br /><br />
     * This does not renumber any of the cards, it simply changes which 
     * card (Component) is visible.
     * If this method returns true, the card has been put at the top of the stack
     * and it became visible.
     * If this method returns false, the currently visible card had input 
     * focus and refused to release it or an error index was passed in.
     * 
     * @param cardIndex Index of the Card to be pushed to the visible top of
     *                  the stack. This does not renumber any of the cards, 
     *                  it simply changes which Card is visible.
     * @return True, if the change of top Card to the new index was successful; 
     *         otherwise, false
     */
    setCurrentIndex : function(cardIndex) {        
        if (cardIndex == this.$activeIndex) {
            // Just return if the card to show is already the
            // active card
            return true;
        }
        
        try {
            var children = this._children;
            
            if (cardIndex < 0 || 
                cardIndex >= children.length || 
                    children[cardIndex] == null) 
            {
                cc.ui.logW("cc.ui.boxes", "CardBox: invalid value sent to setCurrentIndex");
                return false;
            }

            // Get a reference to the top level container (screen or widget)
            var tlc = this.getTopLevelContainer();
            
            // If the currently selected card owns the focus, then we
            // definitely need a traverse when we select a new card
            var needsTraverse = false;

            // It is possible that activeIndex became invalid
            if (this.$activeIndex < children.length) {

                // TODO
                /*
                if (tlc != null) {
                    var focusOwner = tlc.getFocusManager().getFocusOwner();
                    if (focusOwner != null && this.isAncestor(focusOwner)) {
                        // NOTE: When switching cards in a card box, the user
                        // expects the current input focus to be on whatever
                        // component it was on when the card was switched.
                        // So we store the old focus owner of the card in the
                        // ___fo property such that if the user navigates back
                        // to the card, we can resume input focus on that
                        // focus owner rather than reset the focus owner.
                        children[this.$activeIndex].___fo = focusOwner;
                    }
                    needsTraverse  = (focusOwner == null) || 
                                     this.isAncestor(focusOwner);
                }
                */
                // setVisible() will take care of traversal out
                children[this.$activeIndex].setVisible(false);
            }

            var oldIndex = this.$activeIndex;
            children[cardIndex].setVisible(true);
            this.$activeIndex = cardIndex;

            // TODO
            /*
            // FIXME: this should only resume focus within the card if the
            // current focus owner is a descendent of this box
            if (children[cardIndex].___fo != null) {
                // This means this card was visible previously and there
                // is an old focus owner that may need to be returned to
                var fo = children[cardIndex].___fo;
                if (children[cardIndex].isAncestor(fo)) {
                    if (tlc != null) {
                        tlc.getFocusManager().setFocusOwner(fo);
                    }
                    needsTraverse = false;
                } else {
                    needsTraverse = true;
                }
                children[cardIndex].___fo = null;
            }
            if (needsTraverse) { // needsTraverse will be false if tlc is null
                tlc.getFocusManager().traverseInto(this, cc.ui.Constants.TRVS_DOWN);
            }
            */

            this.notifyCardListeners({ "newIndex" : this.$activeIndex, "oldIndex" : oldIndex });
            this.repaint();
            return true;
            
        } catch (err) {
            cc.ui.logE("cc.ui.boxes",
                       "CardBox.setCurrentIndex error: " + err);
        }
        
        return false;
    },
    
    /**
     * Overrides <a href="./cc.ui.Box.html#a_doLayout">
     * cc.ui.Box.doLayout()</a> method to layout CardBox's cards
     * within the given <i>maxWidth</i> and <i>maxHeight</i> limits.
     * <br><br>
     * CardBox stacks all its cards (Components). While doing the layout
     * CardBox calls doLayout() method on all its cards and determines the
     * largest one which becomes the overall size of the Box's content
     * with this layout.
     * 
     * @param maxWidth Maximum width available to the CardBox in 
     *                 pixels (not including margin, border, and padding)
     * @param maxHeight Maximum height available to the CardBox in 
     *                  pixels (not including margin, border, and padding)
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

            cc.ui.logI("cc.ui.boxes", "CardBox.doLayout max size is: " + maxWidth + ", " + maxHeight);
            var children = this._children;        
        
            var width = 0;
            var height = 0;
            var size = null;
            
            var isComponent = false;

            if (children.length == 0) {
                this.$activeIndex = 0;
            } else if (this.$activeIndex >= children.length) {
                this.$activeIndex = children.length - 1;
            }
        
            for (var i = 0; i < children.length; i++) {
                if (!children[i]) {
                    continue;
                }
                isComponent = cc.ui.instanceOf(children[i], cc.ui.Component);

                // We'll set the default visibility as well
                children[i].setVisible(i == this.$activeIndex);
                
                size = (isComponent) ? 
                    children[i].doLayout(maxWidth, maxHeight)
                    : children[i].getContentSize();
                
                if (size.width > width) {
                    width = size.width;
                }
                if (size.height > height) {
                    height = size.height;
                }
            }

            // Set the box's content size and internal bounding box to
            // be the size of the largest card(s). This may change later in
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
                       "CardBox.doLayout error: " + err);
        }
        return { "width" : 0, "height" : 0 };
    },

    /**
     * Overrides <a href="./cc.ui.Box.html#a_stretchAndAlign">
     * cc.ui.Box.stretchAndAlign()</a> method to stretch
     * the corresponding Container's content to the given <i>width</i> and <i>height</i> 
     * (not including Container's margin, border, and padding), 
     * aligning its child components 
     * within this context based on their individual alignment properties.
     * <br><br>
     * CardBox stacks all its cards (Components). While doing the stretch
     * CardBox calls stretchAndAlign() method on all its cards (Components).
     * 
     * @param width Granted width (not including margin, border, and padding) 
     *        in which 
     *        this CardBox may stretch and align its cards
     * @param height Granted height (not including margin, border, and padding)
     *        in 
     *        which this CardBox may stretch and align its cards
     */
    stretchAndAlign : function(width, height) {
        try {

            cc.ui.logI("cc.ui.boxes", "CardBox.sAnda, old size: " + this._contentSize.width + ", " + this._contentSize.height);
            cc.ui.logI("cc.ui.boxes", "CardBox.sAnda, new size: " + width + ", " + height);

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
            if (!children) {
                return;
            }
            var isComponent = false;
            var align = null;
            var stretch = false;

            for (var i = 0; i < children.length; i++) {
                if (!children[i]) {
                    continue;
                }
                isComponent = cc.ui.instanceOf(children[i], cc.ui.Component);

                // We'll give the child a default lower/left position, then
                // adjust if necessary below
                children[i].setPosition(this.$ibounds.x, 
                                        this.$ibounds.y);

                stretch = (isComponent) ? children[i].shouldStretch()
                    : false;

                if (stretch) {
                    children[i].stretchAndAlign(width, height);
                } else {
                    // Align the child within the available space per the
                    // child's alignment directives
                
                    size = children[i].getContentSize();

                    if (size.height < height) {
                        align = (isComponent) ? children[i].getVertAlign()
                            : cc.ui.Constants.ALGN_TOP;

                        switch (align) {
                            case cc.ui.Constants.ALGN_BOTTOM:
                                // Already done by default above ($ibounds.y)
                                break;
                            case cc.ui.Constants.ALGN_MIDDLE:
                                children[i].setPositionY( 
                                    this.$ibounds.y + 
                                    Math.floor((height - size.height) / 2));
                                break;
                            case cc.ui.Constants.ALGN_TOP:
                                children[i].setPositionY(
                                    this.$ibounds.y +
                                    (height - size.height));
                                break;           
                        }
                    }

                    if (size.width < width) {
                        align = (isComponent) ? children[i].getHorizAlign()
                            : cc.ui.Constants.ALGN_LEFT;

                        switch (align) {
                            case cc.ui.Constants.ALGN_LEFT:
                                // Already done by default above ($ibounds.x)
                                break;
                            case cc.ui.Constants.ALGN_CENTER:
                                children[i].setPositionX( 
                                    this.$ibounds.x + 
                                    Math.floor((width - size.width) / 2));                                
                                break;
                            case cc.ui.Constants.ALGN_RIGHT:
                                children[i].setPositionX( 
                                    this.$ibounds.x + width - size.width);
                                break;
                        }
                    }
                }

            }
        } catch (err) {
            cc.ui.logE("cc.ui.boxes", 
                       "CardBox.stretchAndAlign error: " + err);
        }
    },

    /**
     * Overrides <a href="./cc.ui.Box.html#a_getNextComponent">
     * cc.ui.Box.getNextComponent()</a> method to
     * get the next focusable component (if any) for that traversal starting from 
     * a given <i>component</i>, at a given direction of traversal <i>dir</i>.
     * If Component is null, the TraversalPolicy should assume an initial 
     * traversal into Container in the given direction.</li>
     * If no next focusable Component in the given direction, this method 
     * returns null.
     * <br><br>
     * This  gets next focusable component within the current card (Component).
     * 
     * @param component Component from which traversal originates; null, if no 
     *                  such Component 
     * @param dir Traversal direction, defined in cc.ui.Constants&#58;
     *            TRVS_UP, TRVS_DOWN, TRVS_LEFT, or TRVS_RIGHT
     */
    getNextComponent : function(component, dir) {
        // If the default traversal has been overridden, return that
        var newOwner = this.$base(component, dir);
        if (newOwner != null) {
            return newOwner;
        }
        try {
            if (this.container.children.length > 0 && 
                this.activeIndex < this.container.children.length) {
                var c = this.container.children[this.activeIndex];
                if (c.isFocusable() && c.isVisible()) {
                    newOwner = c;
                }
                if (newOwner == null && $class.instanceOf(c, cc.ui.Container)) {
                    var tP = c.getTraversalPolicy();
                    newOwner = tP.getNextComponent(component, dir);
                } else if (newOwner == component && $class.instanceOf(c, cc.ui.Container)){
                    var tP = c.getTraversalPolicy();
                    var possibleOwner = tP.getNextComponent(component, dir);
                    if(possibleOwner != null) {
                        newOwner = possibleOwner;
                    } else  {
                        newOwner = null;
                    }
                }
            }
        } catch (err) {
            cc.__Debug.trace(cc.__Debug.ERROR,
                                "cc.ui.boxes", 
                                "CardBox.getNextComponent error: " + err);
        }
        return newOwner;
    },
    
    /**
     * Overrides <a href="./cc.ui.Box.html#a_getComponentAt">
     * cc.ui.Box.getComponentAt()</a> method to
     * return the 
     * Component of this CardBox that contains the given point (as the 
     * coordinates <i>x</i> and <i>y</i>). This method only finds the first 
     * child of this Box that contains the point (not the deepest); null, 
     * if no child of this CardBox contains the point. 
     * <br /><br />
     * The point should be in the coordinate space of this CardBox
     * and be contained within it.
     * 
     * @param x X-coordinate of the target point
     * @param y Y-coordinate of the target point
     * @return Child of this CardBox that contains the point; null,
     *         if no child contains the point
     */
    getComponentAt : function(x, y) {
        var children = this._children;
        if (children && 
            children.length > 0 && 
                this.$activeIndex < children.length) 
        {
            var child = children[this.$activeIndex];
            var pos = child.getPosition();
            if (cc.ui.instanceOf(child, cc.ui.Box)) {
                return child.getComponentAt(x, y);
            } else if (child.containsPoint(x - pos.x, 
                                           y - pos.y)) {
                return child;
            }
        }
        return (this.containsPoint(x, y)) ? this : null;
    },
    
    /**
     * Overrides <a href="./cc.ui.Box.html#a_findComponentAt">
     * cc.ui.Box.findComponentAt()</a> method to
     * find the 
     * deepest level Component of this CardBox that contains the
     * given point (as the coordinates <i>X</i> and <i>Y</i>). This method 
     * recursively descends the children of this CardBox to find the 
     * deepest-level Component (leaf) containing the given point.
     * 
     * @param x X-coordinate of the target point
     * @param y Y-coordinate of the target point
     * @return Child of this CardBox that contains the point; null,
     *         if no child contains the point
     */
    findComponentAt : function(x, y) {
        var children = this._children;
        if (children && 
            children.length > 0 &&
                this.$activeIndex < children.length) 
        {
            var child = children[this.$activeIndex];
            var pos = child.getPosition();
            if (child.containsPoint(x - pos.x, y - pos.y)) {
                if (cc.ui.instanceOf(child, cc.ui.Box)) {
                    return child.findComponentAt(x - pos.x,
                                                 y - pos.y);
                } else {
                    return child;
                }
            }
        }
        
        return (this.containsPoint(x, y)) ? this : null;   
    },
    
    /**
     * Registers the
     * given <i>listener</i> (in this case, for an <i>indexChange</i> events).
     * <br /><br />
     * When the current index of this CardBox changes, the Listener will 
     * be notified through its notify() method.
     * The listener must either be of the type cc.ui.EventListener or
     * a function.
     * 
     * @param listener Listener to register for <i>indexChange</i> events
     */
    addCardListener : function(listener) {
        var event = "indexChange";
        if (typeof event == 'string') {
            event = new Array(event);
        }
        
        // Never add the same listener twice for the same event
        this.removeCardListener(listener);
        
        // NOTE: this.listeners is an "associative array"
        // which stores an array of listeners under each
        // event name (kept as a property on this.listeners)
        if (event.length) {
            for (var i = 0; i < event.length; i++) {
                if (!event[i]) {
                    continue;
                }
                if (!this.$listeners[event[i]]) {
                    this.$listeners[event[i]] = new Array();
                }
                this.$listeners[event[i]].push(listener);
            }
        }           
    },
        
    /**
     * Removes 
     * the given <i>listener</i> for the given <i>event</i> (either a single 
     * string representing the event type, or an array of strings representing 
     * multiple event types).
     * 
     * @param event Event (or set of Events) for which to unregister
     *              the Listener; either a single string representing
     *              the event type, or an array of strings representing 
     *              multiple event types
     * @param listener Listener to unregister for the given event or
     *                 set of events
     */
    removeCardListener : function(listener) {
        var event = "indexChange";
        if (typeof event == 'string') {
            event = new Array("indexChange");
        }
        
        if (event.length) {
            var queue = null;
            for (var i = 0; i < event.length; i++) {    
                if (this.$listeners[event[i]]) {
                    queue = this.$listeners[event[i]];
                    for (var j = 0; j < queue.length; j++) {
                        if (queue[j] === listener) {
                            queue.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        }       
    },
    
    /**
     * Notifies all of this CardBox's registered Listeners
     * about the occurrence of an <i>indexChange</i> event, delivering the 
     * given <i>Details</i> of the Event in an object containing this 
     * CardBox's <i>oldIndex</i> and <i>newIndex</i> of this CardBox.
     * <br /><br />
     * Every <i>details</i> object has a <i>src</i> property, set to the 
     * CardBox that generated it.
     * 
     * @param details Object containing the specific properties
     *                of the event
     */
    notifyCardListeners : function(details) {
        var event = "indexChange";
        var listeners = this.$listeners[event];
        if (listeners) {
            // Automatically set the source object for all events
            if (!details) {
                details = new Object();
            }
            details.src = this;
            for (var i = 0; i < listeners.length; i++) {
                try {
                    if (!listeners[i]) {
                        continue;
                    } else if (typeof listeners[i] == 'function') {
                        listeners[i]("indexChange", details);
                    } else if (listeners[i].eventNotify) {
                        listeners[i].eventNotify(event, details);
                    }
                } catch (err) {
                    cc.ui.logE("cc.ui.boxes",
                               "CardBox.notifyListeners: Error " +
                               "notifying listener on event: " +
                               " Error: " + err);
                }
            }
        }
    },
    
});
