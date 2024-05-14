;(() => {
  var e = {
    780: (e, t) => {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: true })
      var r
      ;(function (e) {
        e[(e['TOP_LEFT'] = 1)] = 'TOP_LEFT'
        e[(e['TOP_RIGHT'] = 2)] = 'TOP_RIGHT'
        e[(e['BOTTOM_RIGHT'] = 3)] = 'BOTTOM_RIGHT'
        e[(e['BOTTOM_LEFT'] = 4)] = 'BOTTOM_LEFT'
        e[(e['LEFT_TOP'] = 5)] = 'LEFT_TOP'
        e[(e['RIGHT_TOP'] = 6)] = 'RIGHT_TOP'
        e[(e['RIGHT_BOTTOM'] = 7)] = 'RIGHT_BOTTOM'
        e[(e['LEFT_BOTTOM'] = 8)] = 'LEFT_BOTTOM'
      })((r = t.Orientation || (t.Orientation = {})))
    },
    330: (e, t, r) => {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: true })
      const s = r(781)
      const i = r(300)
      class StreamParserWritableClass extends s.Writable {
        constructor() {
          super()
          i(this)
        }
      }
      t.StreamParserWritable = StreamParserWritableClass
    },
    300: (e, t, r) => {
      var s = r(491)
      var i = r(753)('stream-parser')
      e.exports = Parser
      var n = -1
      var a = 0
      var o = 1
      var f = 2
      function Parser(e) {
        var t = e && 'function' == typeof e._transform
        var r = e && 'function' == typeof e._write
        if (!t && !r)
          throw new Error('must pass a Writable or Transform stream in')
        i('extending Parser into stream')
        e._bytes = _bytes
        e._skipBytes = _skipBytes
        if (t) e._passthrough = _passthrough
        if (t) {
          e._transform = transform
        } else {
          e._write = write
        }
      }
      function init(e) {
        i('initializing parser stream')
        e._parserBytesLeft = 0
        e._parserBuffers = []
        e._parserBuffered = 0
        e._parserState = n
        e._parserCallback = null
        if ('function' == typeof e.push) {
          e._parserOutput = e.push.bind(e)
        }
        e._parserInit = true
      }
      function _bytes(e, t) {
        s(!this._parserCallback, 'there is already a "callback" set!')
        s(
          isFinite(e) && e > 0,
          'can only buffer a finite number of bytes > 0, got "' + e + '"'
        )
        if (!this._parserInit) init(this)
        i('buffering %o bytes', e)
        this._parserBytesLeft = e
        this._parserCallback = t
        this._parserState = a
      }
      function _skipBytes(e, t) {
        s(!this._parserCallback, 'there is already a "callback" set!')
        s(e > 0, 'can only skip > 0 bytes, got "' + e + '"')
        if (!this._parserInit) init(this)
        i('skipping %o bytes', e)
        this._parserBytesLeft = e
        this._parserCallback = t
        this._parserState = o
      }
      function _passthrough(e, t) {
        s(!this._parserCallback, 'There is already a "callback" set!')
        s(e > 0, 'can only pass through > 0 bytes, got "' + e + '"')
        if (!this._parserInit) init(this)
        i('passing through %o bytes', e)
        this._parserBytesLeft = e
        this._parserCallback = t
        this._parserState = f
      }
      function write(e, t, r) {
        if (!this._parserInit) init(this)
        i('write(%o bytes)', e.length)
        if ('function' == typeof t) r = t
        _(this, e, null, r)
      }
      function transform(e, t, r) {
        if (!this._parserInit) init(this)
        i('transform(%o bytes)', e.length)
        if ('function' != typeof t) {
          t = this._parserOutput
        }
        _(this, e, t, r)
      }
      function _data(e, t, r, s) {
        if (e._parserBytesLeft <= 0) {
          return s(new Error('got data but not currently parsing anything'))
        }
        if (t.length <= e._parserBytesLeft) {
          return function () {
            return process(e, t, r, s)
          }
        } else {
          return function () {
            var i = t.slice(0, e._parserBytesLeft)
            return process(e, i, r, function (n) {
              if (n) return s(n)
              if (t.length > i.length) {
                return function () {
                  return _data(e, t.slice(i.length), r, s)
                }
              }
            })
          }
        }
      }
      function process(e, t, r, s) {
        e._parserBytesLeft -= t.length
        i('%o bytes left for stream piece', e._parserBytesLeft)
        if (e._parserState === a) {
          e._parserBuffers.push(t)
          e._parserBuffered += t.length
        } else if (e._parserState === f) {
          r(t)
        }
        if (0 === e._parserBytesLeft) {
          var o = e._parserCallback
          if (o && e._parserState === a && e._parserBuffers.length > 1) {
            t = Buffer.concat(e._parserBuffers, e._parserBuffered)
          }
          if (e._parserState !== a) {
            t = null
          }
          e._parserCallback = null
          e._parserBuffered = 0
          e._parserState = n
          e._parserBuffers.splice(0)
          if (o) {
            var _ = []
            if (t) {
              _.push(t)
            } else {
            }
            if (r) {
              _.push(r)
            }
            var p = o.length > _.length
            if (p) {
              _.push(trampoline(s))
            }
            var u = o.apply(e, _)
            if (!p || s === u) return s
          }
        } else {
          return s
        }
      }
      var _ = trampoline(_data)
      function trampoline(e) {
        return function () {
          var t = e.apply(this, arguments)
          while ('function' == typeof t) {
            t = t()
          }
          return t
        }
      }
    },
    753: (e) => {
      'use strict'
      e.exports = require('../debug')
    },
    491: (e) => {
      'use strict'
      e.exports = require('assert')
    },
    781: (e) => {
      'use strict'
      e.exports = require('stream')
    },
  }
  var t = {}
  function __nccwpck_require__(r) {
    var s = t[r]
    if (s !== undefined) {
      return s.exports
    }
    var i = (t[r] = { exports: {} })
    var n = true
    try {
      e[r](i, i.exports, __nccwpck_require__)
      n = false
    } finally {
      if (n) delete t[r]
    }
    return i.exports
  }
  if (typeof __nccwpck_require__ !== 'undefined')
    __nccwpck_require__.ab = __dirname + '/'
  var r = {}
  ;(() => {
    'use strict'
    var e = r
    Object.defineProperty(e, '__esModule', { value: true })
    const t = __nccwpck_require__(781)
    const s = __nccwpck_require__(780)
    e.Orientation = s.Orientation
    const i = __nccwpck_require__(330)
    const noop = () => {}
    class EXIFOrientationParser extends i.StreamParserWritable {
      constructor() {
        super()
        this._bytes(4, this.onSignature.bind(this))
      }
      onSignature(e) {
        const t = e.readUInt16BE(0)
        const r = e.readUInt16BE(2)
        if (t === 65496) {
          this.onJPEGMarker(e.slice(2))
        } else if ((t === 18761 && r === 10752) || (t === 19789 && r === 42)) {
          this._bytes(4, (t) => {
            this.onTIFFHeader(Buffer.concat([e, t]))
          })
        } else {
          this._skipBytes(Infinity, noop)
        }
      }
      onJPEGMarker(e) {
        const t = e.readUInt16BE(0)
        if (t === 65505) {
          this._bytes(8, (e) => {
            const t =
              e.readUInt16BE(2) === 17784 &&
              e.readUInt16BE(4) === 26982 &&
              e.readUInt16BE(6) === 0
            if (t) {
              this._bytes(8, this.onTIFFHeader.bind(this))
            } else {
              const t = e.readUInt16BE(0)
              const r = t - 6
              this._skipBytes(r, () => {
                this._bytes(2, this.onJPEGMarker.bind(this))
              })
            }
          })
        } else if (65504 <= t && t <= 65519) {
          this._bytes(2, (t) => {
            const r = t.readUInt16BE(0)
            const s = r - e.length
            this._skipBytes(s, () => {
              this._bytes(2, this.onJPEGMarker.bind(this))
            })
          })
        } else {
          this._skipBytes(Infinity, noop)
        }
      }
      onTIFFHeader(e) {
        const t = e.readUInt16BE(0) === 18761
        const readUInt16 = (e, r) => (t ? e.readUInt16LE(r) : e.readUInt16BE(r))
        const readUInt32 = (e, r) => (t ? e.readUInt32LE(r) : e.readUInt32BE(r))
        const r = readUInt32(e, 4)
        const s = r - e.length
        const consumeIDFBlock = () => {
          this._bytes(2, (e) => {
            let t = readUInt16(e, 0)
            const consumeIFDFields = () => {
              if (t-- > 0) {
                this._bytes(12, (e) => {
                  const t = readUInt16(e, 0)
                  if (t === 274) {
                    const t = e.slice(8, 12)
                    const r = readUInt16(t, 0)
                    if (1 <= r && r <= 8) {
                      this.emit('orientation', r)
                    } else {
                      this.emit(
                        'error',
                        new Error('Unexpected Orientation value')
                      )
                    }
                    this._skipBytes(Infinity, noop)
                  } else {
                    consumeIFDFields()
                  }
                })
              } else {
                this._skipBytes(Infinity, noop)
              }
            }
            consumeIFDFields()
          })
        }
        if (s > 0) {
          this._skipBytes(s, consumeIDFBlock)
        } else {
          consumeIDFBlock()
        }
      }
    }
    e.EXIFOrientationParser = EXIFOrientationParser
    function getOrientation(e) {
      return new Promise((r, i) => {
        const n = new EXIFOrientationParser()
          .once('error', onError)
          .once('finish', onFinish)
          .once('orientation', onOrientation)
        let a = false
        function onError(e) {
          n.removeListener('finish', onFinish)
          n.removeListener('orientation', onOrientation)
          if (!a) {
            a = true
            i(e)
          }
        }
        function onFinish() {
          n.removeListener('error', onError)
          n.removeListener('orientation', onOrientation)
          if (!a) {
            a = true
            r(s.Orientation.TOP_LEFT)
          }
        }
        function onOrientation(e) {
          n.removeListener('error', onError)
          n.removeListener('finish', onFinish)
          if (!a) {
            a = true
            r(e)
          }
        }
        if (Buffer.isBuffer(e)) {
          n.end(e)
        } else if (e instanceof t.Readable) {
          e.pipe(n)
        } else {
          throw new TypeError('Unexpected input type')
        }
      })
    }
    e.getOrientation = getOrientation
  })()
  module.exports = r
})()
