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
cc.Label = cc.Node.extend(/** @lends cc.LabelTTFWebGL# */
{
        /// ---- common properties start    ----
        _dimensions:null,
        _hAlignment:cc.TEXT_ALIGNMENT_CENTER,
        _vAlignment:cc.VERTICAL_TEXT_ALIGNMENT_TOP,
        _fontName:"Arial",
        _fontSize:0.0,
        _string:"",
        _isMultiLine:false,
        _fontStyleStr:null,
        _colorStyleStr:null,
        /**
         * Constructor
         */
        ctor:function () {
        this._super();
        this._dimensions = cc.SizeZero();
        this._opacityModifyRGB = false;
        this._fontStyleStr = "";
        this._colorStyleStr = "";
        this._opacity = 255;
        this._color = cc.white();
        this._setColorStyleStr();
        },
        
        init:function (callsuper) {
        if (callsuper) {
        return this._super();
        }
        return this.initWithString([" ", this._fontName, this._fontSize]);
        },
        /**
         * Prints out a description of this class
         * @return {String}
         */
        description:function () {
        return "<cc.LabelTTF | FontName =" + this._fontName + " FontSize = " + this._fontSize.toFixed(1) + ">";
        },
        
        setColor:function (color3) {
        if ((this._color.r == color3.r) && (this._color.g == color3.g) && (this._color.b == color3.b))
        return;
        
        this._super(color3);
        this._setColorStyleStr();
        this.setNodeDirty();
        },
        /**
        * Return color of sprite
        * @return {cc.Color3B}
        */
        getColor:function () {
           if (this._opacityModifyRGB)
               return new cc.Color3B(this._colorUnmodified);
    
           return new cc.Color3B(this._color);
        },
        
        setOpacity:function (opacity) {
           if (this._opacity === opacity)
               return;
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
        getOpacity:function () {
        return this._opacity;
        },
        
        _setColorStyleStr:function () {
        this._colorStyleStr = "rgba(" + this._color.r + "," + this._color.g + "," + this._color.b + ", " + this._opacity / 255 + ")";
        },
        
        /**
         * returns the text of the label
         * @return {String}
         */
        getString:function () {
        return this._string;
        },
        
        /**
         * return Horizontal Alignment of cc.LabelTTF
         * @return {cc.TEXT_ALIGNMENT_LEFT|cc.TEXT_ALIGNMENT_CENTER|cc.TEXT_ALIGNMENT_RIGHT}
         */
        getHorizontalAlignment:function () {
        return this._hAlignment;
        },
        
        /**
         * return Vertical Alignment of cc.LabelTTF
         * @return {cc.VERTICAL_TEXT_ALIGNMENT_TOP|cc.VERTICAL_TEXT_ALIGNMENT_CENTER|cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM}
         */
        getVerticalAlignment:function () {
        return this._vAlignment;
        },
        
        /**
         * return Dimensions of cc.LabelTTF
         * @return {cc.Size}
         */
        getDimensions:function () {
        return this._dimensions;
        },
        
        /**
         * return font size of cc.LabelTTF
         * @return {Number}
         */
        getFontSize:function () {
        return this._fontSize;
        },
        
        /**
         * return font name of cc.LabelTTF
         * @return {String}
         */
        getFontName:function () {
        return this._fontName;
        },
        /**
         * position setter (override cc.Node )
         * @param {cc.Point} pos
         * @override
         */
        setPosition:function (pos) {
        if (arguments.length >= 2)
        cc.Node.prototype.setPosition.call(this, pos, arguments[1]);
        else
        cc.Node.prototype.setPosition.call(this, pos);
        this.SET_DIRTY_RECURSIVELY();
        }
    });
