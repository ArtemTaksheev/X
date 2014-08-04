/*
 *
 *                  xxxxxxx      xxxxxxx
 *                   x:::::x    x:::::x
 *                    x:::::x  x:::::x
 *                     x:::::xx:::::x
 *                      x::::::::::x
 *                       x::::::::x
 *                       x::::::::x
 *                      x::::::::::x
 *                     x:::::xx:::::x
 *                    x:::::x  x:::::x
 *                   x:::::x    x:::::x
 *              THE xxxxxxx      xxxxxxx TOOLKIT
 *
 *                  http://www.goXTK.com
 *
 * Copyright (c) 2012 The X Toolkit Developers <dev@goXTK.com>
 *
 *    The X Toolkit (XTK) is licensed under the MIT License:
 *      http://www.opensource.org/licenses/mit-license.php
 *
 *      "Free software" is a matter of liberty, not price.
 *      "Free" as in "free speech", not as in "free beer".
 *                                         - Richard M. Stallman
 *
 *
 */

// provides
goog.provide('X.renderer2D');
// requires
goog.require('X.renderer');
goog.require('goog.math.Vec3');
goog.require('goog.vec.Vec4');


/**
 * Create a 2D renderer inside a given DOM Element.
 *
 * @constructor
 * @extends X.renderer
 */
X.renderer2D = function() {

    //
    // call the standard constructor of X.renderer
    goog.base(this);

    //
    // class attributes

    /**
     * @inheritDoc
     * @const
     */
    this._classname = 'renderer2D';

    /**
     * The orientation of this renderer.
     *
     * @type {?string}
     * @protected
     */
    this._orientation = null;

    /**
     * The orientation index in respect to the
     * attached volume and its scan direction.
     *
     * @type {!number}
     * @protected
     */
    this._orientationIndex = -1;

    /**
     * The array of orientation colors.
     *
     * @type {!Array}
     * @protected
     */
    this._orientationColors = [];

    /**
     * A frame buffer for slice data.
     *
     * @type {?Element}
     * @protected
     */
    this._frameBuffer = null;

    /**
     * The rendering context of the slice frame buffer.
     *
     * @type {?Object}
     * @protected
     */
    this._frameBufferContext = null;

    /**
     * A frame buffer for label data.
     *
     * @type {?Element}
     * @protected
     */
    this._labelFrameBuffer = null;

    /**
     * The rendering context of the label frame buffer.
     *
     * @type {?Object}
     * @protected
     */
    this._labelFrameBufferContext = null;

    /**
     * The current slice width.
     *
     * @type {number}
     * @protected
     */
    this._sliceWidth = 0;

    /**
     * The current slice height.
     *
     * @type {number}
     * @protected
     */
    this._sliceHeight = 0;

    /**
     * The current slice width spacing.
     *
     * @type {number}
     * @protected
     */
    this._sliceWidthSpacing = 0;

    /**
     * The current slice height spacing.
     *
     * @type {number}
     * @protected
     */
    this._sliceHeightSpacing = 0;

    /**
     * The buffer of the current slice index.
     *
     * @type {!number}
     * @protected
     */
    this._currentSlice = -1;

    this._currentSliceId = -1;

    /**
     * The buffer of the current lower threshold.
     *
     * @type {!number}
     * @protected
     */
    this._lowerThreshold = -1;

    /**
     * The buffer of the current upper threshold.
     *
     * @type {!number}
     * @protected
     */
    this._upperThreshold = -1;

    /**
     * The buffer of the current w/l low value.
     *
     * @type {!number}
     * @protected
     */
    this._windowLow = -1;

    /**
     * The buffer of the current w/l high value.
     *
     * @type {!number}
     * @protected
     */
    this._windowHigh = -1;

    /**
     * The buffer of the showOnly labelmap color.
     *
     * @type {!Float32Array}
     * @protected
     */
    this._labelmapShowOnlyColor = new Float32Array([-255, -255, -255, -255]);


    /**
     * The convention we follow to draw the 2D slices. TRUE for RADIOLOGY, FALSE for NEUROLOGY.
     *
     * @type {!boolean}
     * @protected
     */
    this._radiological = true;



    // added this to check state in case of update with colormaps
    this._objectModified = false;

    this._colArrayHEAT = [[0, 0, 0, 0],
			  [0.0, 0.0, 143.4375, 255],
			  [0.0, 0.0, 143.4375, 255],
			  [0.0, 0.0, 143.4375, 255],
			  [0.0, 0.0, 159.375, 255],
			  [0.0, 0.0, 159.375, 255],
			  [0.0, 0.0, 159.375, 255],
			  [0.0, 0.0, 159.375, 255],
			  [0.0, 0.0, 175.3125, 255],
			  [0.0, 0.0, 175.3125, 255],
			  [0.0, 0.0, 175.3125, 255],
			  [0.0, 0.0, 175.3125, 255],
			  [0.0, 0.0, 191.25, 255],
			  [0.0, 0.0, 191.25, 255],
			  [0.0, 0.0, 191.25, 255],
			  [0.0, 0.0, 191.25, 255],
			  [0.0, 0.0, 207.1875, 255],
			  [0.0, 0.0, 207.1875, 255],
			  [0.0, 0.0, 207.1875, 255],
			  [0.0, 0.0, 207.1875, 255],
			  [0.0, 0.0, 223.125, 255],
			  [0.0, 0.0, 223.125, 255],
			  [0.0, 0.0, 223.125, 255],
			  [0.0, 0.0, 223.125, 255],
			  [0.0, 0.0, 239.0625, 255],
			  [0.0, 0.0, 239.0625, 255],
			  [0.0, 0.0, 239.0625, 255],
			  [0.0, 0.0, 239.0625, 255],
			  [0.0, 0.0, 255.0, 255],
			  [0.0, 0.0, 255.0, 255],
			  [0.0, 0.0, 255.0, 255],
			  [0.0, 0.0, 255.0, 255],
			  [0.0, 15.9375, 255.0, 255],
			  [0.0, 15.9375, 255.0, 255],
			  [0.0, 15.9375, 255.0, 255],
			  [0.0, 15.9375, 255.0, 255],
			  [0.0, 31.875, 255.0, 255],
			  [0.0, 31.875, 255.0, 255],
			  [0.0, 31.875, 255.0, 255],
			  [0.0, 31.875, 255.0, 255],
			  [0.0, 47.8125, 255.0, 255],
			  [0.0, 47.8125, 255.0, 255],
			  [0.0, 47.8125, 255.0, 255],
			  [0.0, 47.8125, 255.0, 255],
			  [0.0, 63.75, 255.0, 255],
			  [0.0, 63.75, 255.0, 255],
			  [0.0, 63.75, 255.0, 255],
			  [0.0, 63.75, 255.0, 255],
			  [0.0, 79.6875, 255.0, 255],
			  [0.0, 79.6875, 255.0, 255],
			  [0.0, 79.6875, 255.0, 255],
			  [0.0, 79.6875, 255.0, 255],
			  [0.0, 95.625, 255.0, 255],
			  [0.0, 95.625, 255.0, 255],
			  [0.0, 95.625, 255.0, 255],
			  [0.0, 95.625, 255.0, 255],
			  [0.0, 111.5625, 255.0, 255],
			  [0.0, 111.5625, 255.0, 255],
			  [0.0, 111.5625, 255.0, 255],
			  [0.0, 111.5625, 255.0, 255],
			  [0.0, 127.5, 255.0, 255],
			  [0.0, 127.5, 255.0, 255],
			  [0.0, 127.5, 255.0, 255],
			  [0.0, 127.5, 255.0, 255],
			  [0.0, 143.4375, 255.0, 255],
			  [0.0, 143.4375, 255.0, 255],
			  [0.0, 143.4375, 255.0, 255],
			  [0.0, 143.4375, 255.0, 255],
			  [0.0, 159.375, 255.0, 255],
			  [0.0, 159.375, 255.0, 255],
			  [0.0, 159.375, 255.0, 255],
			  [0.0, 159.375, 255.0, 255],
			  [0.0, 175.3125, 255.0, 255],
			  [0.0, 175.3125, 255.0, 255],
			  [0.0, 175.3125, 255.0, 255],
			  [0.0, 175.3125, 255.0, 255],
			  [0.0, 191.25, 255.0, 255],
			  [0.0, 191.25, 255.0, 255],
			  [0.0, 191.25, 255.0, 255],
			  [0.0, 191.25, 255.0, 255],
			  [0.0, 207.1875, 255.0, 255],
			  [0.0, 207.1875, 255.0, 255],
			  [0.0, 207.1875, 255.0, 255],
			  [0.0, 207.1875, 255.0, 255],
			  [0.0, 223.125, 255.0, 255],
			  [0.0, 223.125, 255.0, 255],
			  [0.0, 223.125, 255.0, 255],
			  [0.0, 223.125, 255.0, 255],
			  [0.0, 239.0625, 255.0, 255],
			  [0.0, 239.0625, 255.0, 255],
			  [0.0, 239.0625, 255.0, 255],
			  [0.0, 239.0625, 255.0, 255],
			  [0.0, 255.0, 255.0, 255],
			  [0.0, 255.0, 255.0, 255],
			  [0.0, 255.0, 255.0, 255],
			  [0.0, 255.0, 255.0, 255],
			  [15.9375, 255.0, 239.0625, 255],
			  [15.9375, 255.0, 239.0625, 255],
			  [15.9375, 255.0, 239.0625, 255],
			  [15.9375, 255.0, 239.0625, 255],
			  [31.875, 255.0, 223.125, 255],
			  [31.875, 255.0, 223.125, 255],
			  [31.875, 255.0, 223.125, 255],
			  [31.875, 255.0, 223.125, 255],
			  [47.8125, 255.0, 207.1875, 255],
			  [47.8125, 255.0, 207.1875, 255],
			  [47.8125, 255.0, 207.1875, 255],
			  [47.8125, 255.0, 207.1875, 255],
			  [63.75, 255.0, 191.25, 255],
			  [63.75, 255.0, 191.25, 255],
			  [63.75, 255.0, 191.25, 255],
			  [63.75, 255.0, 191.25, 255],
			  [79.6875, 255.0, 175.3125, 255],
			  [79.6875, 255.0, 175.3125, 255],
			  [79.6875, 255.0, 175.3125, 255],
			  [79.6875, 255.0, 175.3125, 255],
			  [95.625, 255.0, 159.375, 255],
			  [95.625, 255.0, 159.375, 255],
			  [95.625, 255.0, 159.375, 255],
			  [95.625, 255.0, 159.375, 255],
			  [111.5625, 255.0, 143.4375, 255],
			  [111.5625, 255.0, 143.4375, 255],
			  [111.5625, 255.0, 143.4375, 255],
			  [111.5625, 255.0, 143.4375, 255],
			  [127.5, 255.0, 127.5, 255],
			  [127.5, 255.0, 127.5, 255],
			  [127.5, 255.0, 127.5, 255],
			  [127.5, 255.0, 127.5, 255],
			  [143.4375, 255.0, 111.5625, 255],
			  [143.4375, 255.0, 111.5625, 255],
			  [143.4375, 255.0, 111.5625, 255],
			  [143.4375, 255.0, 111.5625, 255],
			  [159.375, 255.0, 95.625, 255],
			  [159.375, 255.0, 95.625, 255],
			  [159.375, 255.0, 95.625, 255],
			  [159.375, 255.0, 95.625, 255],
			  [175.3125, 255.0, 79.6875, 255],
			  [175.3125, 255.0, 79.6875, 255],
			  [175.3125, 255.0, 79.6875, 255],
			  [175.3125, 255.0, 79.6875, 255],
			  [191.25, 255.0, 63.75, 255],
			  [191.25, 255.0, 63.75, 255],
			  [191.25, 255.0, 63.75, 255],
			  [191.25, 255.0, 63.75, 255],
			  [207.1875, 255.0, 47.8125, 255],
			  [207.1875, 255.0, 47.8125, 255],
			  [207.1875, 255.0, 47.8125, 255],
			  [207.1875, 255.0, 47.8125, 255],
			  [223.125, 255.0, 31.875, 255],
			  [223.125, 255.0, 31.875, 255],
			  [223.125, 255.0, 31.875, 255],
			  [223.125, 255.0, 31.875, 255],
			  [239.0625, 255.0, 15.9375, 255],
			  [239.0625, 255.0, 15.9375, 255],
			  [239.0625, 255.0, 15.9375, 255],
			  [239.0625, 255.0, 15.9375, 255],
			  [255.0, 255.0, 0.0, 255],
			  [255.0, 255.0, 0.0, 255],
			  [255.0, 255.0, 0.0, 255],
			  [255.0, 255.0, 0.0, 255],
			  [255.0, 239.0625, 0.0, 255],
			  [255.0, 239.0625, 0.0, 255],
			  [255.0, 239.0625, 0.0, 255],
			  [255.0, 239.0625, 0.0, 255],
			  [255.0, 223.125, 0.0, 255],
			  [255.0, 223.125, 0.0, 255],
			  [255.0, 223.125, 0.0, 255],
			  [255.0, 223.125, 0.0, 255],
			  [255.0, 207.1875, 0.0, 255],
			  [255.0, 207.1875, 0.0, 255],
			  [255.0, 207.1875, 0.0, 255],
			  [255.0, 207.1875, 0.0, 255],
			  [255.0, 191.25, 0.0, 255],
			  [255.0, 191.25, 0.0, 255],
			  [255.0, 191.25, 0.0, 255],
			  [255.0, 191.25, 0.0, 255],
			  [255.0, 175.3125, 0.0, 255],
			  [255.0, 175.3125, 0.0, 255],
			  [255.0, 175.3125, 0.0, 255],
			  [255.0, 175.3125, 0.0, 255],
			  [255.0, 159.375, 0.0, 255],
			  [255.0, 159.375, 0.0, 255],
			  [255.0, 159.375, 0.0, 255],
			  [255.0, 159.375, 0.0, 255],
			  [255.0, 143.4375, 0.0, 255],
			  [255.0, 143.4375, 0.0, 255],
			  [255.0, 143.4375, 0.0, 255],
			  [255.0, 143.4375, 0.0, 255],
			  [255.0, 127.5, 0.0, 255],
			  [255.0, 127.5, 0.0, 255],
			  [255.0, 127.5, 0.0, 255],
			  [255.0, 127.5, 0.0, 255],
			  [255.0, 111.5625, 0.0, 255],
			  [255.0, 111.5625, 0.0, 255],
			  [255.0, 111.5625, 0.0, 255],
			  [255.0, 111.5625, 0.0, 255],
			  [255.0, 95.625, 0.0, 255],
			  [255.0, 95.625, 0.0, 255],
			  [255.0, 95.625, 0.0, 255],
			  [255.0, 95.625, 0.0, 255],
			  [255.0, 79.6875, 0.0, 255],
			  [255.0, 79.6875, 0.0, 255],
			  [255.0, 79.6875, 0.0, 255],
			  [255.0, 79.6875, 0.0, 255],
			  [255.0, 63.75, 0.0, 255],
			  [255.0, 63.75, 0.0, 255],
			  [255.0, 63.75, 0.0, 255],
			  [255.0, 63.75, 0.0, 255],
			  [255.0, 47.8125, 0.0, 255],
			  [255.0, 47.8125, 0.0, 255],
			  [255.0, 47.8125, 0.0, 255],
			  [255.0, 47.8125, 0.0, 255],
			  [255.0, 31.875, 0.0, 255],
			  [255.0, 31.875, 0.0, 255],
			  [255.0, 31.875, 0.0, 255],
			  [255.0, 31.875, 0.0, 255],
			  [255.0, 15.9375, 0.0, 255],
			  [255.0, 15.9375, 0.0, 255],
			  [255.0, 15.9375, 0.0, 255],
			  [255.0, 15.9375, 0.0, 255],
			  [255.0, 0.0, 0.0, 255],
			  [255.0, 0.0, 0.0, 255],
			  [255.0, 0.0, 0.0, 255],
			  [255.0, 0.0, 0.0, 255],
			  [239.0625, 0.0, 0.0, 255],
			  [239.0625, 0.0, 0.0, 255],
			  [239.0625, 0.0, 0.0, 255],
			  [239.0625, 0.0, 0.0, 255],
			  [223.125, 0.0, 0.0, 255],
			  [223.125, 0.0, 0.0, 255],
			  [223.125, 0.0, 0.0, 255],
			  [223.125, 0.0, 0.0, 255],
			  [207.1875, 0.0, 0.0, 255],
			  [207.1875, 0.0, 0.0, 255],
			  [207.1875, 0.0, 0.0, 255],
			  [207.1875, 0.0, 0.0, 255],
			  [191.25, 0.0, 0.0, 255],
			  [191.25, 0.0, 0.0, 255],
			  [191.25, 0.0, 0.0, 255],
			  [191.25, 0.0, 0.0, 255],
			  [175.3125, 0.0, 0.0, 255],
			  [175.3125, 0.0, 0.0, 255],
			  [175.3125, 0.0, 0.0, 255],
			  [175.3125, 0.0, 0.0, 255],
			  [159.375, 0.0, 0.0, 255],
			  [159.375, 0.0, 0.0, 255],
			  [159.375, 0.0, 0.0, 255],
			  [159.375, 0.0, 0.0, 255],
			  [143.4375, 0.0, 0.0, 255],
			  [143.4375, 0.0, 0.0, 255],
			  [143.4375, 0.0, 0.0, 255],
			  [143.4375, 0.0, 0.0, 255],
			  [127.5, 0.0, 0.0, 255],
			  [127.5, 0.0, 0.0, 255],
			  [127.5, 0.0, 0.0, 255],
			  [127.5, 0.0, 0.0, 255]
			 ];

    this._colArrayIDS = [[0, 0, 0, 0], 
			 [100, 100, 130, 255], 
			 [200, 200, 235, 255], 
			 [250, 250, 210, 255], 
			 [244, 214, 49, 255], 
			 [0, 151, 206, 255], 
			 [216, 101, 79, 255], 
			 [183, 156, 220, 255], 
			 [183, 214, 211, 255], 
			 [152, 189, 207, 255], 
			 [111, 184, 210, 255], 
			 [178, 212, 242, 255], 
			 [192, 104, 88, 255], 
			 [177, 122, 101, 255], 
			 [241, 214, 145, 255], 
			 [68, 172, 100, 255], 
			 [111, 197, 131, 255], 
			 [216, 101, 79, 255], 
			 [85, 188, 255, 255], 
			 [0, 145, 30, 255], 
			 [214, 230, 130, 255], 
			 [78, 63, 0, 255], 
			 [218, 255, 255, 255], 
			 [170, 250, 250, 255], 
			 [144, 238, 144, 255], 
			 [140, 224, 228, 255], 
			 [188, 65, 28, 255], 
			 [216, 191, 216, 255], 
			 [145, 60, 66, 255], 
			 [150, 98, 83, 255], 
			 [177, 122, 101, 255], 
			 [244, 214, 49, 255], 
			 [250, 250, 225, 255], 
			 [200, 200, 215, 255], 
			 [68, 131, 98, 255], 
			 [128, 174, 128, 255], 
			 [83, 146, 164, 255], 
			 [83, 146, 164, 255], 
			 [162, 115, 105, 255], 
			 [162, 115, 105, 255], 
			 [141, 93, 137, 255], 
			 [141, 93, 137, 255], 
			 [182, 166, 110, 255], 
			 [182, 166, 110, 255], 
			 [188, 135, 166, 255], 
			 [188, 135, 166, 255], 
			 [154, 150, 201, 255], 
			 [154, 150, 201, 255], 
			 [177, 140, 190, 255], 
			 [177, 140, 190, 255], 
			 [30, 111, 85, 255], 
			 [30, 111, 85, 255], 
			 [210, 157, 166, 255], 
			 [210, 157, 166, 255], 
			 [48, 129, 126, 255], 
			 [48, 129, 126, 255], 
			 [98, 153, 112, 255], 
			 [98, 153, 112, 255], 
			 [69, 110, 53, 255], 
			 [166, 113, 137, 255], 
			 [122, 101, 38, 255], 
			 [122, 101, 38, 255], 
			 [253, 135, 192, 255], 
			 [145, 92, 109, 255], 
			 [46, 101, 131, 255], 
			 [0, 108, 112, 255], 
			 [0, 108, 112, 255], 
			 [250, 250, 225, 255], 
			 [127, 150, 88, 255], 
			 [127, 150, 88, 255], 
			 [159, 116, 163, 255], 
			 [159, 116, 163, 255], 
			 [125, 102, 154, 255], 
			 [125, 102, 154, 255], 
			 [106, 174, 155, 255], 
			 [106, 174, 155, 255], 
			 [154, 146, 83, 255], 
			 [154, 146, 83, 255], 
			 [126, 126, 55, 255], 
			 [201, 160, 133, 255], 
			 [201, 160, 133, 255], 
			 [78, 152, 141, 255], 
			 [78, 152, 141, 255], 
			 [174, 140, 103, 255], 
			 [174, 140, 103, 255], 
			 [139, 126, 177, 255], 
			 [139, 126, 177, 255], 
			 [148, 120, 72, 255], 
			 [148, 120, 72, 255], 
			 [186, 135, 135, 255], 
			 [186, 135, 135, 255], 
			 [99, 106, 24, 255], 
			 [156, 171, 108, 255], 
			 [156, 171, 108, 255], 
			 [64, 123, 147, 255], 
			 [64, 123, 147, 255], 
			 [138, 95, 74, 255], 
			 [97, 113, 158, 255], 
			 [126, 161, 197, 255], 
			 [194, 195, 164, 255], 
			 [85, 188, 255, 255], 
			 [88, 106, 215, 255], 
			 [88, 106, 215, 255], 
			 [88, 106, 215, 255], 
			 [88, 106, 215, 255], 
			 [88, 106, 215, 255], 
			 [88, 106, 215, 255], 
			 [88, 106, 215, 255], 
			 [88, 106, 215, 255], 
			 [244, 214, 49, 255], 
			 [200, 200, 215, 255], 
			 [250, 250, 225, 255], 
			 [82, 174, 128, 255], 
			 [57, 157, 110, 255], 
			 [60, 143, 83, 255], 
			 [92, 162, 109, 255], 
			 [255, 244, 209, 255], 
			 [255, 244, 209, 255], 
			 [255, 244, 209, 255], 
			 [255, 244, 209, 255], 
			 [201, 121, 77, 255], 
			 [70, 163, 117, 255], 
			 [188, 91, 95, 255], 
			 [177, 122, 101, 255], 
			 [166, 84, 94, 255], 
			 [182, 105, 107, 255], 
			 [229, 147, 118, 255], 
			 [229, 147, 118, 255], 
			 [174, 122, 90, 255], 
			 [174, 122, 90, 255], 
			 [201, 112, 73, 255], 
			 [201, 112, 73, 255], 
			 [194, 142, 0, 255], 
			 [194, 142, 0, 255], 
			 [241, 213, 144, 255], 
			 [203, 179, 77, 255], 
			 [203, 179, 77, 255], 
			 [229, 204, 109, 255], 
			 [229, 204, 109, 255], 
			 [255, 243, 152, 255], 
			 [255, 243, 152, 255], 
			 [209, 185, 85, 255], 
			 [209, 185, 85, 255], 
			 [248, 223, 131, 255], 
			 [248, 223, 131, 255], 
			 [255, 230, 138, 255], 
			 [196, 172, 68, 255], 
			 [255, 255, 167, 255], 
			 [255, 250, 160, 255], 
			 [255, 237, 145, 255], 
			 [242, 217, 123, 255], 
			 [242, 217, 123, 255], 
			 [222, 198, 101, 255], 
			 [255, 250, 220, 255], 
			 [177, 122, 101, 255], 
			 [213, 124, 109, 255], 
			 [184, 105, 108, 255], 
			 [150, 208, 243, 255], 
			 [62, 162, 114, 255], 
			 [62, 162, 114, 255], 
			 [62, 162, 114, 255], 
			 [242, 206, 142, 255], 
			 [250, 210, 139, 255], 
			 [255, 255, 207, 255], 
			 [177, 122, 101, 255], 
			 [182, 228, 255, 255], 
			 [175, 216, 244, 255], 
			 [197, 165, 145, 255], 
			 [197, 165, 145, 255], 
			 [172, 138, 115, 255], 
			 [172, 138, 115, 255], 
			 [202, 164, 140, 255], 
			 [224, 186, 162, 255], 
			 [224, 186, 162, 255], 
			 [255, 245, 217, 255], 
			 [206, 110, 84, 255], 
			 [210, 115, 89, 255], 
			 [203, 108, 81, 255], 
			 [233, 138, 112, 255], 
			 [195, 100, 73, 255], 
			 [181, 85, 57, 255], 
			 [152, 55, 13, 255], 
			 [159, 63, 27, 255], 
			 [166, 70, 38, 255], 
			 [218, 123, 97, 255], 
			 [225, 130, 104, 255], 
			 [224, 97, 76, 255], 
			 [255, 244, 209, 255], 
			 [184, 122, 154, 255], 
			 [211, 171, 143, 255], 
			 [47, 150, 103, 255], 
			 [255, 244, 209, 255], 
			 [173, 121, 88, 255], 
			 [188, 95, 76, 255], 
			 [255, 239, 172, 255], 
			 [226, 202, 134, 255], 
			 [253, 232, 158, 255], 
			 [244, 217, 154, 255], 
			 [205, 179, 108, 255], 
			 [205, 179, 108, 255], 
			 [186, 124, 161, 255], 
			 [177, 122, 101, 255], 
			 [255, 255, 220, 255], 
			 [234, 234, 194, 255], 
			 [204, 142, 178, 255], 
			 [180, 119, 153, 255], 
			 [216, 132, 105, 255], 
			 [255, 253, 229, 255], 
			 [205, 167, 142, 255], 
			 [204, 168, 143, 255], 
			 [255, 224, 199, 255], 
			 [221, 130, 101, 255], 
			 [0, 145, 30, 255], 
			 [139, 150, 98, 255], 
			 [249, 180, 111, 255], 
			 [157, 108, 162, 255], 
			 [203, 136, 116, 255], 
			 [185, 102, 83, 255], 
			 [185, 102, 83, 255], 
			 [247, 182, 164, 255], 
			 [247, 182, 164, 255], 
			 [222, 154, 132, 255], 
			 [124, 186, 223, 255], 
			 [249, 186, 150, 255], 
			 [249, 186, 150, 255], 
			 [244, 170, 147, 255], 
			 [255, 181, 158, 255], 
			 [255, 190, 165, 255], 
			 [227, 153, 130, 255], 
			 [213, 141, 113, 255], 
			 [213, 141, 113, 255], 
			 [193, 123, 103, 255], 
			 [216, 146, 127, 255], 
			 [230, 158, 140, 255], 
			 [245, 172, 147, 255], 
			 [245, 172, 147, 255], 
			 [241, 172, 151, 255], 
			 [241, 172, 151, 255], 
			 [177, 124, 92, 255], 
			 [171, 85, 68, 255], 
			 [217, 198, 131, 255], 
			 [212, 188, 102, 255], 
			 [185, 135, 134, 255], 
			 [185, 135, 134, 255], 
			 [198, 175, 125, 255], 
			 [194, 98, 79, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [255, 238, 170, 255], 
			 [206, 111, 93, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [177, 122, 101, 255], 
			 [216, 186, 0, 255], 
			 [255, 226, 77, 255], 
			 [255, 243, 106, 255], 
			 [255, 234, 92, 255], 
			 [240, 210, 35, 255], 
			 [224, 194, 0, 255], 
			 [213, 99, 79, 255], 
			 [217, 102, 81, 255], 
			 [0, 147, 202, 255], 
			 [0, 122, 171, 255], 
			 [186, 77, 64, 255], 
			 [111, 197, 131, 255], 
			 [220, 245, 20, 255], 
			 [240, 255, 30, 255], 
			 [185, 232, 61, 255], 
			 [0, 226, 255, 255], 
			 [251, 159, 255, 255], 
			 [230, 169, 29, 255], 
			 [0, 194, 113, 255], 
			 [104, 160, 249, 255], 
			 [221, 108, 158, 255], 
			 [137, 142, 0, 255], 
			 [230, 70, 0, 255], 
			 [0, 147, 0, 255], 
			 [0, 147, 248, 255], 
			 [231, 0, 206, 255], 
			 [129, 78, 0, 255], 
			 [0, 116, 0, 255], 
			 [0, 0, 255, 255]
			];



    this._colArrayDEFAULT = [[0, 0, 0, 255],
			     [1, 1, 1, 255],
			     [2, 2, 2, 255],
			     [3, 3, 3, 255],
			     [4, 4, 4, 255],
			     [5, 5, 5, 255],
			     [6, 6, 6, 255],
			     [7, 7, 7, 255],
			     [8, 8, 8, 255],
			     [9, 9, 9, 255],
			     [10, 10, 10, 255],
			     [11, 11, 11, 255],
			     [12, 12, 12, 255],
			     [13, 13, 13, 255],
			     [14, 14, 14, 255],
			     [15, 15, 15, 255],
			     [16, 16, 16, 255],
			     [17, 17, 17, 255],
			     [18, 18, 18, 255],
			     [19, 19, 19, 255],
			     [20, 20, 20, 255],
			     [21, 21, 21, 255],
			     [22, 22, 22, 255],
			     [23, 23, 23, 255],
			     [24, 24, 24, 255],
			     [25, 25, 25, 255],
			     [26, 26, 26, 255],
			     [27, 27, 27, 255],
			     [28, 28, 28, 255],
			     [29, 29, 29, 255],
			     [30, 30, 30, 255],
			     [31, 31, 31, 255],
			     [32, 32, 32, 255],
			     [33, 33, 33, 255],
			     [34, 34, 34, 255],
			     [35, 35, 35, 255],
			     [36, 36, 36, 255],
			     [37, 37, 37, 255],
			     [38, 38, 38, 255],
			     [39, 39, 39, 255],
			     [40, 40, 40, 255],
			     [41, 41, 41, 255],
			     [42, 42, 42, 255],
			     [43, 43, 43, 255],
			     [44, 44, 44, 255],
			     [45, 45, 45, 255],
			     [46, 46, 46, 255],
			     [47, 47, 47, 255],
			     [48, 48, 48, 255],
			     [49, 49, 49, 255],
			     [50, 50, 50, 255],
			     [51, 51, 51, 255],
			     [52, 52, 52, 255],
			     [53, 53, 53, 255],
			     [54, 54, 54, 255],
			     [55, 55, 55, 255],
			     [56, 56, 56, 255],
			     [57, 57, 57, 255],
			     [58, 58, 58, 255],
			     [59, 59, 59, 255],
			     [60, 60, 60, 255],
			     [61, 61, 61, 255],
			     [62, 62, 62, 255],
			     [63, 63, 63, 255],
			     [64, 64, 64, 255],
			     [65, 65, 65, 255],
			     [66, 66, 66, 255],
			     [67, 67, 67, 255],
			     [68, 68, 68, 255],
			     [69, 69, 69, 255],
			     [70, 70, 70, 255],
			     [71, 71, 71, 255],
			     [72, 72, 72, 255],
			     [73, 73, 73, 255],
			     [74, 74, 74, 255],
			     [75, 75, 75, 255],
			     [76, 76, 76, 255],
			     [77, 77, 77, 255],
			     [78, 78, 78, 255],
			     [79, 79, 79, 255],
			     [80, 80, 80, 255],
			     [81, 81, 81, 255],
			     [82, 82, 82, 255],
			     [83, 83, 83, 255],
			     [84, 84, 84, 255],
			     [85, 85, 85, 255],
			     [86, 86, 86, 255],
			     [87, 87, 87, 255],
			     [88, 88, 88, 255],
			     [89, 89, 89, 255],
			     [90, 90, 90, 255],
			     [91, 91, 91, 255],
			     [92, 92, 92, 255],
			     [93, 93, 93, 255],
			     [94, 94, 94, 255],
			     [95, 95, 95, 255],
			     [96, 96, 96, 255],
			     [97, 97, 97, 255],
			     [98, 98, 98, 255],
			     [99, 99, 99, 255],
			     [100, 100, 100, 255],
			     [101, 101, 101, 255],
			     [102, 102, 102, 255],
			     [103, 103, 103, 255],
			     [104, 104, 104, 255],
			     [105, 105, 105, 255],
			     [106, 106, 106, 255],
			     [107, 107, 107, 255],
			     [108, 108, 108, 255],
			     [109, 109, 109, 255],
			     [110, 110, 110, 255],
			     [111, 111, 111, 255],
			     [112, 112, 112, 255],
			     [113, 113, 113, 255],
			     [114, 114, 114, 255],
			     [115, 115, 115, 255],
			     [116, 116, 116, 255],
			     [117, 117, 117, 255],
			     [118, 118, 118, 255],
			     [119, 119, 119, 255],
			     [120, 120, 120, 255],
			     [121, 121, 121, 255],
			     [122, 122, 122, 255],
			     [123, 123, 123, 255],
			     [124, 124, 124, 255],
			     [125, 125, 125, 255],
			     [126, 126, 126, 255],
			     [127, 127, 127, 255],
			     [128, 128, 128, 255],
			     [129, 129, 129, 255],
			     [130, 130, 130, 255],
			     [131, 131, 131, 255],
			     [132, 132, 132, 255],
			     [133, 133, 133, 255],
			     [134, 134, 134, 255],
			     [135, 135, 135, 255],
			     [136, 136, 136, 255],
			     [137, 137, 137, 255],
			     [138, 138, 138, 255],
			     [139, 139, 139, 255],
			     [140, 140, 140, 255],
			     [141, 141, 141, 255],
			     [142, 142, 142, 255],
			     [143, 143, 143, 255],
			     [144, 144, 144, 255],
			     [145, 145, 145, 255],
			     [146, 146, 146, 255],
			     [147, 147, 147, 255],
			     [148, 148, 148, 255],
			     [149, 149, 149, 255],
			     [150, 150, 150, 255],
			     [151, 151, 151, 255],
			     [152, 152, 152, 255],
			     [153, 153, 153, 255],
			     [154, 154, 154, 255],
			     [155, 155, 155, 255],
			     [156, 156, 156, 255],
			     [157, 157, 157, 255],
			     [158, 158, 158, 255],
			     [159, 159, 159, 255],
			     [160, 160, 160, 255],
			     [161, 161, 161, 255],
			     [162, 162, 162, 255],
			     [163, 163, 163, 255],
			     [164, 164, 164, 255],
			     [165, 165, 165, 255],
			     [166, 166, 166, 255],
			     [167, 167, 167, 255],
			     [168, 168, 168, 255],
			     [169, 169, 169, 255],
			     [170, 170, 170, 255],
			     [171, 171, 171, 255],
			     [172, 172, 172, 255],
			     [173, 173, 173, 255],
			     [174, 174, 174, 255],
			     [175, 175, 175, 255],
			     [176, 176, 176, 255],
			     [177, 177, 177, 255],
			     [178, 178, 178, 255],
			     [179, 179, 179, 255],
			     [180, 180, 180, 255],
			     [181, 181, 181, 255],
			     [182, 182, 182, 255],
			     [183, 183, 183, 255],
			     [184, 184, 184, 255],
			     [185, 185, 185, 255],
			     [186, 186, 186, 255],
			     [187, 187, 187, 255],
			     [188, 188, 188, 255],
			     [189, 189, 189, 255],
			     [190, 190, 190, 255],
			     [191, 191, 191, 255],
			     [192, 192, 192, 255],
			     [193, 193, 193, 255],
			     [194, 194, 194, 255],
			     [195, 195, 195, 255],
			     [196, 196, 196, 255],
			     [197, 197, 197, 255],
			     [198, 198, 198, 255],
			     [199, 199, 199, 255],
			     [200, 200, 200, 255],
			     [201, 201, 201, 255],
			     [202, 202, 202, 255],
			     [203, 203, 203, 255],
			     [204, 204, 204, 255],
			     [205, 205, 205, 255],
			     [206, 206, 206, 255],
			     [207, 207, 207, 255],
			     [208, 208, 208, 255],
			     [209, 209, 209, 255],
			     [210, 210, 210, 255],
			     [211, 211, 211, 255],
			     [212, 212, 212, 255],
			     [213, 213, 213, 255],
			     [214, 214, 214, 255],
			     [215, 215, 215, 255],
			     [216, 216, 216, 255],
			     [217, 217, 217, 255],
			     [218, 218, 218, 255],
			     [219, 219, 219, 255],
			     [220, 220, 220, 255],
			     [221, 221, 221, 255],
			     [222, 222, 222, 255],
			     [223, 223, 223, 255],
			     [224, 224, 224, 255],
			     [225, 225, 225, 255],
			     [226, 226, 226, 255],
			     [227, 227, 227, 255],
			     [228, 228, 228, 255],
			     [229, 229, 229, 255],
			     [230, 230, 230, 255],
			     [231, 231, 231, 255],
			     [232, 232, 232, 255],
			     [233, 233, 233, 255],
			     [234, 234, 234, 255],
			     [235, 235, 235, 255],
			     [236, 236, 236, 255],
			     [237, 237, 237, 255],
			     [238, 238, 238, 255],
			     [239, 239, 239, 255],
			     [240, 240, 240, 255],
			     [241, 241, 241, 255],
			     [242, 242, 242, 255],
			     [243, 243, 243, 255],
			     [244, 244, 244, 255],
			     [245, 245, 245, 255],
			     [246, 246, 246, 255],
			     [247, 247, 247, 255],
			     [248, 248, 248, 255],
			     [249, 249, 249, 255],
			     [250, 250, 250, 255],
			     [251, 251, 251, 255],
			     [252, 252, 252, 255],
			     [253, 253, 253, 255],
			     [254, 254, 254, 255]
			    ];


    this._colArrayCURRENT = this._colArrayDEFAULT;
    this._colArrayChanged = false;
};
// inherit from X.base
goog.inherits(X.renderer2D, X.renderer);


/**
 * Overload this function to execute code after scrolling has completed and just
 * before the next rendering call.
 *
 * @public
 */
X.renderer2D.prototype.onScroll = function() {

    // do nothing
};


/**
 * Overload this function to execute code after window/level adjustment has
 * completed and just before the next rendering call.
 *
 * @public
 */
X.renderer2D.prototype.onWindowLevel = function() {

    // do nothing
};


/**
 * @inheritDoc
 */
X.renderer2D.prototype.onScroll_ = function(event) {

    //window.console.log('X.renderer2D.onScroll_()');


    goog.base(this, 'onScroll_', event);

    // grab the current volume
    var _volume = this._topLevelObjects[0];

    // .. if there is none, exit right away
    if (!_volume) {

	return;

    }

    // switch between different orientations
    var _orientation = "";

    if (this._orientationIndex == 0) {

	_orientation = "indexX";

    } else if (this._orientationIndex == 1) {

	_orientation = "indexY";

    } else {

	_orientation = "indexZ";

    }

    if (event._up) {

	// yes, scroll up
	_volume[_orientation] = _volume[_orientation] + 1;

    } else {

	// yes, so scroll down
	_volume[_orientation] = _volume[_orientation] - 1;

    }

    // execute the callback
    eval('this.onScroll();');

    // .. and trigger re-rendering
    // this.render_(false, false);
};


/**
 * Performs window/level adjustment for the currently loaded volume.
 *
 * @param {!X.event.WindowLevelEvent} event The window/level event from the
 *          camera.
 */
X.renderer2D.prototype.onWindowLevel_ = function(event) {

    // grab the current volume
    var _volume = this._topLevelObjects[0];

    // .. if there is none, exit right away
    if (!_volume) {
	return;
    }

    // update window level
    var _old_window = _volume._windowHigh - _volume._windowLow;
    var _old_level = _old_window / 2;

    // shrink/expand window
    var _new_window = parseInt(_old_window + (_old_window / 15) * -event._window,
			       10);

    // increase/decrease level
    var _new_level = parseInt(_old_level + (_old_level / 15) * event._level, 10);

    // TODO better handling of these cases
    if (_old_window == _new_window) {
	_new_window++;
    }
    if (_old_level == _new_level) {
	_new_level++;
    }

    // re-propagate
    _volume._windowLow -= parseInt(_old_level - _new_level, 10);
    _volume._windowLow -= parseInt(_old_window - _new_window, 10);
    _volume._windowLow = Math.max(_volume._windowLow, _volume._min);
    _volume._windowHigh -= parseInt(_old_level - _new_level, 10);
    _volume._windowHigh += parseInt(_old_window - _new_window, 10);
    _volume._windowHigh = Math.min(_volume._windowHigh, _volume._max);

    // execute the callback
    eval('this.onWindowLevel();');

};


/**
 * Get the orientation of this renderer. Valid orientations are 'x','y','z' or
 * null.
 *
 * @return {?string} The orientation of this renderer.
 */
X.renderer2D.prototype.__defineGetter__('orientation', function() {

    return this._orientation;

});


/**
 * Set the orientation for this renderer. Valid orientations are 'x','y' or 'z' or 'axial',
 * 'sagittal' or 'coronal'.
 *
 * AXIAL == Z
 * SAGITTAL == X
 * CORONAL == Y
 *
 * @param {!string} orientation The orientation for this renderer: 'x','y' or
 *          'z' or 'axial', 'sagittal' or 'coronal'.
 * @throws {Error} An error, if the given orientation was wrong.
 */
X.renderer2D.prototype.__defineSetter__('orientation', function(orientation) {

    orientation = orientation.toUpperCase();

    if (orientation == 'AXIAL') {

	orientation = 'Z';
	this._orientationIndex = 2;

    } else if (orientation == 'SAGITTAL') {

	orientation = 'X';
	this._orientationIndex = 0;

    } else if (orientation == 'CORONAL') {

	orientation = 'Y';
	this._orientationIndex = 1;

    }

    if (orientation != 'X' && orientation != 'Y' && orientation != 'Z') {

	throw new Error('Invalid orientation.');

    }

    this._orientation = orientation;

    var _volume = this._topLevelObjects[0];

});

/**
 * Get the convention of this renderer.
 *
 * @return {!boolean} TRUE if the RADIOLOGY convention is used, FALSE if the
 *                    NEUROLOGY convention is used.
 */
X.renderer2D.prototype.__defineGetter__('radiological', function() {

    return this._radiological;

});


/**
 * Set the convention for this renderer. There is a difference between radiological and neurological
 * convention in terms of treating the coronal left and right.
 *
 * Default is the radiological convention.
 *
 * @param {!boolean} radiological TRUE if the RADIOLOGY convention is used, FALSE if the
 *                                NEUROLOGY convention is used.
 */
X.renderer2D.prototype.__defineSetter__('radiological', function(radiological) {

    this._radiological = radiological;

});


/**
 * @inheritDoc
 */
X.renderer2D.prototype.init = function() {

    // make sure an orientation is configured
    if (!this._orientation) {

	throw new Error('No 2D orientation set.');

    }

    // call the superclass' init method
    goog.base(this, 'init', '2d');

    // use the background color of the container by setting transparency here
    this._context.fillStyle = "rgba(50,50,50,0)";

    // .. and size
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    // create an invisible canvas as a framebuffer
    this._frameBuffer = goog.dom.createDom('canvas');
    this._labelFrameBuffer = goog.dom.createDom('canvas');

    //
    //
    // try to apply nearest-neighbor interpolation -> does not work right now
    // so we ignore it
    // this._labelFrameBuffer.style.imageRendering = 'optimizeSpeed';
    // this._labelFrameBuffer.style.imageRendering = '-moz-crisp-edges';
    // this._labelFrameBuffer.style.imageRendering = '-o-crisp-edges';
    // this._labelFrameBuffer.style.imageRendering = '-webkit-optimize-contrast';
    // this._labelFrameBuffer.style.imageRendering = 'optimize-contrast';
    // this._labelFrameBuffer.style.msInterpolationMode = 'nearest-neighbor';

    // listen to window/level events of the camera
    goog.events.listen(this._camera, X.event.events.WINDOWLEVEL,
		       this.onWindowLevel_.bind(this));

};


/**
 * @inheritDoc
 */
X.renderer2D.prototype.onResize_ = function() {

    // call the super class
    goog.base(this, 'onResize_');

    // in 2D we also want to perform auto scaling
    this.autoScale_();

};


/**
 * @inheritDoc
 */
X.renderer2D.prototype.resetViewAndRender = function() {

    // call the super class
    goog.base(this, 'resetViewAndRender');

    // .. and perform auto scaling
    this.autoScale_();

    // .. and reset the window/level
    var _volume = this._topLevelObjects[0];

    // .. if there is none, exit right away
    if (_volume) {

	_volume._windowHigh = _volume._max;
	_volume._windowLow = _volume._min;

    }
    // .. render
    // this.render_(false, false);
};




/**
 * @inheritDoc
 */
X.renderer2D.prototype.setColortable = function(index) {

    window.console.log('X.renderer2D.setColortable(' + index + ')');

    var _volume = this._topLevelObjects[0];

    if (index == 0)
	this._colArrayCURRENT = this._colArrayDEFAULT;
    if (index == 1)
	this._colArrayCURRENT = this._colArrayIDS;
    else if (index == 2)
	this._colArrayCURRENT = this._colArrayHEAT;

    this._colArrayChanged =  true;

};



/**
 * Convenience method to get the index of the volume container for a given
 * orientation.
 *
 * @param {?string} targetOrientation The orientation required.
 * @return {!number} The index of the volume children.
 * @private
 */

X.renderer2D.prototype.volumeChildrenIndex_ = function(targetOrientation) {

    if (targetOrientation == 'X') {

	return 0;

    } else if (targetOrientation == 'Y') {


	return 1;

    } else {

	return 2;
    }
};



/*CUSTOM FUNC FOR RELOADING THE COLOR TABLE*/
//D.B.
/*
  X.renderer2D.prototype.resetColorTable = function(object) {

  window.console.log('X.renderer2d.resetColorTable');
  
  var colortable = object._colortable;

  //
  // COLOR TABLE
  //
  if (goog.isDefAndNotNull(colortable) &&
  goog.isDefAndNotNull(colortable._file) && colortable._file._dirty) {

  window.console.log('X.renderer2d.update_ colorTable!');

  // a colortable file is associated to this object and it is dirty..
  // start loading
  this._loader.load(colortable, object);

  return;

  }
  };
*/


//D.B.

X.renderer2D.prototype.update  = function(object) {
    //requires the volume to be loaded
    window.console.log('X.renderer2d.update()');

    //do both updates get called!?

    this.update_(object);
};




/**
 * @inheritDoc
 */
X.renderer2D.prototype.update_ = function(object) {

    window.console.log('X.renderer2d.update_() - ' + this.orientation);
    //window.console.log(object);

    // call the update_ method of the superclass
    goog.base(this, 'update_', object);

    // check if object already existed..
    var existed = false;
    if (this.get(object._id)) {

	// this means, we are updating
	existed = true;

    }

    if (!(object instanceof X.volume)) {

	// we only add volumes in the 2d renderer for now
	return;

    }

    // var id = object._id;
    // var texture = object._texture;
    var file = object._file;
    var labelmap = object._labelmap; // here we access directly since we do not
    // want to create one using the labelmap() singleton accessor

    var colortable = object._colortable;

    //
    // LABEL MAP
    //
    if (goog.isDefAndNotNull(labelmap) && goog.isDefAndNotNull(labelmap._file) &&
	labelmap._file._dirty) {

	//window.console.log('X.renderer2d.update_ labelMap!');

	// a labelmap file is associated to this object and it is dirty..
	// background: we always want to parse label maps first
	// run the update_ function on the labelmap object

	//ODD THAT IT WOULD RUN IT AGAIN WITH A LABELMAP?

	this.update_(labelmap);

	// jump out
	return;

    }

    //
    // COLOR TABLE
    //
    if (goog.isDefAndNotNull(colortable) &&
	goog.isDefAndNotNull(colortable._file) && colortable._file._dirty) {

	//window.console.log('X.renderer2d.update_ colorTable!');

	// a colortable file is associated to this object and it is dirty..
	// start loading
	this._loader.load(colortable, object);

	return;

    }

    //
    // VOLUME
    //
    // with multiple files
    if (goog.isDefAndNotNull(file) && goog.isArray(file)) {

	//window.console.log('X.renderer2d.update_ multiple files!');

	// this object holds multiple files, a.k.a it is a DICOM series
	// check if we already loaded all the files
	if (!goog.isDefAndNotNull(object.MRI)) {

	    // no files loaded at all, start the loading
	    var _k = 0;
	    var _len = file.length;

	    for (_k = 0; _k < _len; _k++) {

		// start loading of each file..
		this._loader.load(file[_k], object);

	    }

	    return;

	} else if (object.MRI.loaded_files != file.length) {

	    // still loading
	    return;

	} else if (existed && !object._dirty) {

	    window.console.log('ALREADY PARSED VOLUME');
	    // already parsed the volume
	    return;

	}

	// just continue

    }

    // with one file
    else if (goog.isDefAndNotNull(file) && file._dirty) {

	window.console.log('X.renderer2d.update_ just one file!');

	// this object is based on an external file and it is dirty..
	// start loading..
	this._loader.load(object, object);

	return;

    }
    //D.B. - just checking... so the _dirty flag is being used to check...
    else if (!file._dirty) {

	window.console.log('ALREADY PARSED VOLUME');
	// already parsed the volume


    }
    //
    // at this point the orientation of this renderer might have changed so we
    // should recalculate all the cached values

    // volume dimensions
    var _dim = object._dimensions;

    // check the orientation and store a pointer to the slices
    this._orientationIndex = this.volumeChildrenIndex_(this._orientation);

    // size
    this._slices = object._children[this._orientationIndex]._children;
    
    var _currentSlice = null;
    if (this._orientationIndex == 0) {

	_currentSlice = object['indexX'];

    } else if (this._orientationIndex == 1) {

	_currentSlice = object['indexY'];

    } else {

	_currentSlice = object['indexZ'];

    }
    
    var _width = object._children[this._orientationIndex]._children[_currentSlice]._iWidth;
    var _height = object._children[this._orientationIndex]._children[_currentSlice]._iHeight;
    // spacing
    this._sliceWidthSpacing = object._children[this._orientationIndex]._children[_currentSlice]._widthSpacing;
    this._sliceHeightSpacing = object._children[this._orientationIndex]._children[_currentSlice]._heightSpacing;
    
    // .. and store the dimensions
    this._sliceWidth = _width;
    this._sliceHeight = _height;

    // update the invisible canvas to store the current slice
    var _frameBuffer = this._frameBuffer;
    _frameBuffer.width = _width;
    _frameBuffer.height = _height;

    var _frameBuffer2 = this._labelFrameBuffer;
    _frameBuffer2.width = _width;
    _frameBuffer2.height = _height;

    // .. and the context
    this._frameBufferContext = _frameBuffer.getContext('2d');
    this._labelFrameBufferContext = _frameBuffer2.getContext('2d');

    // do the following only if the object is brand-new
    if (!existed) {

	this._objects.add(object);
	this.autoScale_();

    }

};


/**
 * Adjust the zoom (scale) to best fit the current slice.
 */
X.renderer2D.prototype.autoScale_ = function() {

    // let's auto scale for best fit
    var _wScale = this._width / (this._sliceWidth * this._sliceWidthSpacing);
    var _hScale = this._height / (this._sliceHeight * this._sliceHeightSpacing);

    var _autoScale = Math.min(_wScale, _hScale);

    // propagate scale (zoom) to the camera
    var _view = this._camera._view;
    _view[14] = _autoScale;

};


/**
 * Callback for slice navigation, f.e. to update sliders.
 *
 * @public
 */
X.renderer2D.prototype.onSliceNavigation = function() {

    // should be overloaded

};


/**
 * Convert viewport (canvas) coordinates to volume (index) coordinates.
 *
 * @param x The x coordinate.
 * @param y The y coordinate.
 * @return {?Array} An array of [i,j,k] coordinates or null if out of frame.
 */
X.renderer2D.prototype.xy2ijk = function(x, y) {

    var _volume = this._topLevelObjects[0];
    var _view = this._camera._view;
    var _currentSlice = null;

    var _sliceWidth = this._sliceWidth;
    var _sliceHeight = this._sliceHeight;
    var _sliceWSpacing = null;
    var _sliceHSpacing = null;

    // get current slice
    // which color?
    if (this._orientation == "Y") {
	_currentSlice = this._slices[parseInt(_volume['indexY'], 10)];
	_sliceWSpacing = _currentSlice._widthSpacing;
	_sliceHSpacing = _currentSlice._heightSpacing;
	this._orientationColors[0] = 'red';
	this._orientationColors[1] = 'blue';

    } else if (this._orientation == "Z") {
	_currentSlice = this._slices[parseInt(_volume['indexZ'], 10)];
	_sliceWSpacing = _currentSlice._widthSpacing;
	_sliceHSpacing = _currentSlice._heightSpacing;
	this._orientationColors[0] = 'red';
	this._orientationColors[1] = 'green';

    } else {
	_currentSlice = this._slices[parseInt(_volume['indexX'], 10)];
	_sliceWSpacing = _currentSlice._heightSpacing;
	_sliceHSpacing = _currentSlice._widthSpacing;
	this._orientationColors[0] = 'green';
	this._orientationColors[1] = 'blue';

	var _buf = _sliceWidth;
	_sliceWidth = _sliceHeight;
	_sliceHeight = _buf;
    }

    // padding offsets
    var _x = 1 * _view[12];
    var _y = -1 * _view[13]; // we need to flip y here

    // .. and zoom
    var _normalizedScale = Math.max(_view[14], 0.6);
    var _center = [this._width / 2, this._height / 2];

    // the slice dimensions in canvas coordinates
    var _sliceWidthScaled = _sliceWidth * _sliceWSpacing *
	_normalizedScale;
    var _sliceHeightScaled = _sliceHeight * _sliceHSpacing *
	_normalizedScale;

    // the image borders on the left and top in canvas coordinates
    var _image_left2xy = _center[0] - (_sliceWidthScaled / 2);
    var _image_top2xy = _center[1] - (_sliceHeightScaled / 2);

    // incorporate the padding offsets (but they have to be scaled)
    _image_left2xy += _x * _normalizedScale;
    _image_top2xy += _y * _normalizedScale;

    if(x>_image_left2xy && x < _image_left2xy + _sliceWidthScaled &&
       y>_image_top2xy && y < _image_top2xy + _sliceHeightScaled){

	var _xNorm = (x - _image_left2xy)/ _sliceWidthScaled;
	var _yNorm = (y - _image_top2xy)/ _sliceHeightScaled;
	
	_x = _xNorm*_sliceWidth;
	_y = _yNorm*_sliceHeight;
	var _z = _currentSlice._xyBBox[4];

	if (this._orientation == "X") {
	    // invert cols
	    // then invert x and y to compensate camera +90d rotation
	    _x = _sliceWidth - _x;

	    var _buf = _x;
	    _x = _y;
	    _y = _buf;

	}
	else if (this._orientation == "Y") {
	    
	    // invert cols
	    _x = _sliceWidth - _x;

	}
	else if (this._orientation == "Z") {
	    
	    // invert all
	    _x = _sliceWidth - _x;
	    _y = _sliceHeight - _y;

	}

	// map indices to xy coordinates
	_x = _currentSlice._wmin + _x*_currentSlice._widthSpacing;
	_y = _currentSlice._hmin + _y*_currentSlice._heightSpacing;

	var _xyz = goog.vec.Vec4.createFloat32FromValues(_x, _y, _z, 1);
	var _ijk = goog.vec.Mat4.createFloat32();
	goog.vec.Mat4.multVec4(_currentSlice._XYToIJK, _xyz, _ijk);
	var _ras = goog.vec.Mat4.createFloat32();
	goog.vec.Mat4.multVec4(_currentSlice._XYToRAS, _xyz, _ras);

	var _dx = _volume._childrenInfo[0]._sliceNormal[0]*_ras[0]
	    + _volume._childrenInfo[0]._sliceNormal[1]*_ras[1]
	    + _volume._childrenInfo[0]._sliceNormal[2]*_ras[2]
	    + _volume._childrenInfo[0]._originD;

	var _ix = Math.round(_dx/_volume._childrenInfo[0]._sliceSpacing);
	if(_ix >= _volume._childrenInfo[0]._nb){
	    _ix = _volume._childrenInfo[0]._nb - 1;
	}
	else if(_ix < 0){
	    _ix = 0;
	}


	var _dy = _volume._childrenInfo[1]._sliceNormal[0]*_ras[0]
	    + _volume._childrenInfo[1]._sliceNormal[1]*_ras[1]
	    + _volume._childrenInfo[1]._sliceNormal[2]*_ras[2]
	    + _volume._childrenInfo[1]._originD;

	var _iy = Math.round(_dy/_volume._childrenInfo[1]._sliceSpacing);
	if(_iy >= _volume._childrenInfo[1]._nb){
	    _iy = _volume._childrenInfo[1]._nb - 1;
	}
	else if(_iy < 0) {
	    _iy = 0;
	}

	// get plane distance from the origin
	var _dz = _volume._childrenInfo[2]._sliceNormal[0]*_ras[0]
	    + _volume._childrenInfo[2]._sliceNormal[1]*_ras[1]
	    + _volume._childrenInfo[2]._sliceNormal[2]*_ras[2]
	    + _volume._childrenInfo[2]._originD;

	var _iz = Math.round(_dz/_volume._childrenInfo[2]._sliceSpacing);
	if(_iz >= _volume._childrenInfo[2]._nb){
	    _iz = _volume._childrenInfo[2]._nb - 1;
	}
	else if(_iz < 0){
	    // translate origin by distance
	    _iz = 0;
	}

	return [[_ix, _iy, _iz], [_ijk[0], _ijk[1], _ijk[2]], [_ras[0], _ras[1], _ras[2]]];
    }

    return null;
};


/**
 * @inheritDoc
 */
X.renderer2D.prototype.render_ = function(picking, invoked) {

    //introduce a check here to see if loader has actually completed?


    //D.B.
    //window.console.log('renderer2D.render_()');

    // call the render_ method of the superclass
    goog.base(this, 'render_', picking, invoked);

    // only proceed if there are actually objects to render
    var _objects = this._objects.values();

    var _numberOfObjects = _objects.length;
    if (_numberOfObjects == 0) {

	// there is nothing to render
	// get outta here
	return;

    }

    //D.B. - picking the actual index for the slice!

    var _volume = this._topLevelObjects[0];

    if(_volume){
	if(this.loader){
	    if(!this.loader.completed()){
		window.console.log('LOADER NOT COMPLETED');
	    }
	    else{
		
		//DETERMINE WHICH SLICE TO PICK
		var _currentSlice = null;
		if (this._orientationIndex == 0) {
		    _currentSlice = _volume['indexX'];
		} else if (this._orientationIndex == 1) {
		    _currentSlice = _volume['indexY'];
		} else {
		    _currentSlice = _volume['indexZ'];
		}
		//window.console.log('renderer2D.render_() : current slice = ' + _currentSlice);
		

		//if slice do not exist yet, we have to set slice dimensions
		var _width2 = this._slices[parseInt(_currentSlice, 10)]._iWidth;
		var _height2 = this._slices[parseInt(_currentSlice, 10)]._iHeight;
		// spacing
		this._sliceWidthSpacing = this._slices[parseInt(_currentSlice, 10)]._widthSpacing;
		this._sliceHeightSpacing = this._slices[parseInt(_currentSlice, 10)]._heightSpacing;
		// .. and store the dimensions
		this._sliceWidth = _width2;
		this._sliceHeight = _height2;

		//window.console.log('renderer2D.render_() : current sliceWidth = ' + this._sliceWidth);

		//
		// grab the camera settings

		//
		// viewport size
		var _width = this._width;
		var _height = this._height;

		// first grab the view matrix which is 4x4 in favor of the 3D renderer
		var _view = this._camera._view;

		// clear the canvas
		this._context.save();
		this._context.clearRect(-_width, -_height, 2 * _width, 2 * _height);
		this._context.restore();

		// transform the canvas according to the view matrix
		// .. this includes zoom
		var _normalizedScale = Math.max(_view[14], 0.1);

		this._context.setTransform(_normalizedScale, 0, 0, _normalizedScale, 0, 0);

		// .. and pan
		// we need to flip y here
		var _x = 1 * _view[12];
		var _y = -1 * _view[13];
		//
		// grab the volume and current slice
		//

		var _labelmap = _volume._labelmap;
		var _labelmapShowOnlyColor = null;

		if (_labelmap) {

		    // since there is a labelmap, get the showOnlyColor property
		    _labelmapShowOnlyColor = _volume._labelmap._showOnlyColor;

		}

		// .. here is the current slice


		var _slice = this._slices[parseInt(_currentSlice, 10)];

		var _sliceData = _slice._texture._rawData;
		var _currentLabelMap = _slice._labelmap;
		var _labelData = null;
		if (_currentLabelMap) {

		    _labelData = _currentLabelMap._rawData;

		}

		var _sliceWidth = this._sliceWidth;
		var _sliceHeight = this._sliceHeight;

		//D.B.
		var _currentSliceId = _slice._id;


		//
		// FRAME BUFFERING
		//
		var _imageFBContext = this._frameBufferContext;
		var _labelFBContext = this._labelFrameBufferContext;

		// grab the current pixels
		var _imageData = _imageFBContext
		    .getImageData(0, 0, _sliceWidth, _sliceHeight);
		var _labelmapData = _labelFBContext.getImageData(0, 0, _sliceWidth,
								 _sliceHeight);
		var _pixels = _imageData.data;
		var _labelPixels = _labelmapData.data;
		var _pixelsLength = _pixels.length;

		// threshold values
		var _maxScalarRange = _volume._max;
		var _lowerThreshold = _volume._lowerThreshold;
		var _upperThreshold = _volume._upperThreshold;
		var _windowLow = _volume._windowLow / _maxScalarRange;
		var _windowHigh = _volume._windowHigh / _maxScalarRange;
		var _modified = _volume._modified;

		// caching mechanism
		// we need to redraw the pixels only
		// - if the _currentSlice has changed
		// - if the threshold has changed
		// - if the window/level has changed
		// - the labelmap show only color has changed
		// D.B. - if currentSliceId has changed, hammy way of reloading after 
		// colorTable lookup, chance of failure (1% due to matching id's after
		// reload)!?

		//PROBLEM HERE - ONLY X SLICE GETS UPDATED!
		var _redraw_required = (this._colArrayChanged ==  true ||
					this._currentSliceId != _currentSliceId ||
					this._currentSlice != _currentSlice ||
					this._lowerThreshold != _lowerThreshold ||
					this._upperThreshold != _upperThreshold ||
					this._windowLow != _windowLow || 
					this._windowHigh != _windowHigh || 
					(_labelmapShowOnlyColor && !X.array
					 .compare(_labelmapShowOnlyColor, 
						  this._labelmapShowOnlyColor, 0, 0, 4)));

		if (_redraw_required){
		    //window.console.log(this._currentSliceId);
		    //else{

		    //D.B.
		    window.console.log('renderer2D.render_() - ' + this.orientation + ' - REDRAW REQUIRED');
		    //window.console.log('from ' + this._currentSliceId + ' to ' + _currentSliceId);

		    // update FBs with new size
		    // has to be there, not sure why, too slow to be in main loop?
		    var _frameBuffer = this._frameBuffer;
		    _frameBuffer.width = _width2;
		    _frameBuffer.height = _height2;

		    var _frameBuffer2 = this._labelFrameBuffer;
		    _frameBuffer2.width = _width2;
		    _frameBuffer2.height = _height2;

		    // loop through the pixels and draw them to the invisible canvas
		    // from bottom right up
		    // also apply thresholding
		    var _index = 0;
		    do {

			// default color and label is just transparent
			var _color = [0, 0, 0, 0];
			var _label = [0, 0, 0, 0];

			// grab the pixel intensity -
			// D.B. - IGNORES GBA VALUES!!!! sliceData CONTAINS THE DATA....
			var _intensity = _sliceData[_index] / 255 * _maxScalarRange;
			var _origIntensity = _sliceData[_index];

			var _origIntensityR = _sliceData[_index];
			var _origIntensityG = _sliceData[_index + 1];
			var _origIntensityB = _sliceData[_index + 2];
			var _origIntensityA = _sliceData[_index + 3];
			

			// apply window/level - IMPORTANT TO GET THIS BACK
			var _fac = _windowHigh - _windowLow;
			_origIntensity = (_origIntensity / 255 - _windowLow) / _fac;
			_origIntensity = Math.floor(_origIntensity * 255);
			
			_origIntensityR = (_origIntensityR / 255 - _windowLow) / _fac;
			_origIntensityR = Math.floor(_origIntensityR * 255);

			_origIntensityG = (_origIntensityG / 255 - _windowLow) / _fac;
			_origIntensityG = Math.floor(_origIntensityG * 255);

			_origIntensityB = (_origIntensityB / 255 - _windowLow) / _fac;
			_origIntensityB = Math.floor(_origIntensityB * 255);

			_origIntensityA = (_origIntensityA / 255 - _windowLow) / _fac;
			_origIntensityA = Math.floor(_origIntensityA * 255);

			
			// apply thresholding
			if (_intensity >= _lowerThreshold && _intensity <= _upperThreshold) {

			    // current intensity is inside the threshold range so use the real
			    // intensity

			    // map volume scalars to a linear color gradient
			    /*var maxColor = new goog.math.Vec3(_volume._maxColor[0],
			      _volume._maxColor[1],
			      _volume._maxColor[2]);*/

			    //EXPERIMENTING WITH THESE - ARE THESE ALWAYS THE SAME ie 0-1
			    var maxColor = new goog.math.Vec3(1, 1, 1);

			    var minColor = new goog.math.Vec3(0, 0, 0);

			    /*
			      var minColor = new goog.math.Vec3(_volume._minColor[0],
			      _volume._minColor[1], 
			      _volume._minColor[2]);*/
			    /*
			      _color = maxColor.scale(_origIntensity).add(
			      minColor.scale(255 - _origIntensity));

			      // .. and back to an array
			      _color = [Math.floor(_color.x), 
			      Math.floor(_color.y),
			      Math.floor(_color.z), 
			      255];
			    */

			    /*
			      _color = [_sliceData[_index], 
			      _sliceData[_index + 1],
			      _sliceData[_index + 2], 
			      _sliceData[_index + 3]];
			    */

			    //should use a lookup array here!?
			    //write these arrays with python scripts!
			    //try normal one first
			    //use math.floor for whole integer lookups!


			    
			    _color = [this._colArrayCURRENT[_origIntensityR][0], 
				      this._colArrayCURRENT[_origIntensityG][1],
				      this._colArrayCURRENT[_origIntensityB][2],
				      255];
			    


			    if (_currentLabelMap) {

				// we have a label map here
				// check if all labels are shown or only one
				if (_labelmapShowOnlyColor[3] == -255) {

				    // all labels are shown
				    _label = [_labelData[_index], 
					      _labelData[_index + 1],
					      _labelData[_index + 2], 
					      _labelData[_index + 3]];

				} else {

				    // show only the label which matches in color
				    if (X.array.compare(_labelmapShowOnlyColor, _labelData, 0, _index,
							4)) {

					// this label matches
					_label = [_labelData[_index], 
						  _labelData[_index + 1],
						  _labelData[_index + 2], 
						  _labelData[_index + 3]];

				    }

				}

			    }

			}

			if(this._orientation == "X"){
			    // invert nothing
			    _pixels[_index] = _color[0]; // r
			    _pixels[_index + 1] = _color[1]; // g
			    _pixels[_index + 2] = _color[2]; // b
			    _pixels[_index + 3] = _color[3]; // a
			    _labelPixels[_index] = _label[0]; // r
			    _labelPixels[_index + 1] = _label[1]; // g
			    _labelPixels[_index + 2] = _label[2]; // b
			    _labelPixels[_index + 3] = _label[3]; // a
			}
			else if(this._orientation == "Y"){
			    // invert cols
			    var row = Math.floor(_index/(_sliceWidth*4));
			    var col = _index - row*_sliceWidth*4;
			    var invCol = 4*(_sliceWidth-1) - col ;
			    var _invertedColsIndex = row*_sliceWidth*4 + invCol;
			    _pixels[_invertedColsIndex] = _color[0]; // r
			    _pixels[_invertedColsIndex + 1] = _color[1]; // g
			    _pixels[_invertedColsIndex + 2] = _color[2]; // b
			    _pixels[_invertedColsIndex + 3] = _color[3]; // a
			    _labelPixels[_invertedColsIndex] = _label[0]; // r
			    _labelPixels[_invertedColsIndex + 1] = _label[1]; // g
			    _labelPixels[_invertedColsIndex + 2] = _label[2]; // b
			    _labelPixels[_invertedColsIndex + 3] = _label[3]; // a
			}
			else{
			    // invert all
			    var _invertedIndex = _pixelsLength - 1 - _index;
			    _pixels[_invertedIndex - 3] = _color[0]; // r
			    _pixels[_invertedIndex - 2] = _color[1]; // g
			    _pixels[_invertedIndex - 1] = _color[2]; // b
			    _pixels[_invertedIndex] = _color[3]; // a
			    _labelPixels[_invertedIndex - 3] = _label[0]; // r
			    _labelPixels[_invertedIndex - 2] = _label[1]; // g
			    _labelPixels[_invertedIndex - 1] = _label[2]; // b
			    _labelPixels[_invertedIndex] = _label[3]; // a
			}

			_index += 4; // increase by 4 units for r,g,b,a

		    } while (_index < _pixelsLength);
		    
		    // store the generated image data to the frame buffer context
		    _imageFBContext.putImageData(_imageData, 0, 0);
		    _labelFBContext.putImageData(_labelmapData, 0, 0);

		    // cache the current slice index and other values
		    // which might require a redraw
		    this._currentSlice = _currentSlice;
		    this._lowerThreshold = _lowerThreshold;
		    this._upperThreshold = _upperThreshold;
		    this._windowLow = _windowLow;
		    this._windowHigh = _windowHigh;
		    //D.B.
		    this._currentSliceId = _currentSliceId;
		    this._objectModified = false;
		    _volume._modified = false;

		    this._colArrayChanged = false;
		    

		    if (_currentLabelMap) {

			// only update the setting if we have a labelmap
			this._labelmapShowOnlyColor = _labelmapShowOnlyColor;

		    }

		}

		//
		// the actual drawing (rendering) happens here
		//

		// draw the slice frame buffer (which equals the slice data) to the main
		// context
		this._context.globalAlpha = 1.0; // draw fully opaque}

		// move to the middle
		this._context.translate(_width / 2 / _normalizedScale, _height / 2 /
					_normalizedScale);

		// Rotate the Sagittal viewer
		if(this._orientation == "X") {

		    this._context.rotate(Math.PI * 0.5);

		    var _buf = _x;
		    _x = _y;
		    _y = -_buf;

		}

		var _offset_x = -_sliceWidth * this._sliceWidthSpacing / 2 + _x;
		var _offset_y = -_sliceHeight * this._sliceHeightSpacing / 2 + _y;

		// draw the slice
		this._context.drawImage(this._frameBuffer, _offset_x, _offset_y, _sliceWidth *
					this._sliceWidthSpacing, _sliceHeight * this._sliceHeightSpacing);

		// draw the labels with a configured opacity
		if (_currentLabelMap && _volume._labelmap._visible) {

		    var _labelOpacity = _volume._labelmap._opacity;
		    this._context.globalAlpha = _labelOpacity; // draw transparent depending on
		    // opacity
		    this._context.drawImage(this._labelFrameBuffer, _offset_x, _offset_y,
					    _sliceWidth * this._sliceWidthSpacing, _sliceHeight *
					    this._sliceHeightSpacing);
		    
		}
	    }
	}
	else{
	    window.console.log('NO LOADER');
	}
    }
    else{
	window.console.log('NO VOLUME');
    }
};

// export symbols (required for advanced compilation)
goog.exportSymbol('X.renderer2D', X.renderer2D);
goog.exportSymbol('X.renderer2D.prototype.init', X.renderer2D.prototype.init);
goog.exportSymbol('X.renderer2D.prototype.add', X.renderer2D.prototype.add);
goog.exportSymbol('X.renderer2D.prototype.onShowtime',
		  X.renderer2D.prototype.onShowtime);
goog.exportSymbol('X.renderer2D.prototype.onRender',
		  X.renderer2D.prototype.onRender);
goog.exportSymbol('X.renderer2D.prototype.onScroll',
		  X.renderer2D.prototype.onScroll);
goog.exportSymbol('X.renderer2D.prototype.onWindowLevel',
		  X.renderer2D.prototype.onWindowLevel);
goog.exportSymbol('X.renderer2D.prototype.get', X.renderer2D.prototype.get);
goog.exportSymbol('X.renderer2D.prototype.resetViewAndRender',
		  X.renderer2D.prototype.resetViewAndRender);
goog.exportSymbol('X.renderer2D.prototype.xy2ijk',
		  X.renderer2D.prototype.xy2ijk);
goog.exportSymbol('X.renderer2D.prototype.render',
		  X.renderer2D.prototype.render);
goog.exportSymbol('X.renderer2D.prototype.onResize',
		  X.renderer2D.prototype.onResize);
goog.exportSymbol('X.renderer2D.prototype.destroy',
		  X.renderer2D.prototype.destroy);
//D.B. - update
goog.exportSymbol('X.renderer2D.prototype.update',
		  X.renderer2D.prototype.update);

goog.exportSymbol('X.renderer2D.prototype.setColortable',
		  X.renderer2D.prototype.setColortable);

goog.exportSymbol('X.renderer2D.prototype.onSliceNavigation', X.renderer2D.prototype.onSliceNavigation);
/*
  goog.exportSymbol('X.renderer2D.prototype.resetColorTable', X.renderer2D.prototype.resetColorTable);*/
