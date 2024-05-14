;(() => {
  var e = {
    830: (e) => {
      'use strict'
      e.exports = require('../querystring-es3')
    },
  }
  var t = {}
  function __nccwpck_require__(o) {
    var a = t[o]
    if (a !== undefined) {
      return a.exports
    }
    var s = (t[o] = { exports: {} })
    var p = true
    try {
      e[o](s, s.exports, __nccwpck_require__)
      p = false
    } finally {
      if (p) delete t[o]
    }
    return s.exports
  }
  if (typeof __nccwpck_require__ !== 'undefined')
    __nccwpck_require__.ab = __dirname + '/'
  var o = {}
  ;(() => {
    var e = o
    var t,
      a =
        (t = __nccwpck_require__(830)) && 'object' == typeof t && 'default' in t
          ? t.default
          : t,
      s = /https?|ftp|gopher|file/
    function r(e) {
      'string' == typeof e && (e = d(e))
      var t = (function (e, t, o) {
        var a = e.auth,
          s = e.hostname,
          p = e.protocol || '',
          n = e.pathname || '',
          c = e.hash || '',
          i = e.query || '',
          u = !1
        ;(a = a ? encodeURIComponent(a).replace(/%3A/i, ':') + '@' : ''),
          e.host
            ? (u = a + e.host)
            : s &&
              ((u = a + (~s.indexOf(':') ? '[' + s + ']' : s)),
              e.port && (u += ':' + e.port)),
          i && 'object' == typeof i && (i = t.encode(i))
        var f = e.search || (i && '?' + i) || ''
        return (
          p && ':' !== p.substr(-1) && (p += ':'),
          e.slashes || ((!p || o.test(p)) && !1 !== u)
            ? ((u = '//' + (u || '')), n && '/' !== n[0] && (n = '/' + n))
            : u || (u = ''),
          c && '#' !== c[0] && (c = '#' + c),
          f && '?' !== f[0] && (f = '?' + f),
          {
            protocol: p,
            host: u,
            pathname: (n = n.replace(/[?#]/g, encodeURIComponent)),
            search: (f = f.replace('#', '%23')),
            hash: c,
          }
        )
      })(e, a, s)
      return '' + t.protocol + t.host + t.pathname + t.search + t.hash
    }
    var p = 'http://',
      n = 'w.w',
      c = p + n,
      i = /^([a-z0-9.+-]*:\/\/\/)([a-z0-9.+-]:\/*)?/i,
      u = /https?|ftp|gopher|file/
    function h(e, t) {
      var o = 'string' == typeof e ? d(e) : e
      e = 'object' == typeof e ? r(e) : e
      var a = d(t),
        s = ''
      o.protocol &&
        !o.slashes &&
        ((s = o.protocol),
        (e = e.replace(o.protocol, '')),
        (s += '/' === t[0] || '/' === e[0] ? '/' : '')),
        s &&
          a.protocol &&
          ((s = ''),
          a.slashes || ((s = a.protocol), (t = t.replace(a.protocol, ''))))
      var n = e.match(i)
      n &&
        !a.protocol &&
        ((e = e.substr((s = n[1] + (n[2] || '')).length)),
        /^\/\/[^/]/.test(t) && (s = s.slice(0, -1)))
      var f = new URL(e, c + '/'),
        m = new URL(t, f).toString().replace(c, ''),
        v = a.protocol || o.protocol
      return (
        (v += o.slashes || a.slashes ? '//' : ''),
        !s && v ? (m = m.replace(p, v)) : s && (m = m.replace(p, '')),
        u.test(m) ||
          ~t.indexOf('.') ||
          '/' === e.slice(-1) ||
          '/' === t.slice(-1) ||
          '/' !== m.slice(-1) ||
          (m = m.slice(0, -1)),
        s && (m = s + ('/' === m[0] ? m.substr(1) : m)),
        m
      )
    }
    function l() {}
    ;(l.prototype.parse = d),
      (l.prototype.format = r),
      (l.prototype.resolve = h),
      (l.prototype.resolveObject = h)
    var f = /^https?|ftp|gopher|file/,
      m = /^(.*?)([#?].*)/,
      v = /^([a-z0-9.+-]*:)(\/{0,3})(.*)/i,
      _ = /^([a-z0-9.+-]*:)?\/\/\/*/i,
      b = /^([a-z0-9.+-]*:)(\/{0,2})\[(.*)\]$/i
    function d(e, t, o) {
      if (
        (void 0 === t && (t = !1),
        void 0 === o && (o = !1),
        e && 'object' == typeof e && e instanceof l)
      )
        return e
      var s = (e = e.trim()).match(m)
      ;(e = s ? s[1].replace(/\\/g, '/') + s[2] : e.replace(/\\/g, '/')),
        b.test(e) && '/' !== e.slice(-1) && (e += '/')
      var p = !/(^javascript)/.test(e) && e.match(v),
        i = _.test(e),
        u = ''
      p &&
        (f.test(p[1]) || ((u = p[1].toLowerCase()), (e = '' + p[2] + p[3])),
        p[2] ||
          ((i = !1),
          f.test(p[1]) ? ((u = p[1]), (e = '' + p[3])) : (e = '//' + p[3])),
        (3 !== p[2].length && 1 !== p[2].length) ||
          ((u = p[1]), (e = '/' + p[3])))
      var g,
        y = (s ? s[1] : e).match(/^https?:\/\/[^/]+(:[0-9]+)(?=\/|$)/),
        w = y && y[1],
        C = new l(),
        U = '',
        j = ''
      try {
        g = new URL(e)
      } catch (t) {
        ;(U = t),
          u ||
            o ||
            !/^\/\//.test(e) ||
            /^\/\/.+[@.]/.test(e) ||
            ((j = '/'), (e = e.substr(1)))
        try {
          g = new URL(e, c)
        } catch (e) {
          return (C.protocol = u), (C.href = u), C
        }
      }
      ;(C.slashes = i && !j),
        (C.host = g.host === n ? '' : g.host),
        (C.hostname =
          g.hostname === n ? '' : g.hostname.replace(/(\[|\])/g, '')),
        (C.protocol = U ? u || null : g.protocol),
        (C.search = g.search.replace(/\\/g, '%5C')),
        (C.hash = g.hash.replace(/\\/g, '%5C'))
      var x = e.split('#')
      !C.search && ~x[0].indexOf('?') && (C.search = '?'),
        C.hash || '' !== x[1] || (C.hash = '#'),
        (C.query = t ? a.decode(g.search.substr(1)) : C.search.substr(1)),
        (C.pathname =
          j +
          (p
            ? (function (e) {
                return e
                  .replace(/['^|`]/g, function (e) {
                    return '%' + e.charCodeAt().toString(16).toUpperCase()
                  })
                  .replace(/((?:%[0-9A-F]{2})+)/g, function (e, t) {
                    try {
                      return decodeURIComponent(t)
                        .split('')
                        .map(function (e) {
                          var t = e.charCodeAt()
                          return t > 256 || /^[a-z0-9]$/i.test(e)
                            ? e
                            : '%' + t.toString(16).toUpperCase()
                        })
                        .join('')
                    } catch (e) {
                      return t
                    }
                  })
              })(g.pathname)
            : g.pathname)),
        'about:' === C.protocol &&
          'blank' === C.pathname &&
          ((C.protocol = ''), (C.pathname = '')),
        U && '/' !== e[0] && (C.pathname = C.pathname.substr(1)),
        u &&
          !f.test(u) &&
          '/' !== e.slice(-1) &&
          '/' === C.pathname &&
          (C.pathname = ''),
        (C.path = C.pathname + C.search),
        (C.auth = [g.username, g.password]
          .map(decodeURIComponent)
          .filter(Boolean)
          .join(':')),
        (C.port = g.port),
        w && !C.host.endsWith(w) && ((C.host += w), (C.port = w.slice(1))),
        (C.href = j ? '' + C.pathname + C.search + C.hash : r(C))
      var q = /^(file)/.test(C.href) ? ['host', 'hostname'] : []
      return (
        Object.keys(C).forEach(function (e) {
          ~q.indexOf(e) || (C[e] = C[e] || null)
        }),
        C
      )
    }
    ;(e.parse = d),
      (e.format = r),
      (e.resolve = h),
      (e.resolveObject = function (e, t) {
        return d(h(e, t))
      }),
      (e.Url = l)
  })()
  module.exports = o
})()
