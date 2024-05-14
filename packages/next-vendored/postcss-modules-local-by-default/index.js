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
        var l = 0
        var f = e.length
        while (l < f) {
          var p = e.charAt(l++)
          var h = p.charCodeAt()
          var d = void 0
          if (h < 32 || h > 126) {
            if (h >= 55296 && h <= 56319 && l < f) {
              var v = e.charCodeAt(l++)
              if ((v & 64512) == 56320) {
                h = ((h & 1023) << 10) + (v & 1023) + 65536
              } else {
                l--
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
    35: (e, t, r) => {
      'use strict'
      const n = r(235)
      const i = r(36)
      const { extractICSS: s } = r(417)
      const isSpacing = (e) => e.type === 'combinator' && e.value === ' '
      function normalizeNodeArray(e) {
        const t = []
        e.forEach((e) => {
          if (Array.isArray(e)) {
            normalizeNodeArray(e).forEach((e) => {
              t.push(e)
            })
          } else if (e) {
            t.push(e)
          }
        })
        if (t.length > 0 && isSpacing(t[t.length - 1])) {
          t.pop()
        }
        return t
      }
      function localizeNode(e, t, r) {
        const transform = (e, t) => {
          if (t.ignoreNextSpacing && !isSpacing(e)) {
            throw new Error('Missing whitespace after ' + t.ignoreNextSpacing)
          }
          if (t.enforceNoSpacing && isSpacing(e)) {
            throw new Error('Missing whitespace before ' + t.enforceNoSpacing)
          }
          let i
          switch (e.type) {
            case 'root': {
              let r
              t.hasPureGlobals = false
              i = e.nodes.map((n) => {
                const i = {
                  global: t.global,
                  lastWasSpacing: true,
                  hasLocals: false,
                  explicit: false,
                }
                n = transform(n, i)
                if (typeof r === 'undefined') {
                  r = i.global
                } else if (r !== i.global) {
                  throw new Error(
                    'Inconsistent rule global/local result in rule "' +
                      e +
                      '" (multiple selectors must result in the same mode for the rule)'
                  )
                }
                if (!i.hasLocals) {
                  t.hasPureGlobals = true
                }
                return n
              })
              t.global = r
              e.nodes = normalizeNodeArray(i)
              break
            }
            case 'selector': {
              i = e.map((e) => transform(e, t))
              e = e.clone()
              e.nodes = normalizeNodeArray(i)
              break
            }
            case 'combinator': {
              if (isSpacing(e)) {
                if (t.ignoreNextSpacing) {
                  t.ignoreNextSpacing = false
                  t.lastWasSpacing = false
                  t.enforceNoSpacing = false
                  return null
                }
                t.lastWasSpacing = true
                return e
              }
              break
            }
            case 'pseudo': {
              let r
              const s = !!e.length
              const o = e.value === ':local' || e.value === ':global'
              const a = e.value === ':import' || e.value === ':export'
              if (a) {
                t.hasLocals = true
              } else if (s) {
                if (o) {
                  if (e.nodes.length === 0) {
                    throw new Error(`${e.value}() can't be empty`)
                  }
                  if (t.inside) {
                    throw new Error(
                      `A ${e.value} is not allowed inside of a ${t.inside}(...)`
                    )
                  }
                  r = {
                    global: e.value === ':global',
                    inside: e.value,
                    hasLocals: false,
                    explicit: true,
                  }
                  i = e
                    .map((e) => transform(e, r))
                    .reduce((e, t) => e.concat(t.nodes), [])
                  if (i.length) {
                    const { before: t, after: r } = e.spaces
                    const n = i[0]
                    const s = i[i.length - 1]
                    n.spaces = { before: t, after: n.spaces.after }
                    s.spaces = { before: s.spaces.before, after: r }
                  }
                  e = i
                  break
                } else {
                  r = {
                    global: t.global,
                    inside: t.inside,
                    lastWasSpacing: true,
                    hasLocals: false,
                    explicit: t.explicit,
                  }
                  i = e.map((e) => {
                    const t = { ...r, enforceNoSpacing: false }
                    const n = transform(e, t)
                    r.global = t.global
                    r.hasLocals = t.hasLocals
                    return n
                  })
                  e = e.clone()
                  e.nodes = normalizeNodeArray(i)
                  if (r.hasLocals) {
                    t.hasLocals = true
                  }
                }
                break
              } else if (o) {
                if (t.inside) {
                  throw new Error(
                    `A ${e.value} is not allowed inside of a ${t.inside}(...)`
                  )
                }
                const r = !!e.spaces.before
                t.ignoreNextSpacing = t.lastWasSpacing ? e.value : false
                t.enforceNoSpacing = t.lastWasSpacing ? false : e.value
                t.global = e.value === ':global'
                t.explicit = true
                return r ? n.combinator({ value: ' ' }) : null
              }
              break
            }
            case 'id':
            case 'class': {
              if (!e.value) {
                throw new Error('Invalid class or id selector syntax')
              }
              if (t.global) {
                break
              }
              const i = r.has(e.value)
              const s = i && t.explicit
              if (!i || s) {
                const r = e.clone()
                r.spaces = { before: '', after: '' }
                e = n.pseudo({ value: ':local', nodes: [r], spaces: e.spaces })
                t.hasLocals = true
              }
              break
            }
            case 'nesting': {
              if (e.value === '&') {
                t.hasLocals = true
              }
            }
          }
          t.lastWasSpacing = false
          t.ignoreNextSpacing = false
          t.enforceNoSpacing = false
          return e
        }
        const i = { global: t === 'global', hasPureGlobals: false }
        i.selector = n((e) => {
          transform(e, i)
        }).processSync(e, { updateSelector: false, lossless: true })
        return i
      }
      function localizeDeclNode(e, t) {
        switch (e.type) {
          case 'word':
            if (t.localizeNextItem) {
              if (!t.localAliasMap.has(e.value)) {
                e.value = ':local(' + e.value + ')'
                t.localizeNextItem = false
              }
            }
            break
          case 'function':
            if (
              t.options &&
              t.options.rewriteUrl &&
              e.value.toLowerCase() === 'url'
            ) {
              e.nodes.map((e) => {
                if (e.type !== 'string' && e.type !== 'word') {
                  return
                }
                let r = t.options.rewriteUrl(t.global, e.value)
                switch (e.type) {
                  case 'string':
                    if (e.quote === "'") {
                      r = r.replace(/(\\)/g, '\\$1').replace(/'/g, "\\'")
                    }
                    if (e.quote === '"') {
                      r = r.replace(/(\\)/g, '\\$1').replace(/"/g, '\\"')
                    }
                    break
                  case 'word':
                    r = r.replace(/("|'|\)|\\)/g, '\\$1')
                    break
                }
                e.value = r
              })
            }
            break
        }
        return e
      }
      const o = [
        'none',
        'inherit',
        'initial',
        'revert',
        'revert-layer',
        'unset',
      ]
      function localizeDeclarationValues(e, t, r) {
        const n = i(t.value)
        n.walk((t, n, i) => {
          if (
            t.type === 'function' &&
            (t.value.toLowerCase() === 'var' || t.value.toLowerCase() === 'env')
          ) {
            return false
          }
          if (t.type === 'word' && o.includes(t.value.toLowerCase())) {
            return
          }
          const s = {
            options: r.options,
            global: r.global,
            localizeNextItem: e && !r.global,
            localAliasMap: r.localAliasMap,
          }
          i[n] = localizeDeclNode(t, s)
        })
        t.value = n.toString()
      }
      function localizeDeclaration(e, t) {
        const r = /animation$/i.test(e.prop)
        if (r) {
          const r =
            /^-?([a-z\u0080-\uFFFF_]|(\\[^\r\n\f])|-(?![0-9]))((\\[^\r\n\f])|[a-z\u0080-\uFFFF_0-9-])*$/i
          const n = {
            $normal: 1,
            $reverse: 1,
            $alternate: 1,
            '$alternate-reverse': 1,
            $forwards: 1,
            $backwards: 1,
            $both: 1,
            $infinite: 1,
            $paused: 1,
            $running: 1,
            $ease: 1,
            '$ease-in': 1,
            '$ease-out': 1,
            '$ease-in-out': 1,
            $linear: 1,
            '$step-end': 1,
            '$step-start': 1,
            $none: Infinity,
            $initial: Infinity,
            $inherit: Infinity,
            $unset: Infinity,
            $revert: Infinity,
            '$revert-layer': Infinity,
          }
          let s = {}
          const o = i(e.value).walk((e) => {
            if (e.type === 'div') {
              s = {}
              return
            } else if (e.type === 'function') {
              return false
            } else if (e.type !== 'word') {
              return
            }
            const i = e.type === 'word' ? e.value.toLowerCase() : null
            let o = false
            if (i && r.test(i)) {
              if ('$' + i in n) {
                s['$' + i] = '$' + i in s ? s['$' + i] + 1 : 0
                o = s['$' + i] >= n['$' + i]
              } else {
                o = true
              }
            }
            const a = {
              options: t.options,
              global: t.global,
              localizeNextItem: o && !t.global,
              localAliasMap: t.localAliasMap,
            }
            return localizeDeclNode(e, a)
          })
          e.value = o.toString()
          return
        }
        const n = /animation(-name)?$/i.test(e.prop)
        if (n) {
          return localizeDeclarationValues(true, e, t)
        }
        const s = /url\(/i.test(e.value)
        if (s) {
          return localizeDeclarationValues(false, e, t)
        }
      }
      e.exports = (e = {}) => {
        if (
          e &&
          e.mode &&
          e.mode !== 'global' &&
          e.mode !== 'local' &&
          e.mode !== 'pure'
        ) {
          throw new Error(
            'options.mode must be either "global", "local" or "pure" (default "local")'
          )
        }
        const t = e && e.mode === 'pure'
        const r = e && e.mode === 'global'
        return {
          postcssPlugin: 'postcss-modules-local-by-default',
          prepare() {
            const n = new Map()
            return {
              Once(i) {
                const { icssImports: o } = s(i, false)
                Object.keys(o).forEach((e) => {
                  Object.keys(o[e]).forEach((t) => {
                    n.set(t, o[e][t])
                  })
                })
                i.walkAtRules((i) => {
                  if (/keyframes$/i.test(i.name)) {
                    const s = /^\s*:global\s*\((.+)\)\s*$/.exec(i.params)
                    const o = /^\s*:local\s*\((.+)\)\s*$/.exec(i.params)
                    let a = r
                    if (s) {
                      if (t) {
                        throw i.error(
                          '@keyframes :global(...) is not allowed in pure mode'
                        )
                      }
                      i.params = s[1]
                      a = true
                    } else if (o) {
                      i.params = o[0]
                      a = false
                    } else if (i.params && !r && !n.has(i.params)) {
                      i.params = ':local(' + i.params + ')'
                    }
                    i.walkDecls((t) => {
                      localizeDeclaration(t, {
                        localAliasMap: n,
                        options: e,
                        global: a,
                      })
                    })
                  } else if (/scope$/i.test(i.name)) {
                    i.params = i.params
                      .split('to')
                      .map((r) => {
                        const s = r.trim().slice(1, -1).trim()
                        const o = localizeNode(s, e.mode, n)
                        o.options = e
                        o.localAliasMap = n
                        if (t && o.hasPureGlobals) {
                          throw i.error(
                            'Selector in at-rule"' +
                              s +
                              '" is not pure ' +
                              '(pure selectors must contain at least one local class or id)'
                          )
                        }
                        return `(${o.selector})`
                      })
                      .join(' to ')
                    i.nodes.forEach((t) => {
                      if (t.type === 'decl') {
                        localizeDeclaration(t, {
                          localAliasMap: n,
                          options: e,
                          global: r,
                        })
                      }
                    })
                  } else if (i.nodes) {
                    i.nodes.forEach((t) => {
                      if (t.type === 'decl') {
                        localizeDeclaration(t, {
                          localAliasMap: n,
                          options: e,
                          global: r,
                        })
                      }
                    })
                  }
                })
                i.walkRules((r) => {
                  if (
                    r.parent &&
                    r.parent.type === 'atrule' &&
                    /keyframes$/i.test(r.parent.name)
                  ) {
                    return
                  }
                  const i = localizeNode(r, e.mode, n)
                  i.options = e
                  i.localAliasMap = n
                  if (t && i.hasPureGlobals) {
                    throw r.error(
                      'Selector "' +
                        r.selector +
                        '" is not pure ' +
                        '(pure selectors must contain at least one local class or id)'
                    )
                  }
                  r.selector = i.selector
                  if (r.nodes) {
                    r.nodes.forEach((e) => localizeDeclaration(e, i))
                  }
                })
              },
            }
          },
        }
      }
      e.exports.postcss = true
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
      var l = _interopRequireDefault(r(326))
      var f = _interopRequireWildcard(r(248))
      var p = _interopRequireDefault(r(165))
      var h = _interopRequireDefault(r(537))
      var d = _interopRequireDefault(r(60))
      var v = _interopRequireDefault(r(173))
      var _ = _interopRequireWildcard(r(133))
      var g = _interopRequireWildcard(r(553))
      var y = _interopRequireWildcard(r(600))
      var b = r(513)
      var S, m
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
      var w =
        ((S = {}),
        (S[g.space] = true),
        (S[g.cr] = true),
        (S[g.feed] = true),
        (S[g.newline] = true),
        (S[g.tab] = true),
        S)
      var T = Object.assign({}, w, ((m = {}), (m[g.comment] = true), m))
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
          ;(0, b.ensureObject)(e, 'raws')
          e[t] = (0, b.unesc)(r)
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
      var k = (function () {
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
            this.currToken[_.FIELDS.TYPE] !== g.closeSquare
          ) {
            e.push(this.currToken)
            this.position++
          }
          if (this.currToken[_.FIELDS.TYPE] !== g.closeSquare) {
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
          if (r === 1 && !~[g.word].indexOf(e[0][_.FIELDS.TYPE])) {
            return this.expected('attribute', e[0][_.FIELDS.START_POS])
          }
          var i = 0
          var s = ''
          var o = ''
          var a = null
          var u = false
          while (i < r) {
            var c = e[i]
            var l = this.content(c)
            var p = e[i + 1]
            switch (c[_.FIELDS.TYPE]) {
              case g.space:
                u = true
                if (this.options.lossy) {
                  break
                }
                if (a) {
                  ;(0, b.ensureObject)(n, 'spaces', a)
                  var h = n.spaces[a].after || ''
                  n.spaces[a].after = h + l
                  var d =
                    (0, b.getProp)(n, 'raws', 'spaces', a, 'after') || null
                  if (d) {
                    n.raws.spaces[a].after = d + l
                  }
                } else {
                  s = s + l
                  o = o + l
                }
                break
              case g.asterisk:
                if (p[_.FIELDS.TYPE] === g.equals) {
                  n.operator = l
                  a = 'operator'
                } else if ((!n.namespace || (a === 'namespace' && !u)) && p) {
                  if (s) {
                    ;(0, b.ensureObject)(n, 'spaces', 'attribute')
                    n.spaces.attribute.before = s
                    s = ''
                  }
                  if (o) {
                    ;(0, b.ensureObject)(n, 'raws', 'spaces', 'attribute')
                    n.raws.spaces.attribute.before = s
                    o = ''
                  }
                  n.namespace = (n.namespace || '') + l
                  var v = (0, b.getProp)(n, 'raws', 'namespace') || null
                  if (v) {
                    n.raws.namespace += l
                  }
                  a = 'namespace'
                }
                u = false
                break
              case g.dollar:
                if (a === 'value') {
                  var y = (0, b.getProp)(n, 'raws', 'value')
                  n.value += '$'
                  if (y) {
                    n.raws.value = y + '$'
                  }
                  break
                }
              case g.caret:
                if (p[_.FIELDS.TYPE] === g.equals) {
                  n.operator = l
                  a = 'operator'
                }
                u = false
                break
              case g.combinator:
                if (l === '~' && p[_.FIELDS.TYPE] === g.equals) {
                  n.operator = l
                  a = 'operator'
                }
                if (l !== '|') {
                  u = false
                  break
                }
                if (p[_.FIELDS.TYPE] === g.equals) {
                  n.operator = l
                  a = 'operator'
                } else if (!n.namespace && !n.attribute) {
                  n.namespace = true
                }
                u = false
                break
              case g.word:
                if (
                  p &&
                  this.content(p) === '|' &&
                  e[i + 2] &&
                  e[i + 2][_.FIELDS.TYPE] !== g.equals &&
                  !n.operator &&
                  !n.namespace
                ) {
                  n.namespace = l
                  a = 'namespace'
                } else if (!n.attribute || (a === 'attribute' && !u)) {
                  if (s) {
                    ;(0, b.ensureObject)(n, 'spaces', 'attribute')
                    n.spaces.attribute.before = s
                    s = ''
                  }
                  if (o) {
                    ;(0, b.ensureObject)(n, 'raws', 'spaces', 'attribute')
                    n.raws.spaces.attribute.before = o
                    o = ''
                  }
                  n.attribute = (n.attribute || '') + l
                  var S = (0, b.getProp)(n, 'raws', 'attribute') || null
                  if (S) {
                    n.raws.attribute += l
                  }
                  a = 'attribute'
                } else if (
                  (!n.value && n.value !== '') ||
                  (a === 'value' && !(u || n.quoteMark))
                ) {
                  var m = (0, b.unesc)(l)
                  var w = (0, b.getProp)(n, 'raws', 'value') || ''
                  var T = n.value || ''
                  n.value = T + m
                  n.quoteMark = null
                  if (m !== l || w) {
                    ;(0, b.ensureObject)(n, 'raws')
                    n.raws.value = (w || T) + l
                  }
                  a = 'value'
                } else {
                  var k = l === 'i' || l === 'I'
                  if ((n.value || n.value === '') && (n.quoteMark || u)) {
                    n.insensitive = k
                    if (!k || l === 'I') {
                      ;(0, b.ensureObject)(n, 'raws')
                      n.raws.insensitiveFlag = l
                    }
                    a = 'insensitive'
                    if (s) {
                      ;(0, b.ensureObject)(n, 'spaces', 'insensitive')
                      n.spaces.insensitive.before = s
                      s = ''
                    }
                    if (o) {
                      ;(0, b.ensureObject)(n, 'raws', 'spaces', 'insensitive')
                      n.raws.spaces.insensitive.before = o
                      o = ''
                    }
                  } else if (n.value || n.value === '') {
                    a = 'value'
                    n.value += l
                    if (n.raws.value) {
                      n.raws.value += l
                    }
                  }
                }
                u = false
                break
              case g.str:
                if (!n.attribute || !n.operator) {
                  return this.error(
                    'Expected an attribute followed by an operator preceding the string.',
                    { index: c[_.FIELDS.START_POS] }
                  )
                }
                var O = (0, f.unescapeValue)(l),
                  P = O.unescaped,
                  E = O.quoteMark
                n.value = P
                n.quoteMark = E
                a = 'value'
                ;(0, b.ensureObject)(n, 'raws')
                n.raws.value = l
                u = false
                break
              case g.equals:
                if (!n.attribute) {
                  return this.expected('attribute', c[_.FIELDS.START_POS], l)
                }
                if (n.value) {
                  return this.error(
                    'Unexpected "=" found; an operator was already defined.',
                    { index: c[_.FIELDS.START_POS] }
                  )
                }
                n.operator = n.operator ? n.operator + l : l
                a = 'operator'
                u = false
                break
              case g.comment:
                if (a) {
                  if (
                    u ||
                    (p && p[_.FIELDS.TYPE] === g.space) ||
                    a === 'insensitive'
                  ) {
                    var D = (0, b.getProp)(n, 'spaces', a, 'after') || ''
                    var L = (0, b.getProp)(n, 'raws', 'spaces', a, 'after') || D
                    ;(0, b.ensureObject)(n, 'raws', 'spaces', a)
                    n.raws.spaces[a].after = L + l
                  } else {
                    var I = n[a] || ''
                    var q = (0, b.getProp)(n, 'raws', a) || I
                    ;(0, b.ensureObject)(n, 'raws')
                    n.raws[a] = q + l
                  }
                } else {
                  o = o + l
                }
                break
              default:
                return this.error('Unexpected "' + l + '" found.', {
                  index: c[_.FIELDS.START_POS],
                })
            }
            i++
          }
          unescapeProp(n, 'attribute')
          unescapeProp(n, 'namespace')
          this.newNode(new f['default'](n))
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
              if (w[this.currToken[_.FIELDS.TYPE]]) {
                if (!this.options.lossy) {
                  n += this.content()
                }
              } else if (this.currToken[_.FIELDS.TYPE] === g.comment) {
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
            this.tokens[e + 0][_.FIELDS.TYPE] === g.slash &&
            this.tokens[e + 1] &&
            this.tokens[e + 1][_.FIELDS.TYPE] === g.word &&
            this.tokens[e + 2] &&
            this.tokens[e + 2][_.FIELDS.TYPE] === g.slash
          )
        }
        e.namedCombinator = function namedCombinator() {
          if (this.isNamedCombinator()) {
            var e = this.content(this.tokens[this.position + 1])
            var t = (0, b.unesc)(e).toLowerCase()
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
          if (t < 0 || this.tokens[t][_.FIELDS.TYPE] === g.comma) {
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
          } else if (this.currToken[_.FIELDS.TYPE] === g.combinator) {
            c = new h['default']({
              value: this.content(),
              source: getTokenSource(this.currToken),
              sourceIndex: this.currToken[_.FIELDS.START_POS],
            })
            this.position++
          } else if (w[this.currToken[_.FIELDS.TYPE]]) {
          } else if (!u) {
            this.unexpected()
          }
          if (c) {
            if (u) {
              var l = this.convertWhitespaceNodesToSpace(u),
                f = l.space,
                p = l.rawSpace
              c.spaces.before = f
              c.rawSpaceBefore = p
            }
          } else {
            var d = this.convertWhitespaceNodesToSpace(u, true),
              v = d.space,
              y = d.rawSpace
            if (!y) {
              y = v
            }
            var b = {}
            var S = { spaces: {} }
            if (v.endsWith(' ') && y.endsWith(' ')) {
              b.before = v.slice(0, v.length - 1)
              S.spaces.before = y.slice(0, y.length - 1)
            } else if (v.startsWith(' ') && y.startsWith(' ')) {
              b.after = v.slice(1)
              S.spaces.after = y.slice(1)
            } else {
              S.value = y
            }
            c = new h['default']({
              value: ' ',
              source: getTokenSourceSpan(a, this.tokens[this.position - 1]),
              sourceIndex: a[_.FIELDS.START_POS],
              spaces: b,
              raws: S,
            })
          }
          if (this.currToken && this.currToken[_.FIELDS.TYPE] === g.space) {
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
          if (this.nextToken[_.FIELDS.TYPE] === g.word) {
            this.position++
            return this.word(e)
          } else if (this.nextToken[_.FIELDS.TYPE] === g.asterisk) {
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
          if (e && e.type === y.PSEUDO) {
            var r = new i['default']({
              source: { start: tokenStart(this.tokens[this.position - 1]) },
            })
            var n = this.current
            e.append(r)
            this.current = r
            while (this.position < this.tokens.length && t) {
              if (this.currToken[_.FIELDS.TYPE] === g.openParenthesis) {
                t++
              }
              if (this.currToken[_.FIELDS.TYPE] === g.closeParenthesis) {
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
              if (this.currToken[_.FIELDS.TYPE] === g.openParenthesis) {
                t++
              }
              if (this.currToken[_.FIELDS.TYPE] === g.closeParenthesis) {
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
          while (this.currToken && this.currToken[_.FIELDS.TYPE] === g.colon) {
            t += this.content()
            this.position++
          }
          if (!this.currToken) {
            return this.expected(
              ['pseudo-class', 'pseudo-element'],
              this.position - 1
            )
          }
          if (this.currToken[_.FIELDS.TYPE] === g.word) {
            this.splitWord(false, function (n, i) {
              t += n
              e.newNode(
                new l['default']({
                  value: t,
                  source: getTokenSourceSpan(r, e.currToken),
                  sourceIndex: r[_.FIELDS.START_POS],
                })
              )
              if (
                i > 1 &&
                e.nextToken &&
                e.nextToken[_.FIELDS.TYPE] === g.openParenthesis
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
            this.prevToken[_.FIELDS.TYPE] === g.comma ||
            this.prevToken[_.FIELDS.TYPE] === g.openParenthesis ||
            this.current.nodes.every(function (e) {
              return e.type === 'comment'
            })
          ) {
            this.spaces = this.optionalSpace(e)
            this.position++
          } else if (
            this.position === this.tokens.length - 1 ||
            this.nextToken[_.FIELDS.TYPE] === g.comma ||
            this.nextToken[_.FIELDS.TYPE] === g.closeParenthesis
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
            ~[g.dollar, g.caret, g.equals, g.word].indexOf(n[_.FIELDS.TYPE])
          ) {
            this.position++
            var o = this.content()
            i += o
            if (o.lastIndexOf('\\') === o.length - 1) {
              var c = this.nextToken
              if (c && c[_.FIELDS.TYPE] === g.space) {
                i += this.requiredSpace(this.content(c))
                this.position++
              }
            }
            n = this.nextToken
          }
          var l = indexesOf(i, '.').filter(function (e) {
            var t = i[e - 1] === '\\'
            var r = /^\d+\.\d+%$/.test(i)
            return !t && !r
          })
          var f = indexesOf(i, '#').filter(function (e) {
            return i[e - 1] !== '\\'
          })
          var p = indexesOf(i, '#{')
          if (p.length) {
            f = f.filter(function (e) {
              return !~p.indexOf(e)
            })
          }
          var h = (0, v['default'])(uniqs([0].concat(l, f)))
          h.forEach(function (n, o) {
            var c = h[o + 1] || i.length
            var p = i.slice(n, c)
            if (o === 0 && t) {
              return t.call(r, p, h.length)
            }
            var d
            var v = r.currToken
            var g = v[_.FIELDS.START_POS] + h[o]
            var y = getSource(v[1], v[2] + n, v[3], v[2] + (c - 1))
            if (~l.indexOf(n)) {
              var b = { value: p.slice(1), source: y, sourceIndex: g }
              d = new s['default'](unescapeProp(b, 'value'))
            } else if (~f.indexOf(n)) {
              var S = { value: p.slice(1), source: y, sourceIndex: g }
              d = new a['default'](unescapeProp(S, 'value'))
            } else {
              var m = { value: p, source: y, sourceIndex: g }
              unescapeProp(m, 'value')
              d = new u['default'](m)
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
            case g.space:
              this.space()
              break
            case g.comment:
              this.comment()
              break
            case g.openParenthesis:
              this.parentheses()
              break
            case g.closeParenthesis:
              if (e) {
                this.missingParenthesis()
              }
              break
            case g.openSquare:
              this.attribute()
              break
            case g.dollar:
            case g.caret:
            case g.equals:
            case g.word:
              this.word()
              break
            case g.colon:
              this.pseudo()
              break
            case g.comma:
              this.comma()
              break
            case g.asterisk:
              this.universal()
              break
            case g.ampersand:
              this.nesting()
              break
            case g.slash:
            case g.combinator:
              this.combinator()
              break
            case g.str:
              this.string()
              break
            case g.closeSquare:
              this.missingSquareBracket()
            case g.semicolon:
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
          if (e[_.FIELDS.TYPE] === g.space) {
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
            if (T[this.tokens[t][_.FIELDS.TYPE]]) {
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
      t['default'] = k
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
      var l = u(function () {},
      'Assigning an attribute a value containing characters that might need to be escaped is deprecated. ' + 'Call attribute.setValue() instead.')
      var f = u(function () {},
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
              f()
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
                  l()
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
      var l = _interopRequireDefault(r(422))
      var f = _interopRequireDefault(r(13))
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
      var g = function combinator(e) {
        return new s['default'](e)
      }
      t.combinator = g
      var y = function comment(e) {
        return new o['default'](e)
      }
      t.comment = y
      var b = function id(e) {
        return new a['default'](e)
      }
      t.id = b
      var S = function nesting(e) {
        return new u['default'](e)
      }
      t.nesting = S
      var m = function pseudo(e) {
        return new c['default'](e)
      }
      t.pseudo = m
      var w = function root(e) {
        return new l['default'](e)
      }
      t.root = w
      var T = function selector(e) {
        return new f['default'](e)
      }
      t.selector = T
      var k = function string(e) {
        return new p['default'](e)
      }
      t.string = k
      var O = function tag(e) {
        return new h['default'](e)
      }
      t.tag = O
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
      var l = isNodeType.bind(null, n.ID)
      t.isIdentifier = l
      var f = isNodeType.bind(null, n.NESTING)
      t.isNesting = f
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
      var g = isNodeType.bind(null, n.UNIVERSAL)
      t.isUniversal = g
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
      var l = 'combinator'
      t.COMBINATOR = l
      var f = 'class'
      t.CLASS = f
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
      var l = 91
      t.openSquare = l
      var f = 93
      t.closeSquare = f
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
      var g = 124
      t.pipe = g
      var y = 62
      t.greaterThan = y
      var b = 32
      t.space = b
      var S = 39
      t.singleQuote = S
      var m = 34
      t.doubleQuote = m
      var w = 47
      t.slash = w
      var T = 33
      t.bang = T
      var k = 92
      t.backslash = k
      var O = 13
      t.cr = O
      var P = 12
      t.feed = P
      var E = 10
      t.newline = E
      var D = 9
      t.tab = D
      var L = S
      t.str = L
      var I = -1
      t.comment = I
      var q = -2
      t.word = q
      var R = -3
      t.combinator = R
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
      for (var l = 0; l < c.length; l++) {
        u[c.charCodeAt(l)] = true
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
      var f = {
        TYPE: 0,
        START_LINE: 1,
        START_COL: 2,
        END_LINE: 3,
        END_COL: 4,
        START_POS: 5,
        END_POS: 6,
      }
      t.FIELDS = f
      function tokenize(e) {
        var t = []
        var r = e.css.valueOf()
        var i = r,
          s = i.length
        var o = -1
        var a = 1
        var u = 0
        var c = 0
        var l, f, p, h, d, v, _, g, y, b, S, m, w
        function unclosed(t, n) {
          if (e.safe) {
            r += n
            y = r.length - 1
          } else {
            throw e.error('Unclosed ' + t, a, u - o, u)
          }
        }
        while (u < s) {
          l = r.charCodeAt(u)
          if (l === n.newline) {
            o = u
            a += 1
          }
          switch (l) {
            case n.space:
            case n.tab:
            case n.newline:
            case n.cr:
            case n.feed:
              y = u
              do {
                y += 1
                l = r.charCodeAt(y)
                if (l === n.newline) {
                  o = y
                  a += 1
                }
              } while (
                l === n.space ||
                l === n.newline ||
                l === n.tab ||
                l === n.cr ||
                l === n.feed
              )
              w = n.space
              h = a
              p = y - o - 1
              c = y
              break
            case n.plus:
            case n.greaterThan:
            case n.tilde:
            case n.pipe:
              y = u
              do {
                y += 1
                l = r.charCodeAt(y)
              } while (
                l === n.plus ||
                l === n.greaterThan ||
                l === n.tilde ||
                l === n.pipe
              )
              w = n.combinator
              h = a
              p = u - o
              c = y
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
              y = u
              w = l
              h = a
              p = u - o
              c = y + 1
              break
            case n.singleQuote:
            case n.doubleQuote:
              m = l === n.singleQuote ? "'" : '"'
              y = u
              do {
                d = false
                y = r.indexOf(m, y + 1)
                if (y === -1) {
                  unclosed('quote', m)
                }
                v = y
                while (r.charCodeAt(v - 1) === n.backslash) {
                  v -= 1
                  d = !d
                }
              } while (d)
              w = n.str
              h = a
              p = u - o
              c = y + 1
              break
            default:
              if (l === n.slash && r.charCodeAt(u + 1) === n.asterisk) {
                y = r.indexOf('*/', u + 2) + 1
                if (y === 0) {
                  unclosed('comment', '*/')
                }
                f = r.slice(u, y + 1)
                g = f.split('\n')
                _ = g.length - 1
                if (_ > 0) {
                  b = a + _
                  S = y - g[_].length
                } else {
                  b = a
                  S = o
                }
                w = n.comment
                a = b
                h = b
                p = y - S
              } else if (l === n.slash) {
                y = u
                w = l
                h = a
                p = u - o
                c = y + 1
              } else {
                y = consumeWord(r, u)
                w = n.word
                h = a
                p = y - o
              }
              c = y + 1
              break
          }
          t.push([w, a, u - o, h, p, u, c])
          if (S) {
            o = S
            S = null
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
    417: (e) => {
      'use strict'
      e.exports = require('../icss-utils')
    },
    36: (e) => {
      'use strict'
      e.exports = require('../postcss-value-parser')
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
  var r = __nccwpck_require__(35)
  module.exports = r
})()
