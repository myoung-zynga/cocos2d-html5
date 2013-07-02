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
cc.ui.LabelTTF = cc.Node.extend( /** @lends cc.LabelTTFWebGL# */ {
    /// ---- common properties start    ----
    _dimensions: null,
    _hAlignment: cc.TEXT_ALIGNMENT_CENTER,
    _vAlignment: cc.VERTICAL_TEXT_ALIGNMENT_TOP,
    _fontName: "Arial",
    _fontSize: 0.0,
    _string: "",
    _isMultiLine: false,
    _fontStyleStr: null,
    _colorStyleStr: null,
    _fontClientHeight:0,
    _baseline : null,
    _textAlign : null,
    _xOffset : 0,
    _yOffset : 0,
    _labelCanvas : null,
    _labelContext : null,

    /**
     * Constructor
     * @param fontStyleStr font name of cc.LabelTTF
     * @param fontSize font size of cc.LabelTTF
     */
    ctor: function (fontStyleStr, fontSize) {
        this._super();
        this._dimensions = cc.SizeZero();
        this._opacityModifyRGB = false;
        this._fontStyleStr = "";
        this._colorUnmodified = c.white();
        this._colorStyleStr = "";
        this._opacity = 255;
        this._color = cc.white();
        this._fontStyleStr = fontStyleStr;
        this._fontSize = fontSize;
        this._setColorStyleStr();
    },

    init: function (callsuper) {
        if (callsuper) {
            return this._super();
        }
        return this.initWithString([" ", this._fontName, this._fontSize]);
    },
    /**
     * Prints out a description of this class
     * @return {String}
     */
    description: function () {
        return "<cc.ui.LabelTTF | FontName =" + this._fontName + " FontSize = " + this._fontSize.toFixed(1) + ">";
    },

    setColor: function (color3) {
        // TODO: called super
        if ((this._color.r == color3.r) && (this._color.g == color3.g) && (this._color.b == color3.b)) return;

        this._color = this._colorUnmodified = new cc.Color3B(color3.r, color3.g, color3.b);

        if (this._opacityModifyRGB) {
            this._color.r = 0 | (color3.r * this._opacity / 255);
            this._color.g = 0 | (color3.g * this._opacity / 255);
            this._color.b = 0 | (color3.b * this._opacity / 255);
        }

        this._setColorStyleStr();
    },
    /**
     * Return color of sprite
     * @return {cc.Color3B}
     */
    getColor: function () {
        if (this._opacityModifyRGB) return new cc.Color3B(this._colorUnmodified);

        return new cc.Color3B(this._color);
    },

    setOpacity: function (opacity) {
        if (this._opacity === opacity) return;
        // calls super TODO: figure out which super to call (webgl or canvas version)
        this._opacity = opacity;
        this._setColorStyleStr();
    },
    //
    // RGBA protocol
    //
    /**
     * Return opacity of sprite
     * @return {Number}
     */
    getOpacity: function () {
        return this._opacity;
    },

    /**
     * opacity: conforms to CCRGBAProtocol protocol
     * @param {Boolean} value
     */
    setOpacityModifyRGB: function (value) {
        var oldColor = this._color;
        this._opacityModifyRGB = value;
        this._color = oldColor;
    },

    /**
     * return IsOpacityModifyRGB value
     * @return {Boolean}
     */
    isOpacityModifyRGB: function () {
        return this._opacityModifyRGB;
    },

    _setColorStyleStr: function () {
        this._colorStyleStr = "rgba(" + this._color.r + "," + this._color.g + "," + this._color.b + ", " + this._opacity / 255 + ")";
    },

    /**
     * returns the text of the label
     * @return {String}
     */
    getString: function () {
        return this._string;
    },

    /**
     * changes the string to render
     * @warning Changing the string is as expensive as creating a new cc.ui.LabelTTF. To obtain better performance use cc.LabelAtlas
     * @param {String} text text for the label
     */
    setString: function (text) {
        cc.Assert(text != null, "Invalid string");
        if (this._string != text) {
            this._string = text + "";

            // Force update
            if (this._string.length > 0) this._updateTTF();
        }
    },

    /**
     * return Horizontal Alignment of cc.ui.LabelTTF
     * @return {cc.TEXT_ALIGNMENT_LEFT|cc.TEXT_ALIGNMENT_CENTER|cc.TEXT_ALIGNMENT_RIGHT}
     */
    getHorizontalAlignment: function () {
        return this._hAlignment;
    },

    /**
     * set Horizontal Alignment of cc.ui.LabelTTF
     * @param {cc.TEXT_ALIGNMENT_LEFT|cc.TEXT_ALIGNMENT_CENTER|cc.TEXT_ALIGNMENT_RIGHT} alignment Horizontal Alignment
     */
    setHorizontalAlignment: function (alignment) {
        if (alignment != this._hAlignment) {
            this._hAlignment = alignment;

            // Force update
            if (this._string.length > 0) this._updateTTF();
        }
    },

    /**
     * return Vertical Alignment of cc.ui.LabelTTF
     * @return {cc.VERTICAL_TEXT_ALIGNMENT_TOP|cc.VERTICAL_TEXT_ALIGNMENT_CENTER|cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM}
     */
    getVerticalAlignment: function () {
        return this._vAlignment;
    },

    /**
     * set Vertical Alignment of cc.ui.LabelTTF
     * @param {cc.VERTICAL_TEXT_ALIGNMENT_TOP|cc.VERTICAL_TEXT_ALIGNMENT_CENTER|cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM} verticalAlignment
     */
    setVerticalAlignment: function (verticalAlignment) {
        if (verticalAlignment != this._vAlignment) {
            this._vAlignment = verticalAlignment;

            // Force update
            if (this._string.length > 0) this._updateTTF();
        }
    },

    /**
     * return Dimensions of cc.ui.LabelTTF
     * @return {cc.Size}
     */
    getDimensions: function () {
        return this._dimensions;
    },

    /**
     * set Dimensions of cc.ui.LabelTTF
     * @param {cc.Size} dim
     */
    setDimensions: function (dim) {
        if (dim.width != this._dimensions.width || dim.height != this._dimensions.height) {
            this._dimensions = dim;

            // Force update
            if (this._string.length > 0) this._updateTTF();
        }
    },

    /**
     * return font size of cc.ui.LabelTTF
     * @return {Number}
     */
    getFontSize: function () {
        return this._fontSize;
    },

    /**
     * set font size of cc.LabelTTF
     * @param {Number} fontSize
     */
    setFontSize: function (fontSize) {
        if (this._fontSize != fontSize) {
            this._fontSize = fontSize;
            this._fontStyleStr = this._fontSize + "px '" + this._fontName + "'";
            this._fontClientHeight = cc.LabelTTF.__getFontHeightByDiv(this._fontName, this._fontSize);
            // Force update
            if (this._string.length > 0) this._updateTTF();
        }
    },


    /**
     * return font name of cc.ui.LabelTTF
     * @return {String}
     */
    getFontName: function () {
        return this._fontName;
    },

    /**
     * set font name of cc.ui.LabelTTF
     * @param {String} fontName
     */
    setFontName: function (fontName) {
        if (this._fontName != fontName) {
            this._fontName = new String(fontName);
            this._fontStyleStr = this._fontSize + "px '" + this._fontName + "'";
            this._fontClientHeight = cc.ui.LabelTTF.__getFontHeightByDiv(this._fontName, this._fontSize);
            // Force update
            if (this._string.length > 0) this._updateTTF();
        }
    },
    /**
     * calculate the strings width
     */
    calculateStringWidth: function(){
          return this._labelContext.measureText(this._string).width;
    }
    _updateTTF:function () {
         _getLabelContext();
         var stringWidth = calculateStringWidth();
        /** 
        This is for line wrapping and multiline, logic may not be correct. In V1 we do no allow multiline
	if(this._string.indexOf('\n') !== -1 || (this._dimensions.width !== 0 && stringWidth > this._dimensions.width && this._string.indexOf(" ") !== -1)) {
            var strings = this._strings = this._string.split('\n');
            var lineWidths = this._lineWidths = [];
            for (var i = 0; i < strings.length; i++) {
                if (strings[i].indexOf(" ") !== -1 && this._dimensions.width > 0) {
                    var percent = this._dimensions.width / this._labelContext.measureText(this._strings[i]).width;
                    var startSearch = 0 | (percent * strings[i].length + 1);
                    var cutoff = startSearch;
                    var tempLineWidth = 0;
                    if (percent < 1) {
                        do {
                            cutoff = strings[i].lastIndexOf(" ", cutoff - 1);
                            var str = strings[i].substring(0, cutoff);
                            tempLineWidth = this._labelContext.measureText(str).width;
                            if (cutoff === -1) {
                                cutoff = strings[i].indexOf(" ", startSearch);
                                break;
                            }
                        } while (tempLineWidth > this._dimensions.width);
                        var newline = strings[i].substr(cutoff + 1);
                        strings.splice(i + 1, 0, newline);
                        strings[i] = str;
                    }
                }
                lineWidths[i] = tempLineWidth || this._labelContext.measureText(strings[i]).width;
            }
            this._isMultiLine = true;
        } else
            this._isMultiLine = false;
        */

        if (this._dimensions.width === 0) {
            //if (this._isMultiLine)
            //    this.setContentSize(cc.size(Math.max.apply(Math, this._lineWidths), this._fontClientHeight * this._strings.length));
            //else
            //    this.setContentSize(cc.size(stringWidth, this._fontClientHeight));
            this.setContentSize(cc.size(stringWidth, this._fontClientHeight));
            // TODO: figure out what anchorPointInPoints does
            this._anchorPointInPoints = new cc.Point(this._contentSize.width * this._anchorPoint.x, this._contentSize.height * this._anchorPoint.y);
        } else {
            //dimension is already set, contentSize must be same as dimension
            this.setContentSize(cc.size(this._dimensions.width, this._dimensions.height));
            // TODO: Figure out what anchorPointsInPoint does
            this._anchorPointInPoints = new cc.Point(this._contentSize.width * this._anchorPoint.x, this._contentSize.height * this._anchorPoint.y);
        }
    },



 /**
     * The <a name="stretchAndAlign">stretchAndAlign()</a> method stretches 
     * this text in the label to the given <i>Width</i> and <i>Height</i> (not 
     * including margin, border, and padding).
     * <br /><br />
     * <b>NOTE&#58;</b> 
     * Following <i>doLayout(),</i> <i>stretchAndAlign()</i> assigns a final 
     * size to this label. If different than the preferred <i>doLayout()
     * </i> size, the <i>stretchAndAlign()</i> parameters of <i>Width</i> and 
     * <i>Height</i> represent final label dimensions.
     * @param width Final width of this text label, in which this
     *        label may stretch and align its text components
     * @param height Final height of this text label, in which this
     *        label may stretch and align its text components
     */
    stretchAndAlign : function(width, height) {
        try {

            cc.ui.logI("cc.ui.ccuilabelttf", "Text Size, old size: " + this._contentSize.width + ", " + this._contentSize.height);
            cc.ui.logI("cc.ui.ccuilabelttf", "Text Size, new size: " + width + ", " + height);

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
            // calculate exact width and height from font * #characters
            // get dimensions
            // figure out how much space you are actually taking up
            // text alignment, component alignment 
            var dim = CC.size(width,height);
            setDimensions(dim);
            this._baseline = cc.ui.LabelTTF._textBaseline[this._vAlignment];
            this._textAlign = cc.ui.LabelTTF._textAlign[this._hAlignment];

            var stringWidth = calculateStringWidth();
            // contentSize set in CCNode.js
            if (this._hAlignment === cc.TEXT_ALIGNMENT_RIGHT)
                this._xOffset = this._contentSize.width-stringWidth;
            else if (this._hAlignment === cc.TEXT_ALIGNMENT_CENTER)
                this._xOffset = this._contentSize.width / 2 - stringWidth/2;
            else if (this._hAlignment === cc.TEXT_ALIGNMENT_LEFT)
                this._xOffset = 0;

            if (this._vAlignment === cc.VERTICAL_TEXT_ALIGNMENT_TOP)
                // FIXME: this is wrong I am not sure how to align top
                this._yOffset = -this._contentSize.height;
            else if (this._vAlignment === cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
                this._yOffset = -this._contentSize.height/2;
            else if (this._vAlignment === cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM)
                this._yOffset = 0;       
    },

    _getLabelContext:function () {
        if (this._labelContext)
            return this._labelContext;

        if (!this._labelCanvas) {
            this._labelCanvas = document.createElement("canvas");
        }
        this._labelContext = this._labelCanvas.getContext("2d");
        return this._labelContext;
    },


    /**
     * renders the label
     * @param {CanvasContext|Null} ctx
     */
    draw:function (ctx, renderType) {
        var context = ctx || cc.renderContext;
        if (this._flipX)
            context.scale(-1, 1);
        if (this._flipY)
            context.scale(1, -1);

        //this is fillText for canvas
        context.fillStyle = this._colorStyleStr;

        if (context.font != this._fontStyleStr)
            context.font = this._fontStyleStr;

        context.textBaseline = this_.textBaseLine;
        context.textAlign = this._textAlign;
        
        if (this._isMultiLine) {
          
            for (var i = 0; i < this._strings.length; i++) {
                var line = this._strings[i];
                context.fillText(line, xoffset, -this._contentSize.height + (this._fontSize * i) + yOffset);
            }
        } else {
                context.fillText(this._string, this._xoffset,this._yOffset);
            }
        cc.INCREMENT_GL_DRAWS(1);
    }
});


cc.ui.LabelTTF._textAlign = ["left", "center", "right"];
cc.ui.LabelTTF._textBaseline = ["top", "middle", "bottom"];
cc.ui.LabelTTF.__labelHeightDiv = document.createElement("div");
cc.ui.LabelTTF.__labelHeightDiv.style.fontFamily = "Arial";
cc.ui.LabelTTF.__labelHeightDiv.innerHTML = "ajghl~!";
cc.ui.LabelTTF.__labelHeightDiv.style.position = "absolute";
cc.ui.LabelTTF.__labelHeightDiv.style.left = "-100px";
cc.ui.LabelTTF.__labelHeightDiv.style.top = "-100px";
document.body.appendChild(cc.ui.LabelTTF.__labelHeightDiv);

cc.ui.LabelTTF.__getFontHeightByDiv = function(fontName, fontSize){
    var labelDiv = cc.ui.LabelTTF.__labelHeightDiv;
    labelDiv.style.fontFamily = fontName;
    labelDiv.style.fontSize = fontSize + "px";
    return labelDiv.clientHeight ;
};

