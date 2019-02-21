/* canvas-toBlob.js
 * A canvas.toBlob() implementation.
 * 2016-05-26
 * 
 * By Eli Grey, http://eligrey.com and Devin Samarin, https://github.com/eboyjr
 * License: MIT
 *   See https://github.com/eligrey/canvas-toBlob.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/canvas-toBlob.js/blob/master/canvas-toBlob.js */

/**FileSaver License */
/*
The MIT License

Copyright © 2016 [Eli Grey][1].

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

  [1]: http://eligrey.com
*/
export default class exportSupport
{
    static init()
    {
        /**Init canvas-toBlob */
          
        (function(view) {
            "use strict";
            var
                  Uint8Array = view.Uint8Array
                , HTMLCanvasElement = view.HTMLCanvasElement
                , canvas_proto = HTMLCanvasElement && HTMLCanvasElement.prototype
                , is_base64_regex = /\s*;\s*base64\s*(?:;|$)/i
                , to_data_url = "toDataURL"
                , base64_ranks
                , decode_base64 = function(base64) {
                    var
                          len = base64.length
                        , buffer = new Uint8Array(len / 4 * 3 | 0)
                        , i = 0
                        , outptr = 0
                        , last = [0, 0]
                        , state = 0
                        , save = 0
                        , rank
                        , code
                        , undef
                    ;
                    while (len--) {
                        code = base64.charCodeAt(i++);
                        rank = base64_ranks[code-43];
                        if (rank !== 255 && rank !== undef) {
                            last[1] = last[0];
                            last[0] = code;
                            save = (save << 6) | rank;
                            state++;
                            if (state === 4) {
                                buffer[outptr++] = save >>> 16;
                                if (last[1] !== 61 /* padding character */) {
                                    buffer[outptr++] = save >>> 8;
                                }
                                if (last[0] !== 61 /* padding character */) {
                                    buffer[outptr++] = save;
                                }
                                state = 0;
                            }
                        }
                    }
                    // 2/3 chance there's going to be some null bytes at the end, but that
                    // doesn't really matter with most image formats.
                    // If it somehow matters for you, truncate the buffer up outptr.
                    return buffer;
                }
            ;
            if (Uint8Array) {
                base64_ranks = new Uint8Array([
                      62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1
                    , -1, -1,  0, -1, -1, -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9
                    , 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25
                    , -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35
                    , 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51
                ]);
            }
            if (HTMLCanvasElement && (!canvas_proto.toBlob || !canvas_proto.toBlobHD)) {
                if (!canvas_proto.toBlob)
                canvas_proto.toBlob = function(callback, type /*, ...args*/) {
                      if (!type) {
                        type = "image/png";
                    } if (this.mozGetAsFile) {
                        callback(this.mozGetAsFile("canvas", type));
                        return;
                    } if (this.msToBlob && /^\s*image\/png\s*(?:$|;)/i.test(type)) {
                        callback(this.msToBlob());
                        return;
                    }
            
                    var
                          args = Array.prototype.slice.call(arguments, 1)
                        , dataURI = this[to_data_url].apply(this, args)
                        , header_end = dataURI.indexOf(",")
                        , data = dataURI.substring(header_end + 1)
                        , is_base64 = is_base64_regex.test(dataURI.substring(0, header_end))
                        , blob
                    ;
                    if (Blob.fake) {
                        // no reason to decode a data: URI that's just going to become a data URI again
                        blob = new Blob
                        if (is_base64) {
                            blob.encoding = "base64";
                        } else {
                            blob.encoding = "URI";
                        }
                        blob.data = data;
                        blob.size = data.length;
                    } else if (Uint8Array) {
                        if (is_base64) {
                            blob = new Blob([decode_base64(data)], {type: type});
                        } else {
                            blob = new Blob([decodeURIComponent(data)], {type: type});
                        }
                    }
                    callback(blob);
                };
            
                if (!canvas_proto.toBlobHD && canvas_proto.toDataURLHD) {
                    canvas_proto.toBlobHD = function() {
                        to_data_url = "toDataURLHD";
                        var blob = this.toBlob();
                        to_data_url = "toDataURL";
                        return blob;
                    }
                } else {
                    canvas_proto.toBlobHD = canvas_proto.toBlob;
                }
            }
        }(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content || this)); 
        
        /**Init FileSaver */
        /*
        (function(a, b) {
            if ("function" == typeof define && define.amd) define([], b);
            else if ("undefined" != typeof exports) b();
            else {
              b(), (a.FileSaver = { exports: {} }.exports);
            }
          })(this, function() {
            "use strict";
            function b(a, b) {
              return (
                "undefined" == typeof b
                  ? (b = { autoBom: !1 })
                  : "object" != typeof b &&
                    (console.warn("Depricated: Expected third argument to be a object"),
                    (b = { autoBom: !b })),
                b.autoBom &&
                /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(
                  a.type
                )
                  ? new Blob(["\uFEFF", a], { type: a.type })
                  : a
              );
            }
            function c(b, c, d) {
              var e = new XMLHttpRequest();
              e.open("GET", b),
                (e.responseType = "blob"),
                (e.onload = function() {
                  a(e.response, c, d);
                }),
                (e.onerror = function() {
                  console.error("could not download file");
                }),
                e.send();
            }
            function d(a) {
              var b = new XMLHttpRequest();
              return b.open("HEAD", a, !1), b.send(), 200 <= b.status && 299 >= b.status;
            }
            function e(a) {
              try {
                a.dispatchEvent(new MouseEvent("click"));
              } catch (c) {
                var b = document.createEvent("MouseEvents");
                b.initMouseEvent(
                  "click",
                  !0,
                  !0,
                  window,
                  0,
                  0,
                  0,
                  80,
                  20,
                  !1,
                  !1,
                  !1,
                  !1,
                  0,
                  null
                ),
                  a.dispatchEvent(b);
              }
            }
            var f = (function() {
                try {
                  return Function("return this")() || (42, eval)("this");
                } catch (a) {
                  return "object" == typeof window && window.window === window
                    ? window
                    : "object" == typeof self && self.self === self
                    ? self
                    : "object" == typeof global && global.global === global
                    ? global
                    : this;
                }
              })(),
              a =
                f.saveAs || "object" != typeof window || window !== f
                  ? function() {}
                  : "download" in HTMLAnchorElement.prototype
                  ? function(b, g, h) {
                      var i = f.URL || f.webkitURL,
                        j = document.createElement("a");
                      (g = g || b.name || "download"),
                        (j.download = g),
                        (j.rel = "noopener"),
                        "string" == typeof b
                          ? ((j.href = b),
                            j.origin === location.origin
                              ? e(j)
                              : d(j.href)
                              ? c(b, g, h)
                              : e(j, (j.target = "_blank")))
                          : ((j.href = i.createObjectURL(b)),
                            setTimeout(function() {
                              i.revokeObjectURL(j.href);
                            }, 4e4),
                            setTimeout(function() {
                              e(j);
                            }, 0));
                    }
                  : "msSaveOrOpenBlob" in navigator
                  ? function(f, g, h) {
                      if (((g = g || f.name || "download"), "string" != typeof f))
                        navigator.msSaveOrOpenBlob(b(f, h), g);
                      else if (d(f)) c(f, g, h);
                      else {
                        var i = document.createElement("a");
                        (i.href = f),
                          (i.target = "_blank"),
                          setTimeout(function() {
                            e(i);
                          });
                      }
                    }
                  : function(a, b, d, e) {
                      if (
                        ((e = e || open("", "_blank")),
                        e &&
                          (e.document.title = e.document.body.innerText =
                            "downloading..."),
                        "string" == typeof a)
                      )
                        return c(a, b, d);
                      var g = "application/octet-stream" === a.type,
                        h = /constructor/i.test(f.HTMLElement) || f.safari,
                        i = /CriOS\/[\d]+/.test(navigator.userAgent);
                      if ((i || (g && h)) && "object" == typeof FileReader) {
                        var j = new FileReader();
                        (j.onloadend = function() {
                          var a = j.result;
                          (a = i
                            ? a
                            : a.replace(/^data:[^;]*;/, "data:attachment/file;")),
                            e ? (e.location.href = a) : (location = a),
                            (e = null);
                        }),
                          j.readAsDataURL(a);
                      } else {
                        var k = f.URL || f.webkitURL,
                          l = k.createObjectURL(a);
                        e ? (e.location = l) : (location.href = l),
                          (e = null),
                          setTimeout(function() {
                            k.revokeObjectURL(l);
                          }, 4e4);
                      }
                    };
            (f.saveAs = a.saveAs = a),
              "undefined" != typeof module && (module.exports = a);
          });
          //# sourceMappingURL=FileSaver.min.js.map
          */
    }
    
}
