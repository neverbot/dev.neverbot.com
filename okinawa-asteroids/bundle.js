(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _game = _interopRequireDefault(require("./src/game"));

var _okinawa = _interopRequireDefault(require("okinawa.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Create and initialize game object
// parameters:
//   1) canvas DOM element id
//   2) game object, already instantiated
//   3) optional callback function to inform of certain events inside the game
(0, _okinawa["default"])('game-canvas', _game["default"]);

},{"./src/game":37,"okinawa.js":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Okinawa;

var _engine = _interopRequireDefault(require("./src/engine"));

var _utils = require("./src/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// engine already instanced
function Okinawa(canvasId, gameObject, callbackFunction) {
  // Game initialization
  // parameters:
  //   1) canvas DOM element id
  //   2) game object already instantiated
  //   3) optional callback function to inform of certain events inside the game
  // check document.readyState: if window is already loaded, the game wouldn't initialize
  if (document.readyState === 'complete') _engine["default"].initialize(canvasId, gameObject, callbackFunction);else (0, _utils.addEvent)('load', window, function () {
    _engine["default"].initialize(canvasId, gameObject, callbackFunction);
  });
  return _engine["default"];
}

},{"./src/engine":13,"./src/utils":36}],3:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**

  Font.js v2012.01.25
  (c) Mike "Pomax" Kamermans, 2012
  Licensed under MIT ("expat" flavour) license.
  Hosted on http://github.com/Pomax/Font.js

  This library adds Font objects to the general pool
  of available JavaScript objects, so that you can load
  fonts through a JavaScript object similar to loading
  images through a new Image() object.

  Font.js is compatible with all browsers that support
  <canvas> and Object.defineProperty - This includes
  all versions of Firefox, Chrome, Opera, IE and Safari
  that were 'current' (Firefox 9, Chrome 16, Opera 11.6,
  IE9, Safari 5.1) at the time Font.js was released.

  Font.js will not work on IE8 or below due to the lack
  of Object.defineProperty - I recommend using the
  solution outlined in http://ie6update.com/ for websites
  that are not corporate intranet sites, because as a home
  user you have no excuse not to have upgraded to Internet
  Explorer 9 yet, or simply not using Internet Explorer if
  you're still using Windows XP. If you have friends or
  family that still use IE8 or below: intervene.

  You may remove every line in this header except for
  the first block of four lines, for the purposes of
  saving space and minification. If minification strips
  the header, you'll have to paste that paragraph back in.

  Issue tracker: https://github.com/Pomax/Font.js/issues

**/
(function (window) {
  // 1) Do we have a mechanism for binding implicit get/set?
  if (!Object.defineProperty) {
    throw "Font.js requires Object.defineProperty, which this browser does not support.";
  } // 2) Do we have Canvas2D available?


  if (!document.createElement("canvas").getContext) {
    throw "Font.js requires <canvas> and the Canvas2D API, which this browser does not support.";
  } // Make sure type arrays are available in IE9
  // Code borrowed from pdf.js (https://gist.github.com/1057924)


  (function (window) {
    try {
      var a = new Uint8Array(1);
      return;
    } catch (e) {}

    function subarray(start, end) {
      return this.slice(start, end);
    }

    function set_(array, offset) {
      var i,
          n = array.length;

      if (arguments.length < 2) {
        offset = 0;
      }

      for (i = 0; i < n; ++i, ++offset) {
        this[offset] = array[i] & 0xFF;
      }
    }

    function TypedArray(arg1) {
      var result, i;

      if (typeof arg1 === "number") {
        result = new Array(arg1);

        for (i = 0; i < arg1; ++i) {
          result[i] = 0;
        }
      } else {
        result = arg1.slice(0);
      }

      result.subarray = subarray;
      result.buffer = result;
      result.byteLength = result.length;
      result.set = set_;

      if (_typeof(arg1) === "object" && arg1.buffer) {
        result.buffer = arg1.buffer;
      }

      return result;
    }

    window.Uint8Array = TypedArray;
    window.Uint32Array = TypedArray;
    window.Int32Array = TypedArray;
  })(window); // Also make sure XHR understands typing.
  // Code based on pdf.js (https://gist.github.com/1057924)


  (function (window) {
    // shortcut for Opera - it's already fine
    if (window.opera) return; // shortcuts for browsers that already implement XHR minetyping

    if ("response" in XMLHttpRequest.prototype || "mozResponseArrayBuffer" in XMLHttpRequest.prototype || "mozResponse" in XMLHttpRequest.prototype || "responseArrayBuffer" in XMLHttpRequest.prototype) {
      return;
    }

    var getter; // If we have access to the VBArray (i.e., we're in IE), use that

    if (window.VBArray) {
      getter = function getter() {
        return new Uint8Array(new VBArray(this.responseBody).toArray());
      };
    } // Okay... umm.. untyped arrays? This may break completely.
    // (Android browser 2.3 and 3 don't do typed arrays)
    else {
        getter = function getter() {
          this.responseBody;
        };
      }

    Object.defineProperty(XMLHttpRequest.prototype, "response", {
      get: getter
    });
  })(window); // IE9 does not have binary-to-ascii built in O_O


  if (!window.btoa) {
    // Code borrowed from PHP.js (http://phpjs.org/functions/base64_encode:358)
    window.btoa = function (data) {
      var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var o1,
          o2,
          o3,
          h1,
          h2,
          h3,
          h4,
          bits,
          i = 0,
          ac = 0,
          enc = "",
          tmp_arr = [];

      if (!data) {
        return data;
      }

      do {
        // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);
        bits = o1 << 16 | o2 << 8 | o3;
        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f; // use hexets to index into b64, and append result to encoded string

        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
      } while (i < data.length);

      enc = tmp_arr.join('');
      var r = data.length % 3;
      return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
    };
  }
  /**
     Not-borrowed-code starts here!
    **/


  function Font() {
    // if this is not specified, a random name is used
    this.fontFamily = "fjs" + (999999 * Math.random() | 0);
  } // the font resource URL


  Font.prototype.url = ""; // the font's format ('truetype' for TT-OTF or 'opentype' for CFF-OTF)

  Font.prototype.format = ""; // the font's byte code

  Font.prototype.data = ""; // custom font, implementing the letter 'A' as zero-width letter.

  Font.prototype.base64 = "AAEAAAAKAIAAAwAgT1MvMgAAAAAAAACsAAAAWGNtYXAA" + "AAAAAAABBAAAACxnbHlmAAAAAAAAATAAAAAQaGVhZAAAA" + "AAAAAFAAAAAOGhoZWEAAAAAAAABeAAAACRobXR4AAAAAA" + "AAAZwAAAAIbG9jYQAAAAAAAAGkAAAACG1heHAAAAAAAAA" + "BrAAAACBuYW1lAAAAAAAAAcwAAAAgcG9zdAAAAAAAAAHs" + "AAAAEAAEAAEAZAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAABAAMAAQA" + "AAAwABAAgAAAABAAEAAEAAABB//8AAABB////wAABAAAA" + "AAABAAAAAAAAAAAAAAAAMQAAAQAAAAAAAAAAAABfDzz1A" + "AAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAEAAg" + "AAAAAAAAABAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAA" + "AAAAAAAAAAQAAAAAAAAAAAAAAAAAIAAAAAQAAAAIAAQAB" + "AAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAIAHgADAAEEC" + "QABAAAAAAADAAEECQACAAIAAAAAAAEAAAAAAAAAAAAAAA" + "AAAA=="; // these metrics represent the font-indicated values,
  // not the values pertaining to text as it is rendered
  // on the page (use fontmetrics.js for this instead).

  Font.prototype.metrics = {
    quadsize: 0,
    leading: 0,
    ascent: 0,
    descent: 0,
    weightclass: 400
  }; // Will this be a remote font, or a system font?

  Font.prototype.systemfont = false; // internal indicator that the font is done loading

  Font.prototype.loaded = false;
  /**
   * This function gets called once the font is done
   * loading, its metrics have been determined, and it
   * has been parsed for use on-page. By default, this
   * function does nothing, and users can bind their
   * own handler function.
   */

  Font.prototype.onload = function () {};
  /**
   * This function gets called when there is a problem
   * loading the font.
   */


  Font.prototype.onerror = function () {}; // preassigned quad × quad context, for measurements


  Font.prototype.canvas = false;
  Font.prototype.context = false;
  /**
   * validation function to see if the zero-width styled
   * text is no longer zero-width. If this is true, the
   * font is properly done loading. If this is false, the
   * function calls itself via a timeout
   */

  Font.prototype.validate = function (target, zero, mark, font, timeout) {
    if (timeout !== false && timeout < 0) {
      this.onerror("Requested system font '" + this.fontFamily + "' could not be loaded (it may not be installed).");
      return;
    }

    var width = getComputedStyle(target, null).getPropertyValue("width").replace("px", ''); // font has finished loading - remove the zero-width and
    // validation paragraph, but leave the actual font stylesheet (mark);

    if (width > 0) {
      document.head.removeChild(zero);
      document.body.removeChild(target);
      this.loaded = true;
      this.onload();
    } // font has not finished loading - wait 50ms and try again
    else {
        console.log("timing out");
        setTimeout(function () {
          font.validate(target, zero, mark, font, timeout === false ? false : timeout - 50);
        }, 1000);
      }
  };
  /**
   * This gets called when the file is done downloading.
   */


  Font.prototype.ondownloaded = function () {
    var instance = this; // decimal to character

    var chr = function chr(val) {
      return String.fromCharCode(val);
    }; // decimal to ushort


    var chr16 = function chr16(val) {
      if (val < 256) {
        return chr(0) + chr(val);
      }

      var b1 = val >> 8;
      var b2 = val & 0xFF;
      return chr(b1) + chr(b2);
    }; // decimal to hexadecimal
    // See http://phpjs.org/functions/dechex:382


    var dechex = function dechex(val) {
      if (val < 0) {
        val = 0xFFFFFFFF + val + 1;
      }

      return parseInt(val, 10).toString(16);
    }; // unsigned short to decimal


    var ushort = function ushort(b1, b2) {
      return 256 * b1 + b2;
    }; // signed short to decimal


    var fword = function fword(b1, b2) {
      var negative = b1 >> 7 === 1,
          val;
      b1 = b1 & 0x7F;
      val = 256 * b1 + b2; // positive numbers are already done

      if (!negative) {
        return val;
      } // negative numbers need the two's complement treatment


      return val - 0x8000;
    }; // unsigned long to decimal


    var ulong = function ulong(b1, b2, b3, b4) {
      return 16777216 * b1 + 65536 * b2 + 256 * b3 + b4;
    }; // unified error handling


    var error = function error(msg) {
      instance.onerror(msg);
    }; // we know about TTF (0x00010000) and CFF ('OTTO') fonts


    var ttf = chr(0) + chr(1) + chr(0) + chr(0);
    var cff = "OTTO"; // so what kind of font is this?

    var data = this.data;
    var version = chr(data[0]) + chr(data[1]) + chr(data[2]) + chr(data[3]);
    var isTTF = version === ttf;
    var isCFF = isTTF ? false : version === cff;

    if (isTTF) {
      this.format = "truetype";
    } else if (isCFF) {
      this.format = "opentype";
    } // terminal error: stop running code
    else {
        error("Error: file at " + this.url + " cannot be interpreted as OpenType font.");
        return;
      } // ================================================================
    // if we get here, this is a legal font. Extract some font metrics,
    // and then wait for the font to be available for on-page styling.
    // ================================================================
    // first, we parse the SFNT header data


    var numTables = ushort(data[4], data[5]),
        tagStart = 12,
        ptr,
        end = tagStart + 16 * numTables,
        tags = {},
        tag;

    for (ptr = tagStart; ptr < end; ptr += 16) {
      tag = chr(data[ptr]) + chr(data[ptr + 1]) + chr(data[ptr + 2]) + chr(data[ptr + 3]);
      tags[tag] = {
        name: tag,
        checksum: ulong(data[ptr + 4], data[ptr + 5], data[ptr + 6], data[ptr + 7]),
        offset: ulong(data[ptr + 8], data[ptr + 9], data[ptr + 10], data[ptr + 11]),
        length: ulong(data[ptr + 12], data[ptr + 13], data[ptr + 14], data[ptr + 15])
      };
    } // first we define a quick error shortcut function:


    var checkTableError = function checkTableError(tag) {
      if (!tags[tag]) {
        error("Error: font is missing the required OpenType '" + tag + "' table."); // return false, so that the result of this function can be used to stop running code

        return false;
      }

      return tag;
    }; // Then we access the HEAD table for the "font units per EM" value.


    tag = checkTableError("head");

    if (tag === false) {
      return;
    }

    ptr = tags[tag].offset;
    tags[tag].version = "" + data[ptr] + data[ptr + 1] + data[ptr + 2] + data[ptr + 3];
    var unitsPerEm = ushort(data[ptr + 18], data[ptr + 19]);
    this.metrics.quadsize = unitsPerEm; // We follow up by checking the HHEA table for ascent, descent, and leading values.

    tag = checkTableError("hhea");

    if (tag === false) {
      return;
    }

    ptr = tags[tag].offset;
    tags[tag].version = "" + data[ptr] + data[ptr + 1] + data[ptr + 2] + data[ptr + 3];
    this.metrics.ascent = fword(data[ptr + 4], data[ptr + 5]) / unitsPerEm;
    this.metrics.descent = fword(data[ptr + 6], data[ptr + 7]) / unitsPerEm;
    this.metrics.leading = fword(data[ptr + 8], data[ptr + 9]) / unitsPerEm; // And then finally we check the OS/2 table for the font-indicated weight class.

    tag = checkTableError("OS/2");

    if (tag === false) {
      return;
    }

    ptr = tags[tag].offset;
    tags[tag].version = "" + data[ptr] + data[ptr + 1];
    this.metrics.weightclass = ushort(data[ptr + 4], data[ptr + 5]); // ==================================================================
    // Then the mechanism for determining whether the font is not
    // just done downloading, but also fully parsed and ready for
    // use on the page for typesetting: we pick a letter that we know
    // is supported by the font, and generate a font that implements
    // only that letter, as a zero-width glyph. We can then test
    // whether the font is available by checking whether a paragraph
    // consisting of just that letter, styled with "desiredfont, zwfont"
    // has zero width, or a real width. As long as it's zero width, the
    // font has not finished loading yet.
    // ==================================================================
    // To find a letter, we must consult the character map ("cmap") table

    tag = checkTableError("cmap");

    if (tag === false) {
      return;
    }

    ptr = tags[tag].offset;
    tags[tag].version = "" + data[ptr] + data[ptr + 1];
    numTables = ushort(data[ptr + 2], data[ptr + 3]); // For the moment, we only look for windows/unicode records, with
    // a cmap subtable format 4 because OTS (the sanitiser used in
    // Chrome and Firefox) does not actually support anything else
    // at the moment.
    //
    // When http://code.google.com/p/chromium/issues/detail?id=110175
    // is resolved, remember to stab me to add support for the other
    // maps, too.
    //

    var encodingRecord,
        rptr,
        platformID,
        encodingID,
        offset,
        cmap314 = false;

    for (var encodingRecord = 0; encodingRecord < numTables; encodingRecord++) {
      rptr = ptr + 4 + encodingRecord * 8;
      platformID = ushort(data[rptr], data[rptr + 1]);
      encodingID = ushort(data[rptr + 2], data[rptr + 3]);
      offset = ulong(data[rptr + 4], data[rptr + 5], data[rptr + 6], data[rptr + 7]);

      if (platformID === 3 && encodingID === 1) {
        cmap314 = offset;
      }
    } // This is our fallback font - a minimal font that implements
    // the letter "A". We can transform this font to implementing
    // any character between 0x0000 and 0xFFFF by altering a
    // handful of letters.


    var printChar = "A"; // Now, if we found a format 4 {windows/unicode} cmap subtable,
    // we can find a suitable glyph and modify the 'base64' content.

    if (cmap314 !== false) {
      ptr += cmap314;
      version = ushort(data[ptr], data[ptr + 1]);

      if (version === 4) {
        // First find the number of segments in this map
        var segCount = ushort(data[ptr + 6], data[ptr + 7]) / 2; // Then, find the segment end characters. We'll use
        // whichever of those isn't a whitespace character
        // for our verification font, which we check based
        // on the list of Unicode 6.0 whitespace code points:

        var printable = function printable(chr) {
          return [// ascii range:
          0x0009, 0x000A, 0x000B, 0x000C, 0x000D, 0x0020, // ansi range:
          0x007F, 0x0080, 0x0081, 0x008D, 0x008E, 0x008F, 0x0090, 0x0095, 0x009D, 0x009E, 0x00A0, // general punctuation :
          0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x200B, 0x200C, 0x200D, 0x200E, 0x200F, 0x2028, 0x2029, 0x202A, 0x202B, 0x202B, 0x202C, 0x202D, 0x202E, 0x202F, 0x205F, 0x2060, 0x2061, 0x2062, 0x2063, 0x2064, 0x3000].indexOf(chr) === -1;
        }; // Loop through the segments in search of a usable character code:


        var i = ptr + 14,
            e = ptr + 14 + 2 * segCount,
            endChar = false;

        for (; i < e; i += 2) {
          endChar = ushort(data[i], data[i + 1]);

          if (printable(endChar)) {
            break;
          }

          endChar = false;
        }

        if (endChar != false) {
          // We now have a printable character to validate with!
          // We need to make sure to encode the correct "idDelta"
          // value for this character, because our "glyph" will
          // always be at index 1 (index 0 is reserved for .notdef).
          // As such, we need to set up a delta value such that:
          //
          //   [character code] + [delta value] == 1
          //
          printChar = String.fromCharCode(endChar);
          var delta = (-(endChar - 1) + 65536) % 65536; // Now we need to substitute the values in our
          // base64 font template. The CMAP modification
          // consists of generating a new base64 string
          // for the bit that indicates the encoded char.
          // In our 'A'-encoding font, this is:
          //
          //   0x00 0x41 0xFF 0xFF 0x00 0x00
          //   0x00 0x41 0xFF 0xFF 0xFF 0xC0
          //
          // which is the 20 letter base64 string at [380]:
          //
          //   AABB//8AAABB////wAAB
          //
          // We replace this with our new character:
          //
          //   [hexchar] 0xFF 0xFF 0x00 0x00
          //   [hexchar] 0xFF 0xFF [ delta ]
          //
          // Note: in order to do so properly, we need to
          // make sure that the bytes are base64 aligned, so
          // we have to add a leading 0x00:

          var newcode = chr(0) + // base64 padding byte
          chr16(endChar) + chr16(0xFFFF) + // "endCount" array
          chr16(0) + // cmap required padding
          chr16(endChar) + chr16(0xFFFF) + // "startCount" array
          chr16(delta) + // delta value
          chr16(1); // delta terminator

          var newhex = btoa(newcode); // And now we replace the text in 'base64' at
          // position 380 with this new base64 string:

          this.base64 = this.base64.substring(0, 380) + newhex + this.base64.substring(380 + newhex.length);
        }
      }
    }

    this.bootstrapValidation(printChar, false);
  };

  Font.prototype.bootstrapValidation = function (printChar, timeout) {
    // Create a stylesheet for using the zero-width font:
    var tfName = this.fontFamily + " testfont";
    var zerowidth = document.createElement("style");
    zerowidth.setAttribute("type", "text/css");
    zerowidth.innerHTML = "@font-face {\n" + "  font-family: '" + tfName + "';\n" + "  src: url('data:application/x-font-ttf;base64," + this.base64 + "')\n" + "       format('truetype');}";
    document.head.appendChild(zerowidth); // Create a validation stylesheet for the requested font, if it's a remote font:

    var realfont = false;

    if (!this.systemfont) {
      realfont = this.toStyleNode();
      document.head.appendChild(realfont);
    } // Create a validation paragraph, consisting of the zero-width character


    var para = document.createElement("p");
    para.style.cssText = "position: absolute; top: 0; left: 0; opacity: 0;";
    para.style.fontFamily = "'" + this.fontFamily + "', '" + tfName + "'";
    para.innerHTML = printChar + printChar + printChar + printChar + printChar + printChar + printChar + printChar + printChar + printChar;
    document.body.appendChild(para); // Quasi-error: if there is no getComputedStyle, claim loading is done.

    if (typeof getComputedStyle === "undefined") {
      this.onload();
      error("Error: getComputedStyle is not supported by this browser.\n" + "Consequently, Font.onload() cannot be trusted.");
    } // If there is getComputedStyle, we do proper load completion verification.
    else {
        // If this is a remote font, we rely on the indicated quad size
        // for measurements. If it's a system font there will be no known
        // quad size, so we simply fix it at 1000 pixels.
        var quad = this.systemfont ? 1000 : this.metrics.quadsize; // Because we need to 'preload' a canvas with this
        // font, we have no idea how much surface area
        // we'll need for text measurements later on. So
        // be safe, we assign a surface that is quad² big,
        // and then when measureText is called, we'll
        // actually build a quick <span> to see how much
        // of that surface we don't need to look at.

        var canvas = document.createElement("canvas");
        canvas.width = quad;
        canvas.height = quad;
        this.canvas = canvas; // The reason we preload is because some browsers
        // will also take a few milliseconds to assign a font
        // to a Canvas2D context, so if measureText is called
        // later, without this preloaded context, there is no
        // time for JavaScript to "pause" long enough for the
        // context to properly load the font, and metrics may
        // be completely wrong. The solution is normally to
        // add in a setTimeout call, to give the browser a bit
        // of a breather, but then we can't do synchronous
        // data returns, and we need a callback just to get
        // string metrics, which is about as far from desired
        // as is possible.

        var context = canvas.getContext("2d");
        context.font = "1em '" + this.fontFamily + "'";
        context.fillStyle = "white";
        context.fillRect(-1, -1, quad + 2, quad + 2);
        context.fillStyle = "black";
        context.fillText("test text", 50, quad / 2);
        this.context = context; // ===================================================
        // Thanks to Opera and Firefox, we need to add in more
        // "you can do your thing, browser" moments. If we
        // call validate() as a straight function call, the
        // browser doesn't get the breathing space to perform
        // page styling. This is a bit mad, but until there's
        // a JS function for "make the browser update the page
        // RIGHT NOW", we're stuck with this.
        // ===================================================
        // We need to alias "this" because the keyword "this"
        // becomes the global context after the timeout.

        var local = this;

        var delayedValidate = function delayedValidate() {
          local.validate(para, zerowidth, realfont, local, timeout);
        };

        setTimeout(delayedValidate, 50);
      }
  };
  /**
   * We take a different path for System fonts, because
   * we cannot inspect the actual byte code.
   */


  Font.prototype.processSystemFont = function () {
    // Mark system font use-case
    this.systemfont = true; // There are font-declared metrics to work with.

    this.metrics = false; // However, we do need to check whether the font
    // is actually installed.

    this.bootstrapValidation("A", 1000);
  };
  /**
   * This gets called when font.src is set, (the binding
   * for which is at the end of this file).
   */


  Font.prototype.loadFont = function () {
    var font = this; // System font?

    if (this.url.indexOf(".") === -1) {
      setTimeout(function () {
        font.processSystemFont();
      }, 10);
      return;
    } // Remote font.


    var xhr = new XMLHttpRequest();
    xhr.open('GET', font.url, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = function (evt) {
      var arrayBuffer = xhr.response;

      if (arrayBuffer) {
        font.data = new Uint8Array(arrayBuffer);
        font.ondownloaded();
      } else {
        font.onerror("Error downloading font resource from " + font.url);
      }
    };

    xhr.onerror = function (evt) {
      font.onerror("Error downloading font resource from " + font.url);
    };

    xhr.send(null);
  }; // The stylenode can be added to the document head
  // to make the font available for on-page styling,
  // but it should be requested with .toStyleNode()


  Font.prototype.styleNode = false;
  /**
   * Get the DOM node associated with this Font
   * object, for page-injection.
   */

  Font.prototype.toStyleNode = function () {
    // If we already built it, pass that reference.
    if (this.styleNode) {
      return this.styleNode;
    } // If not, build a style element


    this.styleNode = document.createElement("style");
    this.styleNode.type = "text/css"; // fixed IE load Font

    var fixedIEUrl = this.url.replace('.ttf', '.eot');
    var styletext = "@font-face {\n";
    styletext += "  font-family: '" + this.fontFamily + "';\n"; //  styletext += "  src: url('" + fixedIEUrl + "') format(eot), url('" + this.url + "') format('" + this.format + "');\n";

    styletext += "  src: url('" + this.url + "') format('" + this.format + "');\n";
    styletext += "}";
    this.styleNode.innerHTML = styletext;
    return this.styleNode;
  };
  /**
   * Measure a specific string of text, given this font.
   * If the text is too wide for our preallocated canvas,
   * it will be chopped up and the segments measured
   * separately.
   */


  Font.prototype.measureText = function (textString, fontSize) {
    if (!this.loaded) {
      this.onerror("measureText() was called while the font was not yet loaded");
      return false;
    } // Set up the right font size.


    this.context.font = fontSize + "px '" + this.fontFamily + "'"; // Get the initial string width through our preloaded Canvas2D context

    var metrics = this.context.measureText(textString); // Assign the remaining default values, because the
    // TextMetrics object is horribly deficient.

    metrics.fontsize = fontSize;
    metrics.ascent = 0;
    metrics.descent = 0;
    metrics.bounds = {
      minx: 0,
      maxx: metrics.width,
      miny: 0,
      maxy: 0
    };
    metrics.height = 0; // Does the text fit on the canvas? If not, we have to
    // chop it up and measure each segment separately.

    var segments = [],
        minSegments = metrics.width / this.metrics.quadsize;

    if (minSegments <= 1) {
      segments.push(textString);
    } else {
      // TODO: add the chopping code here. For now this
      // code acts as placeholder
      segments.push(textString);
    } // run through all segments, updating the metrics as we go.


    var segmentLength = segments.length,
        i;

    for (i = 0; i < segmentLength; i++) {
      this.measureSegment(segments[i], fontSize, metrics);
    }

    return metrics;
  };
  /**
   * Measure a section of text, given this font, that is
   * guaranteed to fit on our preallocated canvas.
   */


  Font.prototype.measureSegment = function (textSegment, fontSize, metrics) {
    // Shortcut function for getting computed CSS values
    var getCSSValue = function getCSSValue(element, property) {
      return document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
    }; // We are going to be using you ALL over the place, little variable.


    var i; // For text leading values, we measure a multiline
    // text container as built by the browser.

    var leadDiv = document.createElement("div");
    leadDiv.style.position = "absolute";
    leadDiv.style.opacity = 0;
    leadDiv.style.font = fontSize + "px '" + this.fontFamily + "'";
    var numLines = 10;
    leadDiv.innerHTML = textSegment;

    for (i = 1; i < numLines; i++) {
      leadDiv.innerHTML += "<br/>" + textSegment;
    }

    document.body.appendChild(leadDiv); // First we guess at the leading value, using the standard TeX ratio.

    metrics.leading = 1.2 * fontSize; // We then try to get the real value based on how
    // the browser renders the text.

    var leadDivHeight = getCSSValue(leadDiv, "height");
    leadDivHeight = leadDivHeight.replace("px", "");

    if (leadDivHeight >= fontSize * numLines) {
      metrics.leading = leadDivHeight / numLines | 0;
    }

    document.body.removeChild(leadDiv); // If we're not with a white-space-only string,
    // this is all we will be able to do.

    if (/^\s*$/.test(textSegment)) {
      return metrics;
    } // If we're not, let's try some more things.


    var canvas = this.canvas,
        ctx = this.context,
        quad = this.systemfont ? 1000 : this.metrics.quadsize,
        w = quad,
        h = quad,
        baseline = quad / 2,
        padding = 50,
        xpos = (quad - metrics.width) / 2; // SUPER IMPORTANT, HARDCORE NECESSARY STEP:
    // xpos may be a fractional number at this point, and
    // that will *complete* screw up line scanning, because
    // cropping a canvas on fractional coordiantes does
    // really funky edge interpolation. As such, we force
    // it to an integer.

    if (xpos !== (xpos | 0)) {
      xpos = xpos | 0;
    } // Set all canvas pixeldata values to 255, with all the content
    // data being 0. This lets us scan for data[i] != 255.


    ctx.fillStyle = "white";
    ctx.fillRect(-padding, -padding, w + 2 * padding, h + 2 * padding); // Then render the text centered on the canvas surface.

    ctx.fillStyle = "black";
    ctx.fillText(textSegment, xpos, baseline); // Rather than getting all four million+ subpixels, we
    // instead get a (much smaller) subset that we know
    // contains our text. Canvas pixel data is w*4 by h*4,
    // because {R,G,B,A} is stored as separate channels in
    // the array. Hence the factor 4.

    var scanwidth = metrics.width + padding | 0,
        scanheight = 4 * fontSize,
        x_offset = xpos - padding / 2,
        y_offset = baseline - scanheight / 2,
        pixelData = ctx.getImageData(x_offset, y_offset, scanwidth, scanheight).data; // Set up our scanline variables

    var i = 0,
        j = 0,
        w4 = scanwidth * 4,
        len = pixelData.length,
        mid = scanheight / 2; // Scan 1: find the ascent using a normal, forward scan

    while (++i < len && pixelData[i] === 255) {}

    var ascent = i / w4 | 0; // Scan 2: find the descent using a reverse scan

    i = len - 1;

    while (--i > 0 && pixelData[i] === 255) {}

    var descent = i / w4 | 0; // Scan 3: find the min-x value, using a forward column scan

    for (i = 0, j = 0; j < scanwidth && pixelData[i] === 255;) {
      i += w4;

      if (i >= len) {
        j++;
        i = i - len + 4;
      }
    }

    var minx = j; // Scan 3: find the max-x value, using a reverse column scan

    var step = 1;

    for (i = len - 3, j = 0; j < scanwidth && pixelData[i] === 255;) {
      i -= w4;

      if (i < 0) {
        j++;
        i = len - 3 - step++ * 4;
      }
    }

    var maxx = scanwidth - j; // We have all our metrics now, so fill in the
    // metrics object and return it to the user.

    metrics.ascent = mid - ascent;
    metrics.descent = descent - mid;
    metrics.bounds = {
      minx: minx - padding / 2,
      maxx: maxx - padding / 2,
      miny: -metrics.descent,
      maxy: metrics.ascent
    };
    metrics.height = 1 + (descent - ascent);
    return metrics;
  };
  /**
   * we want Font to do the same thing Image does when
   * we set the "src" property value, so we use the
   * Object.defineProperty function to bind a setter
   * that does more than just bind values.
   */


  Object.defineProperty(Font.prototype, "src", {
    set: function set(url) {
      this.url = url;
      this.loadFont();
    }
  });
  /**
   * Bind to global scope
   */

  if (typeof define !== "undefined") {
    define(function () {
      return Font;
    });
  } else {
    window.Font = Font;
  }
})(window);

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Clock =
/*#__PURE__*/
function () {
  function Clock() {
    _classCallCheck(this, Clock);

    this.startTime = 0; // game init

    this.passedTime = 0; // time passed

    this.ticker500 = 0;
    this.listeners500 = {};
    this.ticker1 = 0;
    this.listeners1 = {};
    this.ticker5 = 0;
    this.listeners5 = {};
  }

  _createClass(Clock, [{
    key: "initialize",
    value: function initialize() {
      this.startTime = new Date().getTime(); // Init time
    }
  }, {
    key: "step",
    value: function step(dt) {
      this.ticker1 += dt;
      this.ticker5 += dt;
      this.ticker500 += dt;

      if (this.ticker1 >= 1000) {
        this.informListeners(this.listeners1);
        this.ticker1 = 0;
      }

      if (this.ticker5 >= 5000) {
        this.informListeners(this.listeners5);
        this.ticker5 = 0;
      }

      if (this.ticker500 >= 500) {
        this.informListeners(this.listeners500);
        this.ticker500 = 0;
      }
    }
  }, {
    key: "draw",
    value: function draw() {}
  }, {
    key: "suscribe500",
    value: function suscribe500(name, func) {
      this.listeners500[name] = func;
    }
  }, {
    key: "suscribeOneSecond",
    value: function suscribeOneSecond(name, func) {
      this.listeners1[name] = func;
    }
  }, {
    key: "suscribeFiveSeconds",
    value: function suscribeFiveSeconds(name, func) {
      this.listeners5[name] = func;
    }
  }, {
    key: "informListeners",
    value: function informListeners(listenersList) {
      for (var ob in listenersList) {
        listenersList[ob](); // call the function
        // // the callback exists
        // if (ob[listenersList[ob]] != undefined ) {
        //   // ob[listenersList[ob]](); // call the function
        //   listenersList[ob].apply();
        // }
      }
    }
  }]);

  return Clock;
}();

exports["default"] = Clock;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("../engine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Specific clock for every scene (one different instance in each scene)
// It's not aligned: it means the different subcriptions to the clock are executed in
// different times: two suscriptions to 500ms events would be called 500ms after each
// subscription, not at the same time
var UnalignedClock =
/*#__PURE__*/
function () {
  function UnalignedClock() {
    _classCallCheck(this, UnalignedClock);

    this.clockEvents = {};
  }

  _createClass(UnalignedClock, [{
    key: "initialize",
    value: function initialize() {
      this.clockEvents = {};
    }
  }, {
    key: "activate",
    value: function activate() {// The events could be suscribed since game initalization
      // so we do not remove them when the scene is activated
      // this.clockEvents = {};
    }
  }, {
    key: "suscribe",
    value: function suscribe(id, object, func, time) {
      if (typeof this.clockEvents[id] !== 'undefined') {
        _engine["default"].logs.log('UnalignedClock::suscribe', 'Object suscribing to clock event with repeated id ' + id);
      }

      this.clockEvents[id] = {
        ob: object,
        f: func,
        t: time,
        dt: 0
      };
    }
  }, {
    key: "unsuscribe",
    value: function unsuscribe(id) {
      delete this.clockEvents[id];
    }
  }, {
    key: "step",
    value: function step(dt) {
      var ids = Object.keys(this.clockEvents);

      for (var i = 0, len = ids.length; i < len; i++) {
        var item = this.clockEvents[ids[i]];
        item.dt += dt;

        if (item.dt >= item.t) {
          // engine.logs.log('UnalignedClock::step', 'Suscribed clock call: ' + ids[i]); // + ' ' + item.f);
          if (typeof item.ob !== 'undefined') {
            item.ob[item.f]();
          } else {
            // Call the suscribed function
            item.f();
          }

          item.dt = 0;
        }
      }
    }
  }]);

  return UnalignedClock;
}();

exports["default"] = UnalignedClock;

},{"../engine":13}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("./engine"));

var _point = _interopRequireDefault(require("./math/point"));

var INPUT = _interopRequireWildcard(require("./input/input"));

var GUI = _interopRequireWildcard(require("./gui/gui"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Core =
/*#__PURE__*/
function () {
  function Core() {
    _classCallCheck(this, Core);

    this.FRAMES_PER_SECOND = 60;
    this.TIME_PER_FRAME = 1000 / this.FRAMES_PER_SECOND; // milliseconds

    this.paused = false;
    this.halted = false; // Drawing state

    this.canvas = null;
    this.ctx = null;
    this.size = new _point["default"](500, 500); // Should use requestAnimationFrame or not

    this.useAnimationFrame = false;
    this.timeLastRender = new Date().getTime(); // Time since last render

    this.timeGameStart = new Date().getTime(); // Init time
    // To count frames per second

    this.fpsPassed = 0; // frames rendered since last time

    this.fps = this.FRAMES_PER_SECOND; // updated only each second
  } // Game Initialization


  _createClass(Core, [{
    key: "initialize",
    value: function initialize(canvasElementId) {
      _engine["default"].logs.log('Engine::Core.initialize', 'Initializing engine core object');

      this.canvas = document.getElementById(canvasElementId);
      this.size.x = this.canvas.width;
      this.size.y = this.canvas.height;
      this.timeLastRender = new Date().getMilliseconds();
      this.ctx = this.canvas.getContext && this.canvas.getContext('2d');

      if (!this.ctx) {
        _engine["default"].logs.log('Engine::Core.initialize', 'Old browser, unable to create canvas context');

        alert('Unable to get canvas context. Old browser?');
        return null;
      }

      _engine["default"].logs.log('Engine::Core.initialize', 'UserAgent: ' + _engine["default"].device.getUserAgent()); // Sometimes this is slower, I don't know why, and that makes me angry :(


      if (_engine["default"].options.useAnimationFrame === false || window.requestAnimationFrame === null) {
        this.useAnimationFrame = false;

        _engine["default"].logs.log('Engine::Core.initialize', 'NOT using requestAnimationFrame');
      } else {
        this.useAnimationFrame = true;

        _engine["default"].logs.log('Engine::Core.initialize', 'Modern browser, using requestAnimationFrame');
      } // Start main loop


      this.loop();
      return 1;
    } // Game Initialization

  }, {
    key: "activate",
    value: function activate() {
      _engine["default"].logs.log('Engine::activate', 'Starting engine');

      _engine["default"].game.activate();

      _engine["default"].gui.activate();

      _engine["default"].scenes.advanceScene();
    }
  }, {
    key: "eventKeyPressed",
    value: function eventKeyPressed(keyCode) {
      // engine.logs.log('Engine::eventKeyPressed', 'Key Pressed: ' + keyCode);
      if (keyCode == INPUT.KEYS.P && _engine["default"].options.allowPause === true) {
        if (this.paused) this.unpauseGame();else if (_engine["default"].scenes.getCurrentScene().playable !== false) this.pauseGame();
      } else if (keyCode == INPUT.KEYS.ESC && _engine["default"].options.allowHalt === true) {
        if (this.halted) {
          this.halted = false;

          _engine["default"].logs.log('Engine::eventKeyPressed', 'Engine un-halted'); // To avoid a jump in animations and movements, as timeLastRender haven has not been
          // updated since last step()


          this.timeLastRender = new Date().getTime();
          this.loop();
        } else {
          this.halted = true;

          _engine["default"].logs.log('Engine::eventKeyPressed', 'Engine halted');

          _engine["default"].gui.get('console').addText('halt', 'Engine halted');

          _engine["default"].gui.draw(this.ctx); // Force draw before halting the loop

        }
      } else if (keyCode == INPUT.KEYS.F && _engine["default"].options.allowFForFps === true) {
        if (_engine["default"].options.showFps === true) _engine["default"].options.showFps = false;else _engine["default"].options.showFps = true;
      }
    } // Game Loop

  }, {
    key: "loop",
    value: function loop() {
      var now = new Date().getTime();
      var dt = now - this.timeLastRender;

      if (dt >= _engine["default"].core.TIME_PER_FRAME) {
        this.timeLastRender = now;

        var sc = _engine["default"].scenes.getCurrentScene();

        if (this.halted) {
          return;
        } // Only the current scene


        if (sc && sc.isCurrent === true) {
          // Only advance game logic if game is not paused
          if (this.paused === false) {
            sc.step(dt);

            if (_engine["default"].game !== undefined) {
              _engine["default"].game.step(dt);
            }

            _engine["default"].effects.step(dt);

            _engine["default"].particles.step(dt);
          }

          _engine["default"].clock.step(dt);

          _engine["default"].gui.step(dt);

          _engine["default"].player.step(dt); // Render current level


          sc.draw(this.ctx);

          _engine["default"].effects.draw(this.ctx);

          _engine["default"].particles.draw(this.ctx); // FPS related stuff


          this.fpsPassed++;

          if (_engine["default"].options.showStatistics === true) {
            if (sc.getAttachedItems().length > 0) {
              _engine["default"].gui.get('console').addText('numItems', sc.getAttachedItems().length + ' ' + _engine["default"].localization.get('items'));
            }

            if (_engine["default"].effects.effects.length > 0) {
              _engine["default"].gui.get('console').addText('numEffects', _engine["default"].effects.effects.length + ' ' + _engine["default"].localization.get('effects'));
            }

            if (_engine["default"].particles.particles.length > 0) {
              _engine["default"].gui.get('console').addText('numParticles', _engine["default"].particles.particles.length + ' ' + _engine["default"].localization.get('particles'));
            }
          }

          _engine["default"].gui.draw(this.ctx);
        } // If the loop has been executed, wait a full TIME_PER_FRAME until next loop step


        dt = 0;
      }

      if (this.useAnimationFrame === true) {
        window.requestAnimationFrame(function () {
          _engine["default"].core.loop();
        });
      } else {
        setTimeout(function () {
          _engine["default"].core.loop();
        }, _engine["default"].core.TIME_PER_FRAME - dt);
      }
    }
  }, {
    key: "clearScreen",
    value: function clearScreen() {
      this.ctx.clearRect(0, 0, this.size.x, this.size.y);
    }
  }, {
    key: "pauseGame",
    value: function pauseGame() {
      if (_engine["default"].options.allowPause === false) return;
      this.paused = true;

      if (_engine["default"].gui.get('pause') === null) {
        var text = new GUI.GuiText(_engine["default"].localization.get('paused'), 500, 30);
        text.setFontColor('#FF2222');
        text.setAlign(GUI.ALIGN.CENTER);
        text.setPosition(this.size.x / 2, this.size.y / 2 + 100);

        _engine["default"].gui.attachItem(text, 'pause');
      }
    }
  }, {
    key: "unpauseGame",
    value: function unpauseGame() {
      if (_engine["default"].options.allowPause === false) return;
      this.paused = false;

      _engine["default"].gui.detachItem('pause');
    }
  }]);

  return Core;
}();

exports["default"] = Core;

},{"./engine":13,"./gui/gui":14,"./input/input":22,"./math/point":28}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("./engine"));

var MATH = _interopRequireWildcard(require("./math/math"));

var _utils = require("./utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Device =
/*#__PURE__*/
function () {
  function Device() {
    _classCallCheck(this, Device);

    this.canvasGlobalOffset = new MATH.Point();
    this.isTouchDevice = false;
    this.isResizing = false;
    this._clearTimeOutId = null;
  }

  _createClass(Device, [{
    key: "initialize",
    value: function initialize() {
      var _this = this;

      this.isTouchDevice = this.detectTouchDevice();

      if (this.isTouchDevice) {
        _engine["default"].logs.log('Engine::Initialize', 'Touch device detected');
      } else {
        _engine["default"].logs.log('Engine::Initialize', 'Touch device NOT detected');
      } // Get the offset of the DOM element used to capture the touch events


      this.canvasGlobalOffset = _engine["default"].device.getGlobalOffset(_engine["default"].core.canvas);
      (0, _utils.addEvent)('resize', window, function () {
        _engine["default"].device.isResizing = true;

        if (_engine["default"].options.showResizeMessage === true) {
          _engine["default"].gui.get('console').addText('resize', 'Resizing!'); // engine.logs.log('Engine::INPUT.Controller.onResize', 'Window resized');

        } // Recalculate if window is resized


        _engine["default"].device.canvasGlobalOffset = _engine["default"].device.getGlobalOffset(_engine["default"].core.canvas);
        clearTimeout(_this._clearTimeOutId);
        _this._clearTimeOutId = setTimeout(_engine["default"].device.doneResizing, 1000);
      });

      if (_engine["default"].options.avoidLeavingPage === true) {
        this.avoidLeavingPage();
      }
    }
  }, {
    key: "doneResizing",
    value: function doneResizing() {
      _engine["default"].device.isResizing = false;

      if (_engine["default"].options.showResizeMessage === true) {
        _engine["default"].gui.get('console').addText('resize', 'Resizing done');
      }
    }
  }, {
    key: "activate",
    value: function activate() {}
  }, {
    key: "getGlobalScroll",
    value: function getGlobalScroll() {
      var pos = new MATH.Point(0, 0); // All browsers except IE < 9

      if (window.pageYOffset) {
        pos.x = window.pageXOffset;
        pos.y = window.pageYOffset;
      } else {
        // Try to fall back if IE < 9, don't know for sure if this is gonna
        // work fine
        var element = document.getElementsByTagName('html')[0];

        if (element.scrollTop) {
          pos.x = element.scrollLeft;
          pos.y = element.scrollTop;
        }
      }

      return pos;
    } // Distance in pixels of a DOM element from the origin of the navigator

  }, {
    key: "getGlobalOffset",
    value: function getGlobalOffset(element) {
      var pos = new MATH.Point(0, 0);
      pos.x = element.offsetLeft;
      pos.y = element.offsetTop;

      while (element = element.offsetParent) {
        pos.x += element.offsetLeft;
        pos.y += element.offsetTop;
      }

      return pos;
    }
  }, {
    key: "detectTouchDevice",
    value: function detectTouchDevice() {
      // eslint undefined error with DocumentTouch

      /* global DocumentTouch */
      if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
      }

      return false;
    }
  }, {
    key: "getUserAgent",
    value: function getUserAgent() {
      return navigator.userAgent;
    }
  }, {
    key: "avoidLeavingPage",
    value: function avoidLeavingPage() {
      window.onbeforeunload = function () {
        return '';
      };
    } // Tricks got from stackoverflow
    // http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server

  }, {
    key: "createAndDownloadFile",
    value: function createAndDownloadFile(filename, text) {
      // IE
      if (window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([text], {
          type: 'text/csv;charset=utf-8;'
        });
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } // Other browsers
      else {
          var link = document.createElement('a');
          link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
          link.setAttribute('download', filename); // In Firefox the element has to be placed inside the DOM

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
    } // Duplicated in utils.js, as a global function, just for really, really old IEs

  }, {
    key: "detectIE",
    value: function detectIE() {
      var userAgent = navigator.userAgent.toLowerCase();

      if (/msie/.test(userAgent)) {
        return parseFloat((userAgent.match(/.*(?:rv|ie)[/: ](.+?)([ );]|$)/) || [])[1]);
      }

      if (navigator.appVersion.indexOf('Trident/') > 0) {
        return 11;
      }

      return -1;
    }
  }, {
    key: "isIE",
    value: function isIE() {
      // First detect IE 6-10, second detect IE 11
      if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
        return true;
      }

      return false;
    }
  }]);

  return Device;
}();

exports["default"] = Device;

},{"./engine":13,"./math/math":27,"./utils":36}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("../engine"));

var _item = _interopRequireDefault(require("../item"));

var MATH = _interopRequireWildcard(require("../math/math"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Effect =
/*#__PURE__*/
function (_Item) {
  _inherits(Effect, _Item);

  function Effect(effectType, x, y, vx, vy) {
    var _this;

    _classCallCheck(this, Effect);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Effect).call(this));
    var spriteData = _engine["default"].sprites.sprites[effectType];
    _this.size = new MATH.Point(spriteData[3], spriteData[4]);
    _this.numFrames = spriteData[5]; // position of the particle

    _this.position = new MATH.Point(x, y); // velocity vector of the particle

    _this.speed = new MATH.Point(vx, vy);
    _this.lived = 0; // Num of steps lived

    _this.lifeTime = 0; // Max num of steps to live (if 0 then ignored)

    _this.maxLoops = 1; // Num of loops to be rendered

    _this.spriteName = effectType;
    _this.initialScaling = 1;
    _this.finalScaling = 1;
    _this.transparencyMethod = 0; // 0 -> no, 1->appear, 2->disappear

    _this.globalAlpha = 1;
    return _this;
  }

  _createClass(Effect, [{
    key: "step",
    value: function step(dt) {
      // Call inherited function
      _get(_getPrototypeOf(Effect.prototype), "step", this).call(this, dt); // let preFrame = this.currentFrame;


      this.lived++;
      var newScaling = 1;

      if (this.initialScaling != 1 || this.finalScaling != 1) {
        newScaling = this.initialScaling + (this.finalScaling - this.initialScaling) * this.lived / this.lifeTime;
        this.scaling.x = newScaling;
        this.scaling.y = newScaling;
      }

      if (this.transparencyMethod == 2) {
        // disappearing
        if (this.lifeTime !== 0) {
          this.globalAlpha = 1 - this.lived / this.lifeTime;
        } else {
          this.globalAlpha = 1 - this.currentFrame / this.numFrames;
        }
      } else if (this.transparencyMethod == 1) {
        // appearing
        if (this.lifeTime !== 0) {
          this.globalAlpha = this.lived / this.lifeTime;
        } else {
          this.globalAlpha = this.currentFrame / this.numFrames;
        }
      } // If the effect is animated, advance its frames


      if (this.isAnimated === true) {
        _engine["default"].sprites.step(dt, this);
      } // if (preFrame != this.currentFrame)
      //   engine.logs.log('Effect', 'pre ' + preFrame + ' current ' + this.currentFrame);

    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      // Call inherited function
      _get(_getPrototypeOf(Effect.prototype), "draw", this).call(this, ctx);
    }
  }]);

  return Effect;
}(_item["default"]);

exports["default"] = Effect;

},{"../engine":13,"../item":24,"../math/math":27}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _effect = _interopRequireDefault(require("./effect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Effects =
/*#__PURE__*/
function () {
  function Effects() {
    _classCallCheck(this, Effects);

    this.effects = [];
    this.removed = [];
  }

  _createClass(Effects, [{
    key: "initialize",
    value: function initialize() {
      // engine.logs.log('Effects::initialize', 'Initializing effects Handler');
      this.effects.length = 0;
    }
  }, {
    key: "removeEffect",
    value: function removeEffect(eff) {
      this.removed.push(eff);
    } // Reset the list of removed objects

  }, {
    key: "_resetRemoved",
    value: function _resetRemoved() {
      this.removed.length = 0;
    } // Remove any objects marked for removal

  }, {
    key: "_finalizeRemoved",
    value: function _finalizeRemoved() {
      for (var i = 0, len = this.removed.length; i < len; i++) {
        var idx = this.effects.indexOf(this.removed[i]);

        if (idx != -1) {
          this.effects.splice(idx, 1);
        }
      }
    }
  }, {
    key: "step",
    value: function step(dt) {
      this._resetRemoved();

      for (var i = 0, len = this.effects.length; i < len; i++) {
        var eff = this.effects[i];
        eff.step(dt); // Effect lasts only the expected lifetime

        if (eff.lifeTime > 0 && eff.lived > eff.lifeTime) {
          this.removeEffect(eff);
        } // Effect lasts only one complete loop


        if (eff.maxLoops > 0 && eff.numLoops > eff.maxLoops) {
          this.removeEffect(eff);
        }
      }

      this._finalizeRemoved();
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      for (var i = 0, len = this.effects.length; i < len; i++) {
        this.effects[i].draw(ctx);
      }
    } // The coordinates passed are the ones from the center

  }, {
    key: "addEffect",
    value: function addEffect(type, x, y, vx, vy) {
      // var effectH = engine.sprites.sprites[type][3];
      // var effectW = engine.sprites.sprites[type][4];
      var eff = new _effect["default"](type, x, y, vx, vy);
      this.effects.push(eff); // Returns the effect to add further changes

      return eff;
    }
  }]);

  return Effects;
}();

exports["default"] = Effects;

},{"./effect":8}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("../engine"));

var _item = _interopRequireDefault(require("../item"));

var MATH = _interopRequireWildcard(require("../math/math"));

var _particle = _interopRequireDefault(require("./particle"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Emitter =
/*#__PURE__*/
function (_Item) {
  _inherits(Emitter, _Item);

  function Emitter(particleSpeed, magnitude, spread) {
    var _this;

    _classCallCheck(this, Emitter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Emitter).call(this)); // this.position = new MATH.Point(0, 0);
    // this.speed    = new MATH.Point(0, 0);

    _this.size = new MATH.Point(10, 10); // velocity vector of the particles

    _this.particleSpeed = particleSpeed;
    _this.magnitude = magnitude;
    _this.particleColor = [255, 255, 255, 255]; // [255,47,30,255]; // [66,167,222,255];

    _this.particleLife = 100;
    _this.particleSize = 3;
    _this.started = false;
    _this.spread = spread;
    _this.emissionRate = 3;
    return _this;
  }

  _createClass(Emitter, [{
    key: "start",
    value: function start() {
      this.started = true;
    }
  }, {
    key: "stop",
    value: function stop() {
      this.started = false;
    }
  }, {
    key: "createParticle",
    value: function createParticle() {
      var modifier = Math.random() * this.spread - this.spread / 2;
      var angle = this.getRotation() + modifier;
      var direction = MATH.angleToDirectionVector(angle);
      direction = direction.normalize();
      var particleSpeed = new MATH.Point(direction.x * this.particleSpeed, direction.y * this.particleSpeed); // Initial position of the particle

      var position = this.getPosition();
      var particle = new _particle["default"](position, particleSpeed);
      particle.ttl = Math.random() * this.particleLife;
      particle.color = this.particleColor;
      particle.size = this.particleSize; // this.particles.push(particle);

      _engine["default"].particles.addParticle(particle);
    }
  }, {
    key: "step",
    value: function step(dt) {
      _get(_getPrototypeOf(Emitter.prototype), "step", this).call(this, dt); // this.emissionCount = this.emissionCount++ % this.emissionRate;


      if (this.started === true) {
        for (var i = 0; i < this.emissionRate; i++) {
          this.createParticle();
        }
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      _get(_getPrototypeOf(Emitter.prototype), "draw", this).call(this, ctx);
    }
  }, {
    key: "collide",
    value: function collide() {
      // Emitters are not physical objects
      return false;
    }
  }]);

  return Emitter;
}(_item["default"]);

exports["default"] = Emitter;

},{"../engine":13,"../item":24,"../math/math":27,"./particle":11}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("../engine"));

var _item = _interopRequireDefault(require("../item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Particle =
/*#__PURE__*/
function (_Item) {
  _inherits(Particle, _Item);

  function Particle(position, speed) {
    var _this;

    _classCallCheck(this, Particle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Particle).call(this));

    _this.setPosition(position.x, position.y);

    _this.setSpeed(speed.x, speed.y);

    _this.ttl = -1;
    _this.lived = 0;
    _this.color = [];
    _this.size = 2;
    return _this;
  }

  _createClass(Particle, [{
    key: "initialize",
    value: function initialize() {}
  }, {
    key: "activate",
    value: function activate() {}
  }, {
    key: "step",
    value: function step(dt) {
      this.move(this.speed.x * dt / _engine["default"].core.TIME_PER_FRAME, this.speed.y * dt / _engine["default"].core.TIME_PER_FRAME);
      this.lived++;
    } // Not needed, the particles will be drawn inside the ParticleCollection object

  }, {
    key: "draw",
    value: function draw() {} // Will never be used, the particles are not attached to the scene

  }, {
    key: "collide",
    value: function collide() {
      // Particles are not physical objects
      return false;
    }
  }]);

  return Particle;
}(_item["default"]);

exports["default"] = Particle;

},{"../engine":13,"../item":24}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("../engine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Particles =
/*#__PURE__*/
function () {
  function Particles() {
    _classCallCheck(this, Particles);

    this.particles = [];
    this.maxParticles = 10000;
    this._removedParticles = []; // particles to be removed at the end of step()

    this.effectField = document.createElement('canvas');
    this.effectField.width = _engine["default"].core.size.x;
    this.effectField.height = _engine["default"].core.size.y;
    this.effectField.ctx = this.effectField.getContext('2d'); // this.effectField.ctx.globalCompositeOperation = 'darker';
    // this.effectField.ctx.fillStyle = 'rgba(' + this.particleColor.join(',') + ')';
  }

  _createClass(Particles, [{
    key: "initialize",
    value: function initialize() {
      this.particles = [];
      this.maxParticles = 10000;
      this._removedParticles = [];
    }
  }, {
    key: "addParticle",
    value: function addParticle(particle) {
      if (this.particles.length > this.maxParticles) {
        return;
      }

      this.particles.push(particle);
    }
  }, {
    key: "removeParticle",
    value: function removeParticle(what) {
      this._removedParticles.push(what);
    }
  }, {
    key: "_resetItems",
    value: function _resetItems() {
      this.particles.length = 0;
    } // Reset the list of removed items

  }, {
    key: "_resetRemoved",
    value: function _resetRemoved() {
      this._removedParticles.length = 0;
    } // Remove any items marked for removal

  }, {
    key: "_finalizeRemoved",
    value: function _finalizeRemoved() {
      for (var i = 0, len = this._removedParticles.length; i < len; i++) {
        var what = this._removedParticles[i];
        var idx = this.particles.indexOf(what);

        if (idx != -1) {
          // what.detachAllItems();
          this.particles.splice(idx, 1);
        }
      }
    }
  }, {
    key: "step",
    value: function step(dt) {
      var i,
          len = this.particles.length,
          p;

      for (i = 0; i < len; i++) {
        p = this.particles[i];

        if (p.lived > p.ttl) {
          this.removeParticle(p);
        } else {
          p.step(dt);
        }
      } // Remove any objects marked for removal


      this._finalizeRemoved(); // Reset the list of removed objects
      // this._resetRemoved();

    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.particles.length > 0) {
        this.effectField.ctx.clearRect(0, 0, _engine["default"].core.size.x, _engine["default"].core.size.y);
        var particle,
            i = -1;

        while (particle = this.particles[++i]) {
          var tmpColor = [particle.color[0] - particle.lived * 3, particle.color[1] - particle.lived, particle.color[2], particle.color[3]];
          this.effectField.ctx.fillStyle = 'rgba(' + tmpColor.join(',') + ')';
          this.effectField.ctx.fillRect(particle.position.x, particle.position.y, particle.size, particle.size);
        }

        ctx.drawImage(this.effectField, 0, 0, _engine["default"].core.size.x, _engine["default"].core.size.y);
      }
    }
  }]);

  return Particles;
}();

exports["default"] = Particles;

},{"../engine":13}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _options = _interopRequireDefault(require("./options"));

var _logs = _interopRequireDefault(require("./logs"));

var _core = _interopRequireDefault(require("./core"));

var _device = _interopRequireDefault(require("./device"));

var _effects = _interopRequireDefault(require("./effects/effects"));

var _particles = _interopRequireDefault(require("./effects/particles"));

var _sprites = _interopRequireDefault(require("./handlers/sprites"));

var _sounds = _interopRequireDefault(require("./handlers/sounds"));

var _fonts = _interopRequireDefault(require("./handlers/fonts"));

var _clock = _interopRequireDefault(require("./clocks/clock"));

var _localization = _interopRequireDefault(require("./localization/localization"));

var INPUT = _interopRequireWildcard(require("./input/input"));

var GUI = _interopRequireWildcard(require("./gui/gui"));

var _scenes = _interopRequireDefault(require("./scenes/scenes"));

var _preloader = _interopRequireDefault(require("./scenes/preloader"));

var _player = _interopRequireDefault(require("./player"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Engine =
/*#__PURE__*/
function () {
  function Engine() {
    _classCallCheck(this, Engine);

    this.options = null;
    this.logs = null;
    this.core = null;
    this.device = null;
    this.effects = null;
    this.particles = null;
    this.sprites = null;
    this.sounds = null;
    this.fonts = null;
    this.clock = null;
    this.localization = null;
    this.input = null;
    this.controls = null;
    this.gui = null;
    this.scenes = null;
    this.preloader = null;
    this.game = null;
    this.externalCallback = null;
    this.player = null;
  }

  _createClass(Engine, [{
    key: "initialize",
    value: function initialize(canvasElementId, gameObject, callbackFunction) {
      var _this = this;

      this.options = new _options["default"]();
      this.logs = new _logs["default"]();
      this.core = new _core["default"]();
      this.device = new _device["default"]();
      this.effects = new _effects["default"]();
      this.particles = new _particles["default"]();
      this.sprites = new _sprites["default"]();
      this.sounds = new _sounds["default"]();
      this.fonts = new _fonts["default"]();
      this.clock = new _clock["default"]();
      this.localization = new _localization["default"]();
      this.input = new INPUT.Controller();
      this.gui = new GUI.GuiElement();
      this.scenes = new _scenes["default"]();
      this.preloader = new _preloader["default"](); // empty player object, probably it will be crushed by
      // a specific game player object

      this.player = new _player["default"]();
      this.logs.log('Engine::initialize', 'Initializing starts...'); // try {
      //   this.game = new window[gameObject]();
      // } catch (err) {
      //   this.logs.log('Engine::initialize', 'Error instantiating game class');
      //   return;
      // }

      this.game = gameObject;

      if (callbackFunction !== null) {
        this.externalCallback = callbackFunction;
      }

      this.core.initialize(canvasElementId);
      this.device.initialize();
      this.effects.initialize();
      this.particles.initialize();
      this.sprites.initialize();
      this.sounds.initialize();
      this.clock.initialize();
      this.clock.suscribeOneSecond('testFPS', function () {
        if (_this.options.showFps) {
          _this.gui.get('console').addText('fps', _this.core.fpsPassed + ' fps');
        }

        _this.core.fpsPassed = 0;
      });
      this.input.initialize();
      this.localization.initialize(); // TODO maybe remove this from global engine someday
      // Global GUI

      var console = new GUI.GuiConsole();
      console.setSize(170, 30);
      console.setPosition(15 + console.size.x / 2, 15 + console.size.y / 2); // left down

      console.order = GUI.ORDENATION.UP;
      this.gui.initialize();
      this.gui.attachItem(console, 'console');
      this.scenes.initialize();
      this.preloader.playable = false; // Just in case

      this.preloader.initialize();
      this.game.initialize();
    }
  }, {
    key: "external",
    value: function external(eventType, id, message) {
      var _this2 = this;

      if (this.externalCallback !== null) {
        setTimeout(function () {
          try {
            _this2.externalCallback(eventType, id, message);
          } catch (err) {
            _this2.logs.log('Engine::external', 'Error with external callback with event ' + eventType + ' ' + id);
          }
        }, 1);
      }
    }
  }]);

  return Engine;
}(); // singleton pattern


var engine = new Engine();
var _default = engine;
exports["default"] = _default;

},{"./clocks/clock":4,"./core":6,"./device":7,"./effects/effects":9,"./effects/particles":12,"./gui/gui":14,"./handlers/fonts":18,"./handlers/sounds":19,"./handlers/sprites":20,"./input/input":22,"./localization/localization":25,"./logs":26,"./options":30,"./player":31,"./scenes/preloader":33,"./scenes/scenes":35}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "GuiElement", {
  enumerable: true,
  get: function get() {
    return _gui_element["default"];
  }
});
Object.defineProperty(exports, "GuiText", {
  enumerable: true,
  get: function get() {
    return _gui_text["default"];
  }
});
Object.defineProperty(exports, "GuiConsole", {
  enumerable: true,
  get: function get() {
    return _gui_console["default"];
  }
});
exports.ALIGN = exports.EVENTS = exports.ORDENATION = void 0;

var _gui_element = _interopRequireDefault(require("./gui_element"));

var _gui_text = _interopRequireDefault(require("./gui_text"));

var _gui_console = _interopRequireDefault(require("./gui_console"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Constants
var ORDENATION = {
  UP: 0,
  DOWN: 1
};
exports.ORDENATION = ORDENATION;
var EVENTS = {
  SELECTION: 0
};
exports.EVENTS = EVENTS;
var ALIGN = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center'
};
exports.ALIGN = ALIGN;

},{"./gui_console":15,"./gui_element":16,"./gui_text":17}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gui_element = _interopRequireDefault(require("./gui_element"));

var _gui_text = _interopRequireDefault(require("./gui_text"));

var _gui = require("./gui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var GuiConsole =
/*#__PURE__*/
function (_GuiElement) {
  _inherits(GuiConsole, _GuiElement);

  function GuiConsole() {
    var _this;

    _classCallCheck(this, GuiConsole);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GuiConsole).call(this));
    _this._texts = {}; // { id : [ 'text to show on scene', GuiText object, insertionTime ] }

    _this._textKeys = []; // keys of this._texts

    _this._textsToRemove = [];
    _this.order = _gui.ORDENATION.DOWN;
    return _this;
  }

  _createClass(GuiConsole, [{
    key: "initialize",
    value: function initialize() {
      _get(_getPrototypeOf(GuiConsole.prototype), "initialize", this).call(this);
    }
  }, {
    key: "activate",
    value: function activate() {
      _get(_getPrototypeOf(GuiConsole.prototype), "activate", this).call(this);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      var len = this._textKeys.length;

      if (len === 0) {
        return;
      } // let pos = this.getPosition();


      var yPos = 0;
      var xPos = 0;
      var now = new Date().getTime();

      for (var i = 0; i < len; i++) {
        var textInfo = this._texts[this._textKeys[i]];
        var text = textInfo[1];
        var time = textInfo[2]; // Delete old messages

        if (time + 2000 < now) {
          // just marked as "toRemove"
          this._textsToRemove.push(this._textKeys[i]); // this.detachItem(text);

        } else {
          text.setPosition(xPos, yPos); // text.draw(ctx);

          if (this.order == _gui.ORDENATION.DOWN) {
            yPos = yPos + 20;
          } else {
            yPos = yPos - 20;
          }
        }
      } // Call inherited function


      _get(_getPrototypeOf(GuiConsole.prototype), "draw", this).call(this, ctx);
    }
  }, {
    key: "step",
    value: function step(dt) {
      // Call inherited function
      _get(_getPrototypeOf(GuiConsole.prototype), "step", this).call(this, dt);

      var len = this._textsToRemove.length;

      if (len > 0) {
        for (var i = 0; i < len; i++) {
          this.detachItem(this._textsToRemove[i]);
          delete this._texts[this._textsToRemove[i]];
        }

        this._textKeys = Object.keys(this._texts);
        this._textsToRemove = [];
      }
    }
  }, {
    key: "addText",
    value: function addText(key, text) {
      if (typeof this._texts[key] !== 'undefined') {
        if (this._texts[key][0] != text) {
          this._texts[key][0] = text;

          this._texts[key][1].setText(text); // Same GuiText object

        }

        this._texts[key][2] = new Date().getTime();
      } else {
        var txt = new _gui_text["default"](text, this.size.x, this.size.y);
        txt.setSize(this.size.x, this.size.y); // Save time of last text addition

        this._texts[key] = [text, txt, new Date().getTime()];
        this._textKeys = Object.keys(this._texts);
        this.attachItem(txt, key);
      }
    }
  }]);

  return GuiConsole;
}(_gui_element["default"]);

exports["default"] = GuiConsole;

},{"./gui":14,"./gui_element":16,"./gui_text":17}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _item = _interopRequireDefault(require("../item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var GuiElement =
/*#__PURE__*/
function (_Item) {
  _inherits(GuiElement, _Item);

  function GuiElement(parentItem) {
    var _this;

    _classCallCheck(this, GuiElement);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GuiElement).call(this, parentItem));
    _this.guiId = null;

    if (typeof parentItem !== 'undefined') {
      _this.setParent(parentItem);
    } else {
      _this.guiId = 'globalGUI';
    }

    _this.inputCallbacks = {}; // { keyCode : callback_function }

    _this.guiElements = {}; // { "id" : guiElement object}

    _this.blink = false;
    return _this;
  }

  _createClass(GuiElement, [{
    key: "initialize",
    value: function initialize() {
      _get(_getPrototypeOf(GuiElement.prototype), "initialize", this).call(this);
    }
  }, {
    key: "activate",
    value: function activate() {
      _get(_getPrototypeOf(GuiElement.prototype), "activate", this).call(this);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      _get(_getPrototypeOf(GuiElement.prototype), "draw", this).call(this, ctx);
    }
  }, {
    key: "step",
    value: function step(dt) {
      _get(_getPrototypeOf(GuiElement.prototype), "step", this).call(this, dt);
    }
  }, {
    key: "setBlink",
    value: function setBlink(value) {
      var scene = this.getParentScene();

      if (scene === null) {
        return;
      }

      if (value === true) {
        this.blink = true;
        scene.clock.suscribe(this.guiId + '_clock', this, 'blinkStep', 350);
      } else {
        this.blink = false;
        this.setVisible(true);
        scene.clock.unsuscribe(this.guiId + '_clock');
      }
    }
  }, {
    key: "blinkStep",
    value: function blinkStep() {
      if (this.blink === true && this.getVisible() === true) {
        this.setVisible(false);
      } else if (this.blink === true && this.getVisible() === false) {
        this.setVisible(true);
      } // Should not happen, ever
      else if (this.blink === false) {
          this.setVisible(true);
        }
    }
  }, {
    key: "addInputCallback",
    value: function addInputCallback(key, callback) {
      var scene = this.getParentScene();

      if (scene === null) {
        return;
      }

      scene.input.addKeyListener(this, 'eventKeyPressed', [key], true); // true == inform in pause too

      this.inputCallbacks[key] = callback;
    }
  }, {
    key: "eventKeyPressed",
    value: function eventKeyPressed(keyCode) {
      // engine.logs.log('Gui.eventKeyPressed', 'Key Pressed: ' + keyCode);
      if (typeof this.inputCallbacks[keyCode] !== 'undefined') {
        this.inputCallbacks[keyCode]();
      }
    }
  }, {
    key: "getElement",
    value: function getElement(id) {
      var ret = this.guiElements[id];

      if (typeof ret !== 'undefined') {
        return ret;
      }

      return null;
    }
  }, {
    key: "get",
    value: function get(id) {
      return this.getElement(id);
    }
  }, {
    key: "attachItem",
    value: function attachItem(what, id) {
      this.guiElements[id] = what;
      what.guiId = id; // this.guiElementsIds = Object.keys(this.guiElements);

      _get(_getPrototypeOf(GuiElement.prototype), "attachItem", this).call(this, what);
    }
  }, {
    key: "detachItem",
    value: function detachItem(id) {
      if (typeof id !== 'undefined') {
        _get(_getPrototypeOf(GuiElement.prototype), "detachItem", this).call(this, this.get(id));

        delete this.guiElements[id]; // this.guiElementsIds = Object.keys(this.guiElements);
      }
    }
  }, {
    key: "detachAllItems",
    value: function detachAllItems() {
      var keys = Object.keys(this.guiElements);

      for (var i = 0, len = keys.length; i < len; i++) {
        // Recursive in-depth
        this.guiElements[keys[i]].detachAllItems();
        this.detachItem(keys[i]);
      }

      this.guiElements = {}; // this.guiElementsIds = [];

      this._finalizeRemoved(); // Don't, in GUI the elements are detached by id, not by object
      // super.detachAllItems(this);

    }
  }, {
    key: "_resetItems",
    value: function _resetItems() {
      this.attachedItems.length = 0;
      this.guiElements = {};
    }
  }]);

  return GuiElement;
}(_item["default"]);

exports["default"] = GuiElement;

},{"../item":24}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gui_element = _interopRequireDefault(require("./gui_element"));

var _gui = require("./gui");

var MATH = _interopRequireWildcard(require("../math/math"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var GuiText =
/*#__PURE__*/
function (_GuiElement) {
  _inherits(GuiText, _GuiElement);

  function GuiText(txt, x, y) {
    var _this;

    _classCallCheck(this, GuiText);

    // TODO: parameters?
    _this = _possibleConstructorReturn(this, _getPrototypeOf(GuiText).call(this));
    _this.text = txt;
    _this.font = 'base,BaseFont,"Courier New"';
    _this.fontSize = 20;
    _this.fontColor = '#FFFFFF'; // white

    _this.fontBorderColor = '#000000'; // black

    _this.textAlign = _gui.ALIGN.LEFT; // to avoid magic numbers which really does not fit with
    // different fonts

    _this.verticalOffset = 20;
    _this.horizontalOffset = 10;

    if (typeof x === 'undefined' || typeof y === 'undefined') {
      _this.size.x = 100;
      _this.size.y = 30;
    } else {
      _this.size.x = x;
      _this.size.y = y;
    } // New GuiText version with its own canvas


    _this._canvasRendering = true;
    _this._innerCanvas = document.createElement('canvas');
    _this._innerCanvas.width = _this.size.x;
    _this._innerCanvas.height = _this.size.y;
    _this._innerContext = _this._innerCanvas.getContext('2d'); // Should re-render the canvas?

    _this._innerChange = true;
    return _this;
  }

  _createClass(GuiText, [{
    key: "initialize",
    value: function initialize() {
      _get(_getPrototypeOf(GuiText.prototype), "initialize", this).call(this);
    }
  }, {
    key: "activate",
    value: function activate() {
      _get(_getPrototypeOf(GuiText.prototype), "activate", this).call(this);
    } // Mask Item.getSize
    // getSize()
    // {
    //   var size = super.getSize(this);
    //   // Be sure the size is never zero, or we will have an exception
    //   // when trying to render the innerCanvas
    //   if ((size.x == 0) || (size.y == 0))
    //     return new MATH.Point(100, 30);
    //   else
    //     return size;
    // }

  }, {
    key: "setSize",
    value: function setSize(x, y) {
      _get(_getPrototypeOf(GuiText.prototype), "setSize", this).call(this, x, y);

      this._innerCanvas.width = this.size.x;
      this._innerCanvas.height = this.size.y;
      this._innerChange = true;
    } // Mask Item.getPosition
    // getPosition()
    // {
    //   if (this.getParent() != undefined)
    //   {
    //     return this.getParent().getPosition();
    //   }
    //   return new MATH.Point(0, 0);
    // }

  }, {
    key: "setText",
    value: function setText(txt) {
      if (this.text == txt) {
        return;
      }

      this.text = txt;
      this._innerChange = true;
    }
  }, {
    key: "getText",
    value: function getText() {
      return this.text;
    } // receives global context just to compare values if necessary

  }, {
    key: "_updateInnerRender",
    value: function _updateInnerRender(ctx) {
      // let pos = this.getPosition();
      // let size = this.getSize();
      // let scale = this.getScaling();
      var where = new MATH.Point(this.horizontalOffset, this.verticalOffset);

      if (this.textAlign == _gui.ALIGN.CENTER) {
        where.x = this.size.x / 2;
      } else if (this.textAlign == _gui.ALIGN.RIGHT) {
        where.x = this.size.x - this.horizontalOffset;
      } // use global context values


      this._innerContext.lineWidth = ctx.lineWidth;

      this._innerContext.clearRect(0, 0, this.size.x, this.size.y);

      this._innerContext.strokeStyle = this.fontBorderColor;
      this._innerContext.fillStyle = this.fontColor;
      this._innerContext.textAlign = this.textAlign;
      this._innerContext.font = 'bold ' + this.fontSize + 'px ' + this.font; // print the full string
      // this._innerContext.strokeText(this.getText(), where.x, where.y);
      // this._innerContext.fillText(this.getText(), where.x, where.y);

      var pieces = this.getText().split('\n');

      for (var i = 0, len = pieces.length; i < len; i++) {
        this._innerContext.strokeText(pieces[i], where.x, where.y);

        this._innerContext.fillText(pieces[i], where.x, where.y);

        where.y += this.verticalOffset; // + this.fontSize;
      }

      this._innerChange = false;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.getVisible() === true) {
        var pos = this.getPosition();
        var size = this.getSize();

        if (this._canvasRendering === false) {
          // let scale = this.getScaling();
          var offset = new MATH.Point(this.horizontalOffset, this.verticalOffset);

          if (this.textAlign == _gui.ALIGN.CENTER) {
            offset.x = this.size.x / 2;
          } else if (this.textAlign == _gui.ALIGN.RIGHT) {
            offset.x = this.size.x - this.horizontalOffset;
          }

          ctx.strokeStyle = this.fontBorderColor;
          ctx.fillStyle = this.fontColor;
          ctx.textAlign = this.textAlign;
          ctx.font = 'bold ' + this.fontSize + 'px ' + this.font; // print the full string
          // ctx.strokeText( this.getText(),
          //                 pos.x - (size.x / 2) + offset.x,
          //                 pos.y - (size.y / 2) + offset.y);
          // ctx.fillText( this.getText(),
          //               pos.x - (size.x / 2) + offset.x,
          //               pos.y - (size.y / 2) + offset.y);

          var pieces = this.getText().split('\n');

          for (var i = 0, len = pieces.length; i < len; i++) {
            ctx.strokeText(pieces[i], pos.x - size.x / 2 + offset.x, pos.y - size.y / 2 + offset.y);
            ctx.fillText(pieces[i], pos.x - size.x / 2 + offset.x, pos.y - size.y / 2 + offset.y);
            offset.y += this.verticalOffset; // + this.fontSize;
          }
        } else {
          if (this._innerChange === true) {
            this._updateInnerRender(ctx);
          }

          ctx.drawImage(this._innerCanvas, pos.x - this.size.x / 2, pos.y - this.size.y / 2);
        }
      } // Call inherited function


      _get(_getPrototypeOf(GuiText.prototype), "draw", this).call(this, ctx);
    }
  }, {
    key: "step",
    value: function step(dt) {
      // Call inherited function
      _get(_getPrototypeOf(GuiText.prototype), "step", this).call(this, dt);
    }
  }, {
    key: "setFont",
    value: function setFont(font) {
      this.font = font;
    }
  }, {
    key: "setFontSize",
    value: function setFontSize(size) {
      this.fontSize = size;
    }
  }, {
    key: "setFontColor",
    value: function setFontColor(color) {
      this.fontColor = color;
    }
  }, {
    key: "setFontBorderColor",
    value: function setFontBorderColor(color) {
      this.fontBorderColor = color;
    }
  }, {
    key: "setAlign",
    value: function setAlign(align) {
      this.textAlign = align;
    }
  }, {
    key: "setCanvasRendering",
    value: function setCanvasRendering(value) {
      this._canvasRendering = value;
    }
  }, {
    key: "setVerticalOffset",
    value: function setVerticalOffset(offset) {
      this.verticalOffset = offset;
    }
  }, {
    key: "setHorizontalOffset",
    value: function setHorizontalOffset(offset) {
      this.horizontalOffset = offset;
    }
  }]);

  return GuiText;
}(_gui_element["default"]);

exports["default"] = GuiText;

},{"../math/math":27,"./gui":14,"./gui_element":16}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FONTINFO = {
  FONTOBJECT: 0,
  ORIGINALPATH: 1
};

var Fonts =
/*#__PURE__*/
function () {
  function Fonts() {
    _classCallCheck(this, Fonts);

    // List of Font() objects used in the game, indexed by id/name
    // fonts[name] = [object, original_path];
    this.fonts = {};
  }

  _createClass(Fonts, [{
    key: "initialize",
    value: function initialize() {
      // engine.logs.log('engine.fonts.initialize', 'Initializing font Handler');
      this.fonts.length = 0;
    }
  }, {
    key: "step",
    value: function step() {} // draw(ctx, object)
    // {
    // }

  }, {
    key: "fontExists",
    value: function fontExists(path) {
      var ids = Object.keys(this.fonts);

      for (var i = 0, len = ids.length; i < len; i++) {
        if (this.fonts[ids[i]][FONTINFO.ORIGINALPATH] == path) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "addFont",
    value: function addFont(name, path, object) {
      this.fonts[name] = [object, path];
    }
  }, {
    key: "get",
    value: function get(name) {
      if (typeof this.fonts[name] == 'undefined') {
        return null;
      }

      return this.fonts[name][FONTINFO.FONTOBJECT];
    }
  }]);

  return Fonts;
}();

exports["default"] = Fonts;

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SOUNDINFO = {
  AUDIOOBJECT: 0,
  ORIGINALPATH: 1
};

var Sounds =
/*#__PURE__*/
function () {
  function Sounds() {
    _classCallCheck(this, Sounds);

    // List of Audio() objects used in the game, indexed by id/name
    // sounds[name] = [object, original_path];
    this.sounds = {};
  }

  _createClass(Sounds, [{
    key: "initialize",
    value: function initialize() {
      // engine.logs.log('engine.sounds.initialize', 'Initializing sound Handler');
      this.sounds.length = 0;
    }
  }, {
    key: "step",
    value: function step() {} // draw(ctx, object)
    // {
    // }

  }, {
    key: "soundExists",
    value: function soundExists(path) {
      var ids = Object.keys(this.sounds);

      for (var i = 0, len = ids.length; i < len; i++) {
        if (this.sounds[ids[i]][SOUNDINFO.ORIGINALPATH] == path) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "addSound",
    value: function addSound(name, path, object) {
      this.sounds[name] = [object, path];
    }
  }, {
    key: "get",
    value: function get(name) {
      if (typeof this.sounds[name] == 'undefined') {
        return null;
      }

      var sound = this.sounds[name][SOUNDINFO.AUDIOOBJECT]; // if already playing, clone the Audio object and use the new copy

      if (sound.currentTime > 0) {
        sound = sound.cloneNode();
      }

      return sound;
    } // Play the sound now

  }, {
    key: "play",
    value: function play(name) {
      var sound = this.get(name);

      if (sound !== null) {
        // Sound already playing
        if (sound.currentTime > 0) {
          sound.currentTime = 0;
        }

        sound.play();
      }
    }
  }]);

  return Sounds;
}();

exports["default"] = Sounds;

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var MATH = _interopRequireWildcard(require("../math/math"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SPRITEINFO = {
  PATH: 0,
  XSTART: 1,
  YSTART: 2,
  WIDTH: 3,
  HEIGTH: 4,
  FRAMES: 5,
  INITFRAME: 6,
  FRAMESPEED: 7
};

var Sprites =
/*#__PURE__*/
function () {
  function Sprites() {
    _classCallCheck(this, Sprites);

    // Information related to each sprite, as it was configured in the preloader, indexed by
    // the sprite id/name
    // sprites[spriteName] = [imagePath, xStart, yStart, width, height, frames, initFrame, speed]
    this.sprites = {}; // List of Image() objects used in the game, indexed by original URL
    // images[path] = object;

    this.images = {};
  }

  _createClass(Sprites, [{
    key: "initialize",
    value: function initialize() {
      // engine.logs.log('engine.sprites.initialize', 'Initializing sprites Handler');
      this.sprites.length = 0;
      this.images.length = 0;
    }
  }, {
    key: "step",
    value: function step(dt, object) {
      var fps = this.sprites[object.spriteName][SPRITEINFO.FRAMESPEED];
      var frames = this.sprites[object.spriteName][SPRITEINFO.FRAMES];
      var initFrame = this.sprites[object.spriteName][SPRITEINFO.INITFRAME]; // If the item wants to be rendered at different frame speed

      if (object.forceFrameSpeed !== 0) {
        fps = object.forceFrameSpeed;
      } // if frames > 1 -> animation


      if (frames > 1) {
        var now = new Date().getTime(); // If the animation just started

        if (object.timeLastFrame === 0) {
          object.timeLastFrame = now;
        } // If time enough has passed to change the currentFrame


        if (now - object.timeLastFrame > 1000 / fps) {
          var preFrame = object.currentFrame;
          object.currentFrame++;

          if (object.currentFrame >= initFrame + frames) {
            object.currentFrame = initFrame;
          }

          object.timeLastFrame = now; // If the animation restarts, increment loop counter

          if (preFrame == frames - 1) {
            object.numLoops += 1;

            if (typeof object.eventAnimationRestart !== 'undefined') {
              object.eventAnimationRestart();
            }
          }
        }
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx, object) {
      if (object.getVisible() === false) {
        return;
      } // sprites[i] -> [imagePath, xStart, yStart, width, height, frames, initFrame, speed]


      var image = this.sprites[object.spriteName][SPRITEINFO.PATH];
      var xStart = this.sprites[object.spriteName][SPRITEINFO.XSTART];
      var yStart = this.sprites[object.spriteName][SPRITEINFO.YSTART];
      var width = this.sprites[object.spriteName][SPRITEINFO.WIDTH];
      var height = this.sprites[object.spriteName][SPRITEINFO.HEIGTH]; // let frames = this.sprites[object.spriteName][SPRITEINFO.FRAMES];

      var position = object.getPosition(); // Set transparency

      ctx.globalAlpha = object.globalAlpha;

      if (object.rotation.getAngle() !== 0) {
        ctx.save();
        ctx.translate(position.x, position.y);
        ctx.rotate(object.rotation.getAngle());
        ctx.drawImage(this.images[image], xStart + object.currentFrame * width, yStart, width, height, -width / 2 * object.scaling.x, -height / 2 * object.scaling.y, width * object.scaling.x, height * object.scaling.y);
        ctx.restore();
      } // Draw without rotation
      else {
          ctx.drawImage(this.images[image], xStart + object.currentFrame * width, yStart, width, height, position.x - width / 2 * object.scaling.x, position.y - height / 2 * object.scaling.y, width * object.scaling.x, height * object.scaling.y);
        } // restore, just in case


      ctx.globalAlpha = 1;
    }
  }, {
    key: "imageExists",
    value: function imageExists(path) {
      return Object.prototype.hasOwnProperty.call(this.images, path); // return this.images.hasOwnProperty(path);
    }
  }, {
    key: "spriteExists",
    value: function spriteExists(name) {
      return Object.prototype.hasOwnProperty.call(this.sprites, name); // return this.sprites.hasOwnProperty(name);
    }
  }, {
    key: "addImage",
    value: function addImage(path, object) {
      this.images[path] = object;
    }
  }, {
    key: "addSprite",
    value: function addSprite(name, path, xStart, yStart, width, height, frames, initFrame, speed) {
      this.sprites[name] = [path, xStart, yStart, width, height, frames, initFrame, speed];
    } // Returns the object to be painted in the context

  }, {
    key: "getImage",
    value: function getImage(spriteName) {
      // this.sprites[spriteName][0] -> full path from the spriteName
      return this.images[this.sprites[spriteName][SPRITEINFO.PATH]];
    }
  }, {
    key: "getImageFromPath",
    value: function getImageFromPath(path) {
      return this.images[path];
    }
  }, {
    key: "getSpriteData",
    value: function getSpriteData(spriteName) {
      var ret = this.sprites[spriteName];

      if (typeof ret !== 'undefined') {
        return ret;
      }

      return null;
    }
  }, {
    key: "getSpriteInfo",
    value: function getSpriteInfo(spriteName, value) {
      var ret = this.sprites[spriteName];

      if (typeof ret !== 'undefined') {
        var info = ret[value];

        if (typeof info !== 'undefined') {
          return info;
        }
      }

      return null;
    }
  }, {
    key: "getSpriteSize",
    value: function getSpriteSize(spriteName) {
      var ret = this.sprites[spriteName];
      var w = 0;
      var h = 0;

      if (typeof ret !== 'undefined') {
        w = ret[SPRITEINFO.WIDTH];
        h = ret[SPRITEINFO.HEIGTH];
      }

      return new MATH.Point(w, h);
    }
  }]);

  return Sprites;
}();

exports["default"] = Sprites;

},{"../math/math":27}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("../engine"));

var _utils = require("../utils");

var _input = require("./input");

var MATH = _interopRequireWildcard(require("../math/math"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Controller =
/*#__PURE__*/
function () {
  function Controller() {
    _classCallCheck(this, Controller);

    // Same as KEYBOARD, but with code:key ordering
    // Built in the initialize method
    this.inverseKeyboard = {}; // Object with the keys pressed == true

    this.pressed = {}; // { keyCode : true/false }

    this.lastPressed = []; // list of last pressed key codes

    this.lastPressedTime = new Date().getTime(); // Time when a key was pressed last time

    this.currentInputController = null;
  }

  _createClass(Controller, [{
    key: "initialize",
    value: function initialize() {
      // Build the inverseKeyboard
      for (var prop in _input.KEYS) {
        if (Object.prototype.hasOwnProperty.call(_input.KEYS, prop)) {
          // if (KEYS.hasOwnProperty(prop)) {
          this.inverseKeyboard[_input.KEYS[prop]] = prop;
        }
      } // Using document instead of window in the key-press events
      // because old IEs did not implement them in the window object


      (0, _utils.addEvent)('keyup', document, function (event) {
        _engine["default"].input.onKeyup(event); // event.preventDefault();

      });
      (0, _utils.addEvent)('keydown', document, function (event) {
        _engine["default"].input.onKeydown(event); // don't trap keys if the focus is in a html input (outside the game canvas)


        if (_engine["default"].input.isTargetInput(event)) return;
        if (_engine["default"].options.preventDefaultKeyStrokes === true || // delete or backspace
        event.keyCode == 8 || event.keyCode == 46) event.preventDefault();
      });
      (0, _utils.addEvent)('blur', window, function () {
        _engine["default"].input.resetKeys(); // Pause the game when we change tab or window


        if (_engine["default"].options.pauseOnWindowChange) {
          _engine["default"].pauseGame();
        } // event.preventDefault();

      }); // Capture touch events

      (0, _utils.addEvent)('touchstart', _engine["default"].core.canvas, function (event) {
        _engine["default"].input.onClickStart(event.touches[0].clientX, event.touches[0].clientY); // So touch would work in Android browser


        if (navigator.userAgent.match(/Android/i)) {
          event.preventDefault();
        }

        return false;
      });
      (0, _utils.addEvent)('touchmove', _engine["default"].core.canvas, function (event) {
        event.preventDefault();
        return false;
      });
      (0, _utils.addEvent)('touchend', _engine["default"].core.canvas, function (event) {
        event.preventDefault();
        return false;
      }); // Capture click events

      (0, _utils.addEvent)('click', _engine["default"].core.canvas, function (event) {
        _engine["default"].input.onClickStart(event.clientX, event.clientY);

        event.preventDefault();
        return false;
      });
      (0, _utils.addEvent)('mousedown', _engine["default"].core.canvas, function (event) {
        event.preventDefault();
        return false;
      }); // To avoid selections
      // document.onselectstart = function() { return false; }
    }
  }, {
    key: "activate",
    value: function activate() {}
  }, {
    key: "getCurrentInputcontroller",
    value: function getCurrentInputcontroller() {
      return this.currentInputController;
    }
  }, {
    key: "setCurrentInputController",
    value: function setCurrentInputController(controller) {
      this.currentInputController = controller;
    }
  }, {
    key: "isKeyPressed",
    value: function isKeyPressed(keyCode) {
      return this.pressed[keyCode];
    }
  }, {
    key: "onKeydown",
    value: function onKeydown(event) {
      // Avoid multiple events when holding keys
      if (this.pressed[event.keyCode] === true) {
        return;
      } // The key is pressed


      this.pressed[event.keyCode] = true; // Add to the array of last pressed keys, and update times

      this.addLastPressed(event.keyCode);
    }
  }, {
    key: "onKeyup",
    value: function onKeyup(event) {
      delete this.pressed[event.keyCode];
    }
  }, {
    key: "onClickStart",
    value: function onClickStart(x, y) {
      // If the screen is being modified, ignore touch events for safety
      if (_engine["default"].device.isResizing === true) {
        return;
      }

      var position = new MATH.Point(x, y); // let position = new MATH.Point(event.changedTouches[0].pageX, event.changedTouches[0].pageY); // ontouchend
      // Apply correction if the scroll has moved

      var scroll = _engine["default"].device.getGlobalScroll();

      position.x += scroll.x;
      position.y += scroll.y; // engine.logs.log('Engine.INPUT.Controller.onTouchStart', 'Touch in position: ' +position.x+' '+position.y);

      if (position.x < _engine["default"].device.canvasGlobalOffset.x || position.y < _engine["default"].device.canvasGlobalOffset.y || position.x > _engine["default"].device.canvasGlobalOffset.x + _engine["default"].core.canvas.width || position.y > _engine["default"].device.canvasGlobalOffset.y + _engine["default"].core.canvas.height) {// engine.logs.log('Engine.INPUT.Controller.onTouchStart', 'Touch outside the canvas, ignoring');
        // engine.gui.get('console').addText('touch', 'Pos ' + position.x + ' ' + position.y);
      } else {
        position.x -= _engine["default"].device.canvasGlobalOffset.x;
        position.y -= _engine["default"].device.canvasGlobalOffset.y; // engine.logs.log('Engine.INPUT.Controller.onTouchStart', 'Touch inside the canvas, got it!');
        // engine.gui.get('console').addText('touch', 'Pos ' + position.x + ' ' + position.y);

        this.currentInputController.detectClick(position);
      }
    }
  }, {
    key: "resetKeys",
    value: function resetKeys() {
      for (var key in this.pressed) {
        this.pressed[key] = false;
      }
    }
  }, {
    key: "addLastPressed",
    value: function addLastPressed(keyCode) {
      // Inform to listening objects in the current scene
      this.currentInputController.informKeyPressed(keyCode);
      var now = new Date().getTime(); // If a second has passed, clear the pressed keys list

      if (now - this.lastPressedTime > 1000) {
        this.lastPressed = [];
      }

      this.lastPressedTime = now;
      this.lastPressed.push(keyCode); // Only save last 10 elements

      if (this.lastPressed.length > 10) {
        this.lastPressed.shift();
      }

      if (_engine["default"].options.outputPressedKeys === true) {
        _engine["default"].logs.log('Input.addLastPressed', 'Pressed key: ' + this.inverseKeyboard[keyCode], now);
      } // Inform combo performed to currentInputController if needed


      var whichCombo = this.currentInputController.detectCombo();

      if (whichCombo !== null) {
        this.currentInputController.informComboPerformed(whichCombo, now);
      }
    }
  }, {
    key: "addClick",
    value: function addClick(id) {
      this.currentInputController.informClick(id);

      if (_engine["default"].options.outputClicks === true) {
        _engine["default"].logs.log('Input.addClick', 'Click over: ' + id);
      }
    }
  }, {
    key: "getKeyFromCode",
    value: function getKeyFromCode(keyCode) {
      return this.inverseKeyboard[keyCode];
    }
  }, {
    key: "convertKeyToNumber",
    value: function convertKeyToNumber(keyCode) {
      switch (keyCode) {
        case _input.KEYS.NINE:
          return 9;

        case _input.KEYS.EIGTH:
          return 8;

        case _input.KEYS.SEVEN:
          return 7;

        case _input.KEYS.SIX:
          return 6;

        case _input.KEYS.FIVE:
          return 5;

        case _input.KEYS.FOUR:
          return 4;

        case _input.KEYS.THREE:
          return 3;

        case _input.KEYS.TWO:
          return 2;

        case _input.KEYS.ONE:
          return 1;

        case _input.KEYS.ZERO:
          return 0;

        default:
          break;
      }

      return -1;
    }
  }, {
    key: "convertNumberToKey",
    value: function convertNumberToKey(number) {
      switch (number) {
        case 9:
          return _input.KEYS.NINE;

        case 8:
          return _input.KEYS.EIGTH;

        case 7:
          return _input.KEYS.SEVEN;

        case 6:
          return _input.KEYS.SIX;

        case 5:
          return _input.KEYS.FIVE;

        case 4:
          return _input.KEYS.FOUR;

        case 3:
          return _input.KEYS.THREE;

        case 2:
          return _input.KEYS.TWO;

        case 1:
          return _input.KEYS.ONE;

        case 0:
          return _input.KEYS.ZERO;

        default:
          break;
      }

      return _input.KEYS.ZERO;
    }
  }, {
    key: "isTargetInput",
    value: function isTargetInput(event) {
      return event.target.type == 'textarea' || event.target.type == 'text' || event.target.type == 'number' || event.target.type == 'email' || event.target.type == 'password' || event.target.type == 'search' || event.target.type == 'tel' || event.target.type == 'url' || event.target.isContentEditable;
    }
  }]);

  return Controller;
}();

exports["default"] = Controller;

},{"../engine":13,"../math/math":27,"../utils":36,"./input":22}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Controller", {
  enumerable: true,
  get: function get() {
    return _controller["default"];
  }
});
Object.defineProperty(exports, "SceneInput", {
  enumerable: true,
  get: function get() {
    return _scene_input["default"];
  }
});
exports.COMBO_TYPES = exports.KEYS = void 0;

var _controller = _interopRequireDefault(require("./controller"));

var _scene_input = _interopRequireDefault(require("./scene_input"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Keyboard key codes
var KEYS = {
  // Engine Control
  ANY_KEY: -1,
  // Utils
  INSERT: 45,
  DELETE: 46,
  SPACEBAR: 32,
  ESC: 27,
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  PAUSE: 19,
  CAPS_LOCK: 20,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  // Cursors
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  // Letters
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  // Numbers
  ZERO: 48,
  ONE: 49,
  TWO: 50,
  THREE: 51,
  FOUR: 52,
  FIVE: 53,
  SIX: 54,
  SEVEN: 55,
  EIGHT: 56,
  NINE: 57,
  // Others
  LEFT_WINDOW_KEY: 91,
  RIGHT_WINDOW_KEY: 92,
  SELECT_KEY: 93,
  NUMPAD_0: 96,
  NUMPAD_1: 97,
  NUMPAD_2: 98,
  NUMPAD_3: 99,
  NUMPAD_4: 100,
  NUMPAD_5: 101,
  NUMPAD_6: 102,
  NUMPAD_7: 103,
  NUMPAD_8: 104,
  NUMPAD_9: 105,
  MULTIPLY: 106,
  ADD: 107,
  SUBTRACT: 109,
  DECIMAL_POINT: 110,
  DIVIDE: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  NUM_LOCK: 144,
  SCROLL_LOCK: 145,
  SEMI_COLON: 186,
  EQUAL_SIGN: 187,
  COMMA: 188,
  DASH: 189,
  PERIOD: 190,
  FORWARD_SLASH: 191,
  GRAVE_ACCENT: 192,
  OPEN_BRACKET: 219,
  BACK_SLASH: 220,
  CLOSE_BRAKET: 221,
  SINGLE_QUOTE: 222,
  // spanish keyboard
  NTILDE: 209
}; // Types of combos

exports.KEYS = KEYS;
var COMBO_TYPES = {
  CONSECUTIVE: 1,
  // One key after the other
  SIMULTANEOUS: 2 // Keys pressed at the same time

};
exports.COMBO_TYPES = COMBO_TYPES;

},{"./controller":21,"./scene_input":23}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("../engine"));

var _input = require("./input");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SceneInput =
/*#__PURE__*/
function () {
  function SceneInput() {
    _classCallCheck(this, SceneInput);

    // List of combos to detect
    // Combos will be defined in the form
    // combos[comboName] = { comboType: type, comboKeys: [list of keys], lastTime: time }
    this.combos = {}; // { keyCode : [ list of structures of type
    //                      {
    //                          listeningOb:   ob listening to the event,
    //                          listeningFunc: function to be called inside listeningOb,
    //                          onPause:       bool, if ob should be informed with the game on pause,
    //                      }
    //             ]
    // }

    this.comboListeners = {};
    this.keyListeners = {}; // { keyCode : [ list of objects listening to the event ] }
    // List of clickable zones
    // clickableZones[zoneName] = {
    //                  position : x, y of its center,
    //                  size : x, y (rectangle form),
    //                  character : character to emulate when it's touched
    //                        }

    this.clickableZones = {};
    this.clickListeners = []; // array of elements listening to click events
  }

  _createClass(SceneInput, [{
    key: "initialize",
    value: function initialize() {}
  }, {
    key: "activate",
    value: function activate() {
      _engine["default"].input.setCurrentInputController(this); // Always have the common controls


      this.addKeyListener(_engine["default"].core, 'eventKeyPressed', [_input.KEYS.P, _input.KEYS.ESC, _input.KEYS.F], true);
    } // testLog()
    // {
    //   let res = '[';
    //   for (let j = 0, len_j = this.lastPressed.length; j < len_j; j++)
    //     res += this.lastPressed[j] + ', ';
    //   res += ']';
    //   engine.logs.log('Input.testLog', res);
    // }

  }, {
    key: "addKeyListener",
    value: function addKeyListener(object, funcName, keyList, onPause) {
      if (typeof onPause == 'undefined') {
        onPause = false;
      }

      var element = {};
      element['listeningOb'] = object;
      element['listeningFunc'] = funcName;
      element['onPause'] = onPause;

      for (var i = 0, len = keyList.length; i < len; i++) {
        if (typeof this.keyListeners[keyList[i]] === 'undefined') {
          this.keyListeners[keyList[i]] = [element];
        } else {
          this.keyListeners[keyList[i]].push(element);
        }
      }
    }
  }, {
    key: "addClickListener",
    value: function addClickListener(object, funcName, onPause) {
      if (typeof onPause === 'undefined') {
        onPause = false;
      }

      var element = {};
      element['listeningOb'] = object;
      element['listeningFunc'] = funcName;
      element['onPause'] = onPause;
      this.clickListeners.push(element);
    }
  }, {
    key: "removeListeners",
    value: function removeListeners(obj) {
      var i, j, len_i, len_j;

      for (i in this.keyListeners) {
        for (j = 0, len_j = this.keyListeners[i].length; j < len_j; j++) {
          if (this.keyListeners[i][j].listeningOb == obj) {
            this.keyListeners[i].splice(j, 1);

            if (!this.keyListeners[i].length) {
              delete this.keyListeners[i];
            }
          }
        }
      }

      for (i = 0, len_i = this.clickListeners.length; i < len_i; i++) {
        for (j = 0, len_j = this.clickListeners[i].length; j < len_j; j++) {
          if (this.clickListeners[i][j].listeningOb == obj) {
            this.clickListeners[i].splice(j, 1);
          }
        }
      }
    }
  }, {
    key: "informKeyPressed",
    value: function informKeyPressed(keyCode) {
      var listeners = []; // Objects listening to the actual key pressed

      if (typeof this.keyListeners[keyCode] != 'undefined') {
        listeners = listeners.concat(this.keyListeners[keyCode]);
      } // Objects listening to ANY key pressed


      if (typeof this.keyListeners[_input.KEYS.ANY_KEY] != 'undefined') {
        listeners = listeners.concat(this.keyListeners[_input.KEYS.ANY_KEY]);
      }

      if (typeof listeners == 'undefined') {
        return;
      }

      for (var i = 0, len = listeners.length; i < len; i++) {
        var which = listeners[i]; // If the listening object should not be informed on pause

        if (!which.onPause && _engine["default"].paused) {
          continue;
        } // If the object has the function, inform


        if (typeof which.listeningOb[which.listeningFunc] != 'undefined') {
          which.listeningOb[which.listeningFunc](keyCode);
        }
      }
    }
  }, {
    key: "informClick",
    value: function informClick(id) {
      if (typeof this.clickListeners === 'undefined') {
        return;
      }

      for (var i = 0, len = this.clickListeners.length; i < len; i++) {
        var which = this.clickListeners[i]; // If the listening object should not be informed on pause

        if (!which.onPause && _engine["default"].paused) {
          continue;
        } // If the object has the function, inform


        if (typeof which.listeningOb[which.listeningFunc] !== 'undefined') {
          which.listeningOb[which.listeningFunc](id);
        }
      }
    }
  }, {
    key: "defineCombo",
    value: function defineCombo(name, type, list) {
      this.combos[name] = {
        comboType: type,
        comboKeys: list,
        lastTime: 0
      };
    }
  }, {
    key: "addComboListener",
    value: function addComboListener(object, funcName, comboNames, onPause) {
      if (typeof onPause === 'undefined') {
        onPause = false;
      }

      var element = [];
      element['listeningOb'] = object;
      element['listeningFunc'] = funcName;
      element['onPause'] = onPause;

      for (var i = 0, len = comboNames.length; i < len; i++) {
        if (typeof this.comboListeners[comboNames[i]] === 'undefined') {
          this.comboListeners[comboNames[i]] = [element];
        } else {
          this.comboListeners[comboNames[i]].push(element);
        }
      }
    }
  }, {
    key: "informComboPerformed",
    value: function informComboPerformed(comboName, time) {
      if (_engine["default"].options.outputPressedCombos === true) {
        _engine["default"].logs.log('Input.informComboPerformed', 'Combo activated: ' + comboName, time);
      } // Update last time performed


      this.combos[comboName].lastTime = time;
      var listeners = this.comboListeners[comboName];

      if (typeof listeners === 'undefined') {
        return;
      }

      for (var i = 0, len = listeners.length; i < len; i++) {
        var which = listeners[i]; // If the listening object should not be informed on pause

        if (!which.onPause && _engine["default"].paused) {
          continue;
        } // If the object has the function, inform


        if (typeof which.listeningOb[which.listeningFunc] !== 'undefined') {
          which.listeningOb[which.listeningFunc](comboName);
        }
      } // Control of combo result should be done in Controls.informComboPerformed


      return;
    }
  }, {
    key: "detectCombo",
    value: function detectCombo() {
      for (var comboName in this.combos) {
        var combo = this.combos[comboName];
        var j = void 0,
            len_j = void 0; // All the keys pressed at the same time

        if (combo.comboType == _input.COMBO_TYPES.SIMULTANEOUS) {
          for (j = 0, len_j = combo.comboKeys.length; j < len_j; j++) {
            // Any of the keys is not pressed, combo failed
            if (!_engine["default"].input.isKeyPressed(combo.comboKeys[j])) {
              break;
            } // All pressed, this is the last one and it's also pressed, combo win!


            if (j == len_j - 1 && _engine["default"].input.isKeyPressed(combo.comboKeys[j])) {
              return comboName;
            }
          }
        } // Keys pressed in a consecutive way
        else if (combo.comboType == _input.COMBO_TYPES.CONSECUTIVE) {
            var lp_len = _engine["default"].input.lastPressed.length;
            var ck_len = combo.comboKeys.length; // If pressed list shorter than combo

            if (lp_len < ck_len) {
              return null;
            }

            for (j = 1; j <= ck_len && j <= lp_len; j++) {
              // Non-match
              if (combo.comboKeys[ck_len - j] != _engine["default"].input.lastPressed[lp_len - j]) {
                break;
              } // Last element and everyone match


              if (j >= ck_len || j >= lp_len) {
                return comboName;
              }
            }
          }
      } // No combos found


      return null;
    }
  }, {
    key: "addClickZone",
    value: function addClickZone(id, location, rectangleSize, ch) {
      this.clickableZones[id] = {
        position: location,
        size: rectangleSize,
        character: ch
      };
    }
  }, {
    key: "detectClick",
    value: function detectClick(position) {
      for (var clickId in this.clickableZones) {
        var clickZone = this.clickableZones[clickId]; // engine.logs.log('Engine.INPUT.SceneInput.detectTouch', 'Testing ' + clickId + ' zone');

        if (position.x >= clickZone.position.x - clickZone.size.x / 2 && position.x <= clickZone.position.x + clickZone.size.x / 2 && position.y >= clickZone.position.y - clickZone.size.y / 2 && position.y <= clickZone.position.y + clickZone.size.y / 2) {
          // Touch done!
          // engine.logs.log('Engine.INPUT.SceneInput.detectTouch', 'Touch OK, zone: ' + clickId);
          // engine.gui.get('console').addText('touch', clickId);
          // Save the emulated key
          if (clickZone.character !== null) {
            _engine["default"].input.addLastPressed(clickZone.character);
          }

          _engine["default"].input.addClick(clickId);
        }
      }
    }
  }]);

  return SceneInput;
}();

exports["default"] = SceneInput;

},{"../engine":13,"./input":22}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("./engine"));

var MATH = _interopRequireWildcard(require("./math/math"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Item =
/*#__PURE__*/
function () {
  function Item() {
    _classCallCheck(this, Item);

    this.spriteName = null; // If false, will not be rendered by the spriteHandler

    this._visible = true;
    this.position = new MATH.Point();
    this.size = new MATH.Point();
    this.scaling = new MATH.Point(1, 1);
    this.speed = new MATH.Point();
    this.maxVel = 0; // maximum speed

    this.accel = 0; // acceleration

    this.vRot = 0; // rotation speed

    this.maxVRot = 0; // max rotation speed

    this.accelRot = 0; // rotation accel

    this.rotation = new MATH.Rotation();
    this.globalAlpha = 1;
    this.maxRadius = 0; // object radius

    this.collisionRadius = 0; // smaller radius for collsions
    // If isAnimated == true, the object itself would call the spriteHandler to ask
    // for its new frame, etc

    this.isAnimated = false;
    this.currentFrame = 0; // for animations
    // this.numFrames       = 1;

    this.numLoops = 1; // times the animation has been repeated
    // for animations (last time when frame changed)

    this.forceFrameSpeed = 0; // 0 == spriteHandler will use default animation speed

    this.timeLastFrame = 0; // new Date().getTime();
    // Object hierarchy on the screen

    this._attachedItems = []; // objects attached to current position

    this._removedItems = []; // objects to be removed at the end of step()

    this._parent = null; // object this item is attached to
  }

  _createClass(Item, [{
    key: "initialize",
    value: function initialize() {}
  }, {
    key: "activate",
    value: function activate() {
      for (var i = 0, len = this._attachedItems.length; i < len; i++) {
        var what = this._attachedItems[i];
        what.activate();
      }
    }
  }, {
    key: "getVisible",
    value: function getVisible() {
      return this._visible;
    }
  }, {
    key: "setVisible",
    value: function setVisible(value) {
      this._visible = value;
    }
  }, {
    key: "getParent",
    value: function getParent() {
      return this._parent;
    }
  }, {
    key: "setParent",
    value: function setParent(parent) {
      this._parent = parent;
    }
  }, {
    key: "getParentScene",
    value: function getParentScene() {
      var p = this;

      while (p.getParent() !== null) {
        p = p.getParent();
      }

      return p;
    }
  }, {
    key: "getAttachedItems",
    value: function getAttachedItems() {
      return this._attachedItems;
    }
  }, {
    key: "attachItem",
    value: function attachItem(what) {
      // this._attachedItems[this._attachedItems.length] = what;
      this._attachedItems.push(what);

      what.setParent(this);
    }
  }, {
    key: "detachItem",
    value: function detachItem(what) {
      var scene = this.getParentScene(); // stop listening to input events

      scene.input.removeListeners(what);
      var list = what.children();

      for (var i = 0, len = list.length; i < len; i++) {
        scene.input.removeListeners(list[i]);
      }

      this._removedItems.push(what);

      what.setParent(null); // delete this.items[index]; // mark the position as undefined, does not change the array size
      // this.items.splice(index, 1);
    }
  }, {
    key: "detachAllItems",
    value: function detachAllItems() {
      for (var i = 0, len = this._attachedItems.length; i < len; i++) {
        var what = this._attachedItems[i]; // recursive !!

        what.detachAllItems(); // what._finalizeRemoved();

        this.detachItem(what);
      }

      this._finalizeRemoved();
    }
  }, {
    key: "children",
    value: function children() {
      var chs = [];

      for (var i = 0, len = this._attachedItems.length; i < len; i++) {
        chs = chs.concat(this._attachedItems[i]);
        chs = chs.concat(this._attachedItems[i].children());
      }

      return chs;
    }
  }, {
    key: "_resetItems",
    value: function _resetItems() {
      this._attachedItems.length = 0;
    } // Reset the list of removed items

  }, {
    key: "_resetRemoved",
    value: function _resetRemoved() {
      this._removedItems.length = 0;
    } // Remove any items marked for removal

  }, {
    key: "_finalizeRemoved",
    value: function _finalizeRemoved() {
      for (var i = 0, len = this._removedItems.length; i < len; i++) {
        var what = this._removedItems[i];

        var idx = this._attachedItems.indexOf(what);

        if (idx != -1) {
          // what.detachAllItems();
          this._attachedItems.splice(idx, 1);
        }
      } // Reset the list of removed objects


      this._resetRemoved();
    }
  }, {
    key: "setImage",
    value: function setImage(spriteName) {
      this.spriteName = spriteName;
      this.size = _engine["default"].sprites.getSpriteSize(spriteName);
    }
  }, {
    key: "getOrigin",
    value: function getOrigin() {
      var center = this.getPosition();
      return new MATH.Point(center.x - this.size.x / 2, center.y - this.size.y / 2);
    }
  }, {
    key: "getPosition",
    value: function getPosition() {
      var result = new MATH.Point();
      var parentPosition = new MATH.Point();
      var transformedPosition = new MATH.Point();

      if (this._parent !== null) {
        parentPosition = this._parent.getPosition();
        transformedPosition = this._parent.rotation.transformPosition(this.position);
        result.x = transformedPosition.x + parentPosition.x;
        result.y = transformedPosition.y + parentPosition.y;
      } else {
        result.x = this.position.x;
        result.y = this.position.y;
      }

      return result;
    }
  }, {
    key: "setPosition",
    value: function setPosition(x, y) {
      this.position.x = x;
      this.position.y = y;
    }
  }, {
    key: "getSize",
    value: function getSize() {
      return this.size;
    }
  }, {
    key: "setSize",
    value: function setSize(x, y) {
      this.size.x = x;
      this.size.y = y;
    }
  }, {
    key: "getScaling",
    value: function getScaling() {
      return this.scaling;
    }
  }, {
    key: "setScaling",
    value: function setScaling(x, y) {
      this.scaling.x = x;
      this.scaling.y = y;
    }
  }, {
    key: "getSpeed",
    value: function getSpeed() {
      return this.speed;
    }
  }, {
    key: "setSpeed",
    value: function setSpeed(x, y) {
      this.speed.x = x;
      this.speed.y = y;
    }
  }, {
    key: "getParentPosition",
    value: function getParentPosition() {
      if (this._parent !== null) {
        return this._parent.getPosition();
      } else {
        return new MATH.Point();
      }
    }
  }, {
    key: "getParentSpeed",
    value: function getParentSpeed() {
      if (this._parent !== null) {
        return this._parent.getSpeed();
      } else {
        return new MATH.Point();
      }
    }
  }, {
    key: "getRadius",
    value: function getRadius() {
      return Math.sqrt(Math.pow(this.size.x / 2, 2) + Math.pow(this.size.y / 2, 2));
    }
  }, {
    key: "getMagnitude",
    value: function getMagnitude() {
      return Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y);
    }
  }, {
    key: "move",
    value: function move(dx, dy) {
      this.position.x += dx;
      this.position.y += dy;
    }
  }, {
    key: "rotate",
    value: function rotate(dRot) {
      this.rotation.rotate(dRot);
    }
  }, {
    key: "setRotation",
    value: function setRotation(rot) {
      this.rotation.update(rot);
    }
  }, {
    key: "getRotation",
    value: function getRotation() {
      if (this._parent !== null) {
        return this.rotation.getAngle() + this._parent.getRotation();
      } else {
        return this.rotation.getAngle();
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this._visible === true) {
        for (var i = 0, len = this._attachedItems.length; i < len; i++) {
          this._attachedItems[i].draw(ctx);
        }

        if (this.spriteName !== null) {
          _engine["default"].sprites.draw(ctx, this);
        }

        if (_engine["default"].options.drawBoundingBoxes === true) {
          this.drawHelper(ctx, 'spriteBox');
        }

        if (_engine["default"].options.drawMaxRadius === true) {
          this.drawHelper(ctx, 'maxRadius');
        }

        if (_engine["default"].options.drawCollisionRadius === true) {
          this.drawHelper(ctx, 'collisionRadius');
        }

        if (_engine["default"].options.drawOrigins === true) {
          this.drawHelper(ctx, 'origin');
        }

        if (_engine["default"].options.drawCenters === true) {
          this.drawHelper(ctx, 'center');
        }

        if (_engine["default"].options.drawDirectionVectors === true) {
          this.drawHelper(ctx, 'direction');
        }
      }
    }
  }, {
    key: "step",
    value: function step(dt) {
      if (this.speed.x !== 0 || this.speed.y !== 0) this.move(this.speed.x * dt / _engine["default"].core.TIME_PER_FRAME, this.speed.y * dt / _engine["default"].core.TIME_PER_FRAME);

      if (this.vRot !== 0) {
        this.rotate(this.vRot * dt / _engine["default"].core.TIME_PER_FRAME);
      } // Advance the necessary frames in the animation if needed


      if (this.isAnimated === true && this.spriteName !== null) {
        _engine["default"].sprites.step(dt, this);
      }

      for (var i = 0, len = this._attachedItems.length; i < len; i++) {
        this._attachedItems[i].step(dt);
      } // Remove any objects marked for removal


      this._finalizeRemoved();
    }
  }, {
    key: "eventAnimationRestart",
    value: function eventAnimationRestart() {}
  }, {
    key: "drawHelper",
    value: function drawHelper(ctx, what) {
      var pos = this.getPosition();
      var size = this.getSize();
      var scale = this.getScaling(); // Draw the collisionRadius

      if ('maxRadius' == what) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.maxRadius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#FF0000';
        ctx.stroke();
      } else if ('collisionRadius' == what) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.collisionRadius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#FF0000';
        ctx.stroke();
      } // Draw the origin
      else if ('origin' == what) {
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(pos.x - size.x / 2 * scale.x, pos.y - size.y / 2 * scale.y, 2, 2);
        } else if ('center' == what) {
          ctx.fillStyle = '#FF0000';
          ctx.fillRect(pos.x, pos.y, 2, 2);
        } else if ('spriteBox' == what) {
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#FF0000';
          ctx.strokeRect(pos.x - size.x / 2 * scale.x, pos.y - size.y / 2 * scale.y, size.x * scale.x, size.y * scale.y);
        } else if ('direction' == what) {
          var speed = this.getSpeed();
          ctx.lineWidth = 1;
          ctx.strokeStyle = '#FF0000';
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y);
          ctx.lineTo(pos.x + speed.x * 10, pos.y + speed.y * 10);
          ctx.stroke();
        }
    } // By default, when an item collides, it is deleted
    // Objects which inherit from Item must implement their own collide method

  }, {
    key: "collide",
    value: function collide() {
      // Delete the attached items
      this.detachAllItems(); // true if object should be removed, false otherwise

      return true;
    }
  }]);

  return Item;
}();

exports["default"] = Item;

},{"./engine":13,"./math/math":27}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Localization =
/*#__PURE__*/
function () {
  function Localization() {
    _classCallCheck(this, Localization);

    this.fallbackLanguage = 'english';
    this.selectedLanguage = '';
    this.stringTables = {};
    this.baseTexts = {
      english: {
        paused: 'Paused, press P to continue',
        loaded: 'Loading',
        items: 'items',
        effects: 'effects',
        particles: 'particles',
        choose_language: 'Choose language',
        english: 'English',
        spanish: 'Spanish'
      },
      spanish: {
        paused: 'Pausa, pulsa P para continuar',
        loaded: 'Cargando',
        items: 'elementos',
        effects: 'efectos',
        particles: 'partículas',
        choose_language: 'Escoge el idioma',
        english: 'English',
        spanish: 'Español'
      }
    };
  }

  _createClass(Localization, [{
    key: "initialize",
    value: function initialize() {
      // engine.logs.log('localization.initialize', 'Initializing localization handler');
      // initial lenguage
      this.selectedLanguage = 'english';

      for (var lang in this.baseTexts) {
        this.stringTables[lang] = [];
        this.addTextsToStringTable(lang, this.baseTexts[lang]);
      } // engine.controls.addKeyListener( this, 'eventKeyPressed', [Engine.INPUT.KEYS.L, ] ); // change language

    } // eventKeyPressed(keyCode)
    // {
    //   engine.logs.log('Localization::eventKeyPressed', 'Key Pressed: ' + keyCode);
    //   if (keyCode == KEYBOARD.L)
    //   {
    //     if (this.selectedLanguage == 'spanish')
    //       this.selectLanguage('english');
    //     else
    //       this.selectLanguage('spanish');
    //   }
    // }

  }, {
    key: "get",
    value: function get(stringId) {
      var text = this.stringTables[this.selectedLanguage][stringId];

      if (typeof text !== 'undefined') {
        return text;
      } else {
        return this.stringTables[this.fallbackLanguage][stringId];
      }
    }
  }, {
    key: "addStringTable",
    value: function addStringTable(language, table) {
      this.stringTables[language] = table;
    }
  }, {
    key: "setBaseTexts",
    value: function setBaseTexts(table) {
      this.baseTexts = table;
    }
  }, {
    key: "addTextsToStringTable",
    value: function addTextsToStringTable(language, table) {
      for (var prop in table) {
        this.stringTables[language][prop] = table[prop];
      }
    }
  }, {
    key: "selectLanguage",
    value: function selectLanguage(language) {
      this.selectedLanguage = language;
    }
  }]);

  return Localization;
}();

exports["default"] = Localization;

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("./engine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Logs =
/*#__PURE__*/
function () {
  function Logs() {
    _classCallCheck(this, Logs);
  }

  _createClass(Logs, [{
    key: "log",
    value: function log(fileName, message, object) {
      var result = [];

      if (_engine["default"].options.debugInConsole === false) {
        return;
      }

      if (_engine["default"].options.debugFunctionNames === true) {
        result.push(fileName);
      }

      if (Array.isArray(message)) {
        result.push(message.join(' '));
      } else {
        result.push(message);
      }

      if (object) {
        result.push(object);
      }

      if (_engine["default"].options.debugInHtml === true && _engine["default"].core.canvas !== undefined) {
        var e = document.createElement('div');
        e.innerHTML = result;

        _engine["default"].core.canvas.parentNode.appendChild(e);
      } // Old IE, console is not initialized by default
      else if (typeof window.console === 'undefined' || typeof window.console.log === 'undefined') {// Do nothing?
        } else {
          window.console.log(result);
        }
    }
  }]);

  return Logs;
}();

exports["default"] = Logs;

},{"./engine":13}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointDistance = pointDistance;
exports.angleToDirectionVector = angleToDirectionVector;
Object.defineProperty(exports, "Point", {
  enumerable: true,
  get: function get() {
    return _point["default"];
  }
});
Object.defineProperty(exports, "Rotation", {
  enumerable: true,
  get: function get() {
    return _rotation["default"];
  }
});

var _point = _interopRequireDefault(require("./point"));

var _rotation = _interopRequireDefault(require("./rotation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// mathematical and graphical auxiliar
// functions that have no other place to be ;)
// Distance between two Engine.MATH.Point objects
function pointDistance(origin, destination) {
  if (typeof destination.x == 'undefined' || typeof destination.y == 'undefined' || typeof origin.x == 'undefined' || typeof origin.y == 'undefined') {
    return -1;
  }

  return Math.sqrt(Math.pow(destination.x - origin.x, 2) + Math.pow(destination.y - origin.y, 2));
}

function angleToDirectionVector(angle) {
  var result = new _point["default"]();
  result.x = Math.cos(angle);
  result.y = Math.sin(angle);
  return result;
}

},{"./point":28,"./rotation":29}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Point =
/*#__PURE__*/
function () {
  function Point(a, b) {
    _classCallCheck(this, Point);

    if ('undefined' === typeof a) {
      this.x = 0;
    } else {
      this.x = a;
    }

    if ('undefined' === typeof b) {
      this.y = 0;
    } else {
      this.y = b;
    }
  }

  _createClass(Point, [{
    key: "magnitude",
    value: function magnitude() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
  }, {
    key: "normalize",
    value: function normalize() {
      var magnitude = this.magnitude();
      return new Point(this.x / magnitude, this.y / magnitude);
    }
  }, {
    key: "equals",
    value: function equals(p) {
      if (p instanceof Point === false) {
        return false;
      }

      return this.x == p.x && this.y == p.y;
    }
  }]);

  return Point;
}();

exports["default"] = Point;

},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _point = _interopRequireDefault(require("./point"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Rotation =
/*#__PURE__*/
function () {
  function Rotation() {
    _classCallCheck(this, Rotation);

    this.angle = 0; // Matrix for zero degrees rotation

    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
  }

  _createClass(Rotation, [{
    key: "getAngle",
    value: function getAngle() {
      return this.angle;
    }
  }, {
    key: "rotate",
    value: function rotate(dRot) {
      this.update(this.angle + dRot);
    }
  }, {
    key: "update",
    value: function update(newAngle) {
      this.angle = newAngle;
      this.a = Math.cos(this.angle);
      this.b = -Math.sin(this.angle);
      this.c = Math.sin(this.angle);
      this.d = Math.cos(this.angle);
    }
  }, {
    key: "transformPosition",
    value: function transformPosition(point) {
      return new _point["default"](point.x * this.a + point.y * this.b, point.x * this.c + point.y * this.d);
    }
  }]);

  return Rotation;
}();

exports["default"] = Rotation;

},{"./point":28}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Options =
/*#__PURE__*/
function () {
  function Options() {
    _classCallCheck(this, Options);

    // Use requestAnimationFrame instead of SetTimeOut in the main game loop
    this.useAnimationFrame = false; // Draw smooth particles instead of pixel rectangles

    this.useSmoothParticles = false; // drawHelpers:

    this.drawBoundingBoxes = false;
    this.drawMaxRadius = false;
    this.drawCollisionRadius = false;
    this.drawOrigins = false;
    this.drawCenters = false;
    this.drawTrackers = false;
    this.drawDirectionVectors = false; // screenInfos

    this.showFps = false; // frames per second

    this.showStatistics = false; // num items, particles, effects, etc

    this.showResizeMessage = true; // show an announcement when resize happens
    // Console inform

    this.outputPressedKeys = false;
    this.outputPressedCombos = false;
    this.outputClicks = false; // Show LogHandler info in the navigator console

    this.debugInConsole = false; // Redirect console info to a html element
    // Useful for mobile debug

    this.debugInHtml = false;
    this.debugFunctionNames = false;
    this.allowPause = true; // allow pausing the game pressing the P key

    this.allowHalt = false; // allow halting the engine pressing the escape key

    this.allowFForFps = true; // allow pressing F to show FPS on screen

    this.pauseOnWindowChange = false;
    this.avoidLeavingPage = false;
    this.preventDefaultKeyStrokes = true; // Show the language screen?

    this.useLanguageScreen = false;
    this.defaultLanguage = 'english'; // prepend this url to the url/path of the assets in the preloader
    // only used if != null
    // should start with the protocol, i.e. 'http://whatever.com/assets/'
    // if null, window.location will be used

    this.assetsURLPrefix = null;
  }

  _createClass(Options, [{
    key: "addOptions",
    value: function addOptions(opts) {
      // Merge engine options and local game options in a single object
      for (var attr in opts) {
        this[attr] = opts[attr];
      }
    }
  }]);

  return Options;
}();

exports["default"] = Options;

},{}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("./engine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Player =
/*#__PURE__*/
function () {
  function Player() {
    _classCallCheck(this, Player);

    _engine["default"].logs.log('Player::initialize', 'Initializing player object');

    this.avatar = null;
  }

  _createClass(Player, [{
    key: "getAvatar",
    value: function getAvatar() {
      return this.avatar;
    }
  }, {
    key: "setAvatar",
    value: function setAvatar(item) {
      this.avatar = item;
    }
  }, {
    key: "initialize",
    value: function initialize() {}
  }, {
    key: "activate",
    value: function activate() {}
  }, {
    key: "step",
    value: function step() {}
  }, {
    key: "draw",
    value: function draw() {
      // This object is not drawn, its avatar should be
      // added as an attached item inside any screen
      return;
    }
  }]);

  return Player;
}();

exports["default"] = Player;

},{"./engine":13}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("../engine"));

var _item = _interopRequireDefault(require("../item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Background =
/*#__PURE__*/
function (_Item) {
  _inherits(Background, _Item);

  function Background() {
    var _this;

    _classCallCheck(this, Background);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Background).call(this));
    _this.backgroundType = 'image'; // { color, image }

    _this.color = 'black';
    _this.spriteName = null;
    _this.position.x = _engine["default"].core.size.x / 2;
    _this.position.y = _engine["default"].core.size.y / 2;
    _this.pauseScroll = false;
    _this.verticalScroll = false;
    _this.verticalOffset = 0;
    _this.verticalSpeed = 0;
    _this.horizontalScroll = false;
    _this.horizontalOffset = 0;
    _this.horizontalSpeed = 0;
    return _this;
  }

  _createClass(Background, [{
    key: "initialize",
    value: function initialize() {
      _get(_getPrototypeOf(Background.prototype), "initialize", this).call(this);
    }
  }, {
    key: "activate",
    value: function activate() {
      _get(_getPrototypeOf(Background.prototype), "activate", this).call(this);

      this.verticalOffset = 0;
      this.horizontalOffset = 0;
    }
  }, {
    key: "step",
    value: function step(dt) {
      _get(_getPrototypeOf(Background.prototype), "step", this).call(this, dt); // Not necessary if there are no animations, but here it is
      // if (this.spriteName != null)
      //   engine.sprites.step(dt, this);


      if (this.pauseScroll === false) {
        // Calculate the offset if we have scroll
        // Note: vertical OR horizontal scroll, NOT both
        if (this.verticalScroll === true) {
          this.verticalOffset += this.verticalSpeed * dt / _engine["default"].core.TIME_PER_FRAME;
          this.verticalOffset = Math.floor(this.verticalOffset % _engine["default"].core.size.y);
        } else if (this.horizontalScroll === true) {
          this.horizontalOffset += this.horizontalSpeed * dt / _engine["default"].core.TIME_PER_FRAME;
          this.horizontalOffset = Math.floor(this.horizontalOffset % _engine["default"].core.size.x);
        }
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.backgroundType == 'color') {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, _engine["default"].core.size.x, _engine["default"].core.size.y);
      } else if (this.backgroundType == 'image') {
        var intOffset;
        var remaining;

        if (this.verticalScroll === true) {
          intOffset = Math.floor(this.verticalOffset);
          remaining = _engine["default"].core.size.y - intOffset; // Draw the top half of the background

          if (intOffset > 0) {
            ctx.drawImage(_engine["default"].sprites.getImage(this.spriteName), 0, remaining, _engine["default"].core.size.x, intOffset, 0, 0, _engine["default"].core.size.x, intOffset);
          } // Draw the bottom half of the background


          if (remaining > 0) {
            ctx.drawImage(_engine["default"].sprites.getImage(this.spriteName), 0, 0, _engine["default"].core.size.x, remaining, 0, intOffset, _engine["default"].core.size.x, remaining);
          }
        } else if (this.horizontalScroll === true) {
          intOffset = Math.floor(this.horizontalOffset);
          remaining = _engine["default"].core.size.x - intOffset; // Draw the right half of the background (left side of the image)

          if (intOffset > 0) {
            ctx.drawImage(_engine["default"].sprites.getImage(this.spriteName), 0, 0, intOffset, _engine["default"].core.size.y, remaining, 0, intOffset, _engine["default"].core.size.y);
          } // Draw the left half of the background (right side of the image)


          if (remaining > 0) {
            ctx.drawImage(_engine["default"].sprites.getImage(this.spriteName), intOffset, 0, remaining, _engine["default"].core.size.y, 0, 0, remaining, _engine["default"].core.size.y);
          }
        } else {
          // ctx, object
          // draw itself without using the parent draw function (Item.draw)
          _engine["default"].sprites.draw(ctx, this);
        } // super.draw(ctx);

      }
    }
  }]);

  return Background;
}(_item["default"]);

exports["default"] = Background;

},{"../engine":13,"../item":24}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("../engine"));

var _scene = _interopRequireDefault(require("./scene"));

var GUI = _interopRequireWildcard(require("../gui/gui"));

var _utils = require("../utils");

require("../../lib/font.js/Font");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Preloader =
/*#__PURE__*/
function (_Scene) {
  _inherits(Preloader, _Scene);

  function Preloader() {
    var _this;

    _classCallCheck(this, Preloader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Preloader).call(this));
    _this.timeStarted = 0; // timestamp when activate() was called

    _this.percentageLoaded = 0; // Percentage of files loaded

    _this.incremental = 0; // current loader step in the incrementalLoader function

    _this.imageAssets = []; // Assets to load

    _this.totalImages = 0; // Number of different images to be loaded

    _this.soundAssets = [];
    _this.totalFonts = 0; // Number of fonts to be loaded

    _this.message = null;
    return _this;
  }

  _createClass(Preloader, [{
    key: "initialize",
    value: function initialize() {
      _get(_getPrototypeOf(Preloader.prototype), "initialize", this).call(this);
    }
  }, {
    key: "activate",
    value: function activate() {
      _engine["default"].logs.log('Preloader::activate', 'Loading assets');

      _get(_getPrototypeOf(Preloader.prototype), "activate", this).call(this);

      this.timeStarted = new Date().getTime();
      var i, len, what;

      for (i = 0, len = this.imageAssets.length; i < len; i++) {
        what = this.imageAssets[i];
        this.addImageToLoad(what);
      }

      for (i = 0, len = this.soundAssets.length; i < len; i++) {
        what = this.soundAssets[i];
        this.addSoundToLoad(what);
      }

      this.message = new GUI.GuiText(_engine["default"].localization.get('loaded') + ' ' + this.percentageLoaded + '%', 300, 30);
      this.message.setPosition(_engine["default"].core.size.x / 2, _engine["default"].core.size.y / 2 + 100);
      this.message.setAlign(GUI.ALIGN.CENTER);
      this.message.setVerticalOffset(20); // this.message.setFontSize(20);

      this.message.setFontColor('#FF2222');
      this.gui.attachItem(this.message, 'msg_loading');
    }
  }, {
    key: "addAnimation",
    value: function addAnimation(data) {
      this.imageAssets.push(data);
    }
  }, {
    key: "addSprite",
    value: function addSprite(data) {
      // Add information for a complete animation spritesheet, with only
      // one image
      data.xStart = 0;
      data.yStart = 0;
      data.frames = 1;
      data.initFrame = 0;
      data.speed = 0;
      this.addAnimation(data);
    }
  }, {
    key: "addImageToLoad",
    value: function addImageToLoad(data) {
      var image = null; // Load only new images

      if (!_engine["default"].sprites.imageExists(data.path)) {
        image = new Image();
        (0, _utils.addEvent)('load', image, function () {
          _engine["default"].preloader.incrementalLoader();
        }); // src always have to be set after adding the event listener, due to bug in IE8

        if (_engine["default"].options.assetsURLPrefix !== null) {
          image.src = _engine["default"].options.assetsURLPrefix + data.path;
        } else {
          image.src = (0, _utils.getProtocolAndHost)() + data.path;
        }

        this.totalImages++;

        _engine["default"].sprites.addImage(data.path, image);
      } // Save only new sprites


      if (!_engine["default"].sprites.spriteExists(data.name)) {
        _engine["default"].sprites.addSprite(data.name, data.path, data.xStart, data.yStart, data.width, data.height, data.frames, data.initFrame, data.speed);
      }
    }
  }, {
    key: "addSound",
    value: function addSound(data) {
      this.soundAssets.push(data);
    }
  }, {
    key: "addSoundToLoad",
    value: function addSoundToLoad(data) {
      var sound = null; // Load only new images

      if (!_engine["default"].sounds.soundExists(data.path)) {
        var path = data.path;

        if (_engine["default"].options.assetsURLPrefix !== null) {
          path = _engine["default"].options.assetsURLPrefix + path;
        } else {
          path = (0, _utils.getProtocolAndHost)() + path;
        }

        sound = new Audio(path); // sound.src = data.path;

        sound.load();
        (0, _utils.addEvent)('canplaythrough', sound, function () {
          _engine["default"].preloader.incrementalLoader('sound');
        });

        _engine["default"].sounds.addSound(data.name, data.path, sound);
      }
    }
  }, {
    key: "addFont",
    value: function addFont(data) {
      // load a font asynchonously using the Font.js library
      var font = new Font();
      this.totalFonts++;

      font.onerror = function (err) {
        _engine["default"].logs.log('Preloader::addFont', 'Error loading a font: ' + err);
      };

      font.onload = function () {
        _engine["default"].logs.log('Preloader::addFont', 'Font loaded <' + font.fontFamily + '>');

        _engine["default"].preloader.incrementalLoader('font');
      };

      font.fontFamily = data.name;

      if (typeof data.flag != 'undefined') {
        font.src = data.path;
      } else {
        if (_engine["default"].options.assetsURLPrefix !== null) {
          font.src = _engine["default"].options.assetsURLPrefix + data.path;
        } else {
          font.src = (0, _utils.getProtocolAndHost)() + data.path;
        }
      }

      _engine["default"].fonts.addFont(data.name, data.path, font);
    }
  }, {
    key: "incrementalLoader",
    value: function incrementalLoader() {
      var total = this.totalImages + this.soundAssets.length + this.totalFonts;
      this.incremental += 1;
      this.percentageLoaded = Math.floor(this.incremental * 100 / total);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      _get(_getPrototypeOf(Preloader.prototype), "draw", this).call(this, ctx); // Loading bar


      var barWidth = _engine["default"].core.size.x / 3;
      ctx.fillStyle = '#FF2222';
      ctx.fillRect((_engine["default"].core.size.x - barWidth) / 2 + 1, _engine["default"].core.size.y / 2 + 51, this.percentageLoaded * barWidth / 100, 15);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FFEEEE';
      ctx.strokeRect((_engine["default"].core.size.x - barWidth) / 2, _engine["default"].core.size.y / 2 + 50, barWidth + 2, 16);
    }
  }, {
    key: "step",
    value: function step(dt) {
      _get(_getPrototypeOf(Preloader.prototype), "step", this).call(this, dt);

      this.message.setText(_engine["default"].localization.get('loaded') + ' ' + this.percentageLoaded + '%');
      var timeLived = new Date().getTime() - this.timeStarted; // At least one second to load resources

      if (this.percentageLoaded >= 100 && timeLived > 1000) {
        _engine["default"].core.activate();

        _engine["default"].external('LOADED', null, null);
      }
    }
  }]);

  return Preloader;
}(_scene["default"]);

exports["default"] = Preloader;

},{"../../lib/font.js/Font":3,"../engine":13,"../gui/gui":14,"../utils":36,"./scene":34}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("../engine"));

var _item = _interopRequireDefault(require("../item"));

var GUI = _interopRequireWildcard(require("../gui/gui"));

var _unaligned = _interopRequireDefault(require("../clocks/unaligned"));

var INPUT = _interopRequireWildcard(require("../input/input"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Scene =
/*#__PURE__*/
function (_Item) {
  _inherits(Scene, _Item);

  function Scene() {
    var _this;

    _classCallCheck(this, Scene);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Scene).call(this));
    _this.playable = false; // This screen is playable

    _this.backgrounds = [];
    _this.isCurrent = false; // Is the screen being used now

    _this.gui = new GUI.GuiElement(_assertThisInitialized(_this)); // Different Gui for each scene

    _this.clock = new _unaligned["default"]();
    _this.input = new INPUT.SceneInput();
    return _this;
  }

  _createClass(Scene, [{
    key: "initialize",
    value: function initialize() {
      _get(_getPrototypeOf(Scene.prototype), "initialize", this).call(this);

      this.gui.initialize();
      this.clock.initialize();
      this.input.initialize();
    }
  }, {
    key: "activate",
    value: function activate() {
      _get(_getPrototypeOf(Scene.prototype), "activate", this).call(this);

      this.gui.activate();
      this.clock.activate();
      this.input.activate();

      for (var i = 0, len = this.backgrounds.length; i < len; i++) {
        this.backgrounds[i].activate();
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      // Test for safety: clean the full scene
      // If everything is well coded in the game, in theory this could be removed
      ctx.clearRect(0, 0, _engine["default"].core.size.x, _engine["default"].core.size.y);

      for (var i = 0, len = this.backgrounds.length; i < len; i++) {
        this.backgrounds[i].draw(ctx);
      }

      _get(_getPrototypeOf(Scene.prototype), "draw", this).call(this, ctx);

      this.gui.draw(ctx);
    }
  }, {
    key: "step",
    value: function step(dt) {
      for (var i = 0, len = this.backgrounds.length; i < len; i++) {
        this.backgrounds[i].step(dt);
      }

      this.clock.step(dt);

      _get(_getPrototypeOf(Scene.prototype), "step", this).call(this, dt);

      this.gui.step(dt);
    }
  }, {
    key: "addBackground",
    value: function addBackground(background) {
      this.backgrounds.push(background);
    }
  }]);

  return Scene;
}(_item["default"]);

exports["default"] = Scene;

},{"../clocks/unaligned":5,"../engine":13,"../gui/gui":14,"../input/input":22,"../item":24}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("../engine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Scenes =
/*#__PURE__*/
function () {
  function Scenes() {
    _classCallCheck(this, Scenes);

    this.collection = null; // Array in the form scenes[i] = { 'scene': scene, 'name': name }

    this.currentSceneIndex = null;
    this.currentSceneName = null;
    this.currentScene = null;
  }

  _createClass(Scenes, [{
    key: "initialize",
    value: function initialize() {
      this.collection = [];
      this.currentSceneIndex = 0;
      this.currentSceneName = '';
      this.currentScene = null;
    }
  }, {
    key: "activate",
    value: function activate() {}
  }, {
    key: "draw",
    value: function draw() {}
  }, {
    key: "step",
    value: function step() {}
  }, {
    key: "getCurrentScene",
    value: function getCurrentScene() {
      return this.currentScene;
    }
  }, {
    key: "setScene",
    value: function setScene(num) {
      // Old scene
      // let oldScene = this.currentScene;
      if (typeof this.currentScene !== 'undefined' && this.currentScene !== null) {
        this.currentScene.isCurrent = false;
      }

      _engine["default"].core.clearScreen(); // New scene


      this.currentSceneIndex = num;
      this.currentSceneName = _engine["default"].scenes.collection[num].name;
      this.currentScene = _engine["default"].scenes.collection[num].scene;
      this.currentScene.isCurrent = true;
      this.currentScene.activate();

      if (typeof _engine["default"].player !== 'undefined' && _engine["default"].player !== null) {
        _engine["default"].player.activate();
      }

      _engine["default"].logs.log('Scenes::setScene', 'Set Scene: ' + this.currentSceneName + ' (' + this.currentSceneIndex + ')');

      _engine["default"].external('SCENE_CHANGE', null, null);
    }
  }, {
    key: "addScene",
    value: function addScene(scene, name) {
      _engine["default"].logs.log('Scenes::addScene', 'Add Scene: ' + name);

      scene.isCurrent = false;
      this.collection.push({
        scene: scene,
        name: name
      });
    }
  }, {
    key: "insertScene",
    value: function insertScene(scene, name, num) {
      scene.isCurrent = false;
      this.collection.splice(num, 0, {
        scene: scene,
        name: name
      });
    } // do not use 'this', as this function could be called out

  }, {
    key: "advanceScene",
    value: function advanceScene() {
      // Not able to advance scene
      if (_engine["default"].scenes.currentSceneIndex + 1 >= _engine["default"].scenes.collection.length) {
        return;
      } // engine.logs.log('Scenes::advanceScene', 'Advance Level', this.currentSceneIndex + 1);


      _engine["default"].scenes.setScene(_engine["default"].scenes.currentSceneIndex + 1);
    }
  }, {
    key: "goBackScene",
    value: function goBackScene() {
      // Not able to go back
      if (this.currentSceneIndex - 1 < 0) {
        return;
      } // engine.logs.log('Scenes::advanceScene', 'Advance Level', this.currentSceneIndex + 1);


      this.setScene(this.currentSceneIndex - 1);
    }
  }]);

  return Scenes;
}();

exports["default"] = Scenes;

},{"../engine":13}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addEvent = addEvent;
exports.getProtocolAndHost = getProtocolAndHost;
exports.detectIE = detectIE;

// Global addEvent to fix old IE way of attaching events
function addEvent(evnt, elem, func) {
  if (elem.addEventListener) {
    // W3C DOM
    elem.addEventListener(evnt, func, false);
  } else if (elem.attachEvent) {
    // IE DOM
    elem.attachEvent('on' + evnt, func);
  } // If we want to expose the currentTarget (non-existent in older IE)
  // elem.attachEvent('on' + evnt, function(a) { a.currentTarget = elem; func(a); });
  // Not much to do
  else {
      elem['on' + evnt] = func;
    }
} // get protocol and hostname


function getProtocolAndHost() {
  var result = '';

  if (window.location.href) {
    return window.location.href;
  }

  if (window.location.protocol != 'file:') {
    result += window.location.protocol + '//';
  }

  if (window.location.host !== '') {
    result += window.location.host + '/';
  }

  return result;
}
/*
// Polyfill for the Array.isArray function
Array.isArray ||
  (Array.isArray = function(a) {
    return '' + a !== a && {}.toString.call(a) == '[object Array]';
  });

// Polyfill for the Object.create function
Object.create ||
  (Object.create = function(o) {
    if (arguments.length > 1) {
      throw new Error(
        'Object.create implementation only accepts the first parameter.'
      );
    }
    function F() {}
    F.prototype = o;
    return new F();
  });

// Polyfill for the JS Object.keys function.
// From https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    let hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
      dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],
      dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (
        typeof obj !== 'object' &&
        (typeof obj !== 'function' || obj === null)
      ) {
        throw new TypeError('Object.keys called on non-object');
      }

      let result = [],
        prop,
        i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  })();
}
*/


function detectIE() {
  var userAgent = navigator.userAgent.toLowerCase();

  if (/msie/.test(userAgent)) {
    return parseFloat((userAgent.match(/.*(?:rv|ie)[/: ](.+?)([ );]|$)/) || [])[1]);
  }

  if (navigator.appVersion.indexOf('Trident/') > 0) {
    return 11;
  }

  return -1;
}

},{}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("okinawa.js/src/engine"));

var _options = _interopRequireDefault(require("./options"));

var SCENES = _interopRequireWildcard(require("./scenes/scenes"));

var _loader = _interopRequireDefault(require("./loader"));

var _player = _interopRequireDefault(require("./player"));

var _points = _interopRequireDefault(require("./points"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Game =
/*#__PURE__*/
function () {
  function Game() {
    _classCallCheck(this, Game);

    // Generic
    this.options = null;
    this.loader = null;
    this.player = null; // Game specific

    this.commonBackground = null;
    this.points = null;
  }

  _createClass(Game, [{
    key: "initialize",
    value: function initialize() {
      // The specific game options could be reached as options AND as engine.options
      this.options = new _options["default"]();

      _engine["default"].options.addOptions(this.options); // Common background for every screen


      this.commonBackground = new SCENES.StarBackground();
      this.commonBackground.initialize();
      this.loader = new _loader["default"]();
      this.loader.initialize();
      _engine["default"].player = new _player["default"]();

      _engine["default"].player.initialize();

      this.points = new _points["default"]();
      this.points.initialize();
    } // Game Initialization

  }, {
    key: "activate",
    value: function activate() {
      _engine["default"].logs.log('activate', 'Starting game');

      var lvl = new SCENES.InitialScene();
      lvl.addBackground(this.commonBackground);
      lvl.playable = true;
      lvl.initialize();

      _engine["default"].scenes.addScene(lvl, 'start_game');

      lvl = new SCENES.Level();
      lvl.addBackground(this.commonBackground);
      lvl.playable = true;
      lvl.initialize();

      _engine["default"].scenes.addScene(lvl, 'main_game');
    }
  }, {
    key: "step",
    value: function step() {}
  }]);

  return Game;
}(); // singleton pattern


var game = new Game();
var _default = game;
exports["default"] = _default;

},{"./loader":43,"./options":44,"./player":45,"./points":46,"./scenes/scenes":50,"okinawa.js/src/engine":13}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("okinawa.js/src/engine"));

var _item = _interopRequireDefault(require("okinawa.js/src/item"));

var MATH = _interopRequireWildcard(require("okinawa.js/src/math/math"));

var _shot = _interopRequireDefault(require("./shot"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Gun =
/*#__PURE__*/
function (_Item) {
  _inherits(Gun, _Item);

  function Gun() {
    var _this;

    _classCallCheck(this, Gun);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Gun).call(this));
    _this.size = new MATH.Point(10, 10);
    return _this;
  }

  _createClass(Gun, [{
    key: "step",
    value: function step(dt) {
      // Not necessary if there are no animations, but here it is
      // engine.sprites.step(dt, this);
      _get(_getPrototypeOf(Gun.prototype), "step", this).call(this, dt);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      _get(_getPrototypeOf(Gun.prototype), "draw", this).call(this, ctx);
    }
  }, {
    key: "shoot",
    value: function shoot(creator) {
      // var pos = this.getPosition();
      var shot = new _shot["default"](creator, this.getPosition(), this.getRotation());

      _engine["default"].scenes.getCurrentScene().attachItem(shot);
    }
  }, {
    key: "collide",
    value: function collide() {
      // Guns are not physical objects
      return false;
    }
  }]);

  return Gun;
}(_item["default"]);

exports["default"] = Gun;

},{"./shot":41,"okinawa.js/src/engine":13,"okinawa.js/src/item":24,"okinawa.js/src/math/math":27}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Gun", {
  enumerable: true,
  get: function get() {
    return _gun["default"];
  }
});
Object.defineProperty(exports, "Meteor", {
  enumerable: true,
  get: function get() {
    return _meteor["default"];
  }
});
Object.defineProperty(exports, "Shot", {
  enumerable: true,
  get: function get() {
    return _shot["default"];
  }
});
Object.defineProperty(exports, "Starship", {
  enumerable: true,
  get: function get() {
    return _starship["default"];
  }
});

var _gun = _interopRequireDefault(require("./gun"));

var _meteor = _interopRequireDefault(require("./meteor"));

var _shot = _interopRequireDefault(require("./shot"));

var _starship = _interopRequireDefault(require("./starship"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

},{"./gun":38,"./meteor":40,"./shot":41,"./starship":42}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("okinawa.js/src/engine"));

var _item = _interopRequireDefault(require("okinawa.js/src/item"));

var _shot = _interopRequireDefault(require("./shot"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Meteor =
/*#__PURE__*/
function (_Item) {
  _inherits(Meteor, _Item);

  function Meteor(size, speed) {
    var _this;

    _classCallCheck(this, Meteor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Meteor).call(this));
    _this.spriteName = 'meteor';
    _this.size.x = _engine["default"].sprites.sprites[_this.spriteName][3];
    _this.size.y = _engine["default"].sprites.sprites[_this.spriteName][4];
    _this.linearSpeed = speed;
    _this.vRot = Math.PI / 600;
    _this.scaling.x = size;
    _this.scaling.y = size;
    _this.maxRadius = _this.getRadius();
    _this.collisionRadius = 29;
    return _this;
  }

  _createClass(Meteor, [{
    key: "step",
    value: function step(dt) {
      _get(_getPrototypeOf(Meteor.prototype), "step", this).call(this, dt); // Not necessary if there are no animations, but here it is
      // engine.sprites.step(dt, this);

    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      _get(_getPrototypeOf(Meteor.prototype), "draw", this).call(this, ctx);
    }
  }, {
    key: "collide",
    value: function collide(what) {
      _get(_getPrototypeOf(Meteor.prototype), "collide", this).call(this);

      var newVx = what.speed.x;
      var newVy = what.speed.y; // The shots are fast and the effect is awkward... better not so much

      if (what instanceof _shot["default"]) {
        newVx = what.speed.x / 10;
        newVy = what.speed.y / 10;
      }

      var effect = _engine["default"].effects.addEffect('halo', this.position.x, this.position.y, this.speed.x + newVx, this.speed.y + newVy);

      effect.initialScaling = 2;
      effect.finalScaling = 3;
      effect.lifeTime = 20;
      effect.vRot = Math.PI / 100;
      effect.transparencyMethod = 2; // disappearing

      for (var i = 0; i < 10; i++) {
        effect = _engine["default"].effects.addEffect('explosion', this.position.x + (Math.random() - 0.5) * 40, this.position.y + (Math.random() - 0.5) * 40, this.speed.x + (Math.random() - 0.5), this.speed.y + (Math.random() - 0.5));
        effect.scaling.x = Math.abs(Math.random() - 0.1);
        effect.scaling.y = effect.scaling.x;
        effect.vRot = (Math.random() - 0.5) * Math.PI / 50;
        effect.lifeTime = 100;
        effect.isAnimated = true;
        effect.transparencyMethod = Math.floor(Math.random() * 3);
      }

      _engine["default"].sounds.play('explosion'); // true == should be removed


      return true;
    }
  }]);

  return Meteor;
}(_item["default"]);

exports["default"] = Meteor;

},{"./shot":41,"okinawa.js/src/engine":13,"okinawa.js/src/item":24}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("okinawa.js/src/engine"));

var _item = _interopRequireDefault(require("okinawa.js/src/item"));

var MATH = _interopRequireWildcard(require("okinawa.js/src/math/math"));

var _meteor = _interopRequireDefault(require("./meteor"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Shot =
/*#__PURE__*/
function (_Item) {
  _inherits(Shot, _Item);

  function Shot(creator, position, angle) {
    var _this;

    _classCallCheck(this, Shot);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Shot).call(this));
    _this.spriteName = 'shot'; // The object which originated the shot (player, npc, etc)

    _this.creator = creator;
    _this.size.x = _engine["default"].sprites.sprites[_this.spriteName][3];
    _this.size.y = _engine["default"].sprites.sprites[_this.spriteName][4];
    _this.position = position;
    _this.speedMagnitude = 5;

    _this.setRotation(angle);

    var direction = MATH.angleToDirectionVector(angle);
    direction = direction.normalize();
    _this.speed.x = direction.x * _this.speedMagnitude;
    _this.speed.y = direction.y * _this.speedMagnitude;
    _this.maxRadius = _this.getRadius();
    _this.collisionRadius = 12;
    return _this;
  }

  _createClass(Shot, [{
    key: "step",
    value: function step(dt) {
      _get(_getPrototypeOf(Shot.prototype), "step", this).call(this, dt); // Not necessary if there are no animations, but here it is
      // engine.sprites.step(dt, this);

    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      _get(_getPrototypeOf(Shot.prototype), "draw", this).call(this, ctx);
    }
  }, {
    key: "collide",
    value: function collide(what) {
      // Cannot collide with other shots
      if (what instanceof Shot) {
        return false;
      } // Cannot collide with its own creator


      if (what == this.creator) {
        return false;
      } // Win!


      if (what instanceof _meteor["default"]) {
        _engine["default"].game.points.add(50);
      } // Should be done only if we are going to return true in this function


      _get(_getPrototypeOf(Shot.prototype), "collide", this).call(this); // true == should be removed


      return true;
    }
  }]);

  return Shot;
}(_item["default"]);

exports["default"] = Shot;

},{"./meteor":40,"okinawa.js/src/engine":13,"okinawa.js/src/item":24,"okinawa.js/src/math/math":27}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("okinawa.js/src/engine"));

var _item = _interopRequireDefault(require("okinawa.js/src/item"));

var _emitter = _interopRequireDefault(require("okinawa.js/src/effects/emitter"));

var _shot = _interopRequireDefault(require("./shot"));

var _gun = _interopRequireDefault(require("./gun"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Starship =
/*#__PURE__*/
function (_Item) {
  _inherits(Starship, _Item);

  function Starship(type) {
    var _this;

    _classCallCheck(this, Starship);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Starship).call(this));
    _this.spriteName = type;
    _this.size.x = _engine["default"].sprites.sprites[_this.spriteName][3];
    _this.size.y = _engine["default"].sprites.sprites[_this.spriteName][4]; // for collisions

    _this.maxRadius = _this.getRadius();
    _this.collisionRadius = 24;
    _this.gunRack = [];
    _this.motorEffect = null;
    return _this;
  }

  _createClass(Starship, [{
    key: "initialize",
    value: function initialize() {
      _get(_getPrototypeOf(Starship.prototype), "initialize", this).call(this); // Create thrusts (particle speed, magnitude, spread)


      this.motorEffect = new _emitter["default"](1, 1, Math.PI / 5);
      this.motorEffect.setPosition(-20, -1);
      this.motorEffect.setRotation(Math.PI);
      this.attachItem(this.motorEffect); // Create guns

      var gun = new _gun["default"]();
      gun.setPosition(20, 0);
      this.gunRack.push(gun);
      this.attachItem(gun); // Rotate the ship, because in the original image it looks towards the right side

      this.setRotation(-Math.PI / 2);
    }
  }, {
    key: "step",
    value: function step(dt) {
      // Not necessary if there are no animations, but here it is
      // engine.sprites.step(dt, this);
      _get(_getPrototypeOf(Starship.prototype), "step", this).call(this, dt);

      if (_engine["default"].player.isThrusting === true) {
        this.motorEffect.start();
      } else {
        this.motorEffect.stop();
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      _get(_getPrototypeOf(Starship.prototype), "draw", this).call(this, ctx);
    }
  }, {
    key: "collide",
    value: function collide(what) {
      // Cannot collide with our own shots
      if (what instanceof _shot["default"] && what.creator == this) {
        return false;
      } // Colliding with any other thing = less speed and lose points


      this.speed.x = this.speed.x / 10;
      this.speed.y = this.speed.y / 10;

      _engine["default"].game.points.add(-10); // should not be removed


      return false;
    }
  }, {
    key: "shoot",
    value: function shoot() {
      for (var i = 0, len = this.gunRack.length; i < len; i++) {
        this.gunRack[i].shoot(this);
      }

      _engine["default"].sounds.play('shot');
    }
  }]);

  return Starship;
}(_item["default"]);

exports["default"] = Starship;

},{"./gun":38,"./shot":41,"okinawa.js/src/effects/emitter":10,"okinawa.js/src/engine":13,"okinawa.js/src/item":24}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("okinawa.js/src/engine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Loader =
/*#__PURE__*/
function () {
  function Loader() {
    _classCallCheck(this, Loader);
  } // Game.Loader Initialization


  _createClass(Loader, [{
    key: "initialize",
    value: function initialize() {
      // engine.preloader.addAnimation(anim_name, path,
      // xStart, yStart, width, height, frames, initFrame, speed)
      _engine["default"].preloader.addSprite({
        name: 'starship',
        path: 'assets/images/ship.png',
        width: 50,
        height: 50
      }); // **************
      //  Enemies
      // **************


      _engine["default"].preloader.addSprite({
        name: 'meteor',
        path: 'assets/images/meteor.png',
        width: 60,
        height: 60
      }); // **************
      //  Shots
      // **************


      _engine["default"].preloader.addSprite({
        name: 'shot',
        path: 'assets/images/shot.png',
        width: 10,
        height: 10
      }); // **************
      //  Effects
      // **************


      _engine["default"].preloader.addAnimation({
        name: 'explosion',
        path: 'assets/images/effect.explosion.png',
        xStart: 0,
        yStart: 0,
        width: 48,
        height: 47,
        frames: 11,
        initFrame: 0,
        speed: 14
      });

      _engine["default"].preloader.addSprite({
        name: 'halo',
        path: 'assets/images/effect.halo.png',
        width: 63,
        height: 63
      }); // **************
      //  Sounds
      // **************


      _engine["default"].preloader.addSound({
        name: 'explosion',
        path: 'assets/sounds/fridobeck_explosion.mp3'
      });

      _engine["default"].preloader.addSound({
        name: 'shot',
        path: 'assets/sounds/halgrimm_shot.mp3'
      }); // **************
      //  Fonts
      // **************


      _engine["default"].preloader.addFont({
        name: 'baseFont',
        path: 'assets/fonts/visitor1.ttf'
      }); // First screen: preloader with progress bar


      _engine["default"].preloader.addBackground(_engine["default"].game.commonBackground);

      _engine["default"].preloader.initialize(); // Usually empty


      _engine["default"].scenes.addScene(_engine["default"].preloader, 'preloader');

      _engine["default"].scenes.setScene(0);

      _engine["default"].localization.addTextsToStringTable('english', this.localization_en());

      _engine["default"].localization.addTextsToStringTable('spanish', this.localization_es());

      _engine["default"].localization.selectLanguage(_engine["default"].game.options.defaultLanguage);
    }
  }, {
    key: "localization_en",
    value: function localization_en() {
      return {
        game_name: 'Game',
        press_spacebar: 'Press the spacebar to start',
        touch_screen: 'Touch the screen to continue',
        points: 'Points',
        accumulated: 'Accumulated points',
        totals: 'Total points'
      };
    }
  }, {
    key: "localization_es",
    value: function localization_es() {
      return {
        game_name: 'Juego',
        press_spacebar: 'Pulsa espacio para comenzar',
        touch_screen: 'Toca la pantalla para continuar',
        points: 'Puntos',
        accumulated: 'Puntos acumulados',
        totals: 'Puntos totales'
      };
    }
  }]);

  return Loader;
}();

exports["default"] = Loader;

},{"okinawa.js/src/engine":13}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Options = function Options() {
  _classCallCheck(this, Options);

  // Possible languages= 'spanish', 'english'
  this.defaultLanguage = 'english';
  this.debugInConsole = true; // Each meteorPeriodicity milliseconds a new meteor appears on the screen

  this.meteorPeriodicity = 500; // milliseconds

  this.shotPeriodicity = 200;
};

exports["default"] = Options;

},{}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("okinawa.js/src/engine"));

var _player = _interopRequireDefault(require("okinawa.js/src/player"));

var INPUT = _interopRequireWildcard(require("okinawa.js/src/input/input"));

var MATH = _interopRequireWildcard(require("okinawa.js/src/math/math"));

var ITEMS = _interopRequireWildcard(require("./items/items"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AsteroidsPlayer =
/*#__PURE__*/
function (_Player) {
  _inherits(AsteroidsPlayer, _Player);

  function AsteroidsPlayer() {
    var _this;

    _classCallCheck(this, AsteroidsPlayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AsteroidsPlayer).call(this));
    _this.avatar = null; // for shooting

    _this.timeLastShot = 0;
    _this.isTurningLeft = false;
    _this.isTurningRight = false;
    _this.isThrusting = false;
    _this.rotationSpeed = Math.PI / 50;
    _this.flightSpeed = 0.05; // More than 0.3 -> impossible to control

    return _this;
  } // Will be called after creation of this object


  _createClass(AsteroidsPlayer, [{
    key: "initialize",
    value: function initialize() {
      _get(_getPrototypeOf(AsteroidsPlayer.prototype), "initialize", this).call();

      this.avatar = new ITEMS.Starship('starship');
      this.avatar.initialize();
    }
  }, {
    key: "activate",
    value: function activate() {
      _get(_getPrototypeOf(AsteroidsPlayer.prototype), "activate", this).call();

      this.timeLastShot = 0;
      this.isTurningLeft = false;
      this.isTurningRight = false;
      this.isThrusting = false; // activate will be called everytime we change to a new scene,
      // so we should ask to the input controller of the new scene to inform us about
      // new key events

      this.getAvatar().getParentScene().input.addKeyListener(this, 'eventKeyPressed', [INPUT.KEYS.SPACEBAR]);
    }
  }, {
    key: "eventKeyPressed",
    value: function eventKeyPressed(keyCode) {
      if (keyCode == INPUT.KEYS.SPACEBAR) {
        var now = new Date().getTime(); // Enough time between shots

        if (now - this.timeLastShot > _engine["default"].options.shotPeriodicity) {
          this.avatar.shoot();
          this.timeLastShot = now;
        }
      }
    }
  }, {
    key: "step",
    value: function step() {
      // If the avatar is not attached to a playable scene,
      // nothing to do
      if (typeof this.getAvatar().getParentScene() != 'undefined' && this.getAvatar().getParentScene() !== null && this.getAvatar().getParentScene().playable === false) {
        return;
      } // ------------------------------------------------
      //  Continuous keys (without events)
      // ------------------------------------------------


      if (_engine["default"].input.isKeyPressed(INPUT.KEYS.LEFT)) {
        this.isTurningLeft = true;
      } else {
        this.isTurningLeft = false;
      }

      if (_engine["default"].input.isKeyPressed(INPUT.KEYS.RIGHT)) {
        this.isTurningRight = true;
      } else {
        this.isTurningRight = false;
      }

      if (_engine["default"].input.isKeyPressed(INPUT.KEYS.UP)) {
        this.isThrusting = true;
      } else {
        this.isThrusting = false;
      } // ------------------------------------------------
      //  Rotation
      // ------------------------------------------------


      if (this.isTurningLeft === true) {
        this.avatar.vRot = -this.rotationSpeed;
      } else if (this.isTurningRight === true) {
        this.avatar.vRot = this.rotationSpeed;
      } else {
        this.avatar.vRot = 0;
      } // ------------------------------------------------
      //  Thrusting
      // ------------------------------------------------


      if (this.isThrusting === true) {
        var dir = MATH.angleToDirectionVector(this.avatar.rotation.getAngle());
        dir = dir.normalize();
        this.avatar.speed.x += dir.x * this.flightSpeed;
        this.avatar.speed.y += dir.y * this.flightSpeed;
      } // ------------------------------------------------
      //  Check Scene limits
      // ------------------------------------------------
      // TODO: maybe this should be in the scene code?
      // Check if we are inside the scene
      // Bounce right side


      if (this.avatar.position.x > _engine["default"].core.size.x) {
        this.avatar.move(-(this.avatar.size.x / 4), 0);
        this.avatar.speed.x = -this.avatar.speed.x / 2;
      } // Bounce left side
      else if (this.avatar.position.x < 0) {
          this.avatar.move(this.avatar.size.x / 4, 0);
          this.avatar.speed.x = -this.avatar.speed.x / 2;
        } // Bounce lower side


      if (this.avatar.position.y > _engine["default"].core.size.y) {
        this.avatar.move(0, -this.avatar.size.y / 4);
        this.avatar.speed.y = -this.avatar.speed.y / 2;
      } // Bounce upper side
      else if (this.avatar.position.y < 0) {
          this.avatar.move(0, this.avatar.size.y / 4);
          this.avatar.speed.y = -this.avatar.speed.y / 2;
        }
    }
  }]);

  return AsteroidsPlayer;
}(_player["default"]);

exports["default"] = AsteroidsPlayer;

},{"./items/items":39,"okinawa.js/src/engine":13,"okinawa.js/src/input/input":22,"okinawa.js/src/math/math":27,"okinawa.js/src/player":31}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("okinawa.js/src/engine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Points =
/*#__PURE__*/
function () {
  function Points() {
    _classCallCheck(this, Points);

    this.totalPoints = 0;
    this.gameInitTime = 0;
  }

  _createClass(Points, [{
    key: "initialize",
    value: function initialize() {}
  }, {
    key: "add",
    value: function add(points) {
      this.totalPoints += points;

      var scene = _engine["default"].scenes.getCurrentScene();

      var guiItem = scene.gui.get('points');

      if (typeof guiItem != 'undefined') {
        guiItem.setText(_engine["default"].localization.get('points') + ': ' + this.totalPoints);
      }
    }
  }]);

  return Points;
}();

exports["default"] = Points;

},{"okinawa.js/src/engine":13}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("okinawa.js/src/engine"));

var _background = _interopRequireDefault(require("okinawa.js/src/scenes/background"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var StarBackground =
/*#__PURE__*/
function (_Background) {
  _inherits(StarBackground, _Background);

  function StarBackground() {
    var _this;

    _classCallCheck(this, StarBackground);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(StarBackground).call(this));
    _this.BACKGROUND_SPEED = 8;
    _this.BACKGROUND_STARS = 30;
    _this.speeds = [];
    _this.offsets = [];
    _this.parallaxDisplacement = 5;
    _this.starfields = [];
    return _this;
  }

  _createClass(StarBackground, [{
    key: "initialize",
    value: function initialize() {
      for (var depth = 0; depth < 3; depth++) {
        // Create a generic background
        this.starfields[depth] = document.createElement('canvas');
        this.starfields[depth].layer = depth;
        this.starfields[depth].width = _engine["default"].core.size.x + (depth + 1) * this.parallaxDisplacement;
        this.starfields[depth].height = _engine["default"].core.size.y;
        this.starfields[depth].ctx = this.starfields[depth].getContext('2d');
        this.speeds[depth] = this.BACKGROUND_SPEED + (depth + 1) * 7;
        this.offsets[depth] = 0; // fill the deepest layer with black background

        if (depth === 0) {
          this.starfields[depth].ctx.fillStyle = '#000';
          this.starfields[depth].ctx.fillRect(0, 0, this.starfields[depth].width, this.starfields[depth].height);
        }

        this.starfields[depth].ctx.fillStyle = '#FFF';
        this.starfields[depth].ctx.globalAlpha = (depth + 1) * 2 / 10; // Now draw a bunch of random 2 pixel
        // rectangles onto the offscreen canvas

        for (var i = 0; i < this.BACKGROUND_STARS; i++) {
          this.starfields[depth].ctx.fillRect(Math.floor(Math.random() * this.starfields[depth].width), Math.floor(Math.random() * this.starfields[depth].height), depth + 1, depth + 1);
        }
      }
    }
  }, {
    key: "step",
    value: function step(dt) {
      // Call inherited function
      // Engine.Background.prototype.step.call(this, dt);
      for (var depth = 0; depth < 3; depth++) {
        this.offsets[depth] += this.speeds[depth] / dt;
        this.offsets[depth] = this.offsets[depth] % this.starfields[depth].height;
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      // Call inherited function
      // Engine.Background.prototype.draw.call(this, ctx);
      for (var depth = 0; depth < 3; depth++) {
        var intOffset = Math.floor(this.offsets[depth]);
        var remaining = this.starfields[depth].height - intOffset;
        var maxWidth = this.starfields[depth].width; // Parallax offset of each layer in the background

        var parallaxOffset = void 0; // No player or one the three first screens (preloader, menu or initial animation)

        if (typeof _engine["default"].player == 'undefined' || _engine["default"].player === null || _engine["default"].currentScene <= 2) {
          parallaxOffset = (depth + 1) * this.parallaxDisplacement * (_engine["default"].core.size.x / 2) / _engine["default"].core.size.x;
        } else {
          var playerDisplacement = _engine["default"].player.getAvatar().getPosition().x;

          parallaxOffset = Math.round((depth + 1) * this.parallaxDisplacement * playerDisplacement / _engine["default"].core.size.x);
          if (parallaxOffset < 0) parallaxOffset = 0;else if (parallaxOffset + _engine["default"].core.size.x > maxWidth) parallaxOffset = maxWidth - _engine["default"].core.size.x;
        } // Draw the top half of the starfield


        if (intOffset > 0) {
          ctx.drawImage(this.starfields[depth], 0 + parallaxOffset, remaining, _engine["default"].core.size.x, intOffset, 0, 0, _engine["default"].core.size.x, intOffset);
        } // Draw the bottom half of the starfield


        if (remaining > 0) {
          ctx.drawImage(this.starfields[depth], 0 + parallaxOffset, 0, _engine["default"].core.size.x, remaining, 0, intOffset, _engine["default"].core.size.x, remaining);
        }
      }
    }
  }]);

  return StarBackground;
}(_background["default"]);

exports["default"] = StarBackground;

},{"okinawa.js/src/engine":13,"okinawa.js/src/scenes/background":32}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("okinawa.js/src/engine"));

var _scene = _interopRequireDefault(require("okinawa.js/src/scenes/scene"));

var INPUT = _interopRequireWildcard(require("okinawa.js/src/input/input"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var InitialScene =
/*#__PURE__*/
function (_Scene) {
  _inherits(InitialScene, _Scene);

  function InitialScene() {
    _classCallCheck(this, InitialScene);

    return _possibleConstructorReturn(this, _getPrototypeOf(InitialScene).call(this));
  } // Will be called after creation of this object


  _createClass(InitialScene, [{
    key: "initialize",
    value: function initialize() {
      _get(_getPrototypeOf(InitialScene.prototype), "initialize", this).call(this); // This object will be listening to the spacebar key
      // When pressed, our eventKeyPressed functions will be called


      this.input.addKeyListener(this, 'eventKeyPressed', [INPUT.KEYS.SPACEBAR]);
    } // Will be called when the scene starts being playable

  }, {
    key: "activate",
    value: function activate() {
      var avatar = _engine["default"].player.getAvatar(); // Position the player avatar in the proper place


      avatar.setPosition(_engine["default"].core.size.x / 2, _engine["default"].core.size.y / 2); // Attach the player avatar to this scene

      this.attachItem(avatar);

      _get(_getPrototypeOf(InitialScene.prototype), "activate", this).call(this);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      _get(_getPrototypeOf(InitialScene.prototype), "draw", this).call(this, ctx);
    }
  }, {
    key: "step",
    value: function step(dt) {
      _get(_getPrototypeOf(InitialScene.prototype), "step", this).call(this, dt);
    }
  }, {
    key: "eventKeyPressed",
    value: function eventKeyPressed(keyCode) {
      if (keyCode == INPUT.KEYS.SPACEBAR) {
        _engine["default"].scenes.advanceScene();
      }
    }
  }]);

  return InitialScene;
}(_scene["default"]);

exports["default"] = InitialScene;

},{"okinawa.js/src/engine":13,"okinawa.js/src/input/input":22,"okinawa.js/src/scenes/scene":34}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _engine = _interopRequireDefault(require("okinawa.js/src/engine"));

var _scene = _interopRequireDefault(require("okinawa.js/src/scenes/scene"));

var GUI = _interopRequireWildcard(require("okinawa.js/src/gui/gui"));

var MATH = _interopRequireWildcard(require("okinawa.js/src/math/math"));

var ITEMS = _interopRequireWildcard(require("../items/items"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Level =
/*#__PURE__*/
function (_Scene) {
  _inherits(Level, _Scene);

  function Level() {
    var _this;

    _classCallCheck(this, Level);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Level).call(this));
    _this.timeLastMeteor = 0;
    return _this;
  }

  _createClass(Level, [{
    key: "initialize",
    value: function initialize() {
      _get(_getPrototypeOf(Level.prototype), "initialize", this).call(this); // Level GUI


      var points = new GUI.GuiText();
      points.setSize(250, 30);
      points.setPosition(15 + points.size.x / 2, _engine["default"].core.size.y - 15 - points.size.y / 2); // left down

      points.setText(_engine["default"].localization.get('points') + ': 0');
      this.gui.attachItem(points, 'points');
    }
  }, {
    key: "activate",
    value: function activate() {
      this.attachItem(_engine["default"].player.getAvatar());

      _get(_getPrototypeOf(Level.prototype), "activate", this).call(this);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      _get(_getPrototypeOf(Level.prototype), "draw", this).call(this, ctx);
    }
  }, {
    key: "step",
    value: function step(dt) {
      _get(_getPrototypeOf(Level.prototype), "step", this).call(this, dt);

      this.checkBoundaries();
      this.checkCollisions();
      var now = new Date().getTime();

      if (now - this.timeLastMeteor > _engine["default"].options.meteorPeriodicity) {
        this.timeLastMeteor = now;
        var meteor = new ITEMS.Meteor(1, 1.5); // (size, speed)

        var side = Math.floor(Math.random() * 4);
        var angle = Math.random() * Math.PI; // 180 degrees

        switch (side) {
          case 0:
            // up
            meteor.position.x = Math.random() * _engine["default"].core.size.x;
            meteor.position.y = 1 - meteor.size.y;
            break;

          case 1:
            // right
            meteor.position.x = 1 - meteor.size.x;
            meteor.position.y = Math.random() * _engine["default"].core.size.y;
            angle += Math.PI / 2;
            break;

          case 2:
            // down
            meteor.position.x = Math.random() * _engine["default"].core.size.x;
            meteor.position.y = _engine["default"].core.size.y + meteor.size.y - 1;
            angle -= Math.PI;
            break;

          default:
          case 3:
            // left
            meteor.position.x = _engine["default"].core.size.x + meteor.size.x - 1;
            meteor.position.y = Math.random() * _engine["default"].core.size.y;
            angle -= Math.PI / 2;
            break;
        }

        var direction = MATH.angleToDirectionVector(angle);
        direction = direction.normalize();
        meteor.speed.x = direction.x * meteor.linearSpeed;
        meteor.speed.y = direction.y * meteor.linearSpeed;
        this.attachItem(meteor);
      }
    }
  }, {
    key: "checkBoundaries",
    value: function checkBoundaries() {
      // Reset the list of removed objects
      this._resetRemoved();

      var item;

      for (var i = 0; i < this.getAttachedItems().length; i++) {
        item = this.getAttachedItems()[i]; // Item outside the screen -> remove

        if (item.position.x > _engine["default"].core.size.x + item.size.x || item.position.x < 0 - item.size.x || item.position.y < 0 - item.size.y || item.position.y > _engine["default"].core.size.y + item.size.y) {
          this.detachItem(item);
        }
      } // Remove any objects marked for removal


      this._finalizeRemoved();
    }
  }, {
    key: "checkCollisions",
    value: function checkCollisions() {
      // Reset the list of removed objects
      this._resetRemoved();

      var a, b;

      for (var i = 0; i < this.getAttachedItems().length; i++) {
        a = this.getAttachedItems()[i]; // Objects without collisionRadius do not collide

        if (a.collisionRadius === 0) {
          continue;
        }

        for (var j = i + 1; j < this.getAttachedItems().length; j++) {
          b = this.getAttachedItems()[j]; // Objects without collisionRadius do not collide

          if (b.collisionRadius === 0) {
            continue;
          }

          if (Math.abs(a.position.x - b.position.x) > a.size.x / 2 + b.size.x / 2) {
            continue;
          }

          if (Math.abs(a.position.y - b.position.y) > a.size.y / 2 + b.size.y / 2) {
            continue;
          }

          if (MATH.pointDistance(a.position, b.position) <= a.collisionRadius + b.collisionRadius) {
            // Collide and remove each object
            if (a.collide(b) === true) this.detachItem(a);
            if (b.collide(a) === true) this.detachItem(b);
          }
        }
      } // Remove any objects marked for removal


      this._finalizeRemoved();
    }
  }]);

  return Level;
}(_scene["default"]);

exports["default"] = Level;

},{"../items/items":39,"okinawa.js/src/engine":13,"okinawa.js/src/gui/gui":14,"okinawa.js/src/math/math":27,"okinawa.js/src/scenes/scene":34}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "StarBackground", {
  enumerable: true,
  get: function get() {
    return _background["default"];
  }
});
Object.defineProperty(exports, "InitialScene", {
  enumerable: true,
  get: function get() {
    return _initial["default"];
  }
});
Object.defineProperty(exports, "Level", {
  enumerable: true,
  get: function get() {
    return _level["default"];
  }
});

var _background = _interopRequireDefault(require("./background"));

var _initial = _interopRequireDefault(require("./initial"));

var _level = _interopRequireDefault(require("./level"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

},{"./background":47,"./initial":48,"./level":49}]},{},[1]);
