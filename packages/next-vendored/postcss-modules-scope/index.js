;(() => {
  var e = {
    441: (e) => {
      'use strict'
      /*! https://mths.be/cssesc v3.0.0 by @mathias */ var t = {}
      var r = t.hasOwnProperty
      var n = function merge(e, t) {
        if (!e) {
          return t
        }
        var n = {}
        for (var i in t) {
          n[i] = r.call(e, i) ? e[i] : t[i]
        }
        return n
      }
      var i = /[ -,\.\/:-@\[-\^`\{-~]/
      var s = /[ -,\.\/:-@\[\]\^`\{-~]/
      var o = /['"\\]/
      var a = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g
      var u = function cssesc(e, t) {
        t = n(t, cssesc.options)
        if (t.quotes != 'single' && t.quotes != 'double') {
          t.quotes = 'single'
        }
        var r = t.quotes == 'double' ? '"' : "'"
        var o = t.isIdentifier
        var u = e.charAt(0)
        var c = ''
        var f = 0
        var l = e.length
        while (f < l) {
          var p = e.charAt(f++)
          var h = p.charCodeAt()
          var d = void 0
          if (h < 32 || h > 126) {
            if (h >= 55296 && h <= 56319 && f < l) {
              var v = e.charCodeAt(f++)
              if ((v & 64512) == 56320) {
                h = ((h & 1023) << 10) + (v & 1023) + 65536
              } else {
                f--
              }
            }
            d = '\\' + h.toString(16).toUpperCase() + ' '
          } else {
            if (t.escapeEverything) {
              if (i.test(p)) {
                d = '\\' + p
              } else {
                d = '\\' + h.toString(16).toUpperCase() + ' '
              }
            } else if (/[\t\n\f\r\x0B]/.test(p)) {
              d = '\\' + h.toString(16).toUpperCase() + ' '
            } else if (
              p == '\\' ||
              (!o && ((p == '"' && r == p) || (p == "'" && r == p))) ||
              (o && s.test(p))
            ) {
              d = '\\' + p
            } else {
              d = p
            }
          }
          c += d
        }
        if (o) {
          if (/^-[-\d]/.test(c)) {
            c = '\\-' + c.slice(1)
          } else if (/\d/.test(u)) {
            c = '\\3' + u + ' ' + c.slice(1)
          }
        }
        c = c.replace(a, function (e, t, r) {
          if (t && t.length % 2) {
            return e
          }
          return (t || '') + r
        })
        if (!o && t.wrap) {
          return r + c + r
        }
        return c
      }
      u.options = {
        escapeEverything: false,
        isIdentifier: false,
        quotes: 'single',
        wrap: false,
      }
      u.version = '3.0.0'
      e.exports = u
    },
    361: (e, t, r) => {
      'use strict'
      const n = r(235)
      const i = Object.prototype.hasOwnProperty
      function getSingleLocalNamesForComposes(e) {
        return e.nodes.map((t) => {
          if (t.type !== 'selector' || t.nodes.length !== 1) {
            throw new Error(
              `composition is only allowed when selector is single :local class name not in "${e}"`
            )
          }
          t = t.nodes[0]
          if (
            t.type !== 'pseudo' ||
            t.value !== ':local' ||
            t.nodes.length !== 1
          ) {
            throw new Error(
              'composition is only allowed when selector is single :local class name not in "' +
                e +
                '", "' +
                t +
                '" is weird'
            )
          }
          t = t.first
          if (t.type !== 'selector' || t.length !== 1) {
            throw new Error(
              'composition is only allowed when selector is single :local class name not in "' +
                e +
                '", "' +
                t +
                '" is weird'
            )
          }
          t = t.first
          if (t.type !== 'class') {
            throw new Error(
              'composition is only allowed when selector is single :local class name not in "' +
                e +
                '", "' +
                t +
                '" is weird'
            )
          }
          return t.value
        })
      }
      const s = '[\\x20\\t\\r\\n\\f]'
      const o = new RegExp('\\\\([\\da-f]{1,6}' + s + '?|(' + s + ')|.)', 'ig')
      function unescape(e) {
        return e.replace(o, (e, t, r) => {
          const n = '0x' + t - 65536
          return n !== n || r
            ? t
            : n < 0
            ? String.fromCharCode(n + 65536)
            : String.fromCharCode((n >> 10) | 55296, (n & 1023) | 56320)
        })
      }
      const plugin = (e = {}) => {
        const t = (e && e.generateScopedName) || plugin.generateScopedName
        const r = (e && e.generateExportEntry) || plugin.generateExportEntry
        const s = e && e.exportGlobals
        return {
          postcssPlugin: 'postcss-modules-scope',
          Once(e, { rule: o }) {
            const a = Object.create(null)
            function exportScopedName(n, i) {
              const s = t(i ? i : n, e.source.input.from, e.source.input.css)
              const o = r(i ? i : n, s, e.source.input.from, e.source.input.css)
              const { key: u, value: c } = o
              a[u] = a[u] || []
              if (a[u].indexOf(c) < 0) {
                a[u].push(c)
              }
              return s
            }
            function localizeNode(e) {
              switch (e.type) {
                case 'selector':
                  e.nodes = e.map(localizeNode)
                  return e
                case 'class':
                  return n.className({
                    value: exportScopedName(
                      e.value,
                      e.raws && e.raws.value ? e.raws.value : null
                    ),
                  })
                case 'id': {
                  return n.id({
                    value: exportScopedName(
                      e.value,
                      e.raws && e.raws.value ? e.raws.value : null
                    ),
                  })
                }
              }
              throw new Error(
                `${e.type} ("${e}") is not allowed in a :local block`
              )
            }
            function traverseNode(e) {
              switch (e.type) {
                case 'pseudo':
                  if (e.value === ':local') {
                    if (e.nodes.length !== 1) {
                      throw new Error('Unexpected comma (",") in :local block')
                    }
                    const t = localizeNode(e.first, e.spaces)
                    t.first.spaces = e.spaces
                    const r = e.next()
                    if (
                      r &&
                      r.type === 'combinator' &&
                      r.value === ' ' &&
                      /\\[A-F0-9]{1,6}$/.test(t.last.value)
                    ) {
                      t.last.spaces.after = ' '
                    }
                    e.replaceWith(t)
                    return
                  }
                case 'root':
                case 'selector': {
                  e.each(traverseNode)
                  break
                }
                case 'id':
                case 'class':
                  if (s) {
                    a[e.value] = [e.value]
                  }
                  break
              }
              return e
            }
            const u = {}
            e.walkRules(/^:import\(.+\)$/, (e) => {
              e.walkDecls((e) => {
                u[e.prop] = true
              })
            })
            e.walkRules((e) => {
              let t = n().astSync(e)
              e.selector = traverseNode(t.clone()).toString()
              e.walkDecls(/composes|compose-with/i, (e) => {
                const r = getSingleLocalNamesForComposes(t)
                const n = e.value.split(/\s+/)
                n.forEach((t) => {
                  const n = /^global\(([^)]+)\)$/.exec(t)
                  if (n) {
                    r.forEach((e) => {
                      a[e].push(n[1])
                    })
                  } else if (i.call(u, t)) {
                    r.forEach((e) => {
                      a[e].push(t)
                    })
                  } else if (i.call(a, t)) {
                    r.forEach((e) => {
                      a[t].forEach((t) => {
                        a[e].push(t)
                      })
                    })
                  } else {
                    throw e.error(
                      `referenced class name "${t}" in ${e.prop} not found`
                    )
                  }
                })
                e.remove()
              })
              e.walkDecls((e) => {
                if (!/:local\s*\((.+?)\)/.test(e.value)) {
                  return
                }
                let t = e.value.split(/(,|'[^']*'|"[^"]*")/)
                t = t.map((e, r) => {
                  if (r === 0 || t[r - 1] === ',') {
                    let t = e
                    const r = /:local\s*\((.+?)\)/.exec(e)
                    if (r) {
                      const e = r.input
                      const n = r[0]
                      const i = r[1]
                      const s = exportScopedName(i)
                      t = e.replace(n, s)
                    } else {
                      return e
                    }
                    return t
                  } else {
                    return e
                  }
                })
                e.value = t.join('')
              })
            })
            e.walkAtRules(/keyframes$/i, (e) => {
              const t = /^\s*:local\s*\((.+?)\)\s*$/.exec(e.params)
              if (!t) {
                return
              }
              e.params = exportScopedName(t[1])
            })
            const c = Object.keys(a)
            if (c.length > 0) {
              const t = o({ selector: ':export' })
              c.forEach((e) =>
                t.append({
                  prop: e,
                  value: a[e].join(' '),
                  raws: { before: '\n  ' },
                })
              )
              e.append(t)
            }
          },
        }
      }
      plugin.postcss = true
      plugin.generateScopedName = function (e, t) {
        const r = t
          .replace(/\.[^./\\]+$/, '')
          .replace(/[\W_]+/g, '_')
          .replace(/^_|_$/g, '')
        return `_${r}__${e}`.trim()
      }
      plugin.generateExportEntry = function (e, t) {
        return { key: unescape(e), value: unescape(t) }
      }
      e.exports = plugin
    },
    235: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(528))
      var i = _interopRequireWildcard(r(110))
      function _getRequireWildcardCache() {
        if (typeof WeakMap !== 'function') return null
        var e = new WeakMap()
        _getRequireWildcardCache = function _getRequireWildcardCache() {
          return e
        }
        return e
      }
      function _interopRequireWildcard(e) {
        if (e && e.__esModule) {
          return e
        }
        if (e === null || (typeof e !== 'object' && typeof e !== 'function')) {
          return { default: e }
        }
        var t = _getRequireWildcardCache()
        if (t && t.has(e)) {
          return t.get(e)
        }
        var r = {}
        var n = Object.defineProperty && Object.getOwnPropertyDescriptor
        for (var i in e) {
          if (Object.prototype.hasOwnProperty.call(e, i)) {
            var s = n ? Object.getOwnPropertyDescriptor(e, i) : null
            if (s && (s.get || s.set)) {
              Object.defineProperty(r, i, s)
            } else {
              r[i] = e[i]
            }
          }
        }
        r['default'] = e
        if (t) {
          t.set(e, r)
        }
        return r
      }
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      var s = function parser(e) {
        return new n['default'](e)
      }
      Object.assign(s, i)
      delete s.__esModule
      var o = s
      t['default'] = o
      e.exports = t.default
    },
    305: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(422))
      var i = _interopRequireDefault(r(13))
      var s = _interopRequireDefault(r(870))
      var o = _interopRequireDefault(r(47))
      var a = _interopRequireDefault(r(393))
      var u = _interopRequireDefault(r(443))
      var c = _interopRequireDefault(r(435))
      var f = _interopRequireDefault(r(326))
      var l = _interopRequireWildcard(r(248))
      var p = _interopRequireDefault(r(165))
      var h = _interopRequireDefault(r(537))
      var d = _interopRequireDefault(r(60))
      var v = _interopRequireDefault(r(173))
      var _ = _interopRequireWildcard(r(133))
      var y = _interopRequireWildcard(r(553))
      var g = _interopRequireWildcard(r(600))
      var S = r(513)
      var b, w
      function _getRequireWildcardCache() {
        if (typeof WeakMap !== 'function') return null
        var e = new WeakMap()
        _getRequireWildcardCache = function _getRequireWildcardCache() {
          return e
        }
        return e
      }
      function _interopRequireWildcard(e) {
        if (e && e.__esModule) {
          return e
        }
        if (e === null || (typeof e !== 'object' && typeof e !== 'function')) {
          return { default: e }
        }
        var t = _getRequireWildcardCache()
        if (t && t.has(e)) {
          return t.get(e)
        }
        var r = {}
        var n = Object.defineProperty && Object.getOwnPropertyDescriptor
        for (var i in e) {
          if (Object.prototype.hasOwnProperty.call(e, i)) {
            var s = n ? Object.getOwnPropertyDescriptor(e, i) : null
            if (s && (s.get || s.set)) {
              Object.defineProperty(r, i, s)
            } else {
              r[i] = e[i]
            }
          }
        }
        r['default'] = e
        if (t) {
          t.set(e, r)
        }
        return r
      }
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _defineProperties(e, t) {
        for (var r = 0; r < t.length; r++) {
          var n = t[r]
          n.enumerable = n.enumerable || false
          n.configurable = true
          if ('value' in n) n.writable = true
          Object.defineProperty(e, n.key, n)
        }
      }
      function _createClass(e, t, r) {
        if (t) _defineProperties(e.prototype, t)
        if (r) _defineProperties(e, r)
        return e
      }
      var T =
        ((b = {}),
        (b[y.space] = true),
        (b[y.cr] = true),
        (b[y.feed] = true),
        (b[y.newline] = true),
        (b[y.tab] = true),
        b)
      var m = Object.assign({}, T, ((w = {}), (w[y.comment] = true), w))
      function tokenStart(e) {
        return { line: e[_.FIELDS.START_LINE], column: e[_.FIELDS.START_COL] }
      }
      function tokenEnd(e) {
        return { line: e[_.FIELDS.END_LINE], column: e[_.FIELDS.END_COL] }
      }
      function getSource(e, t, r, n) {
        return { start: { line: e, column: t }, end: { line: r, column: n } }
      }
      function getTokenSource(e) {
        return getSource(
          e[_.FIELDS.START_LINE],
          e[_.FIELDS.START_COL],
          e[_.FIELDS.END_LINE],
          e[_.FIELDS.END_COL]
        )
      }
      function getTokenSourceSpan(e, t) {
        if (!e) {
          return undefined
        }
        return getSource(
          e[_.FIELDS.START_LINE],
          e[_.FIELDS.START_COL],
          t[_.FIELDS.END_LINE],
          t[_.FIELDS.END_COL]
        )
      }
      function unescapeProp(e, t) {
        var r = e[t]
        if (typeof r !== 'string') {
          return
        }
        if (r.indexOf('\\') !== -1) {
          ;(0, S.ensureObject)(e, 'raws')
          e[t] = (0, S.unesc)(r)
          if (e.raws[t] === undefined) {
            e.raws[t] = r
          }
        }
        return e
      }
      function indexesOf(e, t) {
        var r = -1
        var n = []
        while ((r = e.indexOf(t, r + 1)) !== -1) {
          n.push(r)
        }
        return n
      }
      function uniqs() {
        var e = Array.prototype.concat.apply([], arguments)
        return e.filter(function (t, r) {
          return r === e.indexOf(t)
        })
      }
      var O = (function () {
        function Parser(e, t) {
          if (t === void 0) {
            t = {}
          }
          this.rule = e
          this.options = Object.assign({ lossy: false, safe: false }, t)
          this.position = 0
          this.css =
            typeof this.rule === 'string' ? this.rule : this.rule.selector
          this.tokens = (0, _['default'])({
            css: this.css,
            error: this._errorGenerator(),
            safe: this.options.safe,
          })
          var r = getTokenSourceSpan(
            this.tokens[0],
            this.tokens[this.tokens.length - 1]
          )
          this.root = new n['default']({ source: r })
          this.root.errorGenerator = this._errorGenerator()
          var s = new i['default']({
            source: { start: { line: 1, column: 1 } },
          })
          this.root.append(s)
          this.current = s
          this.loop()
        }
        var e = Parser.prototype
        e._errorGenerator = function _errorGenerator() {
          var e = this
          return function (t, r) {
            if (typeof e.rule === 'string') {
              return new Error(t)
            }
            return e.rule.error(t, r)
          }
        }
        e.attribute = function attribute() {
          var e = []
          var t = this.currToken
          this.position++
          while (
            this.position < this.tokens.length &&
            this.currToken[_.FIELDS.TYPE] !== y.closeSquare
          ) {
            e.push(this.currToken)
            this.position++
          }
          if (this.currToken[_.FIELDS.TYPE] !== y.closeSquare) {
            return this.expected(
              'closing square bracket',
              this.currToken[_.FIELDS.START_POS]
            )
          }
          var r = e.length
          var n = {
            source: getSource(t[1], t[2], this.currToken[3], this.currToken[4]),
            sourceIndex: t[_.FIELDS.START_POS],
          }
          if (r === 1 && !~[y.word].indexOf(e[0][_.FIELDS.TYPE])) {
            return this.expected('attribute', e[0][_.FIELDS.START_POS])
          }
          var i = 0
          var s = ''
          var o = ''
          var a = null
          var u = false
          while (i < r) {
            var c = e[i]
            var f = this.content(c)
            var p = e[i + 1]
            switch (c[_.FIELDS.TYPE]) {
              case y.space:
                u = true
                if (this.options.lossy) {
                  break
                }
                if (a) {
                  ;(0, S.ensureObject)(n, 'spaces', a)
                  var h = n.spaces[a].after || ''
                  n.spaces[a].after = h + f
                  var d =
                    (0, S.getProp)(n, 'raws', 'spaces', a, 'after') || null
                  if (d) {
                    n.raws.spaces[a].after = d + f
                  }
                } else {
                  s = s + f
                  o = o + f
                }
                break
              case y.asterisk:
                if (p[_.FIELDS.TYPE] === y.equals) {
                  n.operator = f
                  a = 'operator'
                } else if ((!n.namespace || (a === 'namespace' && !u)) && p) {
                  if (s) {
                    ;(0, S.ensureObject)(n, 'spaces', 'attribute')
                    n.spaces.attribute.before = s
                    s = ''
                  }
                  if (o) {
                    ;(0, S.ensureObject)(n, 'raws', 'spaces', 'attribute')
                    n.raws.spaces.attribute.before = s
                    o = ''
                  }
                  n.namespace = (n.namespace || '') + f
                  var v = (0, S.getProp)(n, 'raws', 'namespace') || null
                  if (v) {
                    n.raws.namespace += f
                  }
                  a = 'namespace'
                }
                u = false
                break
              case y.dollar:
                if (a === 'value') {
                  var g = (0, S.getProp)(n, 'raws', 'value')
                  n.value += '$'
                  if (g) {
                    n.raws.value = g + '$'
                  }
                  break
                }
              case y.caret:
                if (p[_.FIELDS.TYPE] === y.equals) {
                  n.operator = f
                  a = 'operator'
                }
                u = false
                break
              case y.combinator:
                if (f === '~' && p[_.FIELDS.TYPE] === y.equals) {
                  n.operator = f
                  a = 'operator'
                }
                if (f !== '|') {
                  u = false
                  break
                }
                if (p[_.FIELDS.TYPE] === y.equals) {
                  n.operator = f
                  a = 'operator'
                } else if (!n.namespace && !n.attribute) {
                  n.namespace = true
                }
                u = false
                break
              case y.word:
                if (
                  p &&
                  this.content(p) === '|' &&
                  e[i + 2] &&
                  e[i + 2][_.FIELDS.TYPE] !== y.equals &&
                  !n.operator &&
                  !n.namespace
                ) {
                  n.namespace = f
                  a = 'namespace'
                } else if (!n.attribute || (a === 'attribute' && !u)) {
                  if (s) {
                    ;(0, S.ensureObject)(n, 'spaces', 'attribute')
                    n.spaces.attribute.before = s
                    s = ''
                  }
                  if (o) {
                    ;(0, S.ensureObject)(n, 'raws', 'spaces', 'attribute')
                    n.raws.spaces.attribute.before = o
                    o = ''
                  }
                  n.attribute = (n.attribute || '') + f
                  var b = (0, S.getProp)(n, 'raws', 'attribute') || null
                  if (b) {
                    n.raws.attribute += f
                  }
                  a = 'attribute'
                } else if (
                  (!n.value && n.value !== '') ||
                  (a === 'value' && !(u || n.quoteMark))
                ) {
                  var w = (0, S.unesc)(f)
                  var T = (0, S.getProp)(n, 'raws', 'value') || ''
                  var m = n.value || ''
                  n.value = m + w
                  n.quoteMark = null
                  if (w !== f || T) {
                    ;(0, S.ensureObject)(n, 'raws')
                    n.raws.value = (T || m) + f
                  }
                  a = 'value'
                } else {
                  var O = f === 'i' || f === 'I'
                  if ((n.value || n.value === '') && (n.quoteMark || u)) {
                    n.insensitive = O
                    if (!O || f === 'I') {
                      ;(0, S.ensureObject)(n, 'raws')
                      n.raws.insensitiveFlag = f
                    }
                    a = 'insensitive'
                    if (s) {
                      ;(0, S.ensureObject)(n, 'spaces', 'insensitive')
                      n.spaces.insensitive.before = s
                      s = ''
                    }
                    if (o) {
                      ;(0, S.ensureObject)(n, 'raws', 'spaces', 'insensitive')
                      n.raws.spaces.insensitive.before = o
                      o = ''
                    }
                  } else if (n.value || n.value === '') {
                    a = 'value'
                    n.value += f
                    if (n.raws.value) {
                      n.raws.value += f
                    }
                  }
                }
                u = false
                break
              case y.str:
                if (!n.attribute || !n.operator) {
                  return this.error(
                    'Expected an attribute followed by an operator preceding the string.',
                    { index: c[_.FIELDS.START_POS] }
                  )
                }
                var k = (0, l.unescapeValue)(f),
                  P = k.unescaped,
                  E = k.quoteMark
                n.value = P
                n.quoteMark = E
                a = 'value'
                ;(0, S.ensureObject)(n, 'raws')
                n.raws.value = f
                u = false
                break
              case y.equals:
                if (!n.attribute) {
                  return this.expected('attribute', c[_.FIELDS.START_POS], f)
                }
                if (n.value) {
                  return this.error(
                    'Unexpected "=" found; an operator was already defined.',
                    { index: c[_.FIELDS.START_POS] }
                  )
                }
                n.operator = n.operator ? n.operator + f : f
                a = 'operator'
                u = false
                break
              case y.comment:
                if (a) {
                  if (
                    u ||
                    (p && p[_.FIELDS.TYPE] === y.space) ||
                    a === 'insensitive'
                  ) {
                    var D = (0, S.getProp)(n, 'spaces', a, 'after') || ''
                    var q = (0, S.getProp)(n, 'raws', 'spaces', a, 'after') || D
                    ;(0, S.ensureObject)(n, 'raws', 'spaces', a)
                    n.raws.spaces[a].after = q + f
                  } else {
                    var L = n[a] || ''
                    var R = (0, S.getProp)(n, 'raws', a) || L
                    ;(0, S.ensureObject)(n, 'raws')
                    n.raws[a] = R + f
                  }
                } else {
                  o = o + f
                }
                break
              default:
                return this.error('Unexpected "' + f + '" found.', {
                  index: c[_.FIELDS.START_POS],
                })
            }
            i++
          }
          unescapeProp(n, 'attribute')
          unescapeProp(n, 'namespace')
          this.newNode(new l['default'](n))
          this.position++
        }
        e.parseWhitespaceEquivalentTokens =
          function parseWhitespaceEquivalentTokens(e) {
            if (e < 0) {
              e = this.tokens.length
            }
            var t = this.position
            var r = []
            var n = ''
            var i = undefined
            do {
              if (T[this.currToken[_.FIELDS.TYPE]]) {
                if (!this.options.lossy) {
                  n += this.content()
                }
              } else if (this.currToken[_.FIELDS.TYPE] === y.comment) {
                var s = {}
                if (n) {
                  s.before = n
                  n = ''
                }
                i = new o['default']({
                  value: this.content(),
                  source: getTokenSource(this.currToken),
                  sourceIndex: this.currToken[_.FIELDS.START_POS],
                  spaces: s,
                })
                r.push(i)
              }
            } while (++this.position < e)
            if (n) {
              if (i) {
                i.spaces.after = n
              } else if (!this.options.lossy) {
                var a = this.tokens[t]
                var u = this.tokens[this.position - 1]
                r.push(
                  new c['default']({
                    value: '',
                    source: getSource(
                      a[_.FIELDS.START_LINE],
                      a[_.FIELDS.START_COL],
                      u[_.FIELDS.END_LINE],
                      u[_.FIELDS.END_COL]
                    ),
                    sourceIndex: a[_.FIELDS.START_POS],
                    spaces: { before: n, after: '' },
                  })
                )
              }
            }
            return r
          }
        e.convertWhitespaceNodesToSpace =
          function convertWhitespaceNodesToSpace(e, t) {
            var r = this
            if (t === void 0) {
              t = false
            }
            var n = ''
            var i = ''
            e.forEach(function (e) {
              var s = r.lossySpace(e.spaces.before, t)
              var o = r.lossySpace(e.rawSpaceBefore, t)
              n += s + r.lossySpace(e.spaces.after, t && s.length === 0)
              i +=
                s + e.value + r.lossySpace(e.rawSpaceAfter, t && o.length === 0)
            })
            if (i === n) {
              i = undefined
            }
            var s = { space: n, rawSpace: i }
            return s
          }
        e.isNamedCombinator = function isNamedCombinator(e) {
          if (e === void 0) {
            e = this.position
          }
          return (
            this.tokens[e + 0] &&
            this.tokens[e + 0][_.FIELDS.TYPE] === y.slash &&
            this.tokens[e + 1] &&
            this.tokens[e + 1][_.FIELDS.TYPE] === y.word &&
            this.tokens[e + 2] &&
            this.tokens[e + 2][_.FIELDS.TYPE] === y.slash
          )
        }
        e.namedCombinator = function namedCombinator() {
          if (this.isNamedCombinator()) {
            var e = this.content(this.tokens[this.position + 1])
            var t = (0, S.unesc)(e).toLowerCase()
            var r = {}
            if (t !== e) {
              r.value = '/' + e + '/'
            }
            var n = new h['default']({
              value: '/' + t + '/',
              source: getSource(
                this.currToken[_.FIELDS.START_LINE],
                this.currToken[_.FIELDS.START_COL],
                this.tokens[this.position + 2][_.FIELDS.END_LINE],
                this.tokens[this.position + 2][_.FIELDS.END_COL]
              ),
              sourceIndex: this.currToken[_.FIELDS.START_POS],
              raws: r,
            })
            this.position = this.position + 3
            return n
          } else {
            this.unexpected()
          }
        }
        e.combinator = function combinator() {
          var e = this
          if (this.content() === '|') {
            return this.namespace()
          }
          var t = this.locateNextMeaningfulToken(this.position)
          if (t < 0 || this.tokens[t][_.FIELDS.TYPE] === y.comma) {
            var r = this.parseWhitespaceEquivalentTokens(t)
            if (r.length > 0) {
              var n = this.current.last
              if (n) {
                var i = this.convertWhitespaceNodesToSpace(r),
                  s = i.space,
                  o = i.rawSpace
                if (o !== undefined) {
                  n.rawSpaceAfter += o
                }
                n.spaces.after += s
              } else {
                r.forEach(function (t) {
                  return e.newNode(t)
                })
              }
            }
            return
          }
          var a = this.currToken
          var u = undefined
          if (t > this.position) {
            u = this.parseWhitespaceEquivalentTokens(t)
          }
          var c
          if (this.isNamedCombinator()) {
            c = this.namedCombinator()
          } else if (this.currToken[_.FIELDS.TYPE] === y.combinator) {
            c = new h['default']({
              value: this.content(),
              source: getTokenSource(this.currToken),
              sourceIndex: this.currToken[_.FIELDS.START_POS],
            })
            this.position++
          } else if (T[this.currToken[_.FIELDS.TYPE]]) {
          } else if (!u) {
            this.unexpected()
          }
          if (c) {
            if (u) {
              var f = this.convertWhitespaceNodesToSpace(u),
                l = f.space,
                p = f.rawSpace
              c.spaces.before = l
              c.rawSpaceBefore = p
            }
          } else {
            var d = this.convertWhitespaceNodesToSpace(u, true),
              v = d.space,
              g = d.rawSpace
            if (!g) {
              g = v
            }
            var S = {}
            var b = { spaces: {} }
            if (v.endsWith(' ') && g.endsWith(' ')) {
              S.before = v.slice(0, v.length - 1)
              b.spaces.before = g.slice(0, g.length - 1)
            } else if (v.startsWith(' ') && g.startsWith(' ')) {
              S.after = v.slice(1)
              b.spaces.after = g.slice(1)
            } else {
              b.value = g
            }
            c = new h['default']({
              value: ' ',
              source: getTokenSourceSpan(a, this.tokens[this.position - 1]),
              sourceIndex: a[_.FIELDS.START_POS],
              spaces: S,
              raws: b,
            })
          }
          if (this.currToken && this.currToken[_.FIELDS.TYPE] === y.space) {
            c.spaces.after = this.optionalSpace(this.content())
            this.position++
          }
          return this.newNode(c)
        }
        e.comma = function comma() {
          if (this.position === this.tokens.length - 1) {
            this.root.trailingComma = true
            this.position++
            return
          }
          this.current._inferEndPosition()
          var e = new i['default']({
            source: { start: tokenStart(this.tokens[this.position + 1]) },
          })
          this.current.parent.append(e)
          this.current = e
          this.position++
        }
        e.comment = function comment() {
          var e = this.currToken
          this.newNode(
            new o['default']({
              value: this.content(),
              source: getTokenSource(e),
              sourceIndex: e[_.FIELDS.START_POS],
            })
          )
          this.position++
        }
        e.error = function error(e, t) {
          throw this.root.error(e, t)
        }
        e.missingBackslash = function missingBackslash() {
          return this.error('Expected a backslash preceding the semicolon.', {
            index: this.currToken[_.FIELDS.START_POS],
          })
        }
        e.missingParenthesis = function missingParenthesis() {
          return this.expected(
            'opening parenthesis',
            this.currToken[_.FIELDS.START_POS]
          )
        }
        e.missingSquareBracket = function missingSquareBracket() {
          return this.expected(
            'opening square bracket',
            this.currToken[_.FIELDS.START_POS]
          )
        }
        e.unexpected = function unexpected() {
          return this.error(
            "Unexpected '" +
              this.content() +
              "'. Escaping special characters with \\ may help.",
            this.currToken[_.FIELDS.START_POS]
          )
        }
        e.namespace = function namespace() {
          var e = (this.prevToken && this.content(this.prevToken)) || true
          if (this.nextToken[_.FIELDS.TYPE] === y.word) {
            this.position++
            return this.word(e)
          } else if (this.nextToken[_.FIELDS.TYPE] === y.asterisk) {
            this.position++
            return this.universal(e)
          }
        }
        e.nesting = function nesting() {
          if (this.nextToken) {
            var e = this.content(this.nextToken)
            if (e === '|') {
              this.position++
              return
            }
          }
          var t = this.currToken
          this.newNode(
            new d['default']({
              value: this.content(),
              source: getTokenSource(t),
              sourceIndex: t[_.FIELDS.START_POS],
            })
          )
          this.position++
        }
        e.parentheses = function parentheses() {
          var e = this.current.last
          var t = 1
          this.position++
          if (e && e.type === g.PSEUDO) {
            var r = new i['default']({
              source: { start: tokenStart(this.tokens[this.position - 1]) },
            })
            var n = this.current
            e.append(r)
            this.current = r
            while (this.position < this.tokens.length && t) {
              if (this.currToken[_.FIELDS.TYPE] === y.openParenthesis) {
                t++
              }
              if (this.currToken[_.FIELDS.TYPE] === y.closeParenthesis) {
                t--
              }
              if (t) {
                this.parse()
              } else {
                this.current.source.end = tokenEnd(this.currToken)
                this.current.parent.source.end = tokenEnd(this.currToken)
                this.position++
              }
            }
            this.current = n
          } else {
            var s = this.currToken
            var o = '('
            var a
            while (this.position < this.tokens.length && t) {
              if (this.currToken[_.FIELDS.TYPE] === y.openParenthesis) {
                t++
              }
              if (this.currToken[_.FIELDS.TYPE] === y.closeParenthesis) {
                t--
              }
              a = this.currToken
              o += this.parseParenthesisToken(this.currToken)
              this.position++
            }
            if (e) {
              e.appendToPropertyAndEscape('value', o, o)
            } else {
              this.newNode(
                new c['default']({
                  value: o,
                  source: getSource(
                    s[_.FIELDS.START_LINE],
                    s[_.FIELDS.START_COL],
                    a[_.FIELDS.END_LINE],
                    a[_.FIELDS.END_COL]
                  ),
                  sourceIndex: s[_.FIELDS.START_POS],
                })
              )
            }
          }
          if (t) {
            return this.expected(
              'closing parenthesis',
              this.currToken[_.FIELDS.START_POS]
            )
          }
        }
        e.pseudo = function pseudo() {
          var e = this
          var t = ''
          var r = this.currToken
          while (this.currToken && this.currToken[_.FIELDS.TYPE] === y.colon) {
            t += this.content()
            this.position++
          }
          if (!this.currToken) {
            return this.expected(
              ['pseudo-class', 'pseudo-element'],
              this.position - 1
            )
          }
          if (this.currToken[_.FIELDS.TYPE] === y.word) {
            this.splitWord(false, function (n, i) {
              t += n
              e.newNode(
                new f['default']({
                  value: t,
                  source: getTokenSourceSpan(r, e.currToken),
                  sourceIndex: r[_.FIELDS.START_POS],
                })
              )
              if (
                i > 1 &&
                e.nextToken &&
                e.nextToken[_.FIELDS.TYPE] === y.openParenthesis
              ) {
                e.error('Misplaced parenthesis.', {
                  index: e.nextToken[_.FIELDS.START_POS],
                })
              }
            })
          } else {
            return this.expected(
              ['pseudo-class', 'pseudo-element'],
              this.currToken[_.FIELDS.START_POS]
            )
          }
        }
        e.space = function space() {
          var e = this.content()
          if (
            this.position === 0 ||
            this.prevToken[_.FIELDS.TYPE] === y.comma ||
            this.prevToken[_.FIELDS.TYPE] === y.openParenthesis ||
            this.current.nodes.every(function (e) {
              return e.type === 'comment'
            })
          ) {
            this.spaces = this.optionalSpace(e)
            this.position++
          } else if (
            this.position === this.tokens.length - 1 ||
            this.nextToken[_.FIELDS.TYPE] === y.comma ||
            this.nextToken[_.FIELDS.TYPE] === y.closeParenthesis
          ) {
            this.current.last.spaces.after = this.optionalSpace(e)
            this.position++
          } else {
            this.combinator()
          }
        }
        e.string = function string() {
          var e = this.currToken
          this.newNode(
            new c['default']({
              value: this.content(),
              source: getTokenSource(e),
              sourceIndex: e[_.FIELDS.START_POS],
            })
          )
          this.position++
        }
        e.universal = function universal(e) {
          var t = this.nextToken
          if (t && this.content(t) === '|') {
            this.position++
            return this.namespace()
          }
          var r = this.currToken
          this.newNode(
            new p['default']({
              value: this.content(),
              source: getTokenSource(r),
              sourceIndex: r[_.FIELDS.START_POS],
            }),
            e
          )
          this.position++
        }
        e.splitWord = function splitWord(e, t) {
          var r = this
          var n = this.nextToken
          var i = this.content()
          while (
            n &&
            ~[y.dollar, y.caret, y.equals, y.word].indexOf(n[_.FIELDS.TYPE])
          ) {
            this.position++
            var o = this.content()
            i += o
            if (o.lastIndexOf('\\') === o.length - 1) {
              var c = this.nextToken
              if (c && c[_.FIELDS.TYPE] === y.space) {
                i += this.requiredSpace(this.content(c))
                this.position++
              }
            }
            n = this.nextToken
          }
          var f = indexesOf(i, '.').filter(function (e) {
            var t = i[e - 1] === '\\'
            var r = /^\d+\.\d+%$/.test(i)
            return !t && !r
          })
          var l = indexesOf(i, '#').filter(function (e) {
            return i[e - 1] !== '\\'
          })
          var p = indexesOf(i, '#{')
          if (p.length) {
            l = l.filter(function (e) {
              return !~p.indexOf(e)
            })
          }
          var h = (0, v['default'])(uniqs([0].concat(f, l)))
          h.forEach(function (n, o) {
            var c = h[o + 1] || i.length
            var p = i.slice(n, c)
            if (o === 0 && t) {
              return t.call(r, p, h.length)
            }
            var d
            var v = r.currToken
            var y = v[_.FIELDS.START_POS] + h[o]
            var g = getSource(v[1], v[2] + n, v[3], v[2] + (c - 1))
            if (~f.indexOf(n)) {
              var S = { value: p.slice(1), source: g, sourceIndex: y }
              d = new s['default'](unescapeProp(S, 'value'))
            } else if (~l.indexOf(n)) {
              var b = { value: p.slice(1), source: g, sourceIndex: y }
              d = new a['default'](unescapeProp(b, 'value'))
            } else {
              var w = { value: p, source: g, sourceIndex: y }
              unescapeProp(w, 'value')
              d = new u['default'](w)
            }
            r.newNode(d, e)
            e = null
          })
          this.position++
        }
        e.word = function word(e) {
          var t = this.nextToken
          if (t && this.content(t) === '|') {
            this.position++
            return this.namespace()
          }
          return this.splitWord(e)
        }
        e.loop = function loop() {
          while (this.position < this.tokens.length) {
            this.parse(true)
          }
          this.current._inferEndPosition()
          return this.root
        }
        e.parse = function parse(e) {
          switch (this.currToken[_.FIELDS.TYPE]) {
            case y.space:
              this.space()
              break
            case y.comment:
              this.comment()
              break
            case y.openParenthesis:
              this.parentheses()
              break
            case y.closeParenthesis:
              if (e) {
                this.missingParenthesis()
              }
              break
            case y.openSquare:
              this.attribute()
              break
            case y.dollar:
            case y.caret:
            case y.equals:
            case y.word:
              this.word()
              break
            case y.colon:
              this.pseudo()
              break
            case y.comma:
              this.comma()
              break
            case y.asterisk:
              this.universal()
              break
            case y.ampersand:
              this.nesting()
              break
            case y.slash:
            case y.combinator:
              this.combinator()
              break
            case y.str:
              this.string()
              break
            case y.closeSquare:
              this.missingSquareBracket()
            case y.semicolon:
              this.missingBackslash()
            default:
              this.unexpected()
          }
        }
        e.expected = function expected(e, t, r) {
          if (Array.isArray(e)) {
            var n = e.pop()
            e = e.join(', ') + ' or ' + n
          }
          var i = /^[aeiou]/.test(e[0]) ? 'an' : 'a'
          if (!r) {
            return this.error('Expected ' + i + ' ' + e + '.', { index: t })
          }
          return this.error(
            'Expected ' + i + ' ' + e + ', found "' + r + '" instead.',
            { index: t }
          )
        }
        e.requiredSpace = function requiredSpace(e) {
          return this.options.lossy ? ' ' : e
        }
        e.optionalSpace = function optionalSpace(e) {
          return this.options.lossy ? '' : e
        }
        e.lossySpace = function lossySpace(e, t) {
          if (this.options.lossy) {
            return t ? ' ' : ''
          } else {
            return e
          }
        }
        e.parseParenthesisToken = function parseParenthesisToken(e) {
          var t = this.content(e)
          if (e[_.FIELDS.TYPE] === y.space) {
            return this.requiredSpace(t)
          } else {
            return t
          }
        }
        e.newNode = function newNode(e, t) {
          if (t) {
            if (/^ +$/.test(t)) {
              if (!this.options.lossy) {
                this.spaces = (this.spaces || '') + t
              }
              t = true
            }
            e.namespace = t
            unescapeProp(e, 'namespace')
          }
          if (this.spaces) {
            e.spaces.before = this.spaces
            this.spaces = ''
          }
          return this.current.append(e)
        }
        e.content = function content(e) {
          if (e === void 0) {
            e = this.currToken
          }
          return this.css.slice(e[_.FIELDS.START_POS], e[_.FIELDS.END_POS])
        }
        e.locateNextMeaningfulToken = function locateNextMeaningfulToken(e) {
          if (e === void 0) {
            e = this.position + 1
          }
          var t = e
          while (t < this.tokens.length) {
            if (m[this.tokens[t][_.FIELDS.TYPE]]) {
              t++
              continue
            } else {
              return t
            }
          }
          return -1
        }
        _createClass(Parser, [
          {
            key: 'currToken',
            get: function get() {
              return this.tokens[this.position]
            },
          },
          {
            key: 'nextToken',
            get: function get() {
              return this.tokens[this.position + 1]
            },
          },
          {
            key: 'prevToken',
            get: function get() {
              return this.tokens[this.position - 1]
            },
          },
        ])
        return Parser
      })()
      t['default'] = O
      e.exports = t.default
    },
    528: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(305))
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      var i = (function () {
        function Processor(e, t) {
          this.func = e || function noop() {}
          this.funcRes = null
          this.options = t
        }
        var e = Processor.prototype
        e._shouldUpdateSelector = function _shouldUpdateSelector(e, t) {
          if (t === void 0) {
            t = {}
          }
          var r = Object.assign({}, this.options, t)
          if (r.updateSelector === false) {
            return false
          } else {
            return typeof e !== 'string'
          }
        }
        e._isLossy = function _isLossy(e) {
          if (e === void 0) {
            e = {}
          }
          var t = Object.assign({}, this.options, e)
          if (t.lossless === false) {
            return true
          } else {
            return false
          }
        }
        e._root = function _root(e, t) {
          if (t === void 0) {
            t = {}
          }
          var r = new n['default'](e, this._parseOptions(t))
          return r.root
        }
        e._parseOptions = function _parseOptions(e) {
          return { lossy: this._isLossy(e) }
        }
        e._run = function _run(e, t) {
          var r = this
          if (t === void 0) {
            t = {}
          }
          return new Promise(function (n, i) {
            try {
              var s = r._root(e, t)
              Promise.resolve(r.func(s))
                .then(function (n) {
                  var i = undefined
                  if (r._shouldUpdateSelector(e, t)) {
                    i = s.toString()
                    e.selector = i
                  }
                  return { transform: n, root: s, string: i }
                })
                .then(n, i)
            } catch (e) {
              i(e)
              return
            }
          })
        }
        e._runSync = function _runSync(e, t) {
          if (t === void 0) {
            t = {}
          }
          var r = this._root(e, t)
          var n = this.func(r)
          if (n && typeof n.then === 'function') {
            throw new Error(
              'Selector processor returned a promise to a synchronous call.'
            )
          }
          var i = undefined
          if (t.updateSelector && typeof e !== 'string') {
            i = r.toString()
            e.selector = i
          }
          return { transform: n, root: r, string: i }
        }
        e.ast = function ast(e, t) {
          return this._run(e, t).then(function (e) {
            return e.root
          })
        }
        e.astSync = function astSync(e, t) {
          return this._runSync(e, t).root
        }
        e.transform = function transform(e, t) {
          return this._run(e, t).then(function (e) {
            return e.transform
          })
        }
        e.transformSync = function transformSync(e, t) {
          return this._runSync(e, t).transform
        }
        e.process = function process(e, t) {
          return this._run(e, t).then(function (e) {
            return e.string || e.root.toString()
          })
        }
        e.processSync = function processSync(e, t) {
          var r = this._runSync(e, t)
          return r.string || r.root.toString()
        }
        return Processor
      })()
      t['default'] = i
      e.exports = t.default
    },
    248: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t.unescapeValue = unescapeValue
      t['default'] = void 0
      var n = _interopRequireDefault(r(441))
      var i = _interopRequireDefault(r(590))
      var s = _interopRequireDefault(r(999))
      var o = r(600)
      var a
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _defineProperties(e, t) {
        for (var r = 0; r < t.length; r++) {
          var n = t[r]
          n.enumerable = n.enumerable || false
          n.configurable = true
          if ('value' in n) n.writable = true
          Object.defineProperty(e, n.key, n)
        }
      }
      function _createClass(e, t, r) {
        if (t) _defineProperties(e.prototype, t)
        if (r) _defineProperties(e, r)
        return e
      }
      function _inheritsLoose(e, t) {
        e.prototype = Object.create(t.prototype)
        e.prototype.constructor = e
        _setPrototypeOf(e, t)
      }
      function _setPrototypeOf(e, t) {
        _setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(e, t) {
            e.__proto__ = t
            return e
          }
        return _setPrototypeOf(e, t)
      }
      var u = r(124)
      var c = /^('|")([^]*)\1$/
      var f = u(function () {},
      'Assigning an attribute a value containing characters that might need to be escaped is deprecated. ' + 'Call attribute.setValue() instead.')
      var l = u(function () {},
      'Assigning attr.quoted is deprecated and has no effect. Assign to attr.quoteMark instead.')
      var p = u(function () {},
      'Constructing an Attribute selector with a value without specifying quoteMark is deprecated. Note: The value should be unescaped now.')
      function unescapeValue(e) {
        var t = false
        var r = null
        var n = e
        var s = n.match(c)
        if (s) {
          r = s[1]
          n = s[2]
        }
        n = (0, i['default'])(n)
        if (n !== e) {
          t = true
        }
        return { deprecatedUsage: t, unescaped: n, quoteMark: r }
      }
      function handleDeprecatedContructorOpts(e) {
        if (e.quoteMark !== undefined) {
          return e
        }
        if (e.value === undefined) {
          return e
        }
        p()
        var t = unescapeValue(e.value),
          r = t.quoteMark,
          n = t.unescaped
        if (!e.raws) {
          e.raws = {}
        }
        if (e.raws.value === undefined) {
          e.raws.value = e.value
        }
        e.value = n
        e.quoteMark = r
        return e
      }
      var h = (function (e) {
        _inheritsLoose(Attribute, e)
        function Attribute(t) {
          var r
          if (t === void 0) {
            t = {}
          }
          r = e.call(this, handleDeprecatedContructorOpts(t)) || this
          r.type = o.ATTRIBUTE
          r.raws = r.raws || {}
          Object.defineProperty(r.raws, 'unquoted', {
            get: u(function () {
              return r.value
            }, 'attr.raws.unquoted is deprecated. Call attr.value instead.'),
            set: u(function () {
              return r.value
            }, 'Setting attr.raws.unquoted is deprecated and has no effect. attr.value is unescaped by default now.'),
          })
          r._constructed = true
          return r
        }
        var t = Attribute.prototype
        t.getQuotedValue = function getQuotedValue(e) {
          if (e === void 0) {
            e = {}
          }
          var t = this._determineQuoteMark(e)
          var r = d[t]
          var i = (0, n['default'])(this._value, r)
          return i
        }
        t._determineQuoteMark = function _determineQuoteMark(e) {
          return e.smart ? this.smartQuoteMark(e) : this.preferredQuoteMark(e)
        }
        t.setValue = function setValue(e, t) {
          if (t === void 0) {
            t = {}
          }
          this._value = e
          this._quoteMark = this._determineQuoteMark(t)
          this._syncRawValue()
        }
        t.smartQuoteMark = function smartQuoteMark(e) {
          var t = this.value
          var r = t.replace(/[^']/g, '').length
          var i = t.replace(/[^"]/g, '').length
          if (r + i === 0) {
            var s = (0, n['default'])(t, { isIdentifier: true })
            if (s === t) {
              return Attribute.NO_QUOTE
            } else {
              var o = this.preferredQuoteMark(e)
              if (o === Attribute.NO_QUOTE) {
                var a = this.quoteMark || e.quoteMark || Attribute.DOUBLE_QUOTE
                var u = d[a]
                var c = (0, n['default'])(t, u)
                if (c.length < s.length) {
                  return a
                }
              }
              return o
            }
          } else if (i === r) {
            return this.preferredQuoteMark(e)
          } else if (i < r) {
            return Attribute.DOUBLE_QUOTE
          } else {
            return Attribute.SINGLE_QUOTE
          }
        }
        t.preferredQuoteMark = function preferredQuoteMark(e) {
          var t = e.preferCurrentQuoteMark ? this.quoteMark : e.quoteMark
          if (t === undefined) {
            t = e.preferCurrentQuoteMark ? e.quoteMark : this.quoteMark
          }
          if (t === undefined) {
            t = Attribute.DOUBLE_QUOTE
          }
          return t
        }
        t._syncRawValue = function _syncRawValue() {
          var e = (0, n['default'])(this._value, d[this.quoteMark])
          if (e === this._value) {
            if (this.raws) {
              delete this.raws.value
            }
          } else {
            this.raws.value = e
          }
        }
        t._handleEscapes = function _handleEscapes(e, t) {
          if (this._constructed) {
            var r = (0, n['default'])(t, { isIdentifier: true })
            if (r !== t) {
              this.raws[e] = r
            } else {
              delete this.raws[e]
            }
          }
        }
        t._spacesFor = function _spacesFor(e) {
          var t = { before: '', after: '' }
          var r = this.spaces[e] || {}
          var n = (this.raws.spaces && this.raws.spaces[e]) || {}
          return Object.assign(t, r, n)
        }
        t._stringFor = function _stringFor(e, t, r) {
          if (t === void 0) {
            t = e
          }
          if (r === void 0) {
            r = defaultAttrConcat
          }
          var n = this._spacesFor(t)
          return r(this.stringifyProperty(e), n)
        }
        t.offsetOf = function offsetOf(e) {
          var t = 1
          var r = this._spacesFor('attribute')
          t += r.before.length
          if (e === 'namespace' || e === 'ns') {
            return this.namespace ? t : -1
          }
          if (e === 'attributeNS') {
            return t
          }
          t += this.namespaceString.length
          if (this.namespace) {
            t += 1
          }
          if (e === 'attribute') {
            return t
          }
          t += this.stringifyProperty('attribute').length
          t += r.after.length
          var n = this._spacesFor('operator')
          t += n.before.length
          var i = this.stringifyProperty('operator')
          if (e === 'operator') {
            return i ? t : -1
          }
          t += i.length
          t += n.after.length
          var s = this._spacesFor('value')
          t += s.before.length
          var o = this.stringifyProperty('value')
          if (e === 'value') {
            return o ? t : -1
          }
          t += o.length
          t += s.after.length
          var a = this._spacesFor('insensitive')
          t += a.before.length
          if (e === 'insensitive') {
            return this.insensitive ? t : -1
          }
          return -1
        }
        t.toString = function toString() {
          var e = this
          var t = [this.rawSpaceBefore, '[']
          t.push(this._stringFor('qualifiedAttribute', 'attribute'))
          if (this.operator && (this.value || this.value === '')) {
            t.push(this._stringFor('operator'))
            t.push(this._stringFor('value'))
            t.push(
              this._stringFor(
                'insensitiveFlag',
                'insensitive',
                function (t, r) {
                  if (
                    t.length > 0 &&
                    !e.quoted &&
                    r.before.length === 0 &&
                    !(e.spaces.value && e.spaces.value.after)
                  ) {
                    r.before = ' '
                  }
                  return defaultAttrConcat(t, r)
                }
              )
            )
          }
          t.push(']')
          t.push(this.rawSpaceAfter)
          return t.join('')
        }
        _createClass(Attribute, [
          {
            key: 'quoted',
            get: function get() {
              var e = this.quoteMark
              return e === "'" || e === '"'
            },
            set: function set(e) {
              l()
            },
          },
          {
            key: 'quoteMark',
            get: function get() {
              return this._quoteMark
            },
            set: function set(e) {
              if (!this._constructed) {
                this._quoteMark = e
                return
              }
              if (this._quoteMark !== e) {
                this._quoteMark = e
                this._syncRawValue()
              }
            },
          },
          {
            key: 'qualifiedAttribute',
            get: function get() {
              return this.qualifiedName(this.raws.attribute || this.attribute)
            },
          },
          {
            key: 'insensitiveFlag',
            get: function get() {
              return this.insensitive ? 'i' : ''
            },
          },
          {
            key: 'value',
            get: function get() {
              return this._value
            },
            set: function set(e) {
              if (this._constructed) {
                var t = unescapeValue(e),
                  r = t.deprecatedUsage,
                  n = t.unescaped,
                  i = t.quoteMark
                if (r) {
                  f()
                }
                if (n === this._value && i === this._quoteMark) {
                  return
                }
                this._value = n
                this._quoteMark = i
                this._syncRawValue()
              } else {
                this._value = e
              }
            },
          },
          {
            key: 'insensitive',
            get: function get() {
              return this._insensitive
            },
            set: function set(e) {
              if (!e) {
                this._insensitive = false
                if (
                  this.raws &&
                  (this.raws.insensitiveFlag === 'I' ||
                    this.raws.insensitiveFlag === 'i')
                ) {
                  this.raws.insensitiveFlag = undefined
                }
              }
              this._insensitive = e
            },
          },
          {
            key: 'attribute',
            get: function get() {
              return this._attribute
            },
            set: function set(e) {
              this._handleEscapes('attribute', e)
              this._attribute = e
            },
          },
        ])
        return Attribute
      })(s['default'])
      t['default'] = h
      h.NO_QUOTE = null
      h.SINGLE_QUOTE = "'"
      h.DOUBLE_QUOTE = '"'
      var d =
        ((a = {
          "'": { quotes: 'single', wrap: true },
          '"': { quotes: 'double', wrap: true },
        }),
        (a[null] = { isIdentifier: true }),
        a)
      function defaultAttrConcat(e, t) {
        return '' + t.before + e + t.after
      }
    },
    870: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(441))
      var i = r(513)
      var s = _interopRequireDefault(r(373))
      var o = r(600)
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _defineProperties(e, t) {
        for (var r = 0; r < t.length; r++) {
          var n = t[r]
          n.enumerable = n.enumerable || false
          n.configurable = true
          if ('value' in n) n.writable = true
          Object.defineProperty(e, n.key, n)
        }
      }
      function _createClass(e, t, r) {
        if (t) _defineProperties(e.prototype, t)
        if (r) _defineProperties(e, r)
        return e
      }
      function _inheritsLoose(e, t) {
        e.prototype = Object.create(t.prototype)
        e.prototype.constructor = e
        _setPrototypeOf(e, t)
      }
      function _setPrototypeOf(e, t) {
        _setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(e, t) {
            e.__proto__ = t
            return e
          }
        return _setPrototypeOf(e, t)
      }
      var a = (function (e) {
        _inheritsLoose(ClassName, e)
        function ClassName(t) {
          var r
          r = e.call(this, t) || this
          r.type = o.CLASS
          r._constructed = true
          return r
        }
        var t = ClassName.prototype
        t.valueToString = function valueToString() {
          return '.' + e.prototype.valueToString.call(this)
        }
        _createClass(ClassName, [
          {
            key: 'value',
            get: function get() {
              return this._value
            },
            set: function set(e) {
              if (this._constructed) {
                var t = (0, n['default'])(e, { isIdentifier: true })
                if (t !== e) {
                  ;(0, i.ensureObject)(this, 'raws')
                  this.raws.value = t
                } else if (this.raws) {
                  delete this.raws.value
                }
              }
              this._value = e
            },
          },
        ])
        return ClassName
      })(s['default'])
      t['default'] = a
      e.exports = t.default
    },
    537: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(373))
      var i = r(600)
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _inheritsLoose(e, t) {
        e.prototype = Object.create(t.prototype)
        e.prototype.constructor = e
        _setPrototypeOf(e, t)
      }
      function _setPrototypeOf(e, t) {
        _setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(e, t) {
            e.__proto__ = t
            return e
          }
        return _setPrototypeOf(e, t)
      }
      var s = (function (e) {
        _inheritsLoose(Combinator, e)
        function Combinator(t) {
          var r
          r = e.call(this, t) || this
          r.type = i.COMBINATOR
          return r
        }
        return Combinator
      })(n['default'])
      t['default'] = s
      e.exports = t.default
    },
    47: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(373))
      var i = r(600)
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _inheritsLoose(e, t) {
        e.prototype = Object.create(t.prototype)
        e.prototype.constructor = e
        _setPrototypeOf(e, t)
      }
      function _setPrototypeOf(e, t) {
        _setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(e, t) {
            e.__proto__ = t
            return e
          }
        return _setPrototypeOf(e, t)
      }
      var s = (function (e) {
        _inheritsLoose(Comment, e)
        function Comment(t) {
          var r
          r = e.call(this, t) || this
          r.type = i.COMMENT
          return r
        }
        return Comment
      })(n['default'])
      t['default'] = s
      e.exports = t.default
    },
    734: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t.universal =
        t.tag =
        t.string =
        t.selector =
        t.root =
        t.pseudo =
        t.nesting =
        t.id =
        t.comment =
        t.combinator =
        t.className =
        t.attribute =
          void 0
      var n = _interopRequireDefault(r(248))
      var i = _interopRequireDefault(r(870))
      var s = _interopRequireDefault(r(537))
      var o = _interopRequireDefault(r(47))
      var a = _interopRequireDefault(r(393))
      var u = _interopRequireDefault(r(60))
      var c = _interopRequireDefault(r(326))
      var f = _interopRequireDefault(r(422))
      var l = _interopRequireDefault(r(13))
      var p = _interopRequireDefault(r(435))
      var h = _interopRequireDefault(r(443))
      var d = _interopRequireDefault(r(165))
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      var v = function attribute(e) {
        return new n['default'](e)
      }
      t.attribute = v
      var _ = function className(e) {
        return new i['default'](e)
      }
      t.className = _
      var y = function combinator(e) {
        return new s['default'](e)
      }
      t.combinator = y
      var g = function comment(e) {
        return new o['default'](e)
      }
      t.comment = g
      var S = function id(e) {
        return new a['default'](e)
      }
      t.id = S
      var b = function nesting(e) {
        return new u['default'](e)
      }
      t.nesting = b
      var w = function pseudo(e) {
        return new c['default'](e)
      }
      t.pseudo = w
      var T = function root(e) {
        return new f['default'](e)
      }
      t.root = T
      var m = function selector(e) {
        return new l['default'](e)
      }
      t.selector = m
      var O = function string(e) {
        return new p['default'](e)
      }
      t.string = O
      var k = function tag(e) {
        return new h['default'](e)
      }
      t.tag = k
      var P = function universal(e) {
        return new d['default'](e)
      }
      t.universal = P
    },
    675: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(373))
      var i = _interopRequireWildcard(r(600))
      function _getRequireWildcardCache() {
        if (typeof WeakMap !== 'function') return null
        var e = new WeakMap()
        _getRequireWildcardCache = function _getRequireWildcardCache() {
          return e
        }
        return e
      }
      function _interopRequireWildcard(e) {
        if (e && e.__esModule) {
          return e
        }
        if (e === null || (typeof e !== 'object' && typeof e !== 'function')) {
          return { default: e }
        }
        var t = _getRequireWildcardCache()
        if (t && t.has(e)) {
          return t.get(e)
        }
        var r = {}
        var n = Object.defineProperty && Object.getOwnPropertyDescriptor
        for (var i in e) {
          if (Object.prototype.hasOwnProperty.call(e, i)) {
            var s = n ? Object.getOwnPropertyDescriptor(e, i) : null
            if (s && (s.get || s.set)) {
              Object.defineProperty(r, i, s)
            } else {
              r[i] = e[i]
            }
          }
        }
        r['default'] = e
        if (t) {
          t.set(e, r)
        }
        return r
      }
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _createForOfIteratorHelperLoose(e, t) {
        var r
        if (typeof Symbol === 'undefined' || e[Symbol.iterator] == null) {
          if (
            Array.isArray(e) ||
            (r = _unsupportedIterableToArray(e)) ||
            (t && e && typeof e.length === 'number')
          ) {
            if (r) e = r
            var n = 0
            return function () {
              if (n >= e.length) return { done: true }
              return { done: false, value: e[n++] }
            }
          }
          throw new TypeError(
            'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
          )
        }
        r = e[Symbol.iterator]()
        return r.next.bind(r)
      }
      function _unsupportedIterableToArray(e, t) {
        if (!e) return
        if (typeof e === 'string') return _arrayLikeToArray(e, t)
        var r = Object.prototype.toString.call(e).slice(8, -1)
        if (r === 'Object' && e.constructor) r = e.constructor.name
        if (r === 'Map' || r === 'Set') return Array.from(e)
        if (
          r === 'Arguments' ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
        )
          return _arrayLikeToArray(e, t)
      }
      function _arrayLikeToArray(e, t) {
        if (t == null || t > e.length) t = e.length
        for (var r = 0, n = new Array(t); r < t; r++) {
          n[r] = e[r]
        }
        return n
      }
      function _defineProperties(e, t) {
        for (var r = 0; r < t.length; r++) {
          var n = t[r]
          n.enumerable = n.enumerable || false
          n.configurable = true
          if ('value' in n) n.writable = true
          Object.defineProperty(e, n.key, n)
        }
      }
      function _createClass(e, t, r) {
        if (t) _defineProperties(e.prototype, t)
        if (r) _defineProperties(e, r)
        return e
      }
      function _inheritsLoose(e, t) {
        e.prototype = Object.create(t.prototype)
        e.prototype.constructor = e
        _setPrototypeOf(e, t)
      }
      function _setPrototypeOf(e, t) {
        _setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(e, t) {
            e.__proto__ = t
            return e
          }
        return _setPrototypeOf(e, t)
      }
      var s = (function (e) {
        _inheritsLoose(Container, e)
        function Container(t) {
          var r
          r = e.call(this, t) || this
          if (!r.nodes) {
            r.nodes = []
          }
          return r
        }
        var t = Container.prototype
        t.append = function append(e) {
          e.parent = this
          this.nodes.push(e)
          return this
        }
        t.prepend = function prepend(e) {
          e.parent = this
          this.nodes.unshift(e)
          return this
        }
        t.at = function at(e) {
          return this.nodes[e]
        }
        t.index = function index(e) {
          if (typeof e === 'number') {
            return e
          }
          return this.nodes.indexOf(e)
        }
        t.removeChild = function removeChild(e) {
          e = this.index(e)
          this.at(e).parent = undefined
          this.nodes.splice(e, 1)
          var t
          for (var r in this.indexes) {
            t = this.indexes[r]
            if (t >= e) {
              this.indexes[r] = t - 1
            }
          }
          return this
        }
        t.removeAll = function removeAll() {
          for (
            var e = _createForOfIteratorHelperLoose(this.nodes), t;
            !(t = e()).done;

          ) {
            var r = t.value
            r.parent = undefined
          }
          this.nodes = []
          return this
        }
        t.empty = function empty() {
          return this.removeAll()
        }
        t.insertAfter = function insertAfter(e, t) {
          t.parent = this
          var r = this.index(e)
          this.nodes.splice(r + 1, 0, t)
          t.parent = this
          var n
          for (var i in this.indexes) {
            n = this.indexes[i]
            if (r <= n) {
              this.indexes[i] = n + 1
            }
          }
          return this
        }
        t.insertBefore = function insertBefore(e, t) {
          t.parent = this
          var r = this.index(e)
          this.nodes.splice(r, 0, t)
          t.parent = this
          var n
          for (var i in this.indexes) {
            n = this.indexes[i]
            if (n <= r) {
              this.indexes[i] = n + 1
            }
          }
          return this
        }
        t._findChildAtPosition = function _findChildAtPosition(e, t) {
          var r = undefined
          this.each(function (n) {
            if (n.atPosition) {
              var i = n.atPosition(e, t)
              if (i) {
                r = i
                return false
              }
            } else if (n.isAtPosition(e, t)) {
              r = n
              return false
            }
          })
          return r
        }
        t.atPosition = function atPosition(e, t) {
          if (this.isAtPosition(e, t)) {
            return this._findChildAtPosition(e, t) || this
          } else {
            return undefined
          }
        }
        t._inferEndPosition = function _inferEndPosition() {
          if (this.last && this.last.source && this.last.source.end) {
            this.source = this.source || {}
            this.source.end = this.source.end || {}
            Object.assign(this.source.end, this.last.source.end)
          }
        }
        t.each = function each(e) {
          if (!this.lastEach) {
            this.lastEach = 0
          }
          if (!this.indexes) {
            this.indexes = {}
          }
          this.lastEach++
          var t = this.lastEach
          this.indexes[t] = 0
          if (!this.length) {
            return undefined
          }
          var r, n
          while (this.indexes[t] < this.length) {
            r = this.indexes[t]
            n = e(this.at(r), r)
            if (n === false) {
              break
            }
            this.indexes[t] += 1
          }
          delete this.indexes[t]
          if (n === false) {
            return false
          }
        }
        t.walk = function walk(e) {
          return this.each(function (t, r) {
            var n = e(t, r)
            if (n !== false && t.length) {
              n = t.walk(e)
            }
            if (n === false) {
              return false
            }
          })
        }
        t.walkAttributes = function walkAttributes(e) {
          var t = this
          return this.walk(function (r) {
            if (r.type === i.ATTRIBUTE) {
              return e.call(t, r)
            }
          })
        }
        t.walkClasses = function walkClasses(e) {
          var t = this
          return this.walk(function (r) {
            if (r.type === i.CLASS) {
              return e.call(t, r)
            }
          })
        }
        t.walkCombinators = function walkCombinators(e) {
          var t = this
          return this.walk(function (r) {
            if (r.type === i.COMBINATOR) {
              return e.call(t, r)
            }
          })
        }
        t.walkComments = function walkComments(e) {
          var t = this
          return this.walk(function (r) {
            if (r.type === i.COMMENT) {
              return e.call(t, r)
            }
          })
        }
        t.walkIds = function walkIds(e) {
          var t = this
          return this.walk(function (r) {
            if (r.type === i.ID) {
              return e.call(t, r)
            }
          })
        }
        t.walkNesting = function walkNesting(e) {
          var t = this
          return this.walk(function (r) {
            if (r.type === i.NESTING) {
              return e.call(t, r)
            }
          })
        }
        t.walkPseudos = function walkPseudos(e) {
          var t = this
          return this.walk(function (r) {
            if (r.type === i.PSEUDO) {
              return e.call(t, r)
            }
          })
        }
        t.walkTags = function walkTags(e) {
          var t = this
          return this.walk(function (r) {
            if (r.type === i.TAG) {
              return e.call(t, r)
            }
          })
        }
        t.walkUniversals = function walkUniversals(e) {
          var t = this
          return this.walk(function (r) {
            if (r.type === i.UNIVERSAL) {
              return e.call(t, r)
            }
          })
        }
        t.split = function split(e) {
          var t = this
          var r = []
          return this.reduce(function (n, i, s) {
            var o = e.call(t, i)
            r.push(i)
            if (o) {
              n.push(r)
              r = []
            } else if (s === t.length - 1) {
              n.push(r)
            }
            return n
          }, [])
        }
        t.map = function map(e) {
          return this.nodes.map(e)
        }
        t.reduce = function reduce(e, t) {
          return this.nodes.reduce(e, t)
        }
        t.every = function every(e) {
          return this.nodes.every(e)
        }
        t.some = function some(e) {
          return this.nodes.some(e)
        }
        t.filter = function filter(e) {
          return this.nodes.filter(e)
        }
        t.sort = function sort(e) {
          return this.nodes.sort(e)
        }
        t.toString = function toString() {
          return this.map(String).join('')
        }
        _createClass(Container, [
          {
            key: 'first',
            get: function get() {
              return this.at(0)
            },
          },
          {
            key: 'last',
            get: function get() {
              return this.at(this.length - 1)
            },
          },
          {
            key: 'length',
            get: function get() {
              return this.nodes.length
            },
          },
        ])
        return Container
      })(n['default'])
      t['default'] = s
      e.exports = t.default
    },
    493: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t.isNode = isNode
      t.isPseudoElement = isPseudoElement
      t.isPseudoClass = isPseudoClass
      t.isContainer = isContainer
      t.isNamespace = isNamespace
      t.isUniversal =
        t.isTag =
        t.isString =
        t.isSelector =
        t.isRoot =
        t.isPseudo =
        t.isNesting =
        t.isIdentifier =
        t.isComment =
        t.isCombinator =
        t.isClassName =
        t.isAttribute =
          void 0
      var n = r(600)
      var i
      var s =
        ((i = {}),
        (i[n.ATTRIBUTE] = true),
        (i[n.CLASS] = true),
        (i[n.COMBINATOR] = true),
        (i[n.COMMENT] = true),
        (i[n.ID] = true),
        (i[n.NESTING] = true),
        (i[n.PSEUDO] = true),
        (i[n.ROOT] = true),
        (i[n.SELECTOR] = true),
        (i[n.STRING] = true),
        (i[n.TAG] = true),
        (i[n.UNIVERSAL] = true),
        i)
      function isNode(e) {
        return typeof e === 'object' && s[e.type]
      }
      function isNodeType(e, t) {
        return isNode(t) && t.type === e
      }
      var o = isNodeType.bind(null, n.ATTRIBUTE)
      t.isAttribute = o
      var a = isNodeType.bind(null, n.CLASS)
      t.isClassName = a
      var u = isNodeType.bind(null, n.COMBINATOR)
      t.isCombinator = u
      var c = isNodeType.bind(null, n.COMMENT)
      t.isComment = c
      var f = isNodeType.bind(null, n.ID)
      t.isIdentifier = f
      var l = isNodeType.bind(null, n.NESTING)
      t.isNesting = l
      var p = isNodeType.bind(null, n.PSEUDO)
      t.isPseudo = p
      var h = isNodeType.bind(null, n.ROOT)
      t.isRoot = h
      var d = isNodeType.bind(null, n.SELECTOR)
      t.isSelector = d
      var v = isNodeType.bind(null, n.STRING)
      t.isString = v
      var _ = isNodeType.bind(null, n.TAG)
      t.isTag = _
      var y = isNodeType.bind(null, n.UNIVERSAL)
      t.isUniversal = y
      function isPseudoElement(e) {
        return (
          p(e) &&
          e.value &&
          (e.value.startsWith('::') ||
            e.value.toLowerCase() === ':before' ||
            e.value.toLowerCase() === ':after' ||
            e.value.toLowerCase() === ':first-letter' ||
            e.value.toLowerCase() === ':first-line')
        )
      }
      function isPseudoClass(e) {
        return p(e) && !isPseudoElement(e)
      }
      function isContainer(e) {
        return !!(isNode(e) && e.walk)
      }
      function isNamespace(e) {
        return o(e) || _(e)
      }
    },
    393: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(373))
      var i = r(600)
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _inheritsLoose(e, t) {
        e.prototype = Object.create(t.prototype)
        e.prototype.constructor = e
        _setPrototypeOf(e, t)
      }
      function _setPrototypeOf(e, t) {
        _setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(e, t) {
            e.__proto__ = t
            return e
          }
        return _setPrototypeOf(e, t)
      }
      var s = (function (e) {
        _inheritsLoose(ID, e)
        function ID(t) {
          var r
          r = e.call(this, t) || this
          r.type = i.ID
          return r
        }
        var t = ID.prototype
        t.valueToString = function valueToString() {
          return '#' + e.prototype.valueToString.call(this)
        }
        return ID
      })(n['default'])
      t['default'] = s
      e.exports = t.default
    },
    110: (e, t, r) => {
      'use strict'
      t.__esModule = true
      var n = r(600)
      Object.keys(n).forEach(function (e) {
        if (e === 'default' || e === '__esModule') return
        if (e in t && t[e] === n[e]) return
        t[e] = n[e]
      })
      var i = r(734)
      Object.keys(i).forEach(function (e) {
        if (e === 'default' || e === '__esModule') return
        if (e in t && t[e] === i[e]) return
        t[e] = i[e]
      })
      var s = r(493)
      Object.keys(s).forEach(function (e) {
        if (e === 'default' || e === '__esModule') return
        if (e in t && t[e] === s[e]) return
        t[e] = s[e]
      })
    },
    999: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(441))
      var i = r(513)
      var s = _interopRequireDefault(r(373))
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _defineProperties(e, t) {
        for (var r = 0; r < t.length; r++) {
          var n = t[r]
          n.enumerable = n.enumerable || false
          n.configurable = true
          if ('value' in n) n.writable = true
          Object.defineProperty(e, n.key, n)
        }
      }
      function _createClass(e, t, r) {
        if (t) _defineProperties(e.prototype, t)
        if (r) _defineProperties(e, r)
        return e
      }
      function _inheritsLoose(e, t) {
        e.prototype = Object.create(t.prototype)
        e.prototype.constructor = e
        _setPrototypeOf(e, t)
      }
      function _setPrototypeOf(e, t) {
        _setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(e, t) {
            e.__proto__ = t
            return e
          }
        return _setPrototypeOf(e, t)
      }
      var o = (function (e) {
        _inheritsLoose(Namespace, e)
        function Namespace() {
          return e.apply(this, arguments) || this
        }
        var t = Namespace.prototype
        t.qualifiedName = function qualifiedName(e) {
          if (this.namespace) {
            return this.namespaceString + '|' + e
          } else {
            return e
          }
        }
        t.valueToString = function valueToString() {
          return this.qualifiedName(e.prototype.valueToString.call(this))
        }
        _createClass(Namespace, [
          {
            key: 'namespace',
            get: function get() {
              return this._namespace
            },
            set: function set(e) {
              if (e === true || e === '*' || e === '&') {
                this._namespace = e
                if (this.raws) {
                  delete this.raws.namespace
                }
                return
              }
              var t = (0, n['default'])(e, { isIdentifier: true })
              this._namespace = e
              if (t !== e) {
                ;(0, i.ensureObject)(this, 'raws')
                this.raws.namespace = t
              } else if (this.raws) {
                delete this.raws.namespace
              }
            },
          },
          {
            key: 'ns',
            get: function get() {
              return this._namespace
            },
            set: function set(e) {
              this.namespace = e
            },
          },
          {
            key: 'namespaceString',
            get: function get() {
              if (this.namespace) {
                var e = this.stringifyProperty('namespace')
                if (e === true) {
                  return ''
                } else {
                  return e
                }
              } else {
                return ''
              }
            },
          },
        ])
        return Namespace
      })(s['default'])
      t['default'] = o
      e.exports = t.default
    },
    60: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(373))
      var i = r(600)
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _inheritsLoose(e, t) {
        e.prototype = Object.create(t.prototype)
        e.prototype.constructor = e
        _setPrototypeOf(e, t)
      }
      function _setPrototypeOf(e, t) {
        _setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(e, t) {
            e.__proto__ = t
            return e
          }
        return _setPrototypeOf(e, t)
      }
      var s = (function (e) {
        _inheritsLoose(Nesting, e)
        function Nesting(t) {
          var r
          r = e.call(this, t) || this
          r.type = i.NESTING
          r.value = '&'
          return r
        }
        return Nesting
      })(n['default'])
      t['default'] = s
      e.exports = t.default
    },
    373: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = r(513)
      function _defineProperties(e, t) {
        for (var r = 0; r < t.length; r++) {
          var n = t[r]
          n.enumerable = n.enumerable || false
          n.configurable = true
          if ('value' in n) n.writable = true
          Object.defineProperty(e, n.key, n)
        }
      }
      function _createClass(e, t, r) {
        if (t) _defineProperties(e.prototype, t)
        if (r) _defineProperties(e, r)
        return e
      }
      var i = function cloneNode(e, t) {
        if (typeof e !== 'object' || e === null) {
          return e
        }
        var r = new e.constructor()
        for (var n in e) {
          if (!e.hasOwnProperty(n)) {
            continue
          }
          var i = e[n]
          var s = typeof i
          if (n === 'parent' && s === 'object') {
            if (t) {
              r[n] = t
            }
          } else if (i instanceof Array) {
            r[n] = i.map(function (e) {
              return cloneNode(e, r)
            })
          } else {
            r[n] = cloneNode(i, r)
          }
        }
        return r
      }
      var s = (function () {
        function Node(e) {
          if (e === void 0) {
            e = {}
          }
          Object.assign(this, e)
          this.spaces = this.spaces || {}
          this.spaces.before = this.spaces.before || ''
          this.spaces.after = this.spaces.after || ''
        }
        var e = Node.prototype
        e.remove = function remove() {
          if (this.parent) {
            this.parent.removeChild(this)
          }
          this.parent = undefined
          return this
        }
        e.replaceWith = function replaceWith() {
          if (this.parent) {
            for (var e in arguments) {
              this.parent.insertBefore(this, arguments[e])
            }
            this.remove()
          }
          return this
        }
        e.next = function next() {
          return this.parent.at(this.parent.index(this) + 1)
        }
        e.prev = function prev() {
          return this.parent.at(this.parent.index(this) - 1)
        }
        e.clone = function clone(e) {
          if (e === void 0) {
            e = {}
          }
          var t = i(this)
          for (var r in e) {
            t[r] = e[r]
          }
          return t
        }
        e.appendToPropertyAndEscape = function appendToPropertyAndEscape(
          e,
          t,
          r
        ) {
          if (!this.raws) {
            this.raws = {}
          }
          var n = this[e]
          var i = this.raws[e]
          this[e] = n + t
          if (i || r !== t) {
            this.raws[e] = (i || n) + r
          } else {
            delete this.raws[e]
          }
        }
        e.setPropertyAndEscape = function setPropertyAndEscape(e, t, r) {
          if (!this.raws) {
            this.raws = {}
          }
          this[e] = t
          this.raws[e] = r
        }
        e.setPropertyWithoutEscape = function setPropertyWithoutEscape(e, t) {
          this[e] = t
          if (this.raws) {
            delete this.raws[e]
          }
        }
        e.isAtPosition = function isAtPosition(e, t) {
          if (this.source && this.source.start && this.source.end) {
            if (this.source.start.line > e) {
              return false
            }
            if (this.source.end.line < e) {
              return false
            }
            if (this.source.start.line === e && this.source.start.column > t) {
              return false
            }
            if (this.source.end.line === e && this.source.end.column < t) {
              return false
            }
            return true
          }
          return undefined
        }
        e.stringifyProperty = function stringifyProperty(e) {
          return (this.raws && this.raws[e]) || this[e]
        }
        e.valueToString = function valueToString() {
          return String(this.stringifyProperty('value'))
        }
        e.toString = function toString() {
          return [
            this.rawSpaceBefore,
            this.valueToString(),
            this.rawSpaceAfter,
          ].join('')
        }
        _createClass(Node, [
          {
            key: 'rawSpaceBefore',
            get: function get() {
              var e = this.raws && this.raws.spaces && this.raws.spaces.before
              if (e === undefined) {
                e = this.spaces && this.spaces.before
              }
              return e || ''
            },
            set: function set(e) {
              ;(0, n.ensureObject)(this, 'raws', 'spaces')
              this.raws.spaces.before = e
            },
          },
          {
            key: 'rawSpaceAfter',
            get: function get() {
              var e = this.raws && this.raws.spaces && this.raws.spaces.after
              if (e === undefined) {
                e = this.spaces.after
              }
              return e || ''
            },
            set: function set(e) {
              ;(0, n.ensureObject)(this, 'raws', 'spaces')
              this.raws.spaces.after = e
            },
          },
        ])
        return Node
      })()
      t['default'] = s
      e.exports = t.default
    },
    326: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(675))
      var i = r(600)
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _inheritsLoose(e, t) {
        e.prototype = Object.create(t.prototype)
        e.prototype.constructor = e
        _setPrototypeOf(e, t)
      }
      function _setPrototypeOf(e, t) {
        _setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(e, t) {
            e.__proto__ = t
            return e
          }
        return _setPrototypeOf(e, t)
      }
      var s = (function (e) {
        _inheritsLoose(Pseudo, e)
        function Pseudo(t) {
          var r
          r = e.call(this, t) || this
          r.type = i.PSEUDO
          return r
        }
        var t = Pseudo.prototype
        t.toString = function toString() {
          var e = this.length ? '(' + this.map(String).join(',') + ')' : ''
          return [
            this.rawSpaceBefore,
            this.stringifyProperty('value'),
            e,
            this.rawSpaceAfter,
          ].join('')
        }
        return Pseudo
      })(n['default'])
      t['default'] = s
      e.exports = t.default
    },
    422: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(675))
      var i = r(600)
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _defineProperties(e, t) {
        for (var r = 0; r < t.length; r++) {
          var n = t[r]
          n.enumerable = n.enumerable || false
          n.configurable = true
          if ('value' in n) n.writable = true
          Object.defineProperty(e, n.key, n)
        }
      }
      function _createClass(e, t, r) {
        if (t) _defineProperties(e.prototype, t)
        if (r) _defineProperties(e, r)
        return e
      }
      function _inheritsLoose(e, t) {
        e.prototype = Object.create(t.prototype)
        e.prototype.constructor = e
        _setPrototypeOf(e, t)
      }
      function _setPrototypeOf(e, t) {
        _setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(e, t) {
            e.__proto__ = t
            return e
          }
        return _setPrototypeOf(e, t)
      }
      var s = (function (e) {
        _inheritsLoose(Root, e)
        function Root(t) {
          var r
          r = e.call(this, t) || this
          r.type = i.ROOT
          return r
        }
        var t = Root.prototype
        t.toString = function toString() {
          var e = this.reduce(function (e, t) {
            e.push(String(t))
            return e
          }, []).join(',')
          return this.trailingComma ? e + ',' : e
        }
        t.error = function error(e, t) {
          if (this._error) {
            return this._error(e, t)
          } else {
            return new Error(e)
          }
        }
        _createClass(Root, [
          {
            key: 'errorGenerator',
            set: function set(e) {
              this._error = e
            },
          },
        ])
        return Root
      })(n['default'])
      t['default'] = s
      e.exports = t.default
    },
    13: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(675))
      var i = r(600)
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _inheritsLoose(e, t) {
        e.prototype = Object.create(t.prototype)
        e.prototype.constructor = e
        _setPrototypeOf(e, t)
      }
      function _setPrototypeOf(e, t) {
        _setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(e, t) {
            e.__proto__ = t
            return e
          }
        return _setPrototypeOf(e, t)
      }
      var s = (function (e) {
        _inheritsLoose(Selector, e)
        function Selector(t) {
          var r
          r = e.call(this, t) || this
          r.type = i.SELECTOR
          return r
        }
        return Selector
      })(n['default'])
      t['default'] = s
      e.exports = t.default
    },
    435: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(373))
      var i = r(600)
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _inheritsLoose(e, t) {
        e.prototype = Object.create(t.prototype)
        e.prototype.constructor = e
        _setPrototypeOf(e, t)
      }
      function _setPrototypeOf(e, t) {
        _setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(e, t) {
            e.__proto__ = t
            return e
          }
        return _setPrototypeOf(e, t)
      }
      var s = (function (e) {
        _inheritsLoose(String, e)
        function String(t) {
          var r
          r = e.call(this, t) || this
          r.type = i.STRING
          return r
        }
        return String
      })(n['default'])
      t['default'] = s
      e.exports = t.default
    },
    443: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(999))
      var i = r(600)
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _inheritsLoose(e, t) {
        e.prototype = Object.create(t.prototype)
        e.prototype.constructor = e
        _setPrototypeOf(e, t)
      }
      function _setPrototypeOf(e, t) {
        _setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(e, t) {
            e.__proto__ = t
            return e
          }
        return _setPrototypeOf(e, t)
      }
      var s = (function (e) {
        _inheritsLoose(Tag, e)
        function Tag(t) {
          var r
          r = e.call(this, t) || this
          r.type = i.TAG
          return r
        }
        return Tag
      })(n['default'])
      t['default'] = s
      e.exports = t.default
    },
    600: (e, t) => {
      'use strict'
      t.__esModule = true
      t.UNIVERSAL =
        t.ATTRIBUTE =
        t.CLASS =
        t.COMBINATOR =
        t.COMMENT =
        t.ID =
        t.NESTING =
        t.PSEUDO =
        t.ROOT =
        t.SELECTOR =
        t.STRING =
        t.TAG =
          void 0
      var r = 'tag'
      t.TAG = r
      var n = 'string'
      t.STRING = n
      var i = 'selector'
      t.SELECTOR = i
      var s = 'root'
      t.ROOT = s
      var o = 'pseudo'
      t.PSEUDO = o
      var a = 'nesting'
      t.NESTING = a
      var u = 'id'
      t.ID = u
      var c = 'comment'
      t.COMMENT = c
      var f = 'combinator'
      t.COMBINATOR = f
      var l = 'class'
      t.CLASS = l
      var p = 'attribute'
      t.ATTRIBUTE = p
      var h = 'universal'
      t.UNIVERSAL = h
    },
    165: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = void 0
      var n = _interopRequireDefault(r(999))
      var i = r(600)
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
      function _inheritsLoose(e, t) {
        e.prototype = Object.create(t.prototype)
        e.prototype.constructor = e
        _setPrototypeOf(e, t)
      }
      function _setPrototypeOf(e, t) {
        _setPrototypeOf =
          Object.setPrototypeOf ||
          function _setPrototypeOf(e, t) {
            e.__proto__ = t
            return e
          }
        return _setPrototypeOf(e, t)
      }
      var s = (function (e) {
        _inheritsLoose(Universal, e)
        function Universal(t) {
          var r
          r = e.call(this, t) || this
          r.type = i.UNIVERSAL
          r.value = '*'
          return r
        }
        return Universal
      })(n['default'])
      t['default'] = s
      e.exports = t.default
    },
    173: (e, t) => {
      'use strict'
      t.__esModule = true
      t['default'] = sortAscending
      function sortAscending(e) {
        return e.sort(function (e, t) {
          return e - t
        })
      }
      e.exports = t.default
    },
    553: (e, t) => {
      'use strict'
      t.__esModule = true
      t.combinator =
        t.word =
        t.comment =
        t.str =
        t.tab =
        t.newline =
        t.feed =
        t.cr =
        t.backslash =
        t.bang =
        t.slash =
        t.doubleQuote =
        t.singleQuote =
        t.space =
        t.greaterThan =
        t.pipe =
        t.equals =
        t.plus =
        t.caret =
        t.tilde =
        t.dollar =
        t.closeSquare =
        t.openSquare =
        t.closeParenthesis =
        t.openParenthesis =
        t.semicolon =
        t.colon =
        t.comma =
        t.at =
        t.asterisk =
        t.ampersand =
          void 0
      var r = 38
      t.ampersand = r
      var n = 42
      t.asterisk = n
      var i = 64
      t.at = i
      var s = 44
      t.comma = s
      var o = 58
      t.colon = o
      var a = 59
      t.semicolon = a
      var u = 40
      t.openParenthesis = u
      var c = 41
      t.closeParenthesis = c
      var f = 91
      t.openSquare = f
      var l = 93
      t.closeSquare = l
      var p = 36
      t.dollar = p
      var h = 126
      t.tilde = h
      var d = 94
      t.caret = d
      var v = 43
      t.plus = v
      var _ = 61
      t.equals = _
      var y = 124
      t.pipe = y
      var g = 62
      t.greaterThan = g
      var S = 32
      t.space = S
      var b = 39
      t.singleQuote = b
      var w = 34
      t.doubleQuote = w
      var T = 47
      t.slash = T
      var m = 33
      t.bang = m
      var O = 92
      t.backslash = O
      var k = 13
      t.cr = k
      var P = 12
      t.feed = P
      var E = 10
      t.newline = E
      var D = 9
      t.tab = D
      var q = b
      t.str = q
      var L = -1
      t.comment = L
      var R = -2
      t.word = R
      var I = -3
      t.combinator = I
    },
    133: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t['default'] = tokenize
      t.FIELDS = void 0
      var n = _interopRequireWildcard(r(553))
      var i, s
      function _getRequireWildcardCache() {
        if (typeof WeakMap !== 'function') return null
        var e = new WeakMap()
        _getRequireWildcardCache = function _getRequireWildcardCache() {
          return e
        }
        return e
      }
      function _interopRequireWildcard(e) {
        if (e && e.__esModule) {
          return e
        }
        if (e === null || (typeof e !== 'object' && typeof e !== 'function')) {
          return { default: e }
        }
        var t = _getRequireWildcardCache()
        if (t && t.has(e)) {
          return t.get(e)
        }
        var r = {}
        var n = Object.defineProperty && Object.getOwnPropertyDescriptor
        for (var i in e) {
          if (Object.prototype.hasOwnProperty.call(e, i)) {
            var s = n ? Object.getOwnPropertyDescriptor(e, i) : null
            if (s && (s.get || s.set)) {
              Object.defineProperty(r, i, s)
            } else {
              r[i] = e[i]
            }
          }
        }
        r['default'] = e
        if (t) {
          t.set(e, r)
        }
        return r
      }
      var o =
        ((i = {}),
        (i[n.tab] = true),
        (i[n.newline] = true),
        (i[n.cr] = true),
        (i[n.feed] = true),
        i)
      var a =
        ((s = {}),
        (s[n.space] = true),
        (s[n.tab] = true),
        (s[n.newline] = true),
        (s[n.cr] = true),
        (s[n.feed] = true),
        (s[n.ampersand] = true),
        (s[n.asterisk] = true),
        (s[n.bang] = true),
        (s[n.comma] = true),
        (s[n.colon] = true),
        (s[n.semicolon] = true),
        (s[n.openParenthesis] = true),
        (s[n.closeParenthesis] = true),
        (s[n.openSquare] = true),
        (s[n.closeSquare] = true),
        (s[n.singleQuote] = true),
        (s[n.doubleQuote] = true),
        (s[n.plus] = true),
        (s[n.pipe] = true),
        (s[n.tilde] = true),
        (s[n.greaterThan] = true),
        (s[n.equals] = true),
        (s[n.dollar] = true),
        (s[n.caret] = true),
        (s[n.slash] = true),
        s)
      var u = {}
      var c = '0123456789abcdefABCDEF'
      for (var f = 0; f < c.length; f++) {
        u[c.charCodeAt(f)] = true
      }
      function consumeWord(e, t) {
        var r = t
        var i
        do {
          i = e.charCodeAt(r)
          if (a[i]) {
            return r - 1
          } else if (i === n.backslash) {
            r = consumeEscape(e, r) + 1
          } else {
            r++
          }
        } while (r < e.length)
        return r - 1
      }
      function consumeEscape(e, t) {
        var r = t
        var i = e.charCodeAt(r + 1)
        if (o[i]) {
        } else if (u[i]) {
          var s = 0
          do {
            r++
            s++
            i = e.charCodeAt(r + 1)
          } while (u[i] && s < 6)
          if (s < 6 && i === n.space) {
            r++
          }
        } else {
          r++
        }
        return r
      }
      var l = {
        TYPE: 0,
        START_LINE: 1,
        START_COL: 2,
        END_LINE: 3,
        END_COL: 4,
        START_POS: 5,
        END_POS: 6,
      }
      t.FIELDS = l
      function tokenize(e) {
        var t = []
        var r = e.css.valueOf()
        var i = r,
          s = i.length
        var o = -1
        var a = 1
        var u = 0
        var c = 0
        var f, l, p, h, d, v, _, y, g, S, b, w, T
        function unclosed(t, n) {
          if (e.safe) {
            r += n
            g = r.length - 1
          } else {
            throw e.error('Unclosed ' + t, a, u - o, u)
          }
        }
        while (u < s) {
          f = r.charCodeAt(u)
          if (f === n.newline) {
            o = u
            a += 1
          }
          switch (f) {
            case n.space:
            case n.tab:
            case n.newline:
            case n.cr:
            case n.feed:
              g = u
              do {
                g += 1
                f = r.charCodeAt(g)
                if (f === n.newline) {
                  o = g
                  a += 1
                }
              } while (
                f === n.space ||
                f === n.newline ||
                f === n.tab ||
                f === n.cr ||
                f === n.feed
              )
              T = n.space
              h = a
              p = g - o - 1
              c = g
              break
            case n.plus:
            case n.greaterThan:
            case n.tilde:
            case n.pipe:
              g = u
              do {
                g += 1
                f = r.charCodeAt(g)
              } while (
                f === n.plus ||
                f === n.greaterThan ||
                f === n.tilde ||
                f === n.pipe
              )
              T = n.combinator
              h = a
              p = u - o
              c = g
              break
            case n.asterisk:
            case n.ampersand:
            case n.bang:
            case n.comma:
            case n.equals:
            case n.dollar:
            case n.caret:
            case n.openSquare:
            case n.closeSquare:
            case n.colon:
            case n.semicolon:
            case n.openParenthesis:
            case n.closeParenthesis:
              g = u
              T = f
              h = a
              p = u - o
              c = g + 1
              break
            case n.singleQuote:
            case n.doubleQuote:
              w = f === n.singleQuote ? "'" : '"'
              g = u
              do {
                d = false
                g = r.indexOf(w, g + 1)
                if (g === -1) {
                  unclosed('quote', w)
                }
                v = g
                while (r.charCodeAt(v - 1) === n.backslash) {
                  v -= 1
                  d = !d
                }
              } while (d)
              T = n.str
              h = a
              p = u - o
              c = g + 1
              break
            default:
              if (f === n.slash && r.charCodeAt(u + 1) === n.asterisk) {
                g = r.indexOf('*/', u + 2) + 1
                if (g === 0) {
                  unclosed('comment', '*/')
                }
                l = r.slice(u, g + 1)
                y = l.split('\n')
                _ = y.length - 1
                if (_ > 0) {
                  S = a + _
                  b = g - y[_].length
                } else {
                  S = a
                  b = o
                }
                T = n.comment
                a = S
                h = S
                p = g - b
              } else if (f === n.slash) {
                g = u
                T = f
                h = a
                p = u - o
                c = g + 1
              } else {
                g = consumeWord(r, u)
                T = n.word
                h = a
                p = g - o
              }
              c = g + 1
              break
          }
          t.push([T, a, u - o, h, p, u, c])
          if (b) {
            o = b
            b = null
          }
          u = c
        }
        return t
      }
    },
    684: (e, t) => {
      'use strict'
      t.__esModule = true
      t['default'] = ensureObject
      function ensureObject(e) {
        for (
          var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1;
          n < t;
          n++
        ) {
          r[n - 1] = arguments[n]
        }
        while (r.length > 0) {
          var i = r.shift()
          if (!e[i]) {
            e[i] = {}
          }
          e = e[i]
        }
      }
      e.exports = t.default
    },
    976: (e, t) => {
      'use strict'
      t.__esModule = true
      t['default'] = getProp
      function getProp(e) {
        for (
          var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1;
          n < t;
          n++
        ) {
          r[n - 1] = arguments[n]
        }
        while (r.length > 0) {
          var i = r.shift()
          if (!e[i]) {
            return undefined
          }
          e = e[i]
        }
        return e
      }
      e.exports = t.default
    },
    513: (e, t, r) => {
      'use strict'
      t.__esModule = true
      t.stripComments = t.ensureObject = t.getProp = t.unesc = void 0
      var n = _interopRequireDefault(r(590))
      t.unesc = n['default']
      var i = _interopRequireDefault(r(976))
      t.getProp = i['default']
      var s = _interopRequireDefault(r(684))
      t.ensureObject = s['default']
      var o = _interopRequireDefault(r(453))
      t.stripComments = o['default']
      function _interopRequireDefault(e) {
        return e && e.__esModule ? e : { default: e }
      }
    },
    453: (e, t) => {
      'use strict'
      t.__esModule = true
      t['default'] = stripComments
      function stripComments(e) {
        var t = ''
        var r = e.indexOf('/*')
        var n = 0
        while (r >= 0) {
          t = t + e.slice(n, r)
          var i = e.indexOf('*/', r + 2)
          if (i < 0) {
            return t
          }
          n = i + 2
          r = e.indexOf('/*', n)
        }
        t = t + e.slice(n)
        return t
      }
      e.exports = t.default
    },
    590: (e, t) => {
      'use strict'
      t.__esModule = true
      t['default'] = unesc
      function gobbleHex(e) {
        var t = e.toLowerCase()
        var r = ''
        var n = false
        for (var i = 0; i < 6 && t[i] !== undefined; i++) {
          var s = t.charCodeAt(i)
          var o = (s >= 97 && s <= 102) || (s >= 48 && s <= 57)
          n = s === 32
          if (!o) {
            break
          }
          r += t[i]
        }
        if (r.length === 0) {
          return undefined
        }
        var a = parseInt(r, 16)
        var u = a >= 55296 && a <= 57343
        if (u || a === 0 || a > 1114111) {
          return ['�', r.length + (n ? 1 : 0)]
        }
        return [String.fromCodePoint(a), r.length + (n ? 1 : 0)]
      }
      var r = /\\/
      function unesc(e) {
        var t = r.test(e)
        if (!t) {
          return e
        }
        var n = ''
        for (var i = 0; i < e.length; i++) {
          if (e[i] === '\\') {
            var s = gobbleHex(e.slice(i + 1, i + 7))
            if (s !== undefined) {
              n += s[0]
              i += s[1]
              continue
            }
            if (e[i + 1] === '\\') {
              n += '\\'
              i++
              continue
            }
            if (e.length === i + 1) {
              n += e[i]
            }
            continue
          }
          n += e[i]
        }
        return n
      }
      e.exports = t.default
    },
    124: (e, t, r) => {
      e.exports = r(837).deprecate
    },
    837: (e) => {
      'use strict'
      e.exports = require('util')
    },
  }
  var t = {}
  function __nccwpck_require__(r) {
    var n = t[r]
    if (n !== undefined) {
      return n.exports
    }
    var i = (t[r] = { exports: {} })
    var s = true
    try {
      e[r](i, i.exports, __nccwpck_require__)
      s = false
    } finally {
      if (s) delete t[r]
    }
    return i.exports
  }
  if (typeof __nccwpck_require__ !== 'undefined')
    __nccwpck_require__.ab = __dirname + '/'
  var r = __nccwpck_require__(361)
  module.exports = r
})()
