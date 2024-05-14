;(() => {
  var e = {
    873: (e, r, t) => {
      'use strict'
      var n = t(742)
      var o = []
      e.exports = asap
      function asap(e) {
        var r
        if (o.length) {
          r = o.pop()
        } else {
          r = new RawTask()
        }
        r.task = e
        r.domain = process.domain
        n(r)
      }
      function RawTask() {
        this.task = null
        this.domain = null
      }
      RawTask.prototype.call = function () {
        if (this.domain) {
          this.domain.enter()
        }
        var e = true
        try {
          this.task.call()
          e = false
          if (this.domain) {
            this.domain.exit()
          }
        } finally {
          if (e) {
            n.requestFlush()
          }
          this.task = null
          this.domain = null
          o.push(this)
        }
      }
    },
    742: (e, r, t) => {
      'use strict'
      var n
      var o = typeof setImmediate === 'function'
      e.exports = rawAsap
      function rawAsap(e) {
        if (!i.length) {
          requestFlush()
          s = true
        }
        i[i.length] = e
      }
      var i = []
      var s = false
      var a = 0
      var u = 1024
      function flush() {
        while (a < i.length) {
          var e = a
          a = a + 1
          i[e].call()
          if (a > u) {
            for (var r = 0, t = i.length - a; r < t; r++) {
              i[r] = i[r + a]
            }
            i.length -= a
            a = 0
          }
        }
        i.length = 0
        a = 0
        s = false
      }
      rawAsap.requestFlush = requestFlush
      function requestFlush() {
        var e = process.domain
        if (e) {
          if (!n) {
            n = t(639)
          }
          n.active = process.domain = null
        }
        if (s && o) {
          setImmediate(flush)
        } else {
          process.nextTick(flush)
        }
        if (e) {
          n.active = process.domain = e
        }
      }
    },
    758: (e, r, t) => {
      var n = {}
      e['exports'] = n
      n.themes = {}
      var o = t(837)
      var i = (n.styles = t(77))
      var s = Object.defineProperties
      var a = new RegExp(/[\r\n]+/g)
      n.supportsColor = t(725).supportsColor
      if (typeof n.enabled === 'undefined') {
        n.enabled = n.supportsColor() !== false
      }
      n.enable = function () {
        n.enabled = true
      }
      n.disable = function () {
        n.enabled = false
      }
      n.stripColors = n.strip = function (e) {
        return ('' + e).replace(/\x1B\[\d+m/g, '')
      }
      var u = (n.stylize = function stylize(e, r) {
        if (!n.enabled) {
          return e + ''
        }
        var t = i[r]
        if (!t && r in n) {
          return n[r](e)
        }
        return t.open + e + t.close
      })
      var l = /[|\\{}()[\]^$+*?.]/g
      var escapeStringRegexp = function (e) {
        if (typeof e !== 'string') {
          throw new TypeError('Expected a string')
        }
        return e.replace(l, '\\$&')
      }
      function build(e) {
        var r = function builder() {
          return applyStyle.apply(builder, arguments)
        }
        r._styles = e
        r.__proto__ = f
        return r
      }
      var c = (function () {
        var e = {}
        i.grey = i.gray
        Object.keys(i).forEach(function (r) {
          i[r].closeRe = new RegExp(escapeStringRegexp(i[r].close), 'g')
          e[r] = {
            get: function () {
              return build(this._styles.concat(r))
            },
          }
        })
        return e
      })()
      var f = s(function colors() {}, c)
      function applyStyle() {
        var e = Array.prototype.slice.call(arguments)
        var r = e
          .map(function (e) {
            if (e != null && e.constructor === String) {
              return e
            } else {
              return o.inspect(e)
            }
          })
          .join(' ')
        if (!n.enabled || !r) {
          return r
        }
        var t = r.indexOf('\n') != -1
        var s = this._styles
        var u = s.length
        while (u--) {
          var l = i[s[u]]
          r = l.open + r.replace(l.closeRe, l.open) + l.close
          if (t) {
            r = r.replace(a, function (e) {
              return l.close + e + l.open
            })
          }
        }
        return r
      }
      n.setTheme = function (e) {
        if (typeof e === 'string') {
          console.log(
            'colors.setTheme now only accepts an object, not a string.  ' +
              'If you are trying to set a theme from a file, it is now your (the ' +
              "caller's) responsibility to require the file.  The old syntax " +
              'looked like colors.setTheme(__dirname + ' +
              "'/../themes/generic-logging.js'); The new syntax looks like " +
              'colors.setTheme(require(__dirname + ' +
              "'/../themes/generic-logging.js'));"
          )
          return
        }
        for (var r in e) {
          ;(function (r) {
            n[r] = function (t) {
              if (typeof e[r] === 'object') {
                var o = t
                for (var i in e[r]) {
                  o = n[e[r][i]](o)
                }
                return o
              }
              return n[e[r]](t)
            }
          })(r)
        }
      }
      function init() {
        var e = {}
        Object.keys(c).forEach(function (r) {
          e[r] = {
            get: function () {
              return build([r])
            },
          }
        })
        return e
      }
      var p = function sequencer(e, r) {
        var t = r.split('')
        t = t.map(e)
        return t.join('')
      }
      n.trap = t(822)
      n.zalgo = t(576)
      n.maps = {}
      n.maps.america = t(967)(n)
      n.maps.zebra = t(917)(n)
      n.maps.rainbow = t(410)(n)
      n.maps.random = t(409)(n)
      for (var d in n.maps) {
        ;(function (e) {
          n[e] = function (r) {
            return p(n.maps[e], r)
          }
        })(d)
      }
      s(n, init())
    },
    822: (e) => {
      e['exports'] = function runTheTrap(e, r) {
        var t = ''
        e = e || 'Run the trap, drop the bass'
        e = e.split('')
        var n = {
          a: ['@', 'Ą', 'Ⱥ', 'Ʌ', 'Δ', 'Λ', 'Д'],
          b: ['ß', 'Ɓ', 'Ƀ', 'ɮ', 'β', '฿'],
          c: ['©', 'Ȼ', 'Ͼ'],
          d: ['Ð', 'Ɗ', 'Ԁ', 'ԁ', 'Ԃ', 'ԃ'],
          e: ['Ë', 'ĕ', 'Ǝ', 'ɘ', 'Σ', 'ξ', 'Ҽ', '੬'],
          f: ['Ӻ'],
          g: ['ɢ'],
          h: ['Ħ', 'ƕ', 'Ң', 'Һ', 'Ӈ', 'Ԋ'],
          i: ['༏'],
          j: ['Ĵ'],
          k: ['ĸ', 'Ҡ', 'Ӄ', 'Ԟ'],
          l: ['Ĺ'],
          m: ['ʍ', 'Ӎ', 'ӎ', 'Ԡ', 'ԡ', '൩'],
          n: ['Ñ', 'ŋ', 'Ɲ', 'Ͷ', 'Π', 'Ҋ'],
          o: ['Ø', 'õ', 'ø', 'Ǿ', 'ʘ', 'Ѻ', 'ם', '۝', '๏'],
          p: ['Ƿ', 'Ҏ'],
          q: ['্'],
          r: ['®', 'Ʀ', 'Ȑ', 'Ɍ', 'ʀ', 'Я'],
          s: ['§', 'Ϟ', 'ϟ', 'Ϩ'],
          t: ['Ł', 'Ŧ', 'ͳ'],
          u: ['Ʊ', 'Ս'],
          v: ['ט'],
          w: ['Ш', 'Ѡ', 'Ѽ', '൰'],
          x: ['Ҳ', 'Ӿ', 'Ӽ', 'ӽ'],
          y: ['¥', 'Ұ', 'Ӌ'],
          z: ['Ƶ', 'ɀ'],
        }
        e.forEach(function (e) {
          e = e.toLowerCase()
          var r = n[e] || [' ']
          var o = Math.floor(Math.random() * r.length)
          if (typeof n[e] !== 'undefined') {
            t += n[e][o]
          } else {
            t += e
          }
        })
        return t
      }
    },
    576: (e) => {
      e['exports'] = function zalgo(e, r) {
        e = e || '   he is here   '
        var t = {
          up: [
            '̍',
            '̎',
            '̄',
            '̅',
            '̿',
            '̑',
            '̆',
            '̐',
            '͒',
            '͗',
            '͑',
            '̇',
            '̈',
            '̊',
            '͂',
            '̓',
            '̈',
            '͊',
            '͋',
            '͌',
            '̃',
            '̂',
            '̌',
            '͐',
            '̀',
            '́',
            '̋',
            '̏',
            '̒',
            '̓',
            '̔',
            '̽',
            '̉',
            'ͣ',
            'ͤ',
            'ͥ',
            'ͦ',
            'ͧ',
            'ͨ',
            'ͩ',
            'ͪ',
            'ͫ',
            'ͬ',
            'ͭ',
            'ͮ',
            'ͯ',
            '̾',
            '͛',
            '͆',
            '̚',
          ],
          down: [
            '̖',
            '̗',
            '̘',
            '̙',
            '̜',
            '̝',
            '̞',
            '̟',
            '̠',
            '̤',
            '̥',
            '̦',
            '̩',
            '̪',
            '̫',
            '̬',
            '̭',
            '̮',
            '̯',
            '̰',
            '̱',
            '̲',
            '̳',
            '̹',
            '̺',
            '̻',
            '̼',
            'ͅ',
            '͇',
            '͈',
            '͉',
            '͍',
            '͎',
            '͓',
            '͔',
            '͕',
            '͖',
            '͙',
            '͚',
            '̣',
          ],
          mid: [
            '̕',
            '̛',
            '̀',
            '́',
            '͘',
            '̡',
            '̢',
            '̧',
            '̨',
            '̴',
            '̵',
            '̶',
            '͜',
            '͝',
            '͞',
            '͟',
            '͠',
            '͢',
            '̸',
            '̷',
            '͡',
            ' ҉',
          ],
        }
        var n = [].concat(t.up, t.down, t.mid)
        function randomNumber(e) {
          var r = Math.floor(Math.random() * e)
          return r
        }
        function isChar(e) {
          var r = false
          n.filter(function (t) {
            r = t === e
          })
          return r
        }
        function heComes(e, r) {
          var n = ''
          var o
          var i
          r = r || {}
          r['up'] = typeof r['up'] !== 'undefined' ? r['up'] : true
          r['mid'] = typeof r['mid'] !== 'undefined' ? r['mid'] : true
          r['down'] = typeof r['down'] !== 'undefined' ? r['down'] : true
          r['size'] = typeof r['size'] !== 'undefined' ? r['size'] : 'maxi'
          e = e.split('')
          for (i in e) {
            if (isChar(i)) {
              continue
            }
            n = n + e[i]
            o = { up: 0, down: 0, mid: 0 }
            switch (r.size) {
              case 'mini':
                o.up = randomNumber(8)
                o.mid = randomNumber(2)
                o.down = randomNumber(8)
                break
              case 'maxi':
                o.up = randomNumber(16) + 3
                o.mid = randomNumber(4) + 1
                o.down = randomNumber(64) + 3
                break
              default:
                o.up = randomNumber(8) + 1
                o.mid = randomNumber(6) / 2
                o.down = randomNumber(8) + 1
                break
            }
            var s = ['up', 'mid', 'down']
            for (var a in s) {
              var u = s[a]
              for (var l = 0; l <= o[u]; l++) {
                if (r[u]) {
                  n = n + t[u][randomNumber(t[u].length)]
                }
              }
            }
          }
          return n
        }
        return heComes(e, r)
      }
    },
    967: (e) => {
      e['exports'] = function (e) {
        return function (r, t, n) {
          if (r === ' ') return r
          switch (t % 3) {
            case 0:
              return e.red(r)
            case 1:
              return e.white(r)
            case 2:
              return e.blue(r)
          }
        }
      }
    },
    410: (e) => {
      e['exports'] = function (e) {
        var r = ['red', 'yellow', 'green', 'blue', 'magenta']
        return function (t, n, o) {
          if (t === ' ') {
            return t
          } else {
            return e[r[n++ % r.length]](t)
          }
        }
      }
    },
    409: (e) => {
      e['exports'] = function (e) {
        var r = [
          'underline',
          'inverse',
          'grey',
          'yellow',
          'red',
          'green',
          'blue',
          'white',
          'cyan',
          'magenta',
          'brightYellow',
          'brightRed',
          'brightGreen',
          'brightBlue',
          'brightWhite',
          'brightCyan',
          'brightMagenta',
        ]
        return function (t, n, o) {
          return t === ' '
            ? t
            : e[r[Math.round(Math.random() * (r.length - 2))]](t)
        }
      }
    },
    917: (e) => {
      e['exports'] = function (e) {
        return function (r, t, n) {
          return t % 2 === 0 ? r : e.inverse(r)
        }
      }
    },
    77: (e) => {
      var r = {}
      e['exports'] = r
      var t = {
        reset: [0, 0],
        bold: [1, 22],
        dim: [2, 22],
        italic: [3, 23],
        underline: [4, 24],
        inverse: [7, 27],
        hidden: [8, 28],
        strikethrough: [9, 29],
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],
        gray: [90, 39],
        grey: [90, 39],
        brightRed: [91, 39],
        brightGreen: [92, 39],
        brightYellow: [93, 39],
        brightBlue: [94, 39],
        brightMagenta: [95, 39],
        brightCyan: [96, 39],
        brightWhite: [97, 39],
        bgBlack: [40, 49],
        bgRed: [41, 49],
        bgGreen: [42, 49],
        bgYellow: [43, 49],
        bgBlue: [44, 49],
        bgMagenta: [45, 49],
        bgCyan: [46, 49],
        bgWhite: [47, 49],
        bgGray: [100, 49],
        bgGrey: [100, 49],
        bgBrightRed: [101, 49],
        bgBrightGreen: [102, 49],
        bgBrightYellow: [103, 49],
        bgBrightBlue: [104, 49],
        bgBrightMagenta: [105, 49],
        bgBrightCyan: [106, 49],
        bgBrightWhite: [107, 49],
        blackBG: [40, 49],
        redBG: [41, 49],
        greenBG: [42, 49],
        yellowBG: [43, 49],
        blueBG: [44, 49],
        magentaBG: [45, 49],
        cyanBG: [46, 49],
        whiteBG: [47, 49],
      }
      Object.keys(t).forEach(function (e) {
        var n = t[e]
        var o = (r[e] = [])
        o.open = '[' + n[0] + 'm'
        o.close = '[' + n[1] + 'm'
      })
    },
    274: (e) => {
      'use strict'
      e.exports = function (e, r) {
        r = r || process.argv
        var t = r.indexOf('--')
        var n = /^-{1,2}/.test(e) ? '' : '--'
        var o = r.indexOf(n + e)
        return o !== -1 && (t === -1 ? true : o < t)
      }
    },
    725: (e, r, t) => {
      'use strict'
      var n = t(37)
      var o = t(274)
      var i = process.env
      var s = void 0
      if (o('no-color') || o('no-colors') || o('color=false')) {
        s = false
      } else if (
        o('color') ||
        o('colors') ||
        o('color=true') ||
        o('color=always')
      ) {
        s = true
      }
      if ('FORCE_COLOR' in i) {
        s = i.FORCE_COLOR.length === 0 || parseInt(i.FORCE_COLOR, 10) !== 0
      }
      function translateLevel(e) {
        if (e === 0) {
          return false
        }
        return { level: e, hasBasic: true, has256: e >= 2, has16m: e >= 3 }
      }
      function supportsColor(e) {
        if (s === false) {
          return 0
        }
        if (o('color=16m') || o('color=full') || o('color=truecolor')) {
          return 3
        }
        if (o('color=256')) {
          return 2
        }
        if (e && !e.isTTY && s !== true) {
          return 0
        }
        var r = s ? 1 : 0
        if (process.platform === 'win32') {
          var t = n.release().split('.')
          if (
            Number(process.versions.node.split('.')[0]) >= 8 &&
            Number(t[0]) >= 10 &&
            Number(t[2]) >= 10586
          ) {
            return Number(t[2]) >= 14931 ? 3 : 2
          }
          return 1
        }
        if ('CI' in i) {
          if (
            ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(function (e) {
              return e in i
            }) ||
            i.CI_NAME === 'codeship'
          ) {
            return 1
          }
          return r
        }
        if ('TEAMCITY_VERSION' in i) {
          return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(i.TEAMCITY_VERSION)
            ? 1
            : 0
        }
        if ('TERM_PROGRAM' in i) {
          var a = parseInt((i.TERM_PROGRAM_VERSION || '').split('.')[0], 10)
          switch (i.TERM_PROGRAM) {
            case 'iTerm.app':
              return a >= 3 ? 3 : 2
            case 'Hyper':
              return 3
            case 'Apple_Terminal':
              return 2
          }
        }
        if (/-256(color)?$/i.test(i.TERM)) {
          return 2
        }
        if (
          /^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(i.TERM)
        ) {
          return 1
        }
        if ('COLORTERM' in i) {
          return 1
        }
        if (i.TERM === 'dumb') {
          return r
        }
        return r
      }
      function getSupportLevel(e) {
        var r = supportsColor(e)
        return translateLevel(r)
      }
      e.exports = {
        supportsColor: getSupportLevel,
        stdout: getSupportLevel(process.stdout),
        stderr: getSupportLevel(process.stderr),
      }
    },
    915: (e, r, t) => {
      var n = t(758)
      e['exports'] = n
    },
    263: (e, r, t) => {
      'use strict'
      e.exports = t(554)
    },
    201: (e, r, t) => {
      'use strict'
      var n = t(742)
      function noop() {}
      var o = null
      var i = {}
      function getThen(e) {
        try {
          return e.then
        } catch (e) {
          o = e
          return i
        }
      }
      function tryCallOne(e, r) {
        try {
          return e(r)
        } catch (e) {
          o = e
          return i
        }
      }
      function tryCallTwo(e, r, t) {
        try {
          e(r, t)
        } catch (e) {
          o = e
          return i
        }
      }
      e.exports = Promise
      function Promise(e) {
        if (typeof this !== 'object') {
          throw new TypeError('Promises must be constructed via new')
        }
        if (typeof e !== 'function') {
          throw new TypeError(
            "Promise constructor's argument is not a function"
          )
        }
        this._U = 0
        this._V = 0
        this._W = null
        this._X = null
        if (e === noop) return
        doResolve(e, this)
      }
      Promise._Y = null
      Promise._Z = null
      Promise._0 = noop
      Promise.prototype.then = function (e, r) {
        if (this.constructor !== Promise) {
          return safeThen(this, e, r)
        }
        var t = new Promise(noop)
        handle(this, new Handler(e, r, t))
        return t
      }
      function safeThen(e, r, t) {
        return new e.constructor(function (n, o) {
          var i = new Promise(noop)
          i.then(n, o)
          handle(e, new Handler(r, t, i))
        })
      }
      function handle(e, r) {
        while (e._V === 3) {
          e = e._W
        }
        if (Promise._Y) {
          Promise._Y(e)
        }
        if (e._V === 0) {
          if (e._U === 0) {
            e._U = 1
            e._X = r
            return
          }
          if (e._U === 1) {
            e._U = 2
            e._X = [e._X, r]
            return
          }
          e._X.push(r)
          return
        }
        handleResolved(e, r)
      }
      function handleResolved(e, r) {
        n(function () {
          var t = e._V === 1 ? r.onFulfilled : r.onRejected
          if (t === null) {
            if (e._V === 1) {
              resolve(r.promise, e._W)
            } else {
              reject(r.promise, e._W)
            }
            return
          }
          var n = tryCallOne(t, e._W)
          if (n === i) {
            reject(r.promise, o)
          } else {
            resolve(r.promise, n)
          }
        })
      }
      function resolve(e, r) {
        if (r === e) {
          return reject(
            e,
            new TypeError('A promise cannot be resolved with itself.')
          )
        }
        if (r && (typeof r === 'object' || typeof r === 'function')) {
          var t = getThen(r)
          if (t === i) {
            return reject(e, o)
          }
          if (t === e.then && r instanceof Promise) {
            e._V = 3
            e._W = r
            finale(e)
            return
          } else if (typeof t === 'function') {
            doResolve(t.bind(r), e)
            return
          }
        }
        e._V = 1
        e._W = r
        finale(e)
      }
      function reject(e, r) {
        e._V = 2
        e._W = r
        if (Promise._Z) {
          Promise._Z(e, r)
        }
        finale(e)
      }
      function finale(e) {
        if (e._U === 1) {
          handle(e, e._X)
          e._X = null
        }
        if (e._U === 2) {
          for (var r = 0; r < e._X.length; r++) {
            handle(e, e._X[r])
          }
          e._X = null
        }
      }
      function Handler(e, r, t) {
        this.onFulfilled = typeof e === 'function' ? e : null
        this.onRejected = typeof r === 'function' ? r : null
        this.promise = t
      }
      function doResolve(e, r) {
        var t = false
        var n = tryCallTwo(
          e,
          function (e) {
            if (t) return
            t = true
            resolve(r, e)
          },
          function (e) {
            if (t) return
            t = true
            reject(r, e)
          }
        )
        if (!t && n === i) {
          t = true
          reject(r, o)
        }
      }
    },
    427: (e, r, t) => {
      'use strict'
      var n = t(201)
      e.exports = n
      n.prototype.done = function (e, r) {
        var t = arguments.length ? this.then.apply(this, arguments) : this
        t.then(null, function (e) {
          setTimeout(function () {
            throw e
          }, 0)
        })
      }
    },
    524: (e, r, t) => {
      'use strict'
      var n = t(201)
      e.exports = n
      var o = valuePromise(true)
      var i = valuePromise(false)
      var s = valuePromise(null)
      var a = valuePromise(undefined)
      var u = valuePromise(0)
      var l = valuePromise('')
      function valuePromise(e) {
        var r = new n(n._0)
        r._V = 1
        r._W = e
        return r
      }
      n.resolve = function (e) {
        if (e instanceof n) return e
        if (e === null) return s
        if (e === undefined) return a
        if (e === true) return o
        if (e === false) return i
        if (e === 0) return u
        if (e === '') return l
        if (typeof e === 'object' || typeof e === 'function') {
          try {
            var r = e.then
            if (typeof r === 'function') {
              return new n(r.bind(e))
            }
          } catch (e) {
            return new n(function (r, t) {
              t(e)
            })
          }
        }
        return valuePromise(e)
      }
      var iterableToArray = function (e) {
        if (typeof Array.from === 'function') {
          iterableToArray = Array.from
          return Array.from(e)
        }
        iterableToArray = function (e) {
          return Array.prototype.slice.call(e)
        }
        return Array.prototype.slice.call(e)
      }
      n.all = function (e) {
        var r = iterableToArray(e)
        return new n(function (e, t) {
          if (r.length === 0) return e([])
          var o = r.length
          function res(i, s) {
            if (s && (typeof s === 'object' || typeof s === 'function')) {
              if (s instanceof n && s.then === n.prototype.then) {
                while (s._V === 3) {
                  s = s._W
                }
                if (s._V === 1) return res(i, s._W)
                if (s._V === 2) t(s._W)
                s.then(function (e) {
                  res(i, e)
                }, t)
                return
              } else {
                var a = s.then
                if (typeof a === 'function') {
                  var u = new n(a.bind(s))
                  u.then(function (e) {
                    res(i, e)
                  }, t)
                  return
                }
              }
            }
            r[i] = s
            if (--o === 0) {
              e(r)
            }
          }
          for (var i = 0; i < r.length; i++) {
            res(i, r[i])
          }
        })
      }
      n.reject = function (e) {
        return new n(function (r, t) {
          t(e)
        })
      }
      n.race = function (e) {
        return new n(function (r, t) {
          iterableToArray(e).forEach(function (e) {
            n.resolve(e).then(r, t)
          })
        })
      }
      n.prototype['catch'] = function (e) {
        return this.then(null, e)
      }
    },
    420: (e, r, t) => {
      'use strict'
      var n = t(201)
      e.exports = n
      n.prototype.finally = function (e) {
        return this.then(
          function (r) {
            return n.resolve(e()).then(function () {
              return r
            })
          },
          function (r) {
            return n.resolve(e()).then(function () {
              throw r
            })
          }
        )
      }
    },
    554: (e, r, t) => {
      'use strict'
      e.exports = t(201)
      t(427)
      t(420)
      t(524)
      t(604)
      t(163)
    },
    604: (e, r, t) => {
      'use strict'
      var n = t(201)
      var o = t(873)
      e.exports = n
      n.denodeify = function (e, r) {
        if (typeof r === 'number' && r !== Infinity) {
          return denodeifyWithCount(e, r)
        } else {
          return denodeifyWithoutCount(e)
        }
      }
      var i =
        'function (err, res) {' +
        'if (err) { rj(err); } else { rs(res); }' +
        '}'
      function denodeifyWithCount(e, r) {
        var t = []
        for (var o = 0; o < r; o++) {
          t.push('a' + o)
        }
        var s = [
          'return function (' + t.join(',') + ') {',
          'var self = this;',
          'return new Promise(function (rs, rj) {',
          'var res = fn.call(',
          ['self'].concat(t).concat([i]).join(','),
          ');',
          'if (res &&',
          '(typeof res === "object" || typeof res === "function") &&',
          'typeof res.then === "function"',
          ') {rs(res);}',
          '});',
          '};',
        ].join('')
        return Function(['Promise', 'fn'], s)(n, e)
      }
      function denodeifyWithoutCount(e) {
        var r = Math.max(e.length - 1, 3)
        var t = []
        for (var o = 0; o < r; o++) {
          t.push('a' + o)
        }
        var s = [
          'return function (' + t.join(',') + ') {',
          'var self = this;',
          'var args;',
          'var argLength = arguments.length;',
          'if (arguments.length > ' + r + ') {',
          'args = new Array(arguments.length + 1);',
          'for (var i = 0; i < arguments.length; i++) {',
          'args[i] = arguments[i];',
          '}',
          '}',
          'return new Promise(function (rs, rj) {',
          'var cb = ' + i + ';',
          'var res;',
          'switch (argLength) {',
          t
            .concat(['extra'])
            .map(function (e, r) {
              return (
                'case ' +
                r +
                ':' +
                'res = fn.call(' +
                ['self'].concat(t.slice(0, r)).concat('cb').join(',') +
                ');' +
                'break;'
              )
            })
            .join(''),
          'default:',
          'args[argLength] = cb;',
          'res = fn.apply(self, args);',
          '}',
          'if (res &&',
          '(typeof res === "object" || typeof res === "function") &&',
          'typeof res.then === "function"',
          ') {rs(res);}',
          '});',
          '};',
        ].join('')
        return Function(['Promise', 'fn'], s)(n, e)
      }
      n.nodeify = function (e) {
        return function () {
          var r = Array.prototype.slice.call(arguments)
          var t = typeof r[r.length - 1] === 'function' ? r.pop() : null
          var i = this
          try {
            return e.apply(this, arguments).nodeify(t, i)
          } catch (e) {
            if (t === null || typeof t == 'undefined') {
              return new n(function (r, t) {
                t(e)
              })
            } else {
              o(function () {
                t.call(i, e)
              })
            }
          }
        }
      }
      n.prototype.nodeify = function (e, r) {
        if (typeof e != 'function') return this
        this.then(
          function (t) {
            o(function () {
              e.call(r, null, t)
            })
          },
          function (t) {
            o(function () {
              e.call(r, t)
            })
          }
        )
      }
    },
    163: (e, r, t) => {
      'use strict'
      var n = t(201)
      e.exports = n
      n.enableSynchronous = function () {
        n.prototype.isPending = function () {
          return this.getState() == 0
        }
        n.prototype.isFulfilled = function () {
          return this.getState() == 1
        }
        n.prototype.isRejected = function () {
          return this.getState() == 2
        }
        n.prototype.getValue = function () {
          if (this._V === 3) {
            return this._W.getValue()
          }
          if (!this.isFulfilled()) {
            throw new Error('Cannot get a value of an unfulfilled promise.')
          }
          return this._W
        }
        n.prototype.getReason = function () {
          if (this._V === 3) {
            return this._W.getReason()
          }
          if (!this.isRejected()) {
            throw new Error(
              'Cannot get a rejection reason of a non-rejected promise.'
            )
          }
          return this._W
        }
        n.prototype.getState = function () {
          if (this._V === 3) {
            return this._W.getState()
          }
          if (this._V === -1 || this._V === -2) {
            return 0
          }
          return this._V
        }
      }
      n.disableSynchronous = function () {
        n.prototype.isPending = undefined
        n.prototype.isFulfilled = undefined
        n.prototype.isRejected = undefined
        n.prototype.getValue = undefined
        n.prototype.getReason = undefined
        n.prototype.getState = undefined
      }
    },
    675: (e) => {
      'use strict'
      e.exports = require('../commander')
    },
    639: (e) => {
      'use strict'
      e.exports = require('domain')
    },
    147: (e) => {
      'use strict'
      e.exports = require('fs')
    },
    685: (e) => {
      'use strict'
      e.exports = require('http')
    },
    687: (e) => {
      'use strict'
      e.exports = require('https')
    },
    37: (e) => {
      'use strict'
      e.exports = require('os')
    },
    17: (e) => {
      'use strict'
      e.exports = require('path')
    },
    477: (e) => {
      'use strict'
      e.exports = require('querystring')
    },
    310: (e) => {
      'use strict'
      e.exports = require('url')
    },
    837: (e) => {
      'use strict'
      e.exports = require('util')
    },
    144: (e) => {
      'use strict'
      e.exports = require('vm')
    },
  }
  var r = {}
  function __nccwpck_require__(t) {
    var n = r[t]
    if (n !== undefined) {
      return n.exports
    }
    var o = (r[t] = { exports: {} })
    var i = true
    try {
      e[t](o, o.exports, __nccwpck_require__)
      i = false
    } finally {
      if (i) delete r[t]
    }
    return o.exports
  }
  if (typeof __nccwpck_require__ !== 'undefined')
    __nccwpck_require__.ab = __dirname + '/'
  var t = {}
  ;(() => {
    'use strict'
    var e = t
    /**
     * @license
     * Copyright 2016 The AMP HTML Authors. All Rights Reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *      http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS-IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the license.
     */ const r = __nccwpck_require__(915)
    const n = __nccwpck_require__(147)
    const o = __nccwpck_require__(685)
    const i = __nccwpck_require__(687)
    const s = __nccwpck_require__(17)
    const a = __nccwpck_require__(675)
    const u = __nccwpck_require__(263)
    const l = __nccwpck_require__(477)
    const c = __nccwpck_require__(310)
    const f = __nccwpck_require__(837)
    const p = __nccwpck_require__(144)
    const d = 'amphtml-validator'
    function hasPrefix(e, r) {
      return e.indexOf(r) == 0
    }
    function isHttpOrHttpsUrl(e) {
      return hasPrefix(e, 'http://') || hasPrefix(e, 'https://')
    }
    function readFromFile(e) {
      return new u(function (r, t) {
        n.readFile(e, 'utf8', function (e, n) {
          if (e) {
            t(e)
          } else {
            r(n.trim())
          }
        })
      })
    }
    function readFromReadable(e, r) {
      return new u(function (t, n) {
        const o = []
        r.setEncoding('utf8')
        r.on('data', function (e) {
          o.push(e)
        })
        r.on('end', function () {
          t(o.join(''))
        })
        r.on('error', function (r) {
          n(new Error('Could not read from ' + e + ' - ' + r.message))
        })
      })
    }
    function readFromStdin() {
      return readFromReadable('stdin', process.stdin).then(function (e) {
        process.stdin.resume()
        return e
      })
    }
    function readFromUrl(e, r) {
      return new u(function (t, n) {
        const s = hasPrefix(e, 'http://') ? o : i
        const a = s.request(e, function (r) {
          if (r.statusCode !== 200) {
            r.resume()
            n(
              new Error(
                'Unable to fetch ' + e + ' - HTTP Status ' + r.statusCode
              )
            )
          } else {
            t(r)
          }
        })
        a.setHeader('User-Agent', r)
        a.on('error', function (r) {
          n(new Error('Unable to fetch ' + e + ' - ' + r.message))
        })
        a.end()
      }).then(readFromReadable.bind(null, e))
    }
    function ValidationResult() {
      this.status = 'UNKNOWN'
      this.errors = []
    }
    function ValidationError() {
      this.severity = 'UNKNOWN_SEVERITY'
      this.line = 1
      this.col = 0
      this.message = ''
      this.specUrl = null
      this.code = 'UNKNOWN_CODE'
      this.params = []
    }
    function Validator(e) {
      this.sandbox = p.createContext()
      try {
        new p.Script(e).runInContext(this.sandbox)
      } catch (e) {
        throw new Error(
          'Could not instantiate validator_wasm.js - ' + e.message
        )
      }
    }
    Validator.prototype.init = function () {
      if (this.sandbox.amp.validator.init) {
        return this.sandbox.amp.validator.init()
      } else {
        return u.resolve(undefined)
      }
    }
    Validator.prototype.validateString = function (e, r) {
      const t = this.sandbox.amp.validator.validateString(e, r)
      const n = new ValidationResult()
      n.status = t.status
      for (let e = 0; e < t.errors.length; e++) {
        const r = t.errors[e]
        const o = new ValidationError()
        o.severity = r.severity
        o.line = r.line
        o.col = r.col
        o.message = this.sandbox.amp.validator.renderErrorMessage(r)
        o.specUrl = r.specUrl
        o.code = r.code
        o.params = r.params
        n.errors.push(o)
      }
      return n
    }
    const h = {}
    function getInstance(e, r) {
      const t = e || 'https://cdn.ampproject.org/v0/validator_wasm.js'
      const n = r || d
      if (h.hasOwnProperty(t)) {
        return u.resolve(h[t])
      }
      const o = isHttpOrHttpsUrl(t) ? readFromUrl(t, n) : readFromFile(t)
      return o
        .then(function (e) {
          let r
          try {
            r = new Validator(e)
          } catch (e) {
            throw e
          }
          h[t] = r
          return r
        })
        .then(function (e) {
          return e.init().then(() => e)
        })
    }
    e.getInstance = getInstance
    function newInstance(e) {
      return new Validator(e)
    }
    e.newInstance = newInstance
    function logValidationResult(e, t, n) {
      if (t.status === 'PASS') {
        process.stdout.write(e + ': ' + (n ? r.green('PASS') : 'PASS') + '\n')
      }
      for (let o = 0; o < t.errors.length; o++) {
        const i = t.errors[o]
        let s = e + ':' + i.line + ':' + i.col + ' '
        if (n) {
          s += (i.severity === 'ERROR' ? r.red : r.magenta)(i.message)
        } else {
          s += i.message
        }
        if (i.specUrl) {
          s += ' (see ' + i.specUrl + ')'
        }
        process.stderr.write(s + '\n')
      }
    }
    function main() {
      a.usage(
        '[options] <fileOrUrlOrMinus...>\n\n' +
          '  Validates the files or urls provided as arguments. If "-" is\n' +
          '  specified, reads from stdin instead.'
      )
        .option(
          '--validator_js <fileOrUrl>',
          'The Validator Javascript.\n' +
            '  Latest published version by default, or\n' +
            '  dist/validator_minified.js (built with build.py)\n' +
            '  for development.',
          'https://cdn.ampproject.org/v0/validator_wasm.js'
        )
        .option(
          '--user-agent <userAgent>',
          'User agent string to use in requests.',
          d
        )
        .option(
          '--html_format <AMP|AMP4ADS|AMP4EMAIL>',
          'The input format to be validated.\n' + '  AMP by default.',
          'AMP'
        )
        .option(
          '--format <color|text|json>',
          'How to format the output.\n' +
            '  "color" displays errors/warnings/success in\n' +
            '          red/orange/green.\n' +
            '  "text"  avoids color (e.g., useful in terminals not\n' +
            '          supporting color).\n' +
            '  "json"  emits json corresponding to the ValidationResult\n' +
            '          message in validator.proto.',
          'color'
        )
        .parse(process.argv)
      const e = a.opts()
      if (e.length === 0) {
        a.outputHelp()
        process.exit(1)
      }
      if (
        e.html_format !== 'AMP' &&
        e.html_format !== 'AMP4ADS' &&
        e.html_format !== 'AMP4EMAIL'
      ) {
        process.stderr.write(
          '--html_format must be set to "AMP", "AMP4ADS", or "AMP4EMAIL".\n',
          function () {
            process.exit(1)
          }
        )
      }
      if (e.format !== 'color' && e.format !== 'text' && e.format !== 'json') {
        process.stderr.write(
          '--format must be set to "color", "text", or "json".\n',
          function () {
            process.exit(1)
          }
        )
      }
      const t = []
      for (let r = 0; r < a.args.length; r++) {
        const n = a.args[r]
        if (n === '-') {
          t.push(readFromStdin())
        } else if (isHttpOrHttpsUrl(n)) {
          t.push(readFromUrl(n, e.userAgent))
        } else {
          t.push(readFromFile(n))
        }
      }
      getInstance(e.validator_js, e.userAgent)
        .then(function (n) {
          u.all(t)
            .then(function (r) {
              const t = {}
              let o = false
              for (let i = 0; i < r.length; i++) {
                const s = n.validateString(r[i], e.html_format)
                if (e.format === 'json') {
                  t[a.args[i]] = s
                } else {
                  logValidationResult(
                    a.args[i],
                    s,
                    e.format === 'color' ? true : false
                  )
                }
                if (s.status !== 'PASS') {
                  o = true
                }
              }
              if (e.format === 'json') {
                process.stdout.write(JSON.stringify(t) + '\n', function () {
                  process.exit(o ? 1 : 0)
                })
              } else if (o) {
                process.stderr.write('', function () {
                  process.exit(1)
                })
              } else {
                process.stdout.write('', function () {
                  process.exit(0)
                })
              }
            })
            .catch(function (t) {
              process.stderr.write(
                (e.format == 'color' ? r.red(t.message) : t.message) + '\n',
                function () {
                  process.exit(1)
                }
              )
            })
        })
        .catch(function (t) {
          process.stderr.write(
            (e.format == 'color' ? r.red(t.message) : t.message) + '\n',
            function () {
              process.exit(1)
            }
          )
        })
    }
    e.main = main
  })()
  module.exports = t
})()
