//this is a modified version of soundcloud's SDK
! function(t, e) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        var n = e();
        for (var i in n)("object" == typeof exports ? exports : t)[i] = n[i]
    }
}(this, function() {
    return function(t) {
        function e(i) {
            if (n[i]) return n[i].exports;
            var r = n[i] = {
                exports: {},
                id: i,
                loaded: !1
            };
            return t[i].call(r.exports, r, r.exports, e), r.loaded = !0, r.exports
        }
        var n = {};
        return e.m = t, e.c = n, e.p = "", e(0)
    }([function(t, e, n) {
        (function(e) {
            "use strict";
            var i = n(1),
                r = n(11),
                o = n(2),
                s = n(15),
                a = n(6).Promise,
                u = n(19),
                l = n(25);
            t.exports = e.SC = {
                initialize: function() {
                    var t = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
                    o.set("oauth_token", t.oauth_token), o.set("client_id", t.client_id), o.set("redirect_uri", t.redirect_uri), o.set("baseURL", t.baseURL), o.set("connectURL", t.connectURL)
                },
                get: function(t, e) {
                    return i.request("GET", t, e)
                },
                post: function(t, e) {
                    return i.request("POST", t, e)
                },
                put: function(t, e) {
                    return i.request("PUT", t, e)
                },
                "delete": function(t) {
                    return i.request("DELETE", t)
                },
                upload: function(t) {
                    return i.upload(t)
                },
                connect: function(t) {
                    return s(t)
                },
                isConnected: function() {
                    return void 0 !== o.get("oauth_token")
                },
                getAccessToken: function() {
                    console.log(o);
                    return o.get("oauth_token");
                },
                setAccessToken: function(newVal){
                    o.set("oauth_token", newVal);
                },
                oEmbed: function(t, e) {
                    return i.oEmbed(t, e)
                },
                resolve: function(t) {
                    return i.resolve(t)
                },
                Recorder: u,
                Promise: a,
                stream: function(t, e) {
                    return l(t, e)
                },
                connectCallback: function() {
                    r.notifyDialog(this.location)
                }
            }
        }).call(e, function() {
            return this
        }())
    }, function(t, e, n) {
        (function(e) {
            "use strict";
            var i = n(2),
                r = n(3),
                o = n(6).Promise,
                s = function(t, n, i) {
                    var r = void 0,
                        s = new o(function(o) {
                            var s = e.FormData && i instanceof FormData;
                            r = new XMLHttpRequest, r.open(t, n, !0), s || r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), r.onreadystatechange = function() {
                                4 === r.readyState && o({
                                    responseText: r.responseText,
                                    request: r
                                })
                            }, r.send(i)
                        });
                    return s.request = r, s
                },
                a = function(t) {
                    var e = t.responseText,
                        n = t.request,
                        i = void 0,
                        r = void 0;
                    try {
                        r = JSON.parse(e)
                    } catch (o) {}
                    return r ? r.errors && (i = {
                        message: ""
                    }, r.errors[0] && r.errors[0].error_message && (i = {
                        message: r.errors[0].error_message
                    })) : i = n ? {
                        message: "HTTP Error: " + n.status
                    } : {
                        message: "Unknown error"
                    }, i && (i.status = n.status), {
                        json: r,
                        error: i
                    }
                },
                u = function c(t, e, n) {
                    var i = s(t, e, n),
                        r = i.then(function(t) {
                            var e = t.responseText,
                                n = t.request,
                                i = a({
                                    responseText: e,
                                    request: n
                                });
                            if (i.json && "302 - Found" === i.json.status) return c("GET", i.json.location, null);
                            if (200 !== n.status && i.error) throw i.error;
                            return i.json
                        });
                    return r.request = i.request, r
                },
                l = function(t, e, n) {
                    Object.keys(e).forEach(function(i) {
                        n ? t.append(i, e[i]) : t[i] = e[i]
                    })
                };
            t.exports = {
                request: function(t, n) {
                    var o = arguments.length <= 2 || void 0 === arguments[2] ? {} : arguments[2],
                        s = i.get("oauth_token"),
                        a = i.get("client_id"),
                        c = {},
                        h = e.FormData && o instanceof FormData,
                        f = void 0,
                        d = void 0;
                    return c.format = "json", s ? c.oauth_token = s : c.client_id = a, l(o, c, h), "GET" !== t && (f = h ? o : r.encode(o), o = {}), n = "/" !== n[0] ? "/" + n : n, d = "" + i.get("baseURL") + n + "?" + r.encode(o), u(t, d, f)
                },
                oEmbed: function(t) {
                    var e = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1],
                        n = e.element;
                    delete e.element, e.url = t;
                    var i = "https://soundcloud.com/oembed.json?" + r.encode(e);
                    return u("GET", i, null).then(function(t) {
                        return n && t.html && (n.innerHTML = t.html), t
                    })
                },
                upload: function() {
                    var t = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
                        e = t.asset_data || t.file,
                        n = i.get("oauth_token") && t.title && e;
                    if (!n) return new o(function(t, e) {
                        e({
                            status: 0,
                            error_message: "oauth_token needs to be present and title and asset_data / file passed as parameters"
                        })
                    });
                    var r = Object.keys(t),
                        s = new FormData;
                    return r.forEach(function(e) {
                        var n = t[e];
                        "file" === e && (e = "asset_data", n = t.file), s.append("track[" + e + "]", n)
                    }), this.request("POST", "/tracks", s)
                },
                resolve: function(t) {
                    return this.request("GET", "/resolve", {
                        url: t
                    })
                }
            }
        }).call(e, function() {
            return this
        }())
    }, function(t, e) {
        "use strict";
        var n = {
            oauth_token: void 0,
            baseURL: "https://api.soundcloud.com",
            connectURL: "//connect.soundcloud.com",
            client_id: void 0,
            redirect_uri: void 0
        };
        t.exports = {
            get: function(t) {
                return n[t]
            },
            set: function(t, e) {
                e && (n[t] = e)
            }
        }
    }, function(t, e, n) {
        t.exports = n(4)
    }, function(t, e, n) {
        (function(t) {
            t.exports = {
                encode: function(t, e) {
                    function n(t) {
                        return t.filter(function(t) {
                            return "string" == typeof t && t.length
                        }).join("&")
                    }

                    function i(t) {
                        var e = Object.keys(t);
                        return h ? e.sort() : e
                    }

                    function r(t, e) {
                        var r = ":name[:prop]";
                        return n(i(e).map(function(n) {
                            return s(r.replace(/:name/, t).replace(/:prop/, n), e[n])
                        }))
                    }

                    function o(t, e) {
                        var i = ":name[]";
                        return n(e.map(function(e) {
                            return s(i.replace(/:name/, t), e)
                        }))
                    }

                    function s(t, e) {
                        var n = /%20/g,
                            i = encodeURIComponent,
                            s = typeof e,
                            a = null;
                        return Array.isArray(e) ? a = o(t, e) : "string" === s ? a = i(t) + "=" + u(e) : "number" === s ? a = i(t) + "=" + i(e).replace(n, "+") : "boolean" === s ? a = i(t) + "=" + e : "object" === s && (null !== e ? a = r(t, e) : c || (a = i(t) + "=null")), a
                    }

                    function a(t) {
                        return "%" + ("0" + t.charCodeAt(0).toString(16)).slice(-2).toUpperCase()
                    }

                    function u(t) {
                        return t.replace(/[^ !'()~\*]*/g, encodeURIComponent).replace(/ /g, "+").replace(/[!'()~\*]/g, a)
                    }
                    var l = "object" == typeof e ? e : {},
                        c = l.ignorenull || !1,
                        h = l.sorted || !1;
                    return n(i(t).map(function(e) {
                        return s(e, t[e])
                    }))
                }
            }
        }).call(e, n(5)(t))
    }, function(t, e) {
        t.exports = function(t) {
            return t.webpackPolyfill || (t.deprecate = function() {}, t.paths = [], t.children = [], t.webpackPolyfill = 1), t
        }
    }, function(t, e, n) {
        var i;
        (function(t, r, o, s) {
            /*!
             * @overview es6-promise - a tiny implementation of Promises/A+.
             * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
             * @license   Licensed under MIT license
             *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
             * @version   2.3.0
             */
            (function() {
                "use strict";

                function a(t) {
                    return "function" == typeof t || "object" == typeof t && null !== t
                }

                function u(t) {
                    return "function" == typeof t
                }

                function l(t) {
                    return "object" == typeof t && null !== t
                }

                function c(t) {
                    $ = t
                }

                function h(t) {
                    J = t
                }

                function f() {
                    var e = t.nextTick,
                        n = t.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
                    return Array.isArray(n) && "0" === n[1] && "10" === n[2] && (e = r),
                        function() {
                            e(m)
                        }
                }

                function d() {
                    return function() {
                        q(m)
                    }
                }

                function p() {
                    var t = 0,
                        e = new et(m),
                        n = document.createTextNode("");
                    return e.observe(n, {
                            characterData: !0
                        }),
                        function() {
                            n.data = t = ++t % 2
                        }
                }

                function _() {
                    var t = new MessageChannel;
                    return t.port1.onmessage = m,
                        function() {
                            t.port2.postMessage(0)
                        }
                }

                function g() {
                    return function() {
                        setTimeout(m, 1)
                    }
                }

                function m() {
                    for (var t = 0; Q > t; t += 2) {
                        var e = rt[t],
                            n = rt[t + 1];
                        e(n), rt[t] = void 0, rt[t + 1] = void 0
                    }
                    Q = 0
                }

                function y() {
                    try {
                        var t = n(9);
                        return q = t.runOnLoop || t.runOnContext, d()
                    } catch (e) {
                        return g()
                    }
                }

                function v() {}

                function A() {
                    return new TypeError("You cannot resolve a promise with itself")
                }

                function E() {
                    return new TypeError("A promises callback cannot return that same promise.")
                }

                function S(t) {
                    try {
                        return t.then
                    } catch (e) {
                        return ut.error = e, ut
                    }
                }

                function T(t, e, n, i) {
                    try {
                        t.call(e, n, i)
                    } catch (r) {
                        return r
                    }
                }

                function b(t, e, n) {
                    J(function(t) {
                        var i = !1,
                            r = T(n, e, function(n) {
                                i || (i = !0, e !== n ? L(t, n) : I(t, n))
                            }, function(e) {
                                i || (i = !0, D(t, e))
                            }, "Settle: " + (t._label || " unknown promise"));
                        !i && r && (i = !0, D(t, r))
                    }, t)
                }

                function w(t, e) {
                    e._state === st ? I(t, e._result) : e._state === at ? D(t, e._result) : M(e, void 0, function(e) {
                        L(t, e)
                    }, function(e) {
                        D(t, e)
                    })
                }

                function P(t, e) {
                    if (e.constructor === t.constructor) w(t, e);
                    else {
                        var n = S(e);
                        n === ut ? D(t, ut.error) : void 0 === n ? I(t, e) : u(n) ? b(t, e, n) : I(t, e)
                    }
                }

                function L(t, e) {
                    t === e ? D(t, A()) : a(e) ? P(t, e) : I(t, e)
                }

                function O(t) {
                    t._onerror && t._onerror(t._result), x(t)
                }

                function I(t, e) {
                    t._state === ot && (t._result = e, t._state = st, 0 !== t._subscribers.length && J(x, t))
                }

                function D(t, e) {
                    t._state === ot && (t._state = at, t._result = e, J(O, t))
                }

                function M(t, e, n, i) {
                    var r = t._subscribers,
                        o = r.length;
                    t._onerror = null, r[o] = e, r[o + st] = n, r[o + at] = i, 0 === o && t._state && J(x, t)
                }

                function x(t) {
                    var e = t._subscribers,
                        n = t._state;
                    if (0 !== e.length) {
                        for (var i, r, o = t._result, s = 0; s < e.length; s += 3) i = e[s], r = e[s + n], i ? N(n, i, r, o) : r(o);
                        t._subscribers.length = 0
                    }
                }

                function k() {
                    this.error = null
                }

                function R(t, e) {
                    try {
                        return t(e)
                    } catch (n) {
                        return lt.error = n, lt
                    }
                }

                function N(t, e, n, i) {
                    var r, o, s, a, l = u(n);
                    if (l) {
                        if (r = R(n, i), r === lt ? (a = !0, o = r.error, r = null) : s = !0, e === r) return void D(e, E())
                    } else r = i, s = !0;
                    e._state !== ot || (l && s ? L(e, r) : a ? D(e, o) : t === st ? I(e, r) : t === at && D(e, r))
                }

                function C(t, e) {
                    try {
                        e(function(e) {
                            L(t, e)
                        }, function(e) {
                            D(t, e)
                        })
                    } catch (n) {
                        D(t, n)
                    }
                }

                function U(t, e) {
                    var n = this;
                    n._instanceConstructor = t, n.promise = new t(v), n._validateInput(e) ? (n._input = e, n.length = e.length, n._remaining = e.length, n._init(), 0 === n.length ? I(n.promise, n._result) : (n.length = n.length || 0, n._enumerate(), 0 === n._remaining && I(n.promise, n._result))) : D(n.promise, n._validationError())
                }

                function F(t) {
                    return new ct(this, t).promise
                }

                function H(t) {
                    function e(t) {
                        L(r, t)
                    }

                    function n(t) {
                        D(r, t)
                    }
                    var i = this,
                        r = new i(v);
                    if (!z(t)) return D(r, new TypeError("You must pass an array to race.")), r;
                    for (var o = t.length, s = 0; r._state === ot && o > s; s++) M(i.resolve(t[s]), void 0, e, n);
                    return r
                }

                function B(t) {
                    var e = this;
                    if (t && "object" == typeof t && t.constructor === e) return t;
                    var n = new e(v);
                    return L(n, t), n
                }

                function j(t) {
                    var e = this,
                        n = new e(v);
                    return D(n, t), n
                }

                function G() {
                    throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
                }

                function Y() {
                    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
                }

                function V(t) {
                    this._id = _t++, this._state = void 0, this._result = void 0, this._subscribers = [], v !== t && (u(t) || G(), this instanceof V || Y(), C(this, t))
                }

                function W() {
                    var t;
                    if ("undefined" != typeof o) t = o;
                    else if ("undefined" != typeof self) t = self;
                    else try {
                        t = Function("return this")()
                    } catch (e) {
                        throw new Error("polyfill failed because global object is unavailable in this environment")
                    }
                    var n = t.Promise;
                    (!n || "[object Promise]" !== Object.prototype.toString.call(n.resolve()) || n.cast) && (t.Promise = gt)
                }
                var K;
                K = Array.isArray ? Array.isArray : function(t) {
                    return "[object Array]" === Object.prototype.toString.call(t)
                };
                var q, $, X, z = K,
                    Q = 0,
                    J = ({}.toString, function(t, e) {
                        rt[Q] = t, rt[Q + 1] = e, Q += 2, 2 === Q && ($ ? $(m) : X())
                    }),
                    Z = "undefined" != typeof window ? window : void 0,
                    tt = Z || {},
                    et = tt.MutationObserver || tt.WebKitMutationObserver,
                    nt = "undefined" != typeof t && "[object process]" === {}.toString.call(t),
                    it = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
                    rt = new Array(1e3);
                X = nt ? f() : et ? p() : it ? _() : void 0 === Z ? y() : g();
                var ot = void 0,
                    st = 1,
                    at = 2,
                    ut = new k,
                    lt = new k;
                U.prototype._validateInput = function(t) {
                    return z(t)
                }, U.prototype._validationError = function() {
                    return new Error("Array Methods must be provided an Array")
                }, U.prototype._init = function() {
                    this._result = new Array(this.length)
                };
                var ct = U;
                U.prototype._enumerate = function() {
                    for (var t = this, e = t.length, n = t.promise, i = t._input, r = 0; n._state === ot && e > r; r++) t._eachEntry(i[r], r)
                }, U.prototype._eachEntry = function(t, e) {
                    var n = this,
                        i = n._instanceConstructor;
                    l(t) ? t.constructor === i && t._state !== ot ? (t._onerror = null, n._settledAt(t._state, e, t._result)) : n._willSettleAt(i.resolve(t), e) : (n._remaining--, n._result[e] = t)
                }, U.prototype._settledAt = function(t, e, n) {
                    var i = this,
                        r = i.promise;
                    r._state === ot && (i._remaining--, t === at ? D(r, n) : i._result[e] = n), 0 === i._remaining && I(r, i._result)
                }, U.prototype._willSettleAt = function(t, e) {
                    var n = this;
                    M(t, void 0, function(t) {
                        n._settledAt(st, e, t)
                    }, function(t) {
                        n._settledAt(at, e, t)
                    })
                };
                var ht = F,
                    ft = H,
                    dt = B,
                    pt = j,
                    _t = 0,
                    gt = V;
                V.all = ht, V.race = ft, V.resolve = dt, V.reject = pt, V._setScheduler = c, V._setAsap = h, V._asap = J, V.prototype = {
                    constructor: V,
                    then: function(t, e) {
                        var n = this,
                            i = n._state;
                        if (i === st && !t || i === at && !e) return this;
                        var r = new this.constructor(v),
                            o = n._result;
                        if (i) {
                            var s = arguments[i - 1];
                            J(function() {
                                N(i, r, s, o)
                            })
                        } else M(n, r, t, e);
                        return r
                    },
                    "catch": function(t) {
                        return this.then(null, t)
                    }
                };
                var mt = W,
                    yt = {
                        Promise: gt,
                        polyfill: mt
                    };
                n(10).amd ? (i = function() {
                    return yt
                }.call(e, n, e, s), !(void 0 !== i && (s.exports = i))) : "undefined" != typeof s && s.exports ? s.exports = yt : "undefined" != typeof this && (this.ES6Promise = yt), mt()
            }).call(this)
        }).call(e, n(7), n(8).setImmediate, function() {
            return this
        }(), n(5)(t))
    }, function(t, e) {
        function n() {
            l = !1, s.length ? u = s.concat(u) : c = -1, u.length && i()
        }

        function i() {
            if (!l) {
                var t = setTimeout(n);
                l = !0;
                for (var e = u.length; e;) {
                    for (s = u, u = []; ++c < e;) s && s[c].run();
                    c = -1, e = u.length
                }
                s = null, l = !1, clearTimeout(t)
            }
        }

        function r(t, e) {
            this.fun = t, this.array = e
        }

        function o() {}
        var s, a = t.exports = {},
            u = [],
            l = !1,
            c = -1;
        a.nextTick = function(t) {
            var e = new Array(arguments.length - 1);
            if (arguments.length > 1)
                for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
            u.push(new r(t, e)), 1 !== u.length || l || setTimeout(i, 0)
        }, r.prototype.run = function() {
            this.fun.apply(null, this.array)
        }, a.title = "browser", a.browser = !0, a.env = {}, a.argv = [], a.version = "", a.versions = {}, a.on = o, a.addListener = o, a.once = o, a.off = o, a.removeListener = o, a.removeAllListeners = o, a.emit = o, a.binding = function(t) {
            throw new Error("process.binding is not supported")
        }, a.cwd = function() {
            return "/"
        }, a.chdir = function(t) {
            throw new Error("process.chdir is not supported")
        }, a.umask = function() {
            return 0
        }
    }, function(t, e, n) {
        (function(t, i) {
            function r(t, e) {
                this._id = t, this._clearFn = e
            }
            var o = n(7).nextTick,
                s = Function.prototype.apply,
                a = Array.prototype.slice,
                u = {},
                l = 0;
            e.setTimeout = function() {
                return new r(s.call(setTimeout, window, arguments), clearTimeout)
            }, e.setInterval = function() {
                return new r(s.call(setInterval, window, arguments), clearInterval)
            }, e.clearTimeout = e.clearInterval = function(t) {
                t.close()
            }, r.prototype.unref = r.prototype.ref = function() {}, r.prototype.close = function() {
                this._clearFn.call(window, this._id)
            }, e.enroll = function(t, e) {
                clearTimeout(t._idleTimeoutId), t._idleTimeout = e
            }, e.unenroll = function(t) {
                clearTimeout(t._idleTimeoutId), t._idleTimeout = -1
            }, e._unrefActive = e.active = function(t) {
                clearTimeout(t._idleTimeoutId);
                var e = t._idleTimeout;
                e >= 0 && (t._idleTimeoutId = setTimeout(function() {
                    t._onTimeout && t._onTimeout()
                }, e))
            }, e.setImmediate = "function" == typeof t ? t : function(t) {
                var n = l++,
                    i = arguments.length < 2 ? !1 : a.call(arguments, 1);
                return u[n] = !0, o(function() {
                    u[n] && (i ? t.apply(null, i) : t.call(null), e.clearImmediate(n))
                }), n
            }, e.clearImmediate = "function" == typeof i ? i : function(t) {
                delete u[t]
            }
        }).call(e, n(8).setImmediate, n(8).clearImmediate)
    }, function(t, e) {}, function(t, e) {
        t.exports = function() {
            throw new Error("define cannot be used indirect")
        }
    }, function(t, e, n) {
        "use strict";
        var i = n(12),
            r = n(14);
        t.exports = {
            notifyDialog: function(t) {
                var e = i.parse(t.search),
                    n = i.parse(t.hash),
                    o = {
                        oauth_token: e.access_token || n.access_token,
                        dialog_id: e.state || n.state,
                        error: e.error || n.error,
                        error_description: e.error_description || n.error_description
                    },
                    s = r.get(o.dialog_id);
                s && s.handleConnectResponse(o)
            }
        }
    }, function(t, e, n) {
        "use strict";
        var i = n(13);
        e.extract = function(t) {
            return t.split("?")[1] || ""
        }, e.parse = function(t) {
            return "string" != typeof t ? {} : (t = t.trim().replace(/^(\?|#|&)/, ""), t ? t.split("&").reduce(function(t, e) {
                var n = e.replace(/\+/g, " ").split("="),
                    i = n[0],
                    r = n[1];
                return i = decodeURIComponent(i), r = void 0 === r ? null : decodeURIComponent(r), t.hasOwnProperty(i) ? Array.isArray(t[i]) ? t[i].push(r) : t[i] = [t[i], r] : t[i] = r, t
            }, {}) : {})
        }, e.stringify = function(t) {
            return t ? Object.keys(t).sort().map(function(e) {
                var n = t[e];
                return Array.isArray(n) ? n.sort().map(function(t) {
                    return i(e) + "=" + i(t)
                }).join("&") : i(e) + "=" + i(n)
            }).filter(function(t) {
                return t.length > 0
            }).join("&") : ""
        }
    }, function(t, e) {
        "use strict";
        t.exports = function(t) {
            return encodeURIComponent(t).replace(/[!'()*]/g, function(t) {
                return "%" + t.charCodeAt(0).toString(16)
            })
        }
    }, function(t, e) {
        "use strict";
        var n = {};
        t.exports = {
            get: function(t) {
                return n[t]
            },
            set: function(t, e) {
                n[t] = e
            }
        }
    }, function(t, e, n) {
        "use strict";
        var i = n(2),
            r = n(16),
            o = n(6).Promise,
            s = function(t) {
                return i.set("oauth_token", t.oauth_token), t
            };
        t.exports = function() {
            var t = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
                e = i.get("oauth_token");
            if (e) return new o(function(t) {
                t({
                    oauth_token: e
                })
            });
            var n = {
                client_id: t.client_id || i.get("client_id"),
                redirect_uri: t.redirect_uri || i.get("redirect_uri"),
                response_type: "code_and_token",
                scope: t.scope || "non-expiring",
                display: "popup"
            };
            if (!n.client_id || !n.redirect_uri) throw new Error("Options client_id and redirect_uri must be passed");
            var a = new r(n);
            return a.open().then(s)
        }
    }, function(t, e, n) {
        "use strict";

        function i(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }
        var r = function() {
                function t(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var i = e[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                    }
                }
                return function(e, n, i) {
                    return n && t(e.prototype, n), i && t(e, i), e
                }
            }(),
            o = n(17),
            s = n(14),
            a = n(18),
            u = n(12),
            l = "SoundCloud_Dialog",
            c = function() {
                return [l, Math.ceil(1e6 * Math.random()).toString(16)].join("_")
            },
            h = function(t) {
                return "https://soundcloud.com/connect?" + u.stringify(t)
            },
            f = function() {
                function t() {
                    var e = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
                    i(this, t), this.id = c(), this.options = e, this.options.state = this.id, this.width = 456, this.height = 510, this.deferred = o()
                }
                return r(t, [{
                    key: "open",
                    value: function() {
                        var t = h(this.options);
                        return this.popup = a.open(t, this.width, this.height), s.set(this.id, this), this.deferred.promise
                    }
                }, {
                    key: "handleConnectResponse",
                    value: function(t) {
                        var e = t.error;
                        e ? this.deferred.reject(t) : this.deferred.resolve(t), this.popup.close()
                    }
                }]), t
            }();
        t.exports = f
    }, function(t, e, n) {
        "use strict";
        var i = n(6).Promise;
        t.exports = function() {
            var t = {};
            return t.promise = new i(function(e, n) {
                t.resolve = e, t.reject = n
            }), t
        }
    }, function(t, e) {
        "use strict";
        t.exports = {
            open: function(t, e, n) {
                var i = {},
                    r = void 0;
                return i.location = 1, i.width = e, i.height = n, i.left = window.screenX + (window.outerWidth - e) / 2, i.top = window.screenY + (window.outerHeight - n) / 2, i.toolbar = "no", i.scrollbars = "yes", r = Object.keys(i).map(function(t) {
                    return t + "=" + i[t]
                }).join(", "), window.open(t, i.name, r)
            }
        }
    }, function(t, e, n) {
        "use strict";

        function i(t, e) {
            if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
        }
        var r = function() {
                function t(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var i = e[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i)
                    }
                }
                return function(e, n, i) {
                    return n && t(e.prototype, n), i && t(e, i), e
                }
            }(),
            o = n(20),
            s = n(21),
            a = n(6).Promise,
            u = n(22),
            l = function() {
                var t = this,
                    e = this.context;
                return new a(function(n, i) {
                    t.source ? t.source instanceof AudioNode ? n(t.source) : i(new Error("source needs to be an instance of AudioNode")) : s({
                        audio: !0
                    }, function(i) {
                        t.stream = i, t.source = e.createMediaStreamSource(i), n(t.source)
                    }.bind(t), i)
                })
            },
            c = function() {
                function t() {
                    var e = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];
                    i(this, t), this.context = e.context || o(), this._recorder = null, this.source = e.source, this.stream = null
                }
                return r(t, [{
                    key: "start",
                    value: function() {
                        var t = this;
                        return l.call(this).then(function(e) {
                            return t._recorder = new u(e), t._recorder.record(), e
                        })
                    }
                }, {
                    key: "stop",
                    value: function() {
                        this._recorder && this._recorder.stop(), this.stream && this.stream.stop()
                    }
                }, {
                    key: "getBuffer",
                    value: function() {
                        var t = this;
                        return new a(function(e, n) {
                            t._recorder ? t._recorder.getBuffer(function(n) {
                                var i = t.context.sampleRate,
                                    r = t.context.createBuffer(2, n[0].length, i);
                                r.getChannelData(0).set(n[0]), r.getChannelData(1).set(n[1]), e(r)
                            }.bind(t)) : n(new Error("Nothing has been recorded yet."))
                        })
                    }
                }, {
                    key: "getWAV",
                    value: function() {
                        var t = this;
                        return new a(function(e, n) {
                            t._recorder ? t._recorder.exportWAV(function(t) {
                                e(t)
                            }) : n(new Error("Nothing has been recorded yet."))
                        })
                    }
                }, {
                    key: "play",
                    value: function() {
                        var t = this;
                        return this.getBuffer().then(function(e) {
                            var n = t.context.createBufferSource();
                            return n.buffer = e, n.connect(t.context.destination), n.start(0), n
                        })
                    }
                }, {
                    key: "saveAs",
                    value: function(t) {
                        return this.getWAV().then(function(e) {
                            u.forceDownload(e, t)
                        })
                    }
                }, {
                    key: "delete",
                    value: function() {
                        this._recorder && (this._recorder.stop(), this._recorder.clear(), this._recorder = null), this.stream && this.stream.stop()
                    }
                }]), t
            }();
        t.exports = c
    }, function(t, e) {
        (function(e) {
            "use strict";
            var n = e.AudioContext || e.webkitAudioContext,
                i = null;
            t.exports = function() {
                return i ? i : i = new n
            }
        }).call(e, function() {
            return this
        }())
    }, function(t, e) {
        (function(e) {
            "use strict";
            var n = e.navigator.getUserMedia || e.navigator.webkitGetUserMedia || e.navigator.mozGetUserMedia;
            t.exports = function(t, i, r) {
                n.call(e.navigator, t, i, r)
            }
        }).call(e, function() {
            return this
        }())
    }, function(t, e, n) {
        "use strict";
        var i = n(23),
            r = function(t, e) {
                var n = e || {},
                    r = n.bufferLen || 4096,
                    o = n.numChannels || 2;
                this.context = t.context, this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, r, o, o);
                var s = new i;
                s.postMessage({
                    command: "init",
                    config: {
                        sampleRate: this.context.sampleRate,
                        numChannels: o
                    }
                });
                var a, u = !1;
                this.node.onaudioprocess = function(t) {
                    if (u) {
                        for (var e = [], n = 0; o > n; n++) e.push(t.inputBuffer.getChannelData(n));
                        s.postMessage({
                            command: "record",
                            buffer: e
                        })
                    }
                }, this.configure = function(t) {
                    for (var e in t) t.hasOwnProperty(e) && (n[e] = t[e])
                }, this.record = function() {
                    u = !0
                }, this.stop = function() {
                    u = !1
                }, this.clear = function() {
                    s.postMessage({
                        command: "clear"
                    })
                }, this.getBuffer = function(t) {
                    a = t || n.callback, s.postMessage({
                        command: "getBuffer"
                    })
                }, this.exportWAV = function(t, e) {
                    if (a = t || n.callback, e = e || n.type || "audio/wav", !a) throw new Error("Callback not set");
                    s.postMessage({
                        command: "exportWAV",
                        type: e
                    })
                }, s.onmessage = function(t) {
                    var e = t.data;
                    a(e)
                }, t.connect(this.node), this.node.connect(this.context.destination)
            };
        r.forceDownload = function(t, e) {
            var n = (window.URL || window.webkitURL).createObjectURL(t),
                i = window.document.createElement("a");
            i.href = n, i.download = e || "output.wav";
            var r = document.createEvent("Event");
            r.initEvent("click", !0, !0), i.dispatchEvent(r)
        }, t.exports = r
    }, function(t, e, n) {
        "use strict";
        t.exports = function() {
            return n(24)('!function(t){function n(r){if(e[r])return e[r].exports;var a=e[r]={exports:{},id:r,loaded:!1};return t[r].call(a.exports,a,a.exports,n),a.loaded=!0,a.exports}var e={};return n.m=t,n.c=e,n.p="",n(0)}([function(t,n){(function(t){function n(t){h=t.sampleRate,v=t.numChannels,s()}function e(t){for(var n=0;v>n;n++)p[n].push(t[n]);g+=t[0].length}function r(t){for(var n=[],e=0;v>e;e++)n.push(i(p[e],g));if(2===v)var r=f(n[0],n[1]);else var r=n[0];var a=l(r),o=new Blob([a],{type:t});this.postMessage(o)}function a(){for(var t=[],n=0;v>n;n++)t.push(i(p[n],g));this.postMessage(t)}function o(){g=0,p=[],s()}function s(){for(var t=0;v>t;t++)p[t]=[]}function i(t,n){for(var e=new Float32Array(n),r=0,a=0;a<t.length;a++)e.set(t[a],r),r+=t[a].length;return e}function f(t,n){for(var e=t.length+n.length,r=new Float32Array(e),a=0,o=0;e>a;)r[a++]=t[o],r[a++]=n[o],o++;return r}function c(t,n,e){for(var r=0;r<e.length;r++,n+=2){var a=Math.max(-1,Math.min(1,e[r]));t.setInt16(n,0>a?32768*a:32767*a,!0)}}function u(t,n,e){for(var r=0;r<e.length;r++)t.setUint8(n+r,e.charCodeAt(r))}function l(t){var n=new ArrayBuffer(44+2*t.length),e=new DataView(n);return u(e,0,"RIFF"),e.setUint32(4,36+2*t.length,!0),u(e,8,"WAVE"),u(e,12,"fmt "),e.setUint32(16,16,!0),e.setUint16(20,1,!0),e.setUint16(22,v,!0),e.setUint32(24,h,!0),e.setUint32(28,4*h,!0),e.setUint16(32,2*v,!0),e.setUint16(34,16,!0),u(e,36,"data"),e.setUint32(40,2*t.length,!0),c(e,44,t),e}var h,v,g=0,p=[];t.onmessage=function(t){switch(t.data.command){case"init":n(t.data.config);break;case"record":e(t.data.buffer);break;case"exportWAV":r(t.data.type);break;case"getBuffer":a();break;case"clear":o()}}}).call(n,function(){return this}())}]);', n.p + "9f9aac32c9a7432b5555.worker.js")
        }
    }, function(t, e) {
        var n = window.URL || window.webkitURL;
        t.exports = function(t, e) {
            try {
                try {
                    var i;
                    try {
                        var r = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
                        i = new r, i.append(t), i = i.getBlob()
                    } catch (o) {
                        i = new Blob([t])
                    }
                    return new Worker(n.createObjectURL(i))
                } catch (o) {
                    return new Worker("data:application/javascript," + encodeURIComponent(t))
                }
            } catch (o) {
                return new Worker(e)
            }
        }
    }, function(t, e, n) {
        "use strict";
        var i = n(1),
            r = n(26),
            o = new r({
                flashAudioPath: "https://connect.soundcloud.com/sdk/flashAudio.swf"
            }),
            s = n(2),
            a = n(27);
        t.exports = function(t, e) {
            var n = e ? {
                secret_token: e
            } : {};
            return i.request("GET", t, n).then(function(t) {
                var n = s.get("baseURL"),
                    i = s.get("client_id"),
                    r = n + "/tracks/" + t.id + "/streams?client_id=" + i,
                    u = n + "/tracks/" + t.id + "/plays?client_id=" + i;
                return e && (r += "&secret_token=" + e, u += "&secret_token=" + e), new a(o, {
                    soundId: t.id,
                    duration: t.duration,
                    streamUrlsEndpoint: r,
                    registerEndpoint: u
                })
            })
        }
    }, function(t, e) {
        "use strict";
        t.exports = function(t) {
            function e(i) {
                if (n[i]) return n[i].exports;
                var r = n[i] = {
                    exports: {},
                    id: i,
                    loaded: !1
                };
                return t[i].call(r.exports, r, r.exports, e), r.loaded = !0, r.exports
            }
            var n = {};
            return e.m = t, e.c = n, e.p = "", e(0)
        }(function(t) {
            for (var e in t)
                if (Object.prototype.hasOwnProperty.call(t, e)) switch (typeof t[e]) {
                    case "function":
                        break;
                    case "object":
                        t[e] = function(e) {
                            var n = e.slice(1),
                                i = t[e[0]];
                            return function(t, e, r) {
                                i.apply(this, [t, e, r].concat(n))
                            }
                        }(t[e]);
                        break;
                    default:
                        t[e] = t[t[e]]
                }
                return t
        }([function(t, e, n) {
                var i, r = n(37),
                    o = n(22),
                    s = n(3),
                    a = n(1),
                    u = n(6);
                t.exports = i = function(t) {
                    t = t || {}, this._players = {}, this._volume = 1, this._mute = !1, this.States = s, this.Errors = a, this._settings = r(t, i.defaults)
                }, i.States = s, i.Errors = a, i.BrowserUtils = u, i.defaults = {
                    flashAudioPath: "flashAudio.swf",
                    flashLoadTimeout: 2e3,
                    flashObjectID: "flashAudioObject",
                    audioObjectID: "html5AudioObject",
                    updateInterval: 300,
                    bufferTime: 8e3,
                    bufferingDelay: 800,
                    debug: !1
                }, i.prototype.getAudioPlayer = function(t) {
                    return this._players[t]
                }, i.prototype.hasAudioPlayer = function(t) {
                    return void 0 !== this._players[t]
                }, i.prototype.removeAudioPlayer = function(t) {
                    this.hasAudioPlayer(t) && delete this._players[t]
                }, i.prototype.setVolume = function(t) {
                    t = Math.min(1, t), this._volume = Math.max(0, t);
                    for (var e in this._players) this._players.hasOwnProperty(e) && this._players[e].setVolume(this._volume)
                }, i.prototype.getVolume = function() {
                    return this._volume
                }, i.prototype.setMute = function(t) {
                    this._muted = t;
                    for (var e in this._players) this._players.hasOwnProperty(e) && this._players[e].setMute(this._muted)
                }, i.prototype.getMute = function() {
                    return this._muted
                }, i.prototype.createAudioPlayer = function(t) {
                    var e, t;
                    if (t.id || (t.id = Math.floor(1e10 * Math.random()).toString() + (new Date).getTime().toString()), !t.src) throw new Error("AudioManager: You need to pass a valid media source URL");
                    if (!this._players[t.id]) {
                        if (e = o.createAudioPlayer(t, this._settings), !e) throw new Error("AudioManager: No player could be created from the given descriptor");
                        this._players[t.id] = e
                    }
                    return this._players[t.id].setVolume(this._volume), this._players[t.id].setMute(this._muted), this._players[t.id].on("stateChange", this._onStateChange, this), this._players[t.id]
                }, i.prototype._onStateChange = function(t, e) {
                    e.getState() === s.DEAD && this.removeAudioPlayer(e.getId())
                }
            }, function(t, e) {
                t.exports = {
                    FLASH_HLS_PLAYLIST_NOT_FOUND: "HLS_PLAYLIST_NOT_FOUND",
                    FLASH_HLS_PLAYLIST_SECURITY_ERROR: "HLS_SECURITY_ERROR",
                    FLASH_HLS_NOT_VALID_PLAYLIST: "HLS_NOT_VALID_PLAYLIST",
                    FLASH_HLS_NO_TS_IN_PLAYLIST: "HLS_NO_TS_IN_PLAYLIST",
                    FLASH_HLS_NO_PLAYLIST_IN_MANIFEST: "HLS_NO_PLAYLIST_IN_MANIFEST",
                    FLASH_HLS_TS_IS_CORRUPT: "HLS_TS_IS_CORRUPT",
                    FLASH_HLS_FLV_TAG_CORRUPT: "HLS_FLV_TAG_CORRUPT",
                    FLASH_HTTP_FILE_NOT_FOUND: "HTTP_FILE_NOT_FOUND",
                    FLASH_RTMP_CONNECT_FAILED: "RTMP_CONNECT_FAILED",
                    FLASH_RTMP_CONNECT_CLOSED: "RTMP_CONNECT_CLOSED",
                    FLASH_RTMP_CANNOT_PLAY_STREAM: "RTMP_CANNOT_PLAY_STREAM",
                    FLASH_PROXY_CANT_LOAD_FLASH: "CANT_LOAD_FLASH",
                    FLASH_PROXY_FLASH_BLOCKED: "FLASH_PROXY_FLASH_BLOCKED",
                    HTML5_AUDIO_ABORTED: "HTML5_AUDIO_ABORTED",
                    HTML5_AUDIO_NETWORK: "HTML5_AUDIO_NETWORK",
                    HTML5_AUDIO_DECODE: "HTML5_AUDIO_DECODE",
                    HTML5_AUDIO_SRC_NOT_SUPPORTED: "HTML5_AUDIO_SRC_NOT_SUPPORTED",
                    HTML5_AUDIO_ENDED_EARLY: "HTML5_AUDIO_ENDED_EARLY",
                    HTML5_AUDIO_OVERRUN: "HTML5_AUDIO_OVERRUN",
                    MSE_BAD_OBJECT_STATE: "MSE_BAD_OBJECT_STATE",
                    MSE_NOT_SUPPORTED: "MSE_NOT_SUPPORTED",
                    MSE_MP3_NOT_SUPPORTED: "MSE_MP3_NOT_SUPPORTED",
                    MSE_HLS_NOT_VALID_PLAYLIST: "MSE_HLS_NOT_VALID_PLAYLIST",
                    MSE_HLS_PLAYLIST_NOT_FOUND: "MSE_HLS_PLAYLIST_NOT_FOUND",
                    MSE_HLS_SEGMENT_NOT_FOUND: "MSE_HLS_SEGMENT_NOT_FOUND"
                }
            }, function(t, e, n) {
                function i(t, e, n) {
                    for (var i = -1, r = s(e), o = r.length; ++i < o;) {
                        var a = r[i],
                            u = t[a],
                            l = n(u, e[a], a, t, e);
                        (l === l ? l === u : u !== u) && (void 0 !== u || a in t) || (t[a] = l)
                    }
                    return t
                }
                var r = n(23),
                    o = n(25),
                    s = n(13),
                    a = o(function(t, e, n) {
                        return n ? i(t, e, n) : r(t, e)
                    });
                t.exports = a
            }, function(t, e) {
                t.exports = {
                    PLAYING: "playing",
                    LOADING: "loading",
                    SEEKING: "seeking",
                    PAUSED: "paused",
                    ERROR: "error",
                    IDLE: "idle",
                    INITIALIZE: "initialize",
                    ENDED: "ended",
                    DEAD: "dead"
                }
            }, function(t, e, n) {
                var i = n(56),
                    r = n(70),
                    o = [],
                    s = (o.push, o.slice),
                    a = (o.splice, /\s+/),
                    u = function f(t, e, n, i) {
                        if (!n) return !0;
                        if ("object" == typeof n)
                            for (var r in n) t[e].apply(t, [r, n[r]].concat(i));
                        else {
                            if (!a.test(n)) return !0;
                            for (var o = n.split(a), s = 0, f = o.length; f > s; s++) t[e].apply(t, [o[s]].concat(i))
                        }
                    },
                    l = function(t, e) {
                        var n, i = -1,
                            r = t.length;
                        switch (e.length) {
                            case 0:
                                for (; ++i < r;) n = t[i], n.callback.call(n.ctx);
                                return;
                            case 1:
                                for (; ++i < r;)(n = t[i]).callback.call(n.ctx, e[0]);
                                return;
                            case 2:
                                for (; ++i < r;)(n = t[i]).callback.call(n.ctx, e[0], e[1]);
                                return;
                            case 3:
                                for (; ++i < r;)(n = t[i]).callback.call(n.ctx, e[0], e[1], e[2]);
                                return;
                            default:
                                for (; ++i < r;)(n = t[i]).callback.apply(n.ctx, e)
                        }
                    },
                    c = {
                        on: function(t, e, n) {
                            if (!u(this, "on", t, [e, n]) || !e) return this;
                            this._events || (this._events = {});
                            var i = this._events[t] || (this._events[t] = []);
                            return i.push({
                                callback: e,
                                context: n,
                                ctx: n || this
                            }), this
                        },
                        once: function(t, e, n) {
                            if (!u(this, "once", t, [e, n]) || !e) return this;
                            var r = this,
                                o = i(function() {
                                    r.off(t, o), e.apply(this, arguments)
                                });
                            return o._callback = e, this.on(t, o, n)
                        },
                        off: function(t, e, n) {
                            var i, r, o, s, a, l, c, h;
                            if (!this._events || !u(this, "off", t, [e, n])) return this;
                            if (!t && !e && !n) return this._events = {}, this;
                            for (s = t ? [t] : Object.keys(this._events), a = 0, l = s.length; l > a; a++)
                                if (t = s[a], o = this._events[t]) {
                                    if (this._events[t] = i = [], e || n)
                                        for (c = 0, h = o.length; h > c; c++) r = o[c], (e && e !== r.callback && e !== r.callback._callback || n && n !== r.context) && i.push(r);
                                    i.length || delete this._events[t]
                                }
                            return this
                        },
                        trigger: function(t, e) {
                            if (!this._events) return this;
                            var e = s.call(arguments, 1);
                            if (!u(this, "trigger", t, e)) return this;
                            var n = this._events[t],
                                i = this._events.all;
                            return n && l(n, e), i && l(i, arguments), this
                        },
                        stopListening: function(t, e, n) {
                            var i = this._listeners;
                            if (!i) return this;
                            var r = !e && !n;
                            "object" == typeof e && (n = this), t && ((i = {})[t._listenerId] = t);
                            for (var o in i) i[o].off(e, n, this), r && delete this._listeners[o];
                            return this
                        }
                    },
                    h = {
                        listenTo: "on",
                        listenToOnce: "once"
                    };
                Object.keys(h).forEach(function(t) {
                    var e = h[t];
                    c[t] = function(t, n, i) {
                        var o = this._listeners || (this._listeners = {}),
                            s = t._listenerId || (t._listenerId = r("l"));
                        return o[s] = t, "object" == typeof n && (i = this), t[e](n, i, this), this
                    }
                }), c.bind = c.on, c.unbind = c.off, t.exports = c
            }, function(t, e) {
                var n;
                t.exports = n = function(t, e, n) {
                    this.enabled = n.debug, this.type = t, this.id = e
                }, n.prototype.log = function(t) {
                    this.enabled && window.console.log((new Date).toString() + " | " + this.type + " (" + this.id + "): " + t)
                }
            }, function(t, e) {
                t.exports = {
                    supportHTML5Audio: function() {
                        var t;
                        try {
                            if (window.HTMLAudioElement && "undefined" != typeof Audio) return t = new Audio, !0
                        } catch (e) {
                            return !1
                        }
                    },
                    createAudioElement: function() {
                        var t = document.createElement("audio");
                        return t.setAttribute("msAudioCategory", "BackgroundCapableMedia"), t.mozAudioChannelType = "content", t
                    },
                    supportSourceSwappingWithPreload: function() {
                        return /Firefox/i.test(navigator.userAgent)
                    },
                    isMobile: function(t) {
                        var e = window.navigator.userAgent,
                            n = ["mobile", "iPhone", "iPad", "iPod", "Android", "Skyfire"];
                        return n.some(function(t) {
                            return t = new RegExp(t, "i"), t.test(e)
                        })
                    },
                    isIE10Mobile: function() {
                        return /IEmobile\/10\.0/gi.test(navigator.userAgent)
                    },
                    canPlayType: function(t) {
                        var e = document.createElement("audio");
                        return e && e.canPlayType && e.canPlayType(t).match(/maybe|probably/i) ? !0 : !1
                    },
                    isNativeHlsSupported: function() {
                        var t, e, n, i = navigator.userAgent,
                            r = ["iPhone", "iPad", "iPod"];
                        return t = function(t) {
                            return t.test(i)
                        }, e = !t(/chrome/i) && !t(/opera/i) && t(/safari/i), n = r.some(function(e) {
                            return t(new RegExp(e, "i"))
                        }), n || e
                    },
                    isMSESupported: function() {
                        return !(!window.MediaSource && !window.WebKitMediaSource)
                    },
                    isMSESupportMPEG: function() {
                        var t = window.MediaSource || window.WebKitMediaSource;
                        return t ? t.isTypeSupported("audio/mpeg") : !1
                    }
                }
            }, function(t, e, n) {
                var i, r = n(2),
                    o = n(11).bindAll,
                    s = n(4),
                    a = n(3),
                    u = n(1),
                    l = n(5),
                    c = n(6),
                    h = .3;
                t.exports = i = function(t, e) {
                    this._id = t.id, this._descriptor = t, this._isLoaded = !1, this._settings = e, this._bufferingTimeout = null, this._currentPosition = 0, this._loadedPosition = 0, this._prevCurrentPosition = 0, this._prevCheckTime = 0, this._positionUpdateTimer = 0, this._playRequested = !1, this._startFromPosition = 0, this._waitingToPause = !1, t.duration && (this._duration = t.duration), this._bindHandlers(), this._init(), this._toggleEventListeners(!0), this._descriptor.preload && this._preload(), t.autoPlay ? this.play() : this._setState(a.IDLE)
                }, r(i.prototype, s), i.MediaAPIEvents = ["ended", "play", "playing", "pause", "seeking", "waiting", "seeked", "error", "loadeddata", "loadedmetadata"], i.prototype.getId = function() {
                    return this._id
                }, i.prototype.getType = function() {
                    return "HTML5 audio"
                }, i.prototype.play = function(t) {
                    return this._isInOneOfStates(a.ERROR, a.DEAD) ? void this._logger.log("play called but state is ERROR or DEAD") : this._isInOneOfStates(a.PAUSED, a.ENDED) ? void this.resume() : (this._logger.log("play"), this._startFromPosition = t || 0, this._setState(a.LOADING), this._playRequested = !0, void(this._isLoaded ? this._playAfterLoaded() : (this._preload(), this.once("loaded", this._playAfterLoaded))))
                }, i.prototype.pause = function() {
                    this._playRequested = !1, this._isInOneOfStates(a.ERROR, a.DEAD) || (this._logger.log("pause"), this._waitingToPause = !0, this._html5Audio.pause(), clearTimeout(this._bufferingTimeout), clearInterval(this._positionUpdateTimer))
                }, i.prototype.seek = function(t) {
                    var e, n = !1,
                        i = t / 1e3,
                        r = this._html5Audio.seekable;
                    if (!this._isInOneOfStates(a.ERROR, a.DEAD)) {
                        if (!this._isLoaded) return void this.once("loaded", function() {
                            this.seek(t)
                        });
                        if (c.isIE10Mobile) n = !0;
                        else
                            for (e = 0; e < r.length; e++)
                                if (i <= r.end(e) && i >= r.start(e)) {
                                    n = !0;
                                    break
                                }
                        n && (this._logger.log("seek"), this._setState(a.SEEKING), this._html5Audio.currentTime = i, this._currentPosition = t, this._clearBufferingTimeout())
                    }
                }, i.prototype.resume = function() {
                    return this._isInOneOfStates(a.ERROR, a.DEAD) ? void this._logger.log("resume called but state is ERROR or DEAD") : (this._logger.log("resume"), this.getState() === a.PAUSED ? (this._setState(a.LOADING), this._html5Audio.play(this._html5Audio.currentTime)) : this.getState() === a.ENDED && (this._setState(a.LOADING), this._html5Audio.play(0)), void(this._positionUpdateTimer = setInterval(this._onPositionChange, this._settings.updateInterval)))
                }, i.prototype.setVolume = function(t) {
                    this._html5Audio && (this._html5Audio.volume = t)
                }, i.prototype.getVolume = function() {
                    return this._html5Audio ? this._html5Audio.volume : 1
                }, i.prototype.setMute = function(t) {
                    this._html5Audio && (this._html5Audio.muted = t)
                }, i.prototype.getMute = function() {
                    return this._html5Audio ? this._html5Audio.muted : !1
                }, i.prototype.getState = function() {
                    return this._state
                }, i.prototype.getCurrentPosition = function() {
                    return this._currentPosition
                }, i.prototype.getLoadedPosition = function() {
                    return this._loadedPosition
                }, i.prototype.getDuration = function() {
                    return this._duration
                }, i.prototype.kill = function() {
                    this._state !== a.DEAD && (clearInterval(this._positionUpdateTimer), clearTimeout(this._bufferingTimeout), this._playRequested = !1, this._toggleEventListeners(!1), this._html5Audio.pause(), delete this._html5Audio, this._setState(a.DEAD))
                }, i.prototype.getErrorMessage = function() {
                    return this._errorMessage
                }, i.prototype.getErrorID = function() {
                    return this._errorID
                }, i.prototype._bindHandlers = function() {
                    o(this, ["_onPositionChange", "_onHtml5AudioStateChange", "_onLoaded", "_onLoadedMetadata", "_onBuffering"])
                }, i.prototype._init = function() {
                    this._html5Audio = c.createAudioElement(), this._html5Audio.id = this._settings.audioObjectID + "_" + this._descriptor.id, this._html5Audio.preload = "none", this._logger = new l(this.getType(), this._id, this._settings)
                }, i.prototype._preload = function() {
                    "auto" !== this._html5Audio.preload && (this._logger.log("setting up preload"), this._html5Audio.preload = "auto", this._html5Audio.type = this._descriptor.mimeType, this._html5Audio.src = this._descriptor.src, this._html5Audio.load())
                }, i.prototype._playAfterLoaded = function() {
                    this._playRequested && (this._trySeekToStartPosition(), this._html5Audio.play(), this._positionUpdateTimer = setInterval(this._onPositionChange, this._settings.updateInterval))
                }, i.prototype._setState = function(t) {
                    this._state !== t && (this._logger.log('state changed "' + t + '"'), this._logger.log("currentPosition = " + this._currentPosition + ", loadedPosition = " + this._loadedPosition), this._state = t, this.trigger("stateChange", t, this))
                }, i.prototype._isInOneOfStates = function() {
                    for (var t in arguments)
                        if (arguments[t] === this._state) return !0;
                    return !1
                }, i.prototype._toggleEventListeners = function(t) {
                    if (this._html5Audio) {
                        var e = t ? "addEventListener" : "removeEventListener";
                        i.MediaAPIEvents.forEach(function(t) {
                            switch (t) {
                                case "loadeddata":
                                    this._html5Audio[e]("loadeddata", this._onLoaded);
                                    break;
                                case "loadedmetadata":
                                    this._html5Audio[e]("loadedmetadata", this._onLoadedMetadata);
                                    break;
                                case "timeupdate":
                                default:
                                    this._html5Audio[e](t, this._onHtml5AudioStateChange)
                            }
                        }, this)
                    }
                }, i.prototype._trySeekToStartPosition = function() {
                    var t;
                    return this._startFromPosition > 0 && (this._logger.log("seek to start position=" + this._startFromPosition), t = this._startFromPosition / 1e3, this._html5Audio.currentTime = t, this._html5Audio.currentTime === t) ? (this._currentPosition = this._startFromPosition, this._startFromPosition = 0, !0) : !1
                }, i.prototype._onBuffering = function() {
                    this._isInOneOfStates(a.PAUSED, a.LOADING) || (this._logger.log("buffering detection timeout"), this._setState(a.LOADING))
                }, i.prototype._onLoaded = function(t) {
                    this._logger.log('html5 audio event (loaded handler) "' + t.type + '"'), (void 0 === this._duration || 0 === this._duration) && (this._duration = 1e3 * this._html5Audio.duration), this._loadedPosition = this._duration, this._isLoaded = !0, this.trigger("loaded", this)
                }, i.prototype._onLoadedMetadata = function(t) {
                    this._logger.log('html5 audio event (loadedmetadata handler) "' + t.type + '"'), this.trigger("loadedmetadata", this)
                }, i.prototype._clearBufferingTimeout = function() {
                    clearTimeout(this._bufferingTimeout), this._bufferingTimeout = null
                }, i.prototype._onPositionChange = function(t) {
                    var e, n, i, r = Date.now();
                    if (this._currentPosition = 1e3 * this._html5Audio.currentTime, this.trigger("positionChange", this.getCurrentPosition(), this._loadedPosition, this._duration, this), e = this._currentPosition - this._prevCurrentPosition, !this._isInOneOfStates(a.PLAYING, a.LOADING)) return void(this._state === a.SEEKING && e > 0 && this._setState(a.PLAYING));
                    if (0 !== this._duration && (this._currentPosition > this._duration || this._currentPosition > this._loadedPosition && !c.isIE10Mobile) && this._onHtml5AudioStateChange({
                            type: "ended"
                        }), this._settings.bufferingDelay >= 0) {
                        if (n = r - this._prevCheckTime, 0 === n) return;
                        i = e / n, i > 1 - h ? (this._clearBufferingTimeout(), this.getState() !== a.PLAYING && this._setState(a.PLAYING)) : this._waitingToPause || this._state !== a.PLAYING || null != this._bufferingTimeout || (this._bufferingTimeout = setTimeout(this._onBuffering, this._settings.bufferingDelay))
                    }
                    this._prevCurrentPosition = this._currentPosition, this._prevCheckTime = r
                }, i.prototype._onHtml5AudioStateChange = function(t) {
                    switch (this._logger.log('html5 audio event (state change handler) "' + t.type + '"'), this._waitingToPause = !1, this._clearBufferingTimeout(), t.type) {
                        case "playing":
                            if (this._trySeekToStartPosition()) return;
                            this._setState(a.PLAYING), this._onPositionChange(t);
                            break;
                        case "pause":
                            this._onPositionChange(t), this._setState(a.PAUSED);
                            break;
                        case "ended":
                            this._currentPosition = this._loadedPosition = this._duration, this.trigger("positionChange", this.getCurrentPosition(), this._loadedPosition, this._duration, this), clearInterval(this._positionUpdateTimer), this._setState(a.ENDED);
                            break;
                        case "waiting":
                            if (this.getState() === a.SEEKING) break;
                            this._setState(a.LOADING);
                            break;
                        case "seeking":
                            this._setState(a.SEEKING);
                            break;
                        case "seeked":
                            this._html5Audio.paused ? this._setState(a.PAUSED) : this._setState(a.PLAYING), this._onPositionChange(t);
                            break;
                        case "error":
                            this._error(this._html5AudioErrorCodeToErrorId(), !0)
                    }
                }, i.prototype._html5AudioErrorCodeToErrorId = function() {
                    return {
                        1: u.HTML5_AUDIO_ABORTED,
                        2: u.HTML5_AUDIO_NETWORK,
                        3: u.HTML5_AUDIO_DECODE,
                        4: u.HTML5_AUDIO_SRC_NOT_SUPPORTED
                    }[this._html5Audio.error.code]
                }, i.prototype._error = function(t, e) {
                    var n = "error: ";
                    e && (n = "error (native): "), this._errorID = t, this._errorMessage = this._getErrorMessage(this._errorID), this._logger.log(n + this._errorID + " " + this._errorMessage), this._setState(a.ERROR), this._toggleEventListeners(!1)
                }, i.prototype._getErrorMessage = function(t) {
                    var e = {};
                    return e[u.HTML5_AUDIO_ABORTED] = "The fetching process was aborted by the user.", e[u.HTML5_AUDIO_NETWORK] = "A network connection lost.", e[u.HTML5_AUDIO_DECODE] = "An error occurred while decoding the media resource.", e[u.HTML5_AUDIO_SRC_NOT_SUPPORTED] = "The media resource is not suitable.", e[u.HTML5_AUDIO_ENDED_EARLY] = "Audio playback ended before the indicated duration of the track.", e[u.HTML5_AUDIO_OVERRUN] = "Audio playback continued past end of the track.", e[t]
                }
            }, function(t, e) {
                function n(t) {
                    return !!t && "object" == typeof t
                }

                function i(t, e) {
                    var n = null == t ? void 0 : t[e];
                    return a(n) ? n : void 0
                }

                function r(t) {
                    return "number" == typeof t && t > -1 && t % 1 == 0 && m >= t
                }

                function o(t) {
                    return s(t) && p.call(t) == l
                }

                function s(t) {
                    var e = typeof t;
                    return !!t && ("object" == e || "function" == e)
                }

                function a(t) {
                    return null == t ? !1 : o(t) ? _.test(f.call(t)) : n(t) && c.test(t)
                }
                var u = "[object Array]",
                    l = "[object Function]",
                    c = /^\[object .+?Constructor\]$/,
                    h = Object.prototype,
                    f = Function.prototype.toString,
                    d = h.hasOwnProperty,
                    p = h.toString,
                    _ = RegExp("^" + f.call(d).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                    g = i(Array, "isArray"),
                    m = 9007199254740991,
                    y = g || function(t) {
                        return n(t) && r(t.length) && p.call(t) == u
                    };
                t.exports = y
            }, function(t, e, n) {
                var i, r = n(2),
                    o = n(1),
                    s = (n(4), n(7)),
                    a = (n(5), n(3)),
                    u = 1;
                t.exports = i = function(t, e) {
                    s.apply(this, arguments), this._seekPosition = 0
                }, r(i.prototype, s.prototype), i.prototype.getType = function() {
                    return "HTML5 HLS audio"
                }, i.prototype.seek = function(t) {
                    s.prototype.seek.apply(this, arguments), this._isInOneOfStates(a.LOADING, a.SEEKING) && (this._seekPosition = t)
                }, i.prototype.getCurrentPosition = function() {
                    if (this._isInOneOfStates(a.LOADING) && this._seekPosition > 0) return this._seekPosition;
                    if (this._isInOneOfStates(a.PLAYING, a.SEEKING)) {
                        if (this._seekPosition >= this._currentPosition) return this._seekPosition;
                        this._seekPosition = 0
                    }
                    return s.prototype.getCurrentPosition.apply(this, arguments)
                }, i.prototype._onStateChange = function(t) {
                    switch (this._logger.log('hls html5 audio event "' + t.type + '"'), clearTimeout(this._bufferingTimeout), t.type) {
                        case "playing":
                            if (this._trySeekToStartPosition()) return;
                            this.updatePositions(), this._setState(a.PLAYING);
                            break;
                        case "pause":
                            this._setState(a.PAUSED);
                            break;
                        case "ended":
                            if (this._currentPosition + u < this._duration) {
                                this._errorID = o.HTML5_AUDIO_ENDED_EARLY, this._errorMessage = this._getErrorMessage(this._errorID), this._logger.log("hls html5 audio error: " + this._errorID + " " + this._errorMessage), this._setState(a.ERROR), this.toggleEventListeners(!1);
                                break
                            }
                            this._currentPosition = this._loadedPosition = this._duration, this.trigger("positionChange", this._currentPosition, this._loadedPosition, this._duration, this), this._setState(a.ENDED), clearInterval(this._positionUpdateTimer);
                            break;
                        case "waiting":
                            if (this.getState() === a.SEEKING) break;
                            this._setState(a.LOADING);
                            break;
                        case "seeking":
                            this._setState(a.SEEKING);
                            break;
                        case "seeked":
                            this.updatePositions(), this._html5Audio.paused && this._setState(a.PAUSED);
                            break;
                        case "error":
                            this._errorID = {
                                1: o.HTML5_AUDIO_ABORTED,
                                2: o.HTML5_AUDIO_NETWORK,
                                3: o.HTML5_AUDIO_DECODE,
                                4: o.HTML5_AUDIO_SRC_NOT_SUPPORTED
                            }[this._html5Audio.error.code], this._errorMessage = this._getErrorMessage(this._errorID), this._logger.log("hls html5 audio error: " + this._errorID + " " + this._errorMessage), this._setState(a.ERROR), this.toggleEventListeners(!1)
                    }
                }
            }, function(t, e, n) {
                var i, r = n(2),
                    o = n(6),
                    s = (n(1), n(4), n(7)),
                    a = n(5),
                    u = n(3),
                    l = {};
                t.exports = i = function(t, e) {
                    s.apply(this, arguments)
                }, r(i.prototype, s.prototype), i._pauseOthersAndForwardEvent = function(t, e) {
                    var n = l[i._html5Audio._playerId];
                    Object.keys(l).forEach(function(t) {
                        var e = l[t];
                        e !== n && e.pause()
                    }), n && n[t](e)
                }, i.prototype._init = function() {
                    if (!i._html5Audio) {
                        var t = o.createAudioElement();
                        t.id = this._settings.audioObjectID + "_Single", t.preload = "none", i._html5Audio = t, this._preloadAudio = t, this._addGlobalListeners()
                    }
                    this._html5Audio = i._html5Audio, this._playRequested = !1, this._logger = new a(this.getType(), this._id, this._settings)
                }, i.prototype._toggleEventListeners = function(t) {
                    t ? l[this._id] = this : delete l[this._id]
                }, i.prototype._addGlobalListeners = function() {
                    s.MediaAPIEvents.forEach(function(t) {
                        switch (t) {
                            case "loadeddata":
                                i._html5Audio.addEventListener("loadeddata", i._pauseOthersAndForwardEvent.bind(null, "_onLoaded"));
                                break;
                            case "loadedmetadata":
                                i._html5Audio.addEventListener("loadedmetadata", i._pauseOthersAndForwardEvent.bind(null, "_onLoadedMetadata"));
                                break;
                            default:
                                i._html5Audio.addEventListener(t, i._pauseOthersAndForwardEvent.bind(null, "_onHtml5AudioStateChange"))
                        }
                    })
                }, i.prototype.getType = function() {
                    return "HTML5 single audio"
                }, i.prototype.play = function(t) {
                    if (this._playRequested = !0, this._html5Audio._playerId === this._descriptor.id && this._isInOneOfStates(u.PAUSED, u.ENDED)) return void s.prototype.resume.apply(this, arguments);
                    this._isInOneOfStates(u.PAUSED) && (t = this._currentPosition), this._startFromPosition = t || 0, this._html5Audio._playerId = this._descriptor.id, this._toggleEventListeners(!0), this._setState(u.LOADING);
                    var e = function() {
                        this._playRequested && (this._logger.log("play after loaded"), this._trySeekToStartPosition(), this._html5Audio.play(), clearInterval(this._positionUpdateTimer), this._positionUpdateTimer = setInterval(this._onPositionChange, this._settings.updateInterval))
                    };
                    this._html5Audio.readyState > 0 && this._descriptor.src === this._html5Audio.src ? e.apply(this) : (this.once("loaded", e), this._html5Audio.type = this._descriptor.mimeType, this._html5Audio.src = this._descriptor.src, this._html5Audio.preload = "auto", this._html5Audio.load())
                }, i.prototype.pause = function() {
                    this._playRequested = !1, this._isInOneOfStates(u.ERROR, u.DEAD) || (this._logger.log("pause"), this._html5Audio._playerId === this._descriptor.id ? this._html5Audio.pause() : (this._toggleEventListeners(!1), this._isInOneOfStates(u.PAUSED) || this._setState(u.PAUSED)), clearTimeout(this._bufferingTimeout), clearInterval(this._positionUpdateTimer))
                }, i.prototype.seek = function(t) {
                    return this._html5Audio._playerId !== this._descriptor.id ? (this._currentPosition = t, void this.trigger("positionChange", this._currentPosition, this._loadedPosition, this._duration, this)) : void s.prototype.seek.apply(this, arguments)
                }, i.prototype.kill = function() {
                    this._state !== u.DEAD && (this._playRequested = !1, clearInterval(this._positionUpdateTimer), clearTimeout(this._bufferingTimeout), this._toggleEventListeners(!1), this._setState(u.DEAD))
                }, i.prototype.resume = function() {
                    return this._isInOneOfStates(u.ERROR, u.DEAD) ? void 0 : this._html5Audio._playerId !== this._descriptor.id ? void this.play(this._currentPosition) : void s.prototype.resume.apply(this, arguments)
                }, i.prototype.preload = function() {
                    !this._preloadAudio && o.supportSourceSwappingWithPreload() && (this._preloadAudio = new Audio, this._preloadAudio.preload = "none");
                    var t = this._preloadAudio;
                    t && "auto" !== t.preload && (this._logger.log("preload"), t.preload = "auto", t._playerId = this._id, t.type = this._descriptor.mimeType, t.src = this._descriptor.src, t.load())
                }
            }, function(t, e) {
                t.exports = {
                    bindAll: function(t, e) {
                        e.forEach(function(e) {
                            t[e] = t[e].bind(t)
                        })
                    }
                }
            }, function(t, e) {
                function n() {
                    if (!$ && document.getElementsByTagName("body")[0]) {
                        try {
                            var t, e = v("span");
                            e.style.display = "none", t = j.getElementsByTagName("body")[0].appendChild(e), t.parentNode.removeChild(t), t = null, e = null
                        } catch (n) {
                            return
                        }
                        $ = !0;
                        for (var i = V.length, r = 0; i > r; r++) V[r]()
                    }
                }

                function i(t) {
                    $ ? t() : V[V.length] = t
                }

                function r(t) {
                    if (typeof B.addEventListener != k) B.addEventListener("load", t, !1);
                    else if (typeof j.addEventListener != k) j.addEventListener("load", t, !1);
                    else if (typeof B.attachEvent != k) E(B, "onload", t);
                    else if ("function" == typeof B.onload) {
                        var e = B.onload;
                        B.onload = function() {
                            e(), t()
                        }
                    } else B.onload = t
                }

                function o() {
                    var t = j.getElementsByTagName("body")[0],
                        e = v(R);
                    e.setAttribute("style", "visibility: hidden;"), e.setAttribute("type", U);
                    var n = t.appendChild(e);
                    if (n) {
                        var i = 0;
                        ! function r() {
                            if (typeof n.GetVariable != k) try {
                                var o = n.GetVariable("$version");
                                o && (o = o.split(" ")[1].split(","), J.pv = [A(o[0]), A(o[1]), A(o[2])])
                            } catch (a) {
                                J.pv = [8, 0, 0]
                            } else if (10 > i) return i++, void setTimeout(r, 10);
                            t.removeChild(e), n = null, s()
                        }()
                    } else s()
                }

                function s() {
                    var t = W.length;
                    if (t > 0)
                        for (var e = 0; t > e; e++) {
                            var n = W[e].id,
                                i = W[e].callbackFn,
                                r = {
                                    success: !1,
                                    id: n
                                };
                            if (J.pv[0] > 0) {
                                var o = y(n);
                                if (o)
                                    if (!S(W[e].swfVersion) || J.wk && J.wk < 312)
                                        if (W[e].expressInstall && u()) {
                                            var s = {};
                                            s.data = W[e].expressInstall, s.width = o.getAttribute("width") || "0", s.height = o.getAttribute("height") || "0", o.getAttribute("class") && (s.styleclass = o.getAttribute("class")), o.getAttribute("align") && (s.align = o.getAttribute("align"));
                                            for (var h = {}, f = o.getElementsByTagName("param"), d = f.length, p = 0; d > p; p++) "movie" != f[p].getAttribute("name").toLowerCase() && (h[f[p].getAttribute("name")] = f[p].getAttribute("value"));
                                            l(s, h, n, i)
                                        } else c(o), i && i(r);
                                else b(n, !0), i && (r.success = !0, r.ref = a(n), r.id = n, i(r))
                            } else if (b(n, !0), i) {
                                var _ = a(n);
                                _ && typeof _.SetVariable != k && (r.success = !0, r.ref = _, r.id = _.id), i(r)
                            }
                        }
                }

                function a(t) {
                    var e = null,
                        n = y(t);
                    return n && "OBJECT" === n.nodeName.toUpperCase() && (e = typeof n.SetVariable !== k ? n : n.getElementsByTagName(R)[0] || n), e
                }

                function u() {
                    return !X && S("6.0.65") && (J.win || J.mac) && !(J.wk && J.wk < 312)
                }

                function l(t, e, n, i) {
                    var r = y(n);
                    if (n = m(n), X = !0, I = i || null, D = {
                            success: !1,
                            id: n
                        }, r) {
                        "OBJECT" == r.nodeName.toUpperCase() ? (L = h(r), O = null) : (L = r, O = n), t.id = F, (typeof t.width == k || !/%$/.test(t.width) && A(t.width) < 310) && (t.width = "310"), (typeof t.height == k || !/%$/.test(t.height) && A(t.height) < 137) && (t.height = "137");
                        var o = J.ie ? "ActiveX" : "PlugIn",
                            s = "MMredirectURL=" + encodeURIComponent(B.location.toString().replace(/&/g, "%26")) + "&MMplayerType=" + o + "&MMdoctitle=" + encodeURIComponent(j.title.slice(0, 47) + " - Flash Player Installation");
                        if (typeof e.flashvars != k ? e.flashvars += "&" + s : e.flashvars = s, J.ie && 4 != r.readyState) {
                            var a = v("div");
                            n += "SWFObjectNew", a.setAttribute("id", n), r.parentNode.insertBefore(a, r), r.style.display = "none", _(r)
                        }
                        d(t, e, n)
                    }
                }

                function c(t) {
                    if (J.ie && 4 != t.readyState) {
                        t.style.display = "none";
                        var e = v("div");
                        t.parentNode.insertBefore(e, t), e.parentNode.replaceChild(h(t), e), _(t)
                    } else t.parentNode.replaceChild(h(t), t)
                }

                function h(t) {
                    var e = v("div");
                    if (J.win && J.ie) e.innerHTML = t.innerHTML;
                    else {
                        var n = t.getElementsByTagName(R)[0];
                        if (n) {
                            var i = n.childNodes;
                            if (i)
                                for (var r = i.length, o = 0; r > o; o++) 1 == i[o].nodeType && "PARAM" == i[o].nodeName || 8 == i[o].nodeType || e.appendChild(i[o].cloneNode(!0))
                        }
                    }
                    return e
                }

                function f(t, e) {
                    var n = v("div");
                    return n.innerHTML = "<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'><param name='movie' value='" + t + "'>" + e + "</object>", n.firstChild
                }

                function d(t, e, n) {
                    var i, r = y(n);
                    if (n = m(n), J.wk && J.wk < 312) return i;
                    if (r) {
                        var o, s, a, u = v(J.ie ? "div" : R);
                        typeof t.id == k && (t.id = n);
                        for (a in e) e.hasOwnProperty(a) && "movie" !== a.toLowerCase() && p(u, a, e[a]);
                        J.ie && (u = f(t.data, u.innerHTML));
                        for (o in t) t.hasOwnProperty(o) && (s = o.toLowerCase(), "styleclass" === s ? u.setAttribute("class", t[o]) : "classid" !== s && "data" !== s && u.setAttribute(o, t[o]));
                        J.ie ? K[K.length] = t.id : (u.setAttribute("type", U), u.setAttribute("data", t.data)), r.parentNode.replaceChild(u, r), i = u
                    }
                    return i
                }

                function p(t, e, n) {
                    var i = v("param");
                    i.setAttribute("name", e), i.setAttribute("value", n), t.appendChild(i)
                }

                function _(t) {
                    var e = y(t);
                    e && "OBJECT" == e.nodeName.toUpperCase() && (J.ie ? (e.style.display = "none", function n() {
                        if (4 == e.readyState) {
                            for (var t in e) "function" == typeof e[t] && (e[t] = null);
                            e.parentNode.removeChild(e)
                        } else setTimeout(n, 10)
                    }()) : e.parentNode.removeChild(e))
                }

                function g(t) {
                    return t && t.nodeType && 1 === t.nodeType
                }

                function m(t) {
                    return g(t) ? t.id : t
                }

                function y(t) {
                    if (g(t)) return t;
                    var e = null;
                    try {
                        e = j.getElementById(t)
                    } catch (n) {}
                    return e
                }

                function v(t) {
                    return j.createElement(t)
                }

                function A(t) {
                    return parseInt(t, 10)
                }

                function E(t, e, n) {
                    t.attachEvent(e, n), q[q.length] = [t, e, n]
                }

                function S(t) {
                    t += "";
                    var e = J.pv,
                        n = t.split(".");
                    return n[0] = A(n[0]), n[1] = A(n[1]) || 0, n[2] = A(n[2]) || 0, e[0] > n[0] || e[0] == n[0] && e[1] > n[1] || e[0] == n[0] && e[1] == n[1] && e[2] >= n[2] ? !0 : !1
                }

                function T(t, e, n, i) {
                    var r = j.getElementsByTagName("head")[0];
                    if (r) {
                        var o = "string" == typeof n ? n : "screen";
                        if (i && (M = null, x = null), !M || x != o) {
                            var s = v("style");
                            s.setAttribute("type", "text/css"), s.setAttribute("media", o), M = r.appendChild(s), J.ie && typeof j.styleSheets != k && j.styleSheets.length > 0 && (M = j.styleSheets[j.styleSheets.length - 1]), x = o
                        }
                        M && (typeof M.addRule != k ? M.addRule(t, e) : typeof j.createTextNode != k && M.appendChild(j.createTextNode(t + " {" + e + "}")))
                    }
                }

                function b(t, e) {
                    if (z) {
                        var n = e ? "visible" : "hidden",
                            i = y(t);
                        $ && i ? i.style.visibility = n : "string" == typeof t && T("#" + t, "visibility:" + n)
                    }
                }

                function w(t) {
                    var e = /[\\\"<>\.;]/,
                        n = null != e.exec(t);
                    return n && typeof encodeURIComponent != k ? encodeURIComponent(t) : t
                }
                /*!    SWFObject v2.3.20130521 <http://github.com/swfobject/swfobject>
                	   is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
                	   */
                var P, L, O, I, D, M, x, k = "undefined",
                    R = "object",
                    N = "Shockwave Flash",
                    C = "ShockwaveFlash.ShockwaveFlash",
                    U = "application/x-shockwave-flash",
                    F = "SWFObjectExprInst",
                    H = "onreadystatechange",
                    B = window,
                    j = document,
                    G = navigator,
                    Y = !1,
                    V = [],
                    W = [],
                    K = [],
                    q = [],
                    $ = !1,
                    X = !1,
                    z = !0,
                    Q = !1,
                    J = function() {
                        var t = typeof j.getElementById != k && typeof j.getElementsByTagName != k && typeof j.createElement != k,
                            e = G.userAgent.toLowerCase(),
                            n = G.platform.toLowerCase(),
                            i = n ? /win/.test(n) : /win/.test(e),
                            r = n ? /mac/.test(n) : /mac/.test(e),
                            o = /webkit/.test(e) ? parseFloat(e.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1,
                            s = "Microsoft Internet Explorer" === G.appName,
                            a = [0, 0, 0],
                            u = null;
                        if (typeof G.plugins != k && typeof G.plugins[N] == R) u = G.plugins[N].description, u && typeof G.mimeTypes != k && G.mimeTypes[U] && G.mimeTypes[U].enabledPlugin && (Y = !0, s = !1, u = u.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), a[0] = A(u.replace(/^(.*)\..*$/, "$1")), a[1] = A(u.replace(/^.*\.(.*)\s.*$/, "$1")), a[2] = /[a-zA-Z]/.test(u) ? A(u.replace(/^.*[a-zA-Z]+(.*)$/, "$1")) : 0);
                        else if (typeof B.ActiveXObject != k) try {
                            var l = new ActiveXObject(C);
                            l && (u = l.GetVariable("$version"), u && (s = !0, u = u.split(" ")[1].split(","), a = [A(u[0]), A(u[1]), A(u[2])]))
                        } catch (c) {}
                        return {
                            w3: t,
                            pv: a,
                            wk: o,
                            ie: s,
                            win: i,
                            mac: r
                        }
                    }();
                ! function() {
                    J.w3 && ((typeof j.readyState != k && ("complete" === j.readyState || "interactive" === j.readyState) || typeof j.readyState == k && (j.getElementsByTagName("body")[0] || j.body)) && n(), $ || (typeof j.addEventListener != k && j.addEventListener("DOMContentLoaded", n, !1), J.ie && (j.attachEvent(H, function t() {
                        "complete" == j.readyState && (j.detachEvent(H, t), n())
                    }), B == top && ! function e() {
                        if (!$) {
                            try {
                                j.documentElement.doScroll("left")
                            } catch (t) {
                                return void setTimeout(e, 0)
                            }
                            n()
                        }
                    }()), J.wk && ! function i() {
                        return $ ? void 0 : /loaded|complete/.test(j.readyState) ? void n() : void setTimeout(i, 0)
                    }()))
                }(), V[0] = function() {
                        Y ? o() : s()
                    },
                    function() {
                        J.ie && window.attachEvent("onunload", function() {
                            for (var t = q.length, e = 0; t > e; e++) q[e][0].detachEvent(q[e][1], q[e][2]);
                            for (var n = K.length, i = 0; n > i; i++) _(K[i]);
                            for (var r in J) J[r] = null;
                            J = null;
                            for (var o in P) P[o] = null;
                            P = null
                        })
                    }(), t.exports = P = {
                        registerObject: function(t, e, n, i) {
                            if (J.w3 && t && e) {
                                var r = {};
                                r.id = t, r.swfVersion = e, r.expressInstall = n, r.callbackFn = i, W[W.length] = r, b(t, !1)
                            } else i && i({
                                success: !1,
                                id: t
                            })
                        },
                        getObjectById: function(t) {
                            return J.w3 ? a(t) : void 0
                        },
                        embedSWF: function(t, e, n, r, o, s, a, c, h, f) {
                            var p = m(e),
                                _ = {
                                    success: !1,
                                    id: p
                                };
                            J.w3 && !(J.wk && J.wk < 312) && t && e && n && r && o ? (b(p, !1), i(function() {
                                n += "", r += "";
                                var i = {};
                                if (h && typeof h === R)
                                    for (var g in h) i[g] = h[g];
                                i.data = t, i.width = n, i.height = r;
                                var m = {};
                                if (c && typeof c === R)
                                    for (var y in c) m[y] = c[y];
                                if (a && typeof a === R)
                                    for (var v in a)
                                        if (a.hasOwnProperty(v)) {
                                            var A = Q ? encodeURIComponent(v) : v,
                                                E = Q ? encodeURIComponent(a[v]) : a[v];
                                            typeof m.flashvars != k ? m.flashvars += "&" + A + "=" + E : m.flashvars = A + "=" + E
                                        }
                                if (S(o)) {
                                    var T = d(i, m, e);
                                    i.id == p && b(p, !0), _.success = !0, _.ref = T, _.id = T.id
                                } else {
                                    if (s && u()) return i.data = s, void l(i, m, e, f);
                                    b(p, !0)
                                }
                                f && f(_)
                            })) : f && f(_)
                        },
                        switchOffAutoHideShow: function() {
                            z = !1
                        },
                        enableUriEncoding: function(t) {
                            Q = typeof t === k ? !0 : t
                        },
                        ua: J,
                        getFlashPlayerVersion: function() {
                            return {
                                major: J.pv[0],
                                minor: J.pv[1],
                                release: J.pv[2]
                            }
                        },
                        hasFlashPlayerVersion: S,
                        createSWF: function(t, e, n) {
                            return J.w3 ? d(t, e, n) : void 0
                        },
                        showExpressInstall: function(t, e, n, i) {
                            J.w3 && u() && l(t, e, n, i)
                        },
                        removeSWF: function(t) {
                            J.w3 && _(t)
                        },
                        createCSS: function(t, e, n, i) {
                            J.w3 && T(t, e, n, i)
                        },
                        addDomLoadEvent: i,
                        addLoadEvent: r,
                        getQueryParamValue: function(t) {
                            var e = j.location.search || j.location.hash;
                            if (e) {
                                if (/\?/.test(e) && (e = e.split("?")[1]), null == t) return w(e);
                                for (var n = e.split("&"), i = 0; i < n.length; i++)
                                    if (n[i].substring(0, n[i].indexOf("=")) == t) return w(n[i].substring(n[i].indexOf("=") + 1))
                            }
                            return ""
                        },
                        expressInstallCallback: function() {
                            if (X) {
                                var t = y(F);
                                t && L && (t.parentNode.replaceChild(L, t), O && (b(O, !0), J.ie && (L.style.display = "block")), I && I(D)), X = !1
                            }
                        },
                        version: "2.3"
                    }
            },
            [78, 29, 30, 31],
            function(t, e) {
                function n(t, e) {
                    for (var n = -1, r = t.length, o = -1, s = []; ++n < r;) t[n] === e && (t[n] = i, s[++o] = n);
                    return s
                }
                var i = "__lodash_placeholder__";
                t.exports = n
            },
            8,
            function(t, e, n) {
                var i, r = n(6),
                    o = n(17),
                    s = n(9),
                    a = n(20),
                    u = n(7),
                    l = n(21),
                    c = n(10),
                    h = n(19);
                n(12), t.exports = i = function() {}, i.createAudioPlayer = function(t, e) {
                    var n, f;
                    if (n = t.src.split(":")[0], "rtmp" !== n && "rtmpt" !== n && !t.forceFlash || t.forceHTML5)
                        if (t.mimeType = i.getMimeType(t), t.mimeType === l.M3U8) f = r.isNativeHlsSupported() && !t.forceCustomHLS ? r.isMobile() || t.forceSingle ? new a(t, e) : new s(t, e) : r.isMSESupported() && r.isMSESupportMPEG() ? new h(t, e) : new o(t, e);
                        else if (r.supportHTML5Audio() && r.canPlayType(t.mimeType) || t.forceHTML5) f = r.isMobile() || t.forceSingle ? new c(t, e) : new u(t, e);
                    else {
                        if (t.mimeType !== l.MPEG) return null;
                        f = new o(t, e)
                    } else f = new o(t, e);
                    return f
                }, i.getMimeType = function(t) {
                    if (t.mimeType) return t.mimeType;
                    var e = t.src.split("?")[0];
                    return e = e.substring(e.lastIndexOf(".") + 1, e.length), l.getTypeByExtension(e)
                }
            },
            function(t, e, n) {
                var i, r = n(2),
                    o = n(46),
                    s = n(72),
                    a = n(1),
                    u = n(4),
                    l = n(5),
                    c = n(3),
                    h = n(12);
                t.exports = i = function(t, e) {
                    this._descriptor = t, this._id = t.id, this._autoPlay = t.autoPlay || !1, i.players[t.id] = this, this._errorMessage = null, this._errorID = null, this._state = c.INITIALIZE, this._settings = e, this._volume = 1, this._muted = !1, this._logger = new l(this.getType(), this._id, e), i.creatingFlashAudio || (i.flashAudio ? this._createFlashAudio() : i.createFlashObject(e))
                }, i.createFlashObject = function(t) {
                    i.creatingFlashAudio = !0, i.containerElement = document.createElement("div"), i.containerElement.setAttribute("id", t.flashObjectID + "-container"), i.flashElementTarget = document.createElement("div"), i.flashElementTarget.setAttribute("id", t.flashObjectID + "-target"), i.containerElement.appendChild(i.flashElementTarget), document.body.appendChild(i.containerElement);
                    var e = function(e) {
                        if (e.success) i.flashAudio = document.getElementById(t.flashObjectID), setTimeout(function() {
                            if (i.flashAudio && !("PercentLoaded" in i.flashAudio))
                                for (var t in i.players) i.players.hasOwnProperty(t) && (i.players[t]._errorID = a.FLASH_PROXY_FLASH_BLOCKED, i.players[t]._errorMessage = "Flash object blocked", i.players[t]._setState(c.ERROR), i.players[t]._logger.type = i.players[t].getType(), i.players[t]._logger.log(i.players[t]._errorMessage))
                        }, t.flashLoadTimeout), i.flashAudio.triggerEvent = function(t, e) {
                            i.players[t]._triggerEvent(e)
                        }, i.flashAudio.onPositionChange = function(t, e, n, r) {
                            i.players[t]._onPositionChange(e, n, r)
                        }, i.flashAudio.onDebug = function(t, e, n) {
                            i.players[t]._logger.type = e, i.players[t]._logger.log(n)
                        }, i.flashAudio.onStateChange = function(t, e) {
                            i.players[t]._setState(e), e === c.DEAD && delete i.players[t]
                        }, i.flashAudio.onInit = function(t) {
                            i.creatingFlashAudio = !1, o(s(i.players), "_createFlashAudio")
                        };
                        else
                            for (var n in i.players) i.players.hasOwnProperty(n) && (i.players[n]._errorID = a.FLASH_PROXY_CANT_LOAD_FLASH, i.players[n]._errorMessage = "Cannot create flash object", i.players[n]._setState(c.ERROR))
                    };
                    document.getElementById(t.flashObjectID) || h.embedSWF(t.flashAudioPath, t.flashObjectID + "-target", "1", "1", "9.0.24", "", {
                        json: encodeURIComponent(JSON.stringify(t))
                    }, {
                        allowscriptaccess: "always"
                    }, {
                        id: t.flashObjectID,
                        tabIndex: "-1"
                    }, e)
                }, i._ready = function() {
                    return i.flashAudio && !i.creatingFlashAudio
                }, r(i.prototype, u), i.players = {}, i.prototype._createFlashAudio = function() {
                    i.flashAudio.createAudio(this._descriptor), this._state = i.flashAudio.getState(this._id), this.setVolume(this._volume), this.setMute(this._muted), this._autoPlay && this.play()
                }, i.prototype._triggerEvent = function(t) {
                    this._logger.log("Flash element triggered event: " + t), this.trigger(t, this)
                }, i.prototype._setState = function(t) {
                    this._state !== t && (this._state = t, this.trigger("stateChange", t, this))
                }, i.prototype._onPositionChange = function(t, e, n) {
                    this.trigger("positionChange", t, e, n, this)
                }, i.prototype.getId = function() {
                    return this._id
                }, i.prototype.getType = function() {
                    return i._ready() ? i.flashAudio.getType(this._id) : "Flash ..."
                }, i.prototype.getContainerElement = function() {
                    return i.containerElement
                }, i.prototype.play = function(t) {
                    if (i._ready()) {
                        if (this.getState() === c.PAUSED) return void this.resume();
                        t = void 0 === t ? 0 : t, i.flashAudio.playAudio(this._id, t)
                    }
                }, i.prototype.pause = function() {
                    i._ready() && i.flashAudio.pauseAudio(this._id)
                }, i.prototype.seek = function(t) {
                    i._ready() && i.flashAudio.seekAudio(this._id, t)
                }, i.prototype.resume = function() {
                    i._ready() && i.flashAudio.resumeAudio(this._id)
                }, i.prototype.setVolume = function(t) {
                    this._volume = t, i._ready() && i.flashAudio.setVolume(this._id, t)
                }, i.prototype.getVolume = function() {
                    return i._ready() ? i.flashAudio.getVolume(this._id) : this._volume
                }, i.prototype.setMute = function(t) {
                    this._muted = t, i._ready() && i.flashAudio.setMute(this._id, t)
                }, i.prototype.getMute = function() {
                    return i._ready() ? i.flashAudio.getMute(this._id) : this._muted
                }, i.prototype.getState = function() {
                    return this._state
                }, i.prototype.getCurrentPosition = function() {
                    return i._ready() ? i.flashAudio.getCurrentPosition(this._id) : 0
                }, i.prototype.getLoadedPosition = function() {
                    return i._ready() ? i.flashAudio.getLoadedPosition(this._id) : 0
                }, i.prototype.getDuration = function() {
                    return i._ready() ? i.flashAudio.getDuration(this._id) : 0
                }, i.prototype.kill = function() {
                    return i._ready() ? void i.flashAudio.killAudio(this._id) : 0
                }, i.prototype.getErrorMessage = function() {
                    return this._errorMessage ? this._errorMessage : i.flashAudio.getErrorMessage(this._id)
                }, i.prototype.getErrorID = function() {
                    return this._errorID ? this._errorID : i.flashAudio.getErrorID(this._id)
                }, i.prototype.getLevelNum = function() {
                    return i._ready() ? i.flashAudio.getLevelNum(this._id) : 0
                }, i.prototype.getLevel = function() {
                    return i._ready() ? i.flashAudio.getLevel(this._id) : 0
                }, i.prototype.setLevel = function(t) {
                    return i._ready() ? i.flashAudio.setLevel(this._id, t) : 0
                }, i.prototype.preload = function() {
                    return !1
                }
            },
            function(t, e, n) {
                var i, r = n(2),
                    o = n(32),
                    s = n(39),
                    a = null,
                    u = n(4),
                    l = n(1),
                    c = {
                        NEW: 0,
                        REQUESTED: 1,
                        COMPLETE: 2,
                        FAILED: 400
                    },
                    h = {
                        FIRST: "#EXTM3U",
                        PLAYLIST: "#EXT-X-STREAM-INF:",
                        SEGMENT: "#EXTINF:",
                        END_TAG: "#EXT-X-ENDLIST",
                        ENCRYPTION: "#EXT-X-KEY:"
                    };
                t.exports = i = function(t, e) {
                    var n;
                    this._descriptor = t, this._logger = e, n = t.src, n.indexOf("?") > -1 && (n = n.substr(0, n.indexOf("?"))), this._baseURI = n.substr(0, n.lastIndexOf("/") + 1)
                }, r(i.prototype, u), i.Segment = function(t, e, n, i) {
                    r(this, {
                        uri: t,
                        startPosition: e,
                        endPosition: e + n,
                        duration: n,
                        index: i,
                        data: null,
                        status: c.NEW
                    })
                }, i.Segment.prototype.containsTime = function(t) {
                    return t >= this.startPosition && t <= this.endPosition
                }, i.prototype.updatePlaylist = function() {
                    var t = new XMLHttpRequest;
                    t.open("GET", this._descriptor.src, !0), t.responseType = "text", t.send(), this._logger.log("Downloading playlist"), t.onload = o(function(e) {
                        return 200 !== t.status ? void this.trigger("playlist_failed", l.MSE_HLS_PLAYLIST_NOT_FOUND) : (this._segments = [], this._parsePlaylist(t.responseText), void(this._segments.length > 0 ? (this._logger.log("Playlist download complete"), this._retrieveEncryptionKey(function() {
                            this.trigger("playlist_complete", this._segments)
                        })) : this.trigger("playlist_failed", l.MSE_HLS_NOT_VALID_PLAYLIST)))
                    }, this), t.onerror = o(function(t) {
                        this.trigger("playlist_failed", l.MSE_HLS_PLAYLIST_NOT_FOUND)
                    }, this)
                }, i.prototype._parsePlaylist = function(t) {
                    var e, n, r, o = t.split("\n"),
                        s = 0,
                        a = 0;
                    for (this._duration = 0; s < o.length;) e = o[s++], 0 === e.indexOf(h.SEGMENT) ? (r = 1e3 * Number(e.substr(8, e.indexOf(",") - 8)), n = this._createSegmentURL(o[s]), this._appendSegment(new i.Segment(n, this._duration, r, a++)), s++) : 0 === e.indexOf(h.ENCRYPTION) && this._parsePlaylistEncryptionHeader(e)
                }, i.prototype._appendSegment = function(t) {
                    this._segments.push(t), this._duration += t.duration
                }, i.prototype._parsePlaylistEncryptionHeader = function(t) {
                    var e, n, i, r = t.substr(h.ENCRYPTION.length).split(",");
                    if (s(r, function(t) {
                            t.indexOf("METHOD") >= 0 ? n = t.split("=")[1] : t.indexOf("URI") >= 0 ? e = t.split("=")[1] : t.indexOf("IV") >= 0 && (i = t.split("=")[1])
                        }), !(n && e && n.length && e.length)) throw new Error("Failed to parse M3U8 encryption header");
                    n = n.trim(), e = e.trim().replace(/"/g, ""), this._encryptionMethod = n, this._encryptionKeyUri = e, i && i.length ? (this._encryptionIvHexString = i.trim(), this._parseEncryptionIvHexString()) : this._encryptionIv = null
                }, i.prototype._parseEncryptionIvHexString = function() {
                    var t, e = this._encryptionIvHexString.replace("0x", ""),
                        n = new Uint16Array(8),
                        i = 0;
                    if (e.length % 4 !== 0) throw new Error("Failed to parse M3U8 encryption IV (length is not multiple of 4)");
                    for (; i < e.length; i += 4) {
                        if (t = parseInt(e.substr(i, 4), 16), isNaN(t)) throw new Error("Failed to parse hex number in IV string");
                        n[i / 4] = t
                    }
                    this._encryptionIv = n
                }, i.prototype._encryptionIvForSegment = function(t) {
                    var e = new DataView(new ArrayBuffer(16));
                    return e.setUint32(0, t.index, !0), e.buffer
                }, i.prototype._retrieveEncryptionKey = function(t) {
                    if (t) {
                        if (!this._encryptionKeyUri) return void t.call(this);
                        var e = this._encryptionKeyUri,
                            n = new XMLHttpRequest;
                        n.open("GET", e, !0), n.responseType = "arraybuffer", n.onload = o(function(i) {
                            200 === n.status ? this._encryptionKey = new Uint8Array(n.response) : this._logger.log("Failed to retrieve encryption key from " + e + ", returned status " + n.status), t.call(this)
                        }, this), n.send(), this._logger.log("Downloading encryption key from " + e)
                    }
                }, i.prototype._removeEncryptionPaddingBytes = function(t) {
                    var e = t.data[t.data.byteLength - 1];
                    e ? (this._logger.log("Detected PKCS7 padding length of " + e + " bytes, slicing segment."), t.data = t.data.subarray(0, t.data.byteLength - e)) : this._logger.log("No padding detected (last byte is zero)")
                }, i.prototype.decryptSegmentAES128 = function(t) {
                    if (this._logger.log("Decrypting AES-128 cyphered segment ..."), !a) throw new Error("AES decryption not built-in");
                    var e, n = a.cipher.createDecipher("AES-CBC", a.util.createBuffer(this._encryptionKey)),
                        i = 0,
                        r = t.data.byteLength;
                    for (e = this._encryptionIv ? this._encryptionIv : this._encryptionIvForSegment(t), this._logger.log("Using IV ->"), n.start({
                            iv: a.util.createBuffer(e)
                        }), n.update(a.util.createBuffer(t.data)), n.finish(), t.data = new Uint8Array(r); r > i; i++) t.data[i] = n.output.getByte();
                    this._removeEncryptionPaddingBytes(t)
                }, i.prototype.isAES128Encrypted = function() {
                    return "AES-128" === this._encryptionMethod
                }, i.prototype.getEncryptionKeyUri = function() {
                    return this._encryptionKeyUri
                }, i.prototype.getEncryptionIv = function() {
                    return this._encryptionIv
                }, i.prototype.getEncryptionKey = function() {
                    return this._encryptionKey
                }, i.prototype.getSegmentIndexForTime = function(t) {
                    var e, n;
                    if (t > this._duration || 0 > t || !this._segments || 0 === this._segments.length) return -1;
                    for (e = Math.floor(this._segments.length * (t / this._duration)), n = this._segments[e]; !(n.startPosition <= t && n.startPosition + n.duration > t);) n.startPosition + n.duration >= t ? e-- : e++, n = this._segments[e];
                    return e
                }, i.prototype.getSegmentForTime = function(t) {
                    var e = this.getSegmentIndexForTime(t);
                    return e >= 0 ? this._segments[e] : null
                }, i.prototype._createSegmentURL = function(t) {
                    return "http://" === t.substr(0, 7) || "https://" === t.substr(0, 8) || "/" === t.substr(0, 1) ? t : this._baseURI + t
                }, i.prototype.loadSegment = function(t) {
                    var e, n, i;
                    i = this._segments[t], i.status !== c.REQUESTED && i.status !== c.COMPLETE && (n = i.uri, e = new XMLHttpRequest, e.open("GET", n, !0), e.responseType = "arraybuffer", e.send(), this._logger.log("Downloading segment " + t + " from " + n), i.downloadStartTime = Date.now(), i.status = c.REQUESTED, e.onload = o(function(n) {
                        return 200 !== e.status ? (this.trigger("segment_failed", l.MSE_HLS_SEGMENT_NOT_FOUND), void(i.status = c.FAILED)) : (this._logger.log("Download of segment " + t + " complete"), i.data = new Uint8Array(e.response), i.downloadTime = Date.now() - i.downloadStartTime, i.status = c.COMPLETE, void this.trigger("segment_complete", i))
                    }, this), e.onerror = o(function(t) {
                        i.status = c.FAILED, this.trigger("segment_failed", l.MSE_HLS_SEGMENT_NOT_FOUND)
                    }, this))
                }, i.prototype.getSegment = function(t) {
                    return this._segments && this._segments[t] ? this._segments[t] : null
                }, i.prototype.getDuration = function() {
                    return this._duration ? this._duration : 0
                }, i.prototype.getNumSegments = function() {
                    return this._segments.length
                }
            },
            function(t, e, n) {
                var i, r = n(2),
                    o = n(11).bindAll,
                    s = n(6),
                    a = (n(4), n(1)),
                    u = n(5),
                    l = n(7),
                    c = n(18),
                    h = n(3);
                t.exports = i = function(t, e) {
                    var n;
                    return this._id = t.id, this._descriptor = t, this._isPlaylistLoaded = !1, this._settings = r(e, {}), this._currentPositionInternal = 0, this._loadedPosition = 0, this._startFromPosition = 0, this._sourceBufferPtsOffset = 0, this._state = h.INITIALIZE, this._minPreBufferLengthForPlayback = 5e3, this._maxBufferLength = 3e4, this._segmentsDownloading = [], this._segmentsAwaitingAppendance = [], this._lastSegmentRequested = null, this._isBufferPrepared = !1, this._html5Audio = s.createAudioElement(), this._logger = new u(this.getType(), this._id, this._settings), (n = window.MediaSource || window.WebKitMediaSource) ? (this._bindHandlers(), o(this, ["_onPositionChange", "_onPlaylistLoaded", "_onMSEInit", "_onMSEDispose", "_onSegmentLoaded", "_onLoadedMetadata", "_onSourceBufferUpdate", "_onSourceBufferUpdateLastSegment", "_checkForNextSegmentToLoad"]), this._toggleEventListeners(!0), this._setState(h.INITIALIZE), this._isNotReady = !0, this._sourceBuffer = null, this._mediaSource = new n, this._mediaSource.addEventListener("sourceopen", this._onMSEInit, !1), this._mediaSource.addEventListener("webkitsourceopen", this._onMSEInit, !1), this._mediaSource.addEventListener("sourceended", this._onMSEDispose, !1), this._mediaSource.addEventListener("sourceclose", this._onMSEDispose, !1), this._html5Audio.src = window.URL.createObjectURL(this._mediaSource), this._hls_toolkit = new c(t, this._logger), this._hls_toolkit.on("segment_complete", this._onSegmentLoaded), void(this._loadOnInit = !1)) : void this._error(a.MSE_NOT_SUPPORTED)
                }, r(i.prototype, l.prototype), i.prototype._onMSEInit = function() {
                    return this._logger.log("source open handler"), this._isNotReady = !1, this._mediaSource.removeEventListener("sourceopen", this._onMSEInit, !1), this._mediaSource.removeEventListener("webkitsourceopen", this._onMSEInit, !1), this._sourceBuffer = this._mediaSource.addSourceBuffer("audio/mpeg"), this._descriptor.duration && (this._setDuration(this._descriptor.duration), this._logger.log("duration set from descriptor metadata to " + this._duration)), this._sourceBuffer.addEventListener("update", this._onSourceBufferUpdate), this._setState(h.IDLE), this._descriptor.preload && this._preload(), this._descriptor.autoPlay ? void this.play() : void(this._loadOnInit && this._loadInitialPlaylist())
                }, i.prototype._onMSEDispose = function() {
                    this._logger.log("source dispose handler"), this._mediaSource.removeEventListener("sourceended", this._onMSEDispose, !1), this._mediaSource.removeEventListener("sourceclose", this._onMSEDispose, !1), this._isNotReady = !0
                }, i.prototype.getType = function() {
                    return "HLS MSE audio"
                }, i.prototype.play = function(t) {
                    return this._isInOneOfStates(h.PAUSED, h.SEEKING, h.ENDED) ? void this.resume() : this._isInOneOfStates(h.IDLE, h.INITIALIZE) ? (this._logger.log("play"), this._currentPositionInternal = this._startFromPosition = t || 0, clearInterval(this._positionUpdateTimer), this._positionUpdateTimer = setInterval(this._onPositionChange, this._settings.updateInterval), this._isNotReady ? void(this._loadOnInit = !0) : void this._loadInitialPlaylist()) : void 0
                }, i.prototype._loadInitialPlaylist = function() {
                    this._isInOneOfStates(h.LOADING) || (this._setState(h.LOADING), this._hls_toolkit.once("playlist_complete", this._onPlaylistLoaded), this._hls_toolkit.updatePlaylist())
                }, i.prototype._inspectEncryptionData = function() {
                    this._hls_toolkit.isAES128Encrypted() && (this._logger.log("got key of byte length " + this._hls_toolkit.getEncryptionKey().byteLength), this._hls_toolkit.getEncryptionIv() ? this._logger.log("got IV of byte length " + this._hls_toolkit.getEncryptionIv().byteLength) : this._logger.log("no IV found in header, will use per-segment-index IV"))
                }, i.prototype._onLoadedMetadata = function() {
                    this._logger.log("HTML5 loadedmetadata event handler")
                }, i.prototype._onPlaylistLoaded = function() {
                    return this._logger.log("playlist loaded handler"), this._isNotReady ? void this._logger.log("we have been disposed while loading the playlist, noop") : (this._isPlaylistLoaded = !0, this._inspectEncryptionData(), this._setDuration(this._hls_toolkit.getDuration()), this._logger.log("duration set from playlist info to " + this._duration), this.trigger("loadedmetadata", this), void this._requestSegment(this._hls_toolkit.getSegmentForTime(this._startFromPosition)))
                }, i.prototype._setDuration = function(t) {
                    this._duration = t;
                    try {
                        this._mediaSource.duration = this._duration / 1e3
                    } catch (e) {
                        this._logger.log("MediaSource API error: " + e.message), this._error(a.MSE_BAD_OBJECT_STATE), this.kill()
                    }
                }, i.prototype._onSegmentLoaded = function(t) {
                    return this._isNotReady ? void this._logger.log("we have been disposed while loading a segment, noop") : void this._appendSegments()
                }, i.prototype._appendSegments = function() {
                    var t = !0;
                    this._segmentsDownloading.slice().forEach(function(e) {
                        e.data && t ? (this._segmentsDownloading.shift(), this._decryptSegment(e), this._appendNextSegment(e)) : t = !1
                    }, this)
                }, i.prototype._appendNextSegment = function(t) {
                    return this._logger.log("Trying to append ..."), this._tryAppendNextSegment(t) ? (t.endPosition === this._duration && (this._logger.log("Appended the very last segment"), this._sourceBuffer.addEventListener("update", this._onSourceBufferUpdateLastSegment)), this._state === h.LOADING && this._isTimeBuffered(this._currentPositionInternal + this._minPreBufferLengthForPlayback) && (this._logger.log("Triggering playback after appending enough segments"), this._html5Audio.play()), void this._checkForNextSegmentToLoad()) : (this._error(a.MSE_BAD_OBJECT_STATE), void this.kill())
                }, i.prototype._decryptSegment = function(t) {
                    this._hls_toolkit.isAES128Encrypted() && this._hls_toolkit.decryptSegmentAES128(t)
                }, i.prototype._tryAppendNextSegment = function(t) {
                    try {
                        return this._sourceBuffer.updating ? (this._logger.log("Source buffer is busy updating already, enqueuing data for later appending"), this._segmentsAwaitingAppendance.unshift(t), !0) : (this._logger.log("Source buffer is ready to take data, lets append now"), t.index > 0 && !this._isBufferPrepared && t.containsTime(this._startFromPosition) ? (this._prepareBuffer(t), !0) : (this._logger.log("Appending data now"), this._sourceBuffer.timestampOffset = t.startPosition / 1e3, this._sourceBuffer.appendBuffer(t.data), !0))
                    } catch (e) {
                        return this._logger.log("Was trying to append but seems like SourceBuffer is not in valid state anymore, dropping segment data (error: " + e.message + ")"), !1
                    }
                    this._logger.log("Appended segment " + t.index)
                }, i.prototype._onSourceBufferUpdateLastSegment = function() {
                    return this._sourceBuffer.updating ? void this._logger.log("SourceBuffer still updating") : (this._sourceBuffer.removeEventListener("update", this._onSourceBufferUpdateLastSegment), void this._mediaSource.endOfStream())
                }, i.prototype._onSourceBufferUpdate = function() {
                    this.trigger("loadeddata", this), this._segmentsAwaitingAppendance.length && this._appendNextSegment(this._segmentsAwaitingAppendance.pop())
                }, i.prototype._prepareBufferUpdate = function(t) {
                    try {
                        if (this._sourceBuffer.updating) return void this._logger.log("SourceBuffer still updating");
                        if (this._sourceBuffer.timestampOffset < t.startPosition) return this._sourceBuffer.timestampOffset = this._prepareBufferUpdatePts, this._sourceBuffer.appendBuffer(t.data), this._prepareBufferUpdatePts += t.duration, void this._logger.log("Appended dummy fill data to buffer in media-interval: " + this._sourceBuffer.timestampOffset + " - " + this._prepareBufferUpdatePts);
                        this._isBufferPrepared = !0, this._sourceBuffer.removeEventListener("update", this._prepareBufferUpdate), this._logger.log("Will append initial segment " + t.index + " now"), this._appendNextSegment(t)
                    } catch (e) {
                        this._logger.log("SourceBuffer might be in invalid state (could not prepare it correctly). Error: " + e.message)
                    }
                }, i.prototype._prepareBuffer = function(t) {
                    this._logger.log("Preparing buffer for non-zero timestamp offset ..."), this._prepareBufferUpdatePts = 0, this._prepareBufferUpdate = this._prepareBufferUpdate.bind(this, t), this._sourceBuffer.addEventListener("update", this._prepareBufferUpdate), this._prepareBufferUpdate(t)
                }, i.prototype.pause = function() {
                    l.prototype.pause.call(this)
                }, i.prototype.seek = function(t) {
                    if (this._html5Audio.seekable, !this._isInOneOfStates(h.ERROR, h.DEAD)) {
                        if (!this._isPlaylistLoaded) return void this.once("loadedmetadata", function() {
                            this.seek(t)
                        });
                        if (t > this._duration) return void this._logger.log("can not seek to position over duration");
                        this._logger.log("seek to " + t + " ms"), this._setState(h.SEEKING), this._requestSegment(this._hls_toolkit.getSegmentForTime(t)), this._html5Audio.currentTime = t / 1e3, this._currentPosition = this._currentPositionInternal = t, this._checkForNextSegmentToLoad()
                    }
                }, i.prototype.resume = function() {
                    l.prototype.resume.call(this)
                }, i.prototype.kill = function() {
                    l.prototype.kill.call(this)
                }, i.prototype._checkForNextSegmentToLoad = function() {
                    var t, e, n, i = this._currentPosition + this._maxBufferLength;
                    if (this._logger.log("checking if we can download next segment"), !this._lastSegmentRequested || this._lastSegmentRequested.endPosition < i) {
                        do {
                            if (e = this._lastSegmentRequested ? this._lastSegmentRequested.index + 1 : 0, t = this._hls_toolkit.getSegment(e), !t) break;
                            this._logger.log("will try to request segment " + e), this._requestSegment(t)
                        } while (t.endPosition < i)
                    } else n = this._lastSegmentRequested.duration, this._logger.log("not necessary to request more data yet, scheduling next check in " + n + " ms"), clearTimeout(this._nextCheckTimeout), this._nextCheckTimeout = setTimeout(this._checkForNextSegmentToLoad, n)
                }, i.prototype._requestSegment = function(t) {
                    return this._lastSegmentRequested = t, this._segmentsDownloading.push(t), t.data ? (this._logger.log("requested data is already loaded"), void this._onSegmentLoaded(t)) : void this._hls_toolkit.loadSegment(t.index)
                }, i.prototype._onPositionChange = function(t) {
                    l.prototype._onPositionChange.apply(this, arguments), this._lastSegmentRequested || this._checkForNextSegmentToLoad()
                }, i.prototype._onBuffering = function() {
                    this._logger.log("buffering detection timeout"), this.getState() !== h.PAUSED && this._setState(h.LOADING)
                }, i.prototype._getErrorMessage = function(t) {
                    var e = {};
                    return e[a.MSE_NOT_SUPPORTED] = "The browsed does not support Media Source Extensions yet", e[a.MSE_HLS_NOT_VALID_PLAYLIST] = "Playlist is invalid", e[a.MSE_HLS_SEGMENT_NOT_FOUND] = "Failed to load media segment", e[a.MSE_HLS_PLAYLIST_NOT_FOUND] = "Failed to load HLS playlist", e[a.MSE_MP3_NOT_SUPPORTED] = "Browser does not support MPEG streams in Media Source Extension", e[t] ? e[t] : l.prototype._getErrorMessage.apply(this, arguments)
                }, i.prototype._isTimeBuffered = function(t) {
                    var e, n = this._html5Audio ? this._html5Audio.buffered : [];
                    for (t /= 1e3, e = 0; e < n.length; e++)
                        if (t < n.end(e) && t >= n.start(e)) return !0;
                    return this._logger.log("requested data is already buffered"), !1
                }
            },
            function(t, e, n) {
                var i, r = n(2),
                    o = n(58),
                    s = (n(1), n(4), n(9)),
                    a = (n(5), n(10)),
                    u = n(3);
                t.exports = i = function(t, e) {
                    a.apply(this, arguments)
                }, r(i.prototype, a.prototype), r(i.prototype, o(s.prototype, "_seekPosition", "getCurrentPosition", "_onStateChange")), i.prototype.seek = function(t) {
                    a.prototype.seek.apply(this, arguments), this._isInOneOfStates(u.LOADING, u.SEEKING) && (this._seekPosition = t)
                }, i.prototype.getType = function() {
                    return "HTML5 HLS single audio"
                }
            },
            function(t, e) {
                t.exports = {
                    AAC: "audio/aac",
                    M3U8: "application/x-mpegURL",
                    MP4: "audio/mp4",
                    MPEG: "audio/mpeg",
                    OGG: "audio/ogg",
                    WAV: "audio/wav",
                    WEBM: "audio/webm",
                    getTypeByExtension: function(t) {
                        var e = {
                            mp1: this.MPEG,
                            mp2: this.MPEG,
                            mp3: this.MPEG,
                            mpeg: this.MPEG,
                            mpg: this.MPEG,
                            aac: this.AAC,
                            mp4: this.MP4,
                            ogg: this.OGG,
                            oga: this.OGG,
                            opus: this.OGG,
                            webm: this.WEBM,
                            wav: this.WAV,
                            m3u8: this.M3U8
                        };
                        return e[t] || null
                    }
                }
            },
            function(t, e, n) {
                t.exports = n(16)
            },
            function(t, e, n) {
                function i(t, e) {
                    return null == e ? t : r(e, o(e), t)
                }
                var r = n(24),
                    o = n(13);
                t.exports = i
            },
            function(t, e) {
                function n(t, e, n) {
                    n || (n = {});
                    for (var i = -1, r = e.length; ++i < r;) {
                        var o = e[i];
                        n[o] = t[o]
                    }
                    return n
                }
                t.exports = n
            },
            function(t, e, n) {
                function i(t) {
                    return s(function(e, n) {
                        var i = -1,
                            s = null == e ? 0 : n.length,
                            a = s > 2 ? n[s - 2] : void 0,
                            u = s > 2 ? n[2] : void 0,
                            l = s > 1 ? n[s - 1] : void 0;
                        for ("function" == typeof a ? (a = r(a, l, 5), s -= 2) : (a = "function" == typeof l ? l : void 0, s -= a ? 1 : 0), u && o(n[0], n[1], u) && (a = 3 > s ? void 0 : a, s = 1); ++i < s;) {
                            var c = n[i];
                            c && t(e, c, a)
                        }
                        return e
                    })
                }
                var r = n(26),
                    o = n(27),
                    s = n(28);
                t.exports = i
            },
            function(t, e) {
                function n(t, e, n) {
                    if ("function" != typeof t) return i;
                    if (void 0 === e) return t;
                    switch (n) {
                        case 1:
                            return function(n) {
                                return t.call(e, n)
                            };
                        case 3:
                            return function(n, i, r) {
                                return t.call(e, n, i, r)
                            };
                        case 4:
                            return function(n, i, r, o) {
                                return t.call(e, n, i, r, o)
                            };
                        case 5:
                            return function(n, i, r, o, s) {
                                return t.call(e, n, i, r, o, s)
                            }
                    }
                    return function() {
                        return t.apply(e, arguments)
                    }
                }

                function i(t) {
                    return t
                }
                t.exports = n
            },
            function(t, e) {
                function n(t) {
                    return function(e) {
                        return null == e ? void 0 : e[t]
                    }
                }

                function i(t) {
                    return null != t && s(c(t))
                }

                function r(t, e) {
                    return t = "number" == typeof t || u.test(t) ? +t : -1, e = null == e ? l : e, t > -1 && t % 1 == 0 && e > t
                }

                function o(t, e, n) {
                    if (!a(n)) return !1;
                    var o = typeof e;
                    if ("number" == o ? i(n) && r(e, n.length) : "string" == o && e in n) {
                        var s = n[e];
                        return t === t ? t === s : s !== s
                    }
                    return !1
                }

                function s(t) {
                    return "number" == typeof t && t > -1 && t % 1 == 0 && l >= t
                }

                function a(t) {
                    var e = typeof t;
                    return !!t && ("object" == e || "function" == e)
                }
                var u = /^\d+$/,
                    l = 9007199254740991,
                    c = n("length");
                t.exports = o
            },
            function(t, e) {
                function n(t, e) {
                    if ("function" != typeof t) throw new TypeError(i);
                    return e = r(void 0 === e ? t.length - 1 : +e || 0, 0),
                        function() {
                            for (var n = arguments, i = -1, o = r(n.length - e, 0), s = Array(o); ++i < o;) s[i] = n[e + i];
                            switch (e) {
                                case 0:
                                    return t.call(this, s);
                                case 1:
                                    return t.call(this, n[0], s);
                                case 2:
                                    return t.call(this, n[0], n[1], s)
                            }
                            var a = Array(e + 1);
                            for (i = -1; ++i < e;) a[i] = n[i];
                            return a[e] = s, t.apply(this, a)
                        }
                }
                var i = "Expected a function",
                    r = Math.max;
                t.exports = n
            },
            function(t, e) {
                function n(t) {
                    return !!t && "object" == typeof t
                }

                function i(t, e) {
                    var n = null == t ? void 0 : t[e];
                    return s(n) ? n : void 0
                }

                function r(t) {
                    return o(t) && f.call(t) == a
                }

                function o(t) {
                    var e = typeof t;
                    return !!t && ("object" == e || "function" == e)
                }

                function s(t) {
                    return null == t ? !1 : r(t) ? d.test(c.call(t)) : n(t) && u.test(t)
                }
                var a = "[object Function]",
                    u = /^\[object .+?Constructor\]$/,
                    l = Object.prototype,
                    c = Function.prototype.toString,
                    h = l.hasOwnProperty,
                    f = l.toString,
                    d = RegExp("^" + c.call(h).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
                t.exports = i
            },
            function(t, e) {
                function n(t) {
                    return !!t && "object" == typeof t
                }

                function i(t) {
                    return function(e) {
                        return null == e ? void 0 : e[t]
                    }
                }

                function r(t) {
                    return null != t && o(h(t))
                }

                function o(t) {
                    return "number" == typeof t && t > -1 && t % 1 == 0 && c >= t
                }

                function s(t) {
                    return n(t) && r(t) && u.call(t, "callee") && !l.call(t, "callee")
                }
                var a = Object.prototype,
                    u = a.hasOwnProperty,
                    l = a.propertyIsEnumerable,
                    c = 9007199254740991,
                    h = i("length");
                t.exports = s
            },
            8,
            function(t, e, n) {
                var i = n(33),
                    r = n(14),
                    o = n(36),
                    s = 1,
                    a = 32,
                    u = o(function(t, e, n) {
                        var o = s;
                        if (n.length) {
                            var l = r(n, u.placeholder);
                            o |= a
                        }
                        return i(t, o, e, n, l)
                    });
                u.placeholder = {}, t.exports = u
            },
            function(t, e, n) {
                (function(e) {
                    function i(t, e, n) {
                        for (var i = n.length, r = -1, o = P(t.length - i, 0), s = -1, a = e.length, u = Array(a + o); ++s < a;) u[s] = e[s];
                        for (; ++r < i;) u[n[r]] = t[r];
                        for (; o--;) u[s++] = t[r++];
                        return u
                    }

                    function r(t, e, n) {
                        for (var i = -1, r = n.length, o = -1, s = P(t.length - r, 0), a = -1, u = e.length, l = Array(s + u); ++o < s;) l[o] = t[o];
                        for (var c = o; ++a < u;) l[c + a] = e[a];
                        for (; ++i < r;) l[c + n[i]] = t[o++];
                        return l
                    }

                    function o(t, n) {
                        function i() {
                            var o = this && this !== e && this instanceof i ? r : t;
                            return o.apply(n, arguments)
                        }
                        var r = s(t);
                        return i
                    }

                    function s(t) {
                        return function() {
                            var e = arguments;
                            switch (e.length) {
                                case 0:
                                    return new t;
                                case 1:
                                    return new t(e[0]);
                                case 2:
                                    return new t(e[0], e[1]);
                                case 3:
                                    return new t(e[0], e[1], e[2]);
                                case 4:
                                    return new t(e[0], e[1], e[2], e[3]);
                                case 5:
                                    return new t(e[0], e[1], e[2], e[3], e[4]);
                                case 6:
                                    return new t(e[0], e[1], e[2], e[3], e[4], e[5]);
                                case 7:
                                    return new t(e[0], e[1], e[2], e[3], e[4], e[5], e[6])
                            }
                            var n = p(t.prototype),
                                i = t.apply(n, e);
                            return f(i) ? i : n
                        }
                    }

                    function a(t, n, o, u, l, c, f, p, b, w) {
                        function L() {
                            for (var y = arguments.length, v = y, A = Array(y); v--;) A[v] = arguments[v];
                            if (u && (A = i(A, u, l)), c && (A = r(A, c, f)), M || k) {
                                var T = L.placeholder,
                                    N = _(A, T);
                                if (y -= N.length, w > y) {
                                    var C = p ? d(p) : void 0,
                                        U = P(w - y, 0),
                                        F = M ? N : void 0,
                                        H = M ? void 0 : N,
                                        B = M ? A : void 0,
                                        j = M ? void 0 : A;
                                    n |= M ? E : S, n &= ~(M ? S : E), x || (n &= ~(g | m));
                                    var G = a(t, n, o, B, F, j, H, C, b, U);
                                    return G.placeholder = T, G
                                }
                            }
                            var Y = I ? o : this,
                                V = D ? Y[t] : t;
                            return p && (A = h(A, p)), O && b < A.length && (A.length = b), this && this !== e && this instanceof L && (V = R || s(t)), V.apply(Y, A)
                        }
                        var O = n & T,
                            I = n & g,
                            D = n & m,
                            M = n & v,
                            x = n & y,
                            k = n & A,
                            R = D ? void 0 : s(t);
                        return L
                    }

                    function u(t, n, i, r) {
                        function o() {
                            for (var n = -1, s = arguments.length, l = -1, c = r.length, h = Array(c + s); ++l < c;) h[l] = r[l];
                            for (; s--;) h[l++] = arguments[++n];
                            var f = this && this !== e && this instanceof o ? u : t;
                            return f.apply(a ? i : this, h)
                        }
                        var a = n & g,
                            u = s(t);
                        return o
                    }

                    function l(t, e, n, i, r, s, l, c) {
                        var h = e & m;
                        if (!h && "function" != typeof t) throw new TypeError(b);
                        var f = i ? i.length : 0;
                        if (f || (e &= ~(E | S), i = r = void 0), f -= r ? r.length : 0, e & S) {
                            var d = i,
                                p = r;
                            i = r = void 0
                        }
                        var _ = [t, e, n, i, r, d, p, s, l, c];
                        if (_[9] = null == c ? h ? 0 : t.length : P(c - f, 0) || 0, e == g) var y = o(_[0], _[2]);
                        else y = e != E && e != (g | E) || _[4].length ? a.apply(void 0, _) : u.apply(void 0, _);
                        return y
                    }

                    function c(t, e) {
                        return t = "number" == typeof t || w.test(t) ? +t : -1, e = null == e ? O : e, t > -1 && t % 1 == 0 && e > t
                    }

                    function h(t, e) {
                        for (var n = t.length, i = L(e.length, n), r = d(t); i--;) {
                            var o = e[i];
                            t[i] = c(o, n) ? r[o] : void 0
                        }
                        return t
                    }

                    function f(t) {
                        var e = typeof t;
                        return !!t && ("object" == e || "function" == e)
                    }
                    var d = n(34),
                        p = n(35),
                        _ = n(14),
                        g = 1,
                        m = 2,
                        y = 4,
                        v = 8,
                        A = 16,
                        E = 32,
                        S = 64,
                        T = 128,
                        b = "Expected a function",
                        w = /^\d+$/,
                        P = Math.max,
                        L = Math.min,
                        O = 9007199254740991;
                    t.exports = l
                }).call(e, function() {
                    return this
                }())
            },
            function(t, e) {
                function n(t, e) {
                    var n = -1,
                        i = t.length;
                    for (e || (e = Array(i)); ++n < i;) e[n] = t[n];
                    return e
                }
                t.exports = n
            },
            function(t, e) {
                function n(t) {
                    var e = typeof t;
                    return !!t && ("object" == e || "function" == e)
                }
                var i = function() {
                    function t() {}
                    return function(e) {
                        if (n(e)) {
                            t.prototype = e;
                            var i = new t;
                            t.prototype = void 0
                        }
                        return i || {}
                    }
                }();
                t.exports = i
            },
            28,
            function(t, e, n) {
                function i(t, e) {
                    return void 0 === t ? e : t
                }

                function r(t, e) {
                    return s(function(n) {
                        var i = n[0];
                        return null == i ? i : (n.push(e), t.apply(void 0, n))
                    })
                }
                var o = n(2),
                    s = n(38),
                    a = r(o, i);
                t.exports = a
            },
            28,
            function(t, e, n) {
                function i(t, e) {
                    return function(n, i, r) {
                        return "function" == typeof i && void 0 === r && a(n) ? t(n, i) : e(n, s(i, r, 3))
                    }
                }
                var r = n(40),
                    o = n(41),
                    s = n(45),
                    a = n(15),
                    u = i(r, o);
                t.exports = u
            },
            function(t, e) {
                function n(t, e) {
                    for (var n = -1, i = t.length; ++n < i && e(t[n], n, t) !== !1;);
                    return t
                }
                t.exports = n
            },
            [79, 42],
            [78, 43, 44, 15], 29, 30, 26,
            function(t, e, n) {
                function i(t) {
                    return function(e) {
                        return null == e ? void 0 : e[t]
                    }
                }

                function r(t) {
                    return null != t && s(g(t))
                }

                function o(t, e) {
                    var n = typeof t;
                    if ("string" == n && p.test(t) || "number" == n) return !0;
                    if (h(t)) return !1;
                    var i = !d.test(t);
                    return i || null != e && t in a(e)
                }

                function s(t) {
                    return "number" == typeof t && t > -1 && t % 1 == 0 && _ >= t
                }

                function a(t) {
                    return u(t) ? t : Object(t)
                }

                function u(t) {
                    var e = typeof t;
                    return !!t && ("object" == e || "function" == e)
                }
                var l = n(47),
                    c = n(51),
                    h = n(8),
                    f = n(55),
                    d = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
                    p = /^\w*$/,
                    _ = 9007199254740991,
                    g = i("length"),
                    m = f(function(t, e, n) {
                        var i = -1,
                            s = "function" == typeof e,
                            a = o(e),
                            u = r(t) ? Array(t.length) : [];
                        return l(t, function(t) {
                            var r = s ? e : a && null != t ? t[e] : void 0;
                            u[++i] = r ? r.apply(t, n) : c(t, e, n)
                        }), u
                    });
                t.exports = m
            },
            [79, 48],
            [78, 49, 50, 8], 29, 30,
            function(t, e, n) {
                function i(t, e, n) {
                    null == t || r(e, t) || (e = c(e), t = 1 == e.length ? t : u(t, l(e, 0, -1)), e = s(e));
                    var i = null == t ? t : t[e];
                    return null == i ? void 0 : i.apply(t, n)
                }

                function r(t, e) {
                    var n = typeof t;
                    if ("string" == n && d.test(t) || "number" == n) return !0;
                    if (h(t)) return !1;
                    var i = !f.test(t);
                    return i || null != e && t in o(e)
                }

                function o(t) {
                    return a(t) ? t : Object(t)
                }

                function s(t) {
                    var e = t ? t.length : 0;
                    return e ? t[e - 1] : void 0
                }

                function a(t) {
                    var e = typeof t;
                    return !!t && ("object" == e || "function" == e)
                }
                var u = n(52),
                    l = n(53),
                    c = n(54),
                    h = n(8),
                    f = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
                    d = /^\w*$/;
                t.exports = i
            },
            function(t, e) {
                function n(t, e, n) {
                    if (null != t) {
                        void 0 !== n && n in i(t) && (e = [n]);
                        for (var r = 0, o = e.length; null != t && o > r;) t = t[e[r++]];
                        return r && r == o ? t : void 0
                    }
                }

                function i(t) {
                    return r(t) ? t : Object(t)
                }

                function r(t) {
                    var e = typeof t;
                    return !!t && ("object" == e || "function" == e)
                }
                t.exports = n
            },
            function(t, e) {
                function n(t, e, n) {
                    var i = -1,
                        r = t.length;
                    e = null == e ? 0 : +e || 0, 0 > e && (e = -e > r ? 0 : r + e), n = void 0 === n || n > r ? r : +n || 0, 0 > n && (n += r), r = e > n ? 0 : n - e >>> 0, e >>>= 0;
                    for (var o = Array(r); ++i < r;) o[i] = t[i + e];
                    return o
                }
                t.exports = n
            },
            function(t, e, n) {
                function i(t) {
                    return null == t ? "" : t + ""
                }

                function r(t) {
                    if (o(t)) return t;
                    var e = [];
                    return i(t).replace(s, function(t, n, i, r) {
                        e.push(i ? r.replace(a, "$1") : n || t)
                    }), e
                }
                var o = n(8),
                    s = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,
                    a = /\\(\\)?/g;
                t.exports = r
            },
            28,
            function(t, e, n) {
                function i(t) {
                    return r(2, t)
                }
                var r = n(57);
                t.exports = i
            },
            function(t, e) {
                function n(t, e) {
                    var n;
                    if ("function" != typeof e) {
                        if ("function" != typeof t) throw new TypeError(i);
                        var r = t;
                        t = e, e = r
                    }
                    return function() {
                        return --t > 0 && (n = e.apply(this, arguments)), 1 >= t && (e = void 0), n
                    }
                }
                var i = "Expected a function";
                t.exports = n
            },
            function(t, e, n) {
                var i = n(59),
                    r = n(62),
                    o = n(63),
                    s = n(64),
                    a = n(69),
                    u = a(function(t, e) {
                        return null == t ? {} : "function" == typeof e[0] ? s(t, r(e[0], e[1], 3)) : o(t, i(e))
                    });
                t.exports = u
            },
            function(t, e, n) {
                function i(t) {
                    return !!t && "object" == typeof t
                }

                function r(t, e) {
                    for (var n = -1, i = e.length, r = t.length; ++n < i;) t[r + n] = e[n];
                    return t
                }

                function o(t, e, n, s) {
                    s || (s = []);
                    for (var u = -1, h = t.length; ++u < h;) {
                        var f = t[u];
                        i(f) && a(f) && (n || c(f) || l(f)) ? e ? o(f, e, n, s) : r(s, f) : n || (s[s.length] = f)
                    }
                    return s
                }

                function s(t) {
                    return function(e) {
                        return null == e ? void 0 : e[t]
                    }
                }

                function a(t) {
                    return null != t && u(f(t))
                }

                function u(t) {
                    return "number" == typeof t && t > -1 && t % 1 == 0 && h >= t
                }
                var l = n(60),
                    c = n(61),
                    h = 9007199254740991,
                    f = s("length");
                t.exports = o
            },
            30, 8, 26,
            function(t, e) {
                function n(t, e) {
                    t = i(t);
                    for (var n = -1, r = e.length, o = {}; ++n < r;) {
                        var s = e[n];
                        s in t && (o[s] = t[s])
                    }
                    return o
                }

                function i(t) {
                    return r(t) ? t : Object(t)
                }

                function r(t) {
                    var e = typeof t;
                    return !!t && ("object" == e || "function" == e)
                }
                t.exports = n
            },
            function(t, e, n) {
                function i(t, e) {
                    return o(t, e, s)
                }

                function r(t, e) {
                    var n = {};
                    return i(t, function(t, i, r) {
                        e(t, i, r) && (n[i] = t)
                    }), n
                }
                var o = n(65),
                    s = n(66);
                t.exports = r
            },
            function(t, e) {
                function n(t) {
                    return function(e, n, r) {
                        for (var o = i(e), s = r(e), a = s.length, u = t ? a : -1; t ? u-- : ++u < a;) {
                            var l = s[u];
                            if (n(o[l], l, o) === !1) break
                        }
                        return e
                    }
                }

                function i(t) {
                    return r(t) ? t : Object(t)
                }

                function r(t) {
                    var e = typeof t;
                    return !!t && ("object" == e || "function" == e)
                }
                var o = n();
                t.exports = o
            },
            function(t, e, n) {
                function i(t, e) {
                    return t = "number" == typeof t || l.test(t) ? +t : -1, e = null == e ? f : e, t > -1 && t % 1 == 0 && e > t
                }

                function r(t) {
                    return "number" == typeof t && t > -1 && t % 1 == 0 && f >= t
                }

                function o(t) {
                    var e = typeof t;
                    return !!t && ("object" == e || "function" == e)
                }

                function s(t) {
                    if (null == t) return [];
                    o(t) || (t = Object(t));
                    var e = t.length;
                    e = e && r(e) && (u(t) || a(t)) && e || 0;
                    for (var n = t.constructor, s = -1, l = "function" == typeof n && n.prototype === t, c = Array(e), f = e > 0; ++s < e;) c[s] = s + "";
                    for (var d in t) f && i(d, e) || "constructor" == d && (l || !h.call(t, d)) || c.push(d);
                    return c
                }
                var a = n(67),
                    u = n(68),
                    l = /^\d+$/,
                    c = Object.prototype,
                    h = c.hasOwnProperty,
                    f = 9007199254740991;
                t.exports = s
            },
            30, 8, 28,
            function(t, e, n) {
                function i(t) {
                    var e = ++o;
                    return r(t) + e
                }
                var r = n(71),
                    o = 0;
                t.exports = i
            },
            function(t, e) {
                function n(t) {
                    return null == t ? "" : t + ""
                }
                t.exports = n
            },
            function(t, e, n) {
                function i(t) {
                    return r(t, o(t))
                }
                var r = n(73),
                    o = n(74);
                t.exports = i
            },
            function(t, e) {
                function n(t, e) {
                    for (var n = -1, i = e.length, r = Array(i); ++n < i;) r[n] = t[e[n]];
                    return r
                }
                t.exports = n
            },
            [78, 75, 76, 77], 29, 30, 8,
            function(t, e, n, i, r, o) {
                function s(t) {
                    return function(e) {
                        return null == e ? void 0 : e[t]
                    }
                }

                function a(t) {
                    return null != t && l(E(t))
                }

                function u(t, e) {
                    return t = "number" == typeof t || g.test(t) ? +t : -1, e = null == e ? A : e, t > -1 && t % 1 == 0 && e > t
                }

                function l(t) {
                    return "number" == typeof t && t > -1 && t % 1 == 0 && A >= t
                }

                function c(t) {
                    for (var e = f(t), n = e.length, i = n && t.length, r = !!i && l(i) && (_(t) || p(t)), o = -1, s = []; ++o < n;) {
                        var a = e[o];
                        (r && u(a, i) || y.call(t, a)) && s.push(a)
                    }
                    return s
                }

                function h(t) {
                    var e = typeof t;
                    return !!t && ("object" == e || "function" == e)
                }

                function f(t) {
                    if (null == t) return [];
                    h(t) || (t = Object(t));
                    var e = t.length;
                    e = e && l(e) && (_(t) || p(t)) && e || 0;
                    for (var n = t.constructor, i = -1, r = "function" == typeof n && n.prototype === t, o = Array(e), s = e > 0; ++i < e;) o[i] = i + "";
                    for (var a in t) s && u(a, e) || "constructor" == a && (r || !y.call(t, a)) || o.push(a);
                    return o
                }
                var d = n(i),
                    p = n(r),
                    _ = n(o),
                    g = /^\d+$/,
                    m = Object.prototype,
                    y = m.hasOwnProperty,
                    v = d(Object, "keys"),
                    A = 9007199254740991,
                    E = s("length"),
                    S = v ? function(t) {
                        var e = null == t ? void 0 : t.constructor;
                        return "function" == typeof e && e.prototype === t || "function" != typeof t && a(t) ? c(t) : h(t) ? v(t) : []
                    } : c;
                t.exports = S
            },
            function(t, e, n, i) {
                function r(t, e) {
                    return p(t, e, h)
                }

                function o(t) {
                    return function(e) {
                        return null == e ? void 0 : e[t]
                    }
                }

                function s(t, e) {
                    return function(n, i) {
                        var r = n ? _(n) : 0;
                        if (!u(r)) return t(n, i);
                        for (var o = e ? r : -1, s = l(n);
                            (e ? o-- : ++o < r) && i(s[o], o, s) !== !1;);
                        return n
                    }
                }

                function a(t) {
                    return function(e, n, i) {
                        for (var r = l(e), o = i(e), s = o.length, a = t ? s : -1; t ? a-- : ++a < s;) {
                            var u = o[a];
                            if (n(r[u], u, r) === !1) break
                        }
                        return e
                    }
                }

                function u(t) {
                    return "number" == typeof t && t > -1 && t % 1 == 0 && f >= t
                }

                function l(t) {
                    return c(t) ? t : Object(t)
                }

                function c(t) {
                    var e = typeof t;
                    return !!t && ("object" == e || "function" == e)
                }
                var h = n(i),
                    f = 9007199254740991,
                    d = s(r),
                    p = a(),
                    _ = o("length");
                t.exports = d
            }
        ]))
    }, function(t, e) {
        "use strict";
        t.exports = function(t) {
            function e(i) {
                if (n[i]) return n[i].exports;
                var r = n[i] = {
                    exports: {},
                    id: i,
                    loaded: !1
                };
                return t[i].call(r.exports, r, r.exports, e), r.loaded = !0, r.exports
            }
            var n = {};
            return e.m = t, e.c = n, e.p = "", e(0)
        }([function(t, e, n) {
            function i(t) {
                var e = t.resource_id || t.id || t.cid;
                if (!e) throw new Error("Your model should have a unique `id`, `cid` or `resource_id` property");
                return e
            }

            function r(t) {
                D = t, t && (I.AudioManagerStates = t.States, this.toggleMute(V.muted), this.setVolume(V.volume))
            }

            function o(t) {
                var e, n = this.options;
                return e = {
                    id: this.getId(),
                    src: t.url,
                    duration: k.result(n.duration),
                    mimeType: t.mimeType,
                    forceSingle: n.useSinglePlayer
                }, D.createAudioPlayer(e)
            }

            function s(t, e) {
                var n = e ? "on" : "off";
                t[n]("stateChange", w, this)[n]("positionChange", u, this)[n]("loadedmetadata", a, this)
            }

            function a() {
                this.trigger(U.METADATA)
            }

            function u() {
                this._prevPosition !== this.currentTime() && (this.trigger(U.TIME), this._prevPosition = this.currentTime())
            }

            function l() {
                this._initAudioDefer && (this._initAudioDefer.reject(), this._initAudioDefer = null, this.streamInfo = null)
            }

            function c() {
                l.call(this), this.controller && (this._storedPosition = this.currentTime(), this.controller.kill(), this.controller = null, this.trigger(U.RESET))
            }

            function h() {
                this._registerPlays = !0, this.pause(), this.trigger(U.FINISH)
            }

            function f() {
                var t = M();
                return this.streamInfo ? t.resolve(this.streamInfo) : d.call(this).then(function(e) {
                    var n = R.choosePreferredStream(e, this.options);
                    n ? t.resolve(n) : (this.trigger(U.NO_PROTOCOL), this.options.debug && window.console.warn(L("SCAudio (%s): Could not match a protocol of given media descriptor to one of the supported protocols (" + this.options.protocols + "), aborting attempt to play."), this.getId()), t.reject())
                }.bind(this)).fail(function(e) {
                    this.options.debug && window.console.warn(L("Stream request failed with status: %d"), e.status), p.call(this, e), _.call(this, e), t.reject()
                }.bind(this)), t.promise()
            }

            function d() {
                if (this.options.streamUrls && !this._usedPrefetchUrls) {
                    var t = M();
                    this._usedPrefetchUrls = !0;
                    var e = "function" == typeof this.options.streamUrls ? this.options.streamUrls() : this.options.streamUrls;
                    return t.resolve(e), t.promise()
                }
                return this.ajax({
                    type: "GET",
                    url: k.result(this.options.streamUrlsEndpoint),
                    dataType: "json",
                    async: this.options.asyncFetch,
                    timeout: this.options.asyncFetch ? q : K
                })
            }

            function p(t) {
                var e = t.status >= 400 && -1 !== (t.responseText || "").indexOf("geo_blocked");
                e && this.trigger(U.GEO_BLOCKED)
            }

            function _(t) {
                0 === t.status && this.trigger(U.NO_CONNECTION)
            }

            function g(t) {
                var e = this._initAudioDefer && this._initAudioDefer.state(),
                    n = R.streamValidForPlayingFrom(this.streamInfo, t);
                return e && ("pending" === e || "resolved" === e && n)
            }

            function m(t) {
                t && !this._bufferingTimeout ? this._bufferingTimeout = setTimeout(function() {
                    this._isBuffering = !0, this.trigger(U.BUFFERRING_START)
                }.bind(this), $) : t || (this._bufferingTimeout && (clearTimeout(this._bufferingTimeout), this._bufferingTimeout = null), this._isBuffering && (this._isBuffering = !1, this.trigger(U.BUFFERRING_END)))
            }

            function y() {
                this.off(U.TIME, this.seekTimeEventHandler), this.trigger(U.SEEKED), this.seekTimeEventHandler = null
            }

            function v() {
                this._errorRecoveryFlagsResetTimeout = setTimeout(function() {
                    this._errorRecoveryTime = null, this._errorRecoveryCounts = 0
                }.bind(this), J)
            }

            function A() {
                this._errorRecoveryFlagsResetTimeout && clearTimeout(this._errorRecoveryFlagsResetTimeout)
            }

            function E() {
                var t = this.isPlaying(),
                    e = Date.now();
                return A.call(this), this._errorRecoveryTime && this._errorRecoveryTime + z > e && this._errorRecoveryCounts > Q ? void this.trigger(U.AUDIO_ERROR, this) : (this._errorRecoveryTime = Date.now(), this._errorRecoveryCounts++, c.call(this), void(t && this.play({
                    seek: this.currentTime()
                })))
            }

            function S(t) {
                this.logAudioError({
                    error_id: t,
                    has_flash: x.supportsFlash(),
                    flash_plugin: x.flashPlugin(),
                    playertype: this.controller ? this.controller.getType() : void 0,
                    protocol: this.streamInfo ? this.streamInfo.protocol : void 0,
                    host: this.streamInfo ? G.getUrlHost(this.streamInfo.url) : void 0,
                    media_uri: this.streamInfo ? this.streamInfo.url : void 0
                })
            }

            function T() {
                var t, e = D.Errors;
                if (!this.controller) return this.options.debug && window.console.error(L("SCAudio: controller is null, aborting error handler (" + this.getId() + ")."), this), S.call(this, null), void E.call(this);
                switch (t = this.controller && this.controller.getErrorID(), this.options.debug && ("undefined" != typeof this.controller.getErrorMessage ? window.console.error(L("SCAudio error (" + this.getId() + "): " + this.controller.getErrorMessage())) : window.console.error(L("SCAudio error (" + this.getId() + "): controller implementation lacks getErrorMessage function!"))), S.call(this, t), t) {
                    case e.FLASH_PROXY_CANT_LOAD_FLASH:
                        this.trigger(U.FLASH_NOT_LOADED);
                        break;
                    case e.FLASH_PROXY_FLASH_BLOCKED:
                        this.trigger(U.FLASH_BLOCK);
                        break;
                    case e.FLASH_RTMP_CONNECT_FAILED:
                        k.without(this.options.protocols, B.RTMP);
                    case e.FLASH_RTMP_CANNOT_PLAY_STREAM:
                    case e.FLASH_RTMP_CONNECT_CLOSED:
                    case e.HTML5_AUDIO_NETWORK:
                    case e.HTML5_AUDIO_ABORTED:
                    case e.HTML5_AUDIO_DECODE:
                    case e.HTML5_AUDIO_SRC_NOT_SUPPORTED:
                    case e.HTML5_AUDIO_ENDED_EARLY:
                        E.call(this);
                        break;
                    case e.HTML5_AUDIO_OVERRUN:
                        h.call(this);
                        break;
                    default:
                        window.console.error(L("SCAudio (" + this.getId() + ") does not handle audio error code: " + t), this)
                }
            }

            function b(t) {
                switch (this.options.debug && P.call(this, t), t) {
                    case U.PAUSE:
                        this._isPlaying = !1, this._isPlayActionQueued = !1;
                        break;
                    case U.PLAY:
                        this._isPlaying = !1, this._isPlayActionQueued = !0;
                        break;
                    case U.PLAY_START:
                        this._isPlaying = !0, this._isPlayActionQueued = !1, this._registerPlays && this.registerPlay();
                        break;
                    case U.BUFFERRING_START:
                    case U.SEEK:
                        this._isPlaying && (this._isPlaying = !1, this._isPlayActionQueued = !0);
                        break;
                    case U.BUFFERRING_END:
                    case U.SEEKED:
                        this._isPlayActionQueued && (this._isPlaying = !0, this._isPlayActionQueued = !1)
                }
            }

            function w(t) {
                var e = D.States,
                    n = D.Errors;
                switch (t) {
                    case e.IDLE:
                        O.call(this), this.controller && this.controller.getErrorID() === n.FLASH_PROXY_FLASH_BLOCKED && this.trigger(U.FLASH_UNBLOCK);
                        break;
                    case e.PAUSED:
                        O.call(this), m.call(this, !1), this.seekTimeEventHandler && this.isPaused() && y.call(this);
                        break;
                    case e.PLAYING:
                        O.call(this), m.call(this, !1), v.call(this), this.trigger(U.PLAY_RESUME);
                        break;
                    case e.LOADING:
                    case e.SEEKING:
                        O.call(this), m.call(this, !0);
                        break;
                    case e.ENDED:
                        O.call(this), h.call(this);
                        break;
                    case e.ERROR:
                        m.call(this, !1), T.call(this)
                }
                this.trigger(U.STATE_CHANGE, t)
            }

            function P(t) {
                var e, n = window.console.log;
                t !== U.TIME ? (e = [L("SCAudio event (" + this.getId() + "):")], e.push.apply(e, arguments), n.apply(window.console, e), this._loggedTime = !1) : this._loggedTime || (n.call(window.console, L("SCAudio time (%s): %d ms"), this.getId(), this.currentTime()), this._loggedTime = !0)
            }

            function L(t) {
                return (new Date).toString() + " | " + t
            }

            function O() {
                this._initAudioDefer && this._initAudioDefer.resolve()
            }
            var I, D, M = n(4).Deferred,
                x = n(5),
                k = n(3),
                R = n(15),
                N = n(11),
                C = n(12),
                U = n(1),
                F = n(13),
                H = n(6),
                B = n(2),
                j = n(14),
                G = n(7),
                Y = {},
                V = {
                    muted: !1,
                    volume: 1
                },
                W = {
                    soundId: Y,
                    duration: Y,
                    registerEndpoint: Y,
                    streamUrlsEndpoint: Y,
                    resourceId: !1,
                    debug: !1,
                    asyncFetch: !0,
                    useSinglePlayer: !0,
                    protocols: [B.HLS, B.RTMP, B.HTTP],
                    extensions: [F.MP3],
                    maxBitrate: 1 / 0,
                    mediaSourceEnabled: !1,
                    eventLogger: null,
                    logErrors: !0,
                    logPerformance: !0,
                    ajax: null
                },
                K = 6e3,
                q = 6e3,
                $ = 400,
                X = 6e4,
                z = 6e3,
                Q = 3,
                J = 3e4,
                Z = [];
            I = t.exports = function(t, e) {
                if (1 === arguments.length ? e = t : I.setAudioManager(t), !D) throw new Error("SCAudio: AudioManager instance must be set with `SCAudio.setAudioManager()` or passed via the constructor");
                this.options = k.extend({}, W, e);
                var n = Object.keys(this.options).filter(function(t) {
                    return this.options[t] === Y
                }, this);
                if (n.length) throw new Error("SCAudio: pass into constructor the following options: " + n.join(", "));
                j.prioritizeAndFilter(this.options), this.controller = null, this.streamInfo = null, this._registerPlays = !0, this._registerCounts = this._errorRecoveryCounts = 0, this._isPlayActionQueued = this._usedPrefetchUrls = this._isPlaying = this._isBuffering = !1, this._initAudioDefer = this._expirationTimeout = this._bufferingTimeout = this._errorRecoveryTime = this._errorRecoveryFlagsResetTimeout = this._storedPosition = this._prevPosition = null, this.options.debug && (this._loggedTime = !1), this._modelListeners = {}, this.on("all", b, this), this.audioPerfMonitor = new C(this, this.logAudioPerformance.bind(this)), this.audioLogger = new N(this)
            }, k.extend(I.prototype, H, {
                constructor: I,
                initAudio: function() {
                    return this._initAudioDefer || (this._initAudioDefer = M(), f.call(this).then(function(t) {
                        var e = !0;
                        this.streamInfo && (e = !1), this.streamInfo = t, e && this.trigger(U.STREAMS), this.controller = o.call(this, t), s.call(this, this.controller, !0), w.call(this, this.controller.getState())
                    }.bind(this)).fail(function() {
                        this.trigger(U.NO_STREAMS)
                    }.bind(this)), this._initAudioDefer.done(function() {
                        this.trigger(U.CREATED)
                    }.bind(this))), this._initAudioDefer.promise()
                },
                registerPlay: function() {
                    var t = this.options.soundId,
                        e = !1;
                    return -1 === Z.indexOf(t) && (Z.push(t), setTimeout(function() {
                        var e = Z.indexOf(t);
                        e > -1 && Z.splice(e, 1)
                    }, X), this.ajax({
                        type: "POST",
                        url: k.result(this.options.registerEndpoint),
                        dataType: "json"
                    }), this._registerCounts++, this._registerPlays = !1, this.trigger(U.REGISTERED), e = !0), e
                },
                toggle: function() {
                    this[this.isPaused() ? "play" : "pause"]()
                },
                play: function(t) {
                    var e = t && null != t.seek ? t.seek : this.currentTime();
                    t = k.extend({}, t, {
                        position: e
                    }), this.trigger(U.PLAY, t), g.call(this, e) || c.call(this), this.initAudio().then(function() {
                        this._isPlayActionQueued && (this._storedPosition = null, this.trigger(U.PLAY_START, t), this.controller && this.controller.play(e))
                    }.bind(this)), m.call(this, !0)
                },
                pause: function(t) {
                    this.isPaused() || (t = k.extend({}, t, {
                        position: this.currentTime()
                    }), this.trigger(U.PAUSE, t), this.controller && this.controller.pause(), m.call(this, !1))
                },
                getListenTime: function() {
                    return this.audioLogger ? this.audioLogger.getListenTime() : 0
                },
                dispose: function() {
                    this.audioLogger = null, this.audioPerfMonitor = null, k.without(Z, this.options.soundId), clearTimeout(this._bufferingTimeout), l.call(this), this.controller && (this.controller.kill(), this.controller = null), delete this.controller, this.trigger(U.DESTROYED), this.off()
                },
                seek: function(t) {
                    return this.controller ? t >= k.result(this.options.duration) ? void h.call(this) : (this.seekTimeEventHandler && this.off(U.TIME, this.seekTimeEventHandler), this.seekTimeEventHandler = k.after(2, function() {
                        y.call(this)
                    }.bind(this)), this.on(U.TIME, this.seekTimeEventHandler), this.trigger(U.SEEK, {
                        from: this.currentTime(),
                        to: t
                    }), this.isPlaying() && !g.call(this, t) ? (c.call(this), void this.play({
                        seek: t
                    })) : void this.controller.seek(t)) : void 0
                },
                seekRelative: function(t) {
                    this.controller && this.seek(this.currentTime() + t)
                },
                currentTime: function() {
                    return this._storedPosition ? this._storedPosition : this.controller ? this.controller.getCurrentPosition() : 0
                },
                loadProgress: function() {
                    var t = 0;
                    return this.controller && (t = this.controller.getLoadedPosition() / this.controller.getDuration(), t = t >= .99 ? 1 : t), t
                },
                buffered: function() {
                    return this.controller && this.controller.getDuration() || 0
                },
                isPaused: function() {
                    return !this.isPlaying()
                },
                isBuffering: function() {
                    return this._isBuffering
                },
                isPlaying: function() {
                    return this._isPlayActionQueued || this._isPlaying
                },
                isLoading: function() {
                    return !(!this.controller || this.controller.getState() !== D.States.LOADING)
                },
                toggleMute: function(t) {
                    I.toggleMute(t)
                },
                isMuted: function() {
                    return I.isMuted()
                },
                setVolume: function(t) {
                    I.setVolume(t)
                },
                getVolume: function() {
                    return I.getVolume()
                },
                logAudioPerformance: function(t) {
                    this.getEventLogger() && this.options.logPerformance && this.getEventLogger().audioPerformance(t)
                },
                logAudioError: function(t) {
                    this.getEventLogger() && this.options.logErrors && this.getEventLogger().audioError(t)
                },
                getAudioManagerStates: function() {
                    return D.States
                },
                getId: function() {
                    return this.options.resourceId || this.options.soundId
                },
                getEventLogger: function() {
                    return this.options.eventLogger
                },
                registerModelEventListener: function(t, e) {
                    var n = i(t);
                    if (this._modelListeners[n]) throw new Error("Data model is already registered (forgot to unregister it or registering twice?)");
                    this._modelListeners[n] = e = e.bind(this, t), this.on("all", e)
                },
                unregisterModelEventListener: function(t) {
                    var e = i(t);
                    this._modelListeners[e] && (this.off("all", this._modelListeners[e]), delete this._modelListeners[e])
                },
                ajax: function(t) {
                    return this.options.ajax ? this.options.ajax(t) : k.ajax(t)
                }
            }), k.extend(I, {
                extend: k.inherits,
                getSettings: function() {
                    return V
                },
                setSettings: function(t) {
                    k.extend(V, t)
                },
                setAudioManager: r,
                setAudioManagerOnce: k.once(r),
                toggleMute: function(t) {
                    V.muted = void 0 === t ? !V.muted : !!t, D && D.setVolume(V.muted ? 0 : 1)
                },
                isMuted: function() {
                    return V.muted
                },
                setVolume: function(t) {
                    V.volume = void 0 === t ? 1 : t, D && D.setVolume(V.volume)
                },
                getVolume: function() {
                    return V.volume
                },
                Extensions: F,
                Protocols: B,
                Events: U,
                BUFFER_DELAY: $,
                PLAY_REGISTRATION_TIMEOUT: X
            })
        }, function(t, e) {
            var n = {
                CREATED: "created",
                STATE_CHANGE: "state-change",
                DESTROYED: "destroyed",
                PLAY: "play",
                PLAY_START: "play-start",
                PLAY_RESUME: "play-resume",
                METADATA: "metadata",
                PAUSE: "pause",
                FINISH: "finish",
                RESET: "reset",
                SEEK: "seek",
                SEEKED: "seeked",
                GEO_BLOCKED: "geo_blocked",
                BUFFERRING_START: "buffering_start",
                BUFFERRING_END: "buffering_end",
                FLASH_NOT_LOADED: "flash_not_loaded",
                FLASH_BLOCK: "flash_blocked",
                FLASH_UNBLOCK: "flash_unblocked",
                AUDIO_ERROR: "audio_error",
                TIME: "time",
                NO_STREAMS: "no_streams",
                STREAMS: "streams",
                NO_PROTOCOL: "no_protocol",
                NO_CONNECTION: "no_connection",
                REGISTERED: "registered"
            };
            t.exports = n
        }, function(t, e) {
            var n = {
                HTTP: "http",
                RTMP: "rtmp",
                HLS: "hls"
            };
            t.exports = n
        }, function(t, e, n) {
            var i = n(4).Deferred,
                r = {
                    ajax: function(t) {
                        var e, n, r, o, s, a;
                        r = t.data || null, n = t.url, e = t.type, o = t.dataType, s = t.async, a = t.timeout;
                        var u, l, c, h = i();
                        return void 0 === s && (s = !0), u = new XMLHttpRequest, u.open(e, n, s), s && (u.responseType = "text"), u.onreadystatechange = function() {
                            return 4 == u.readyState ? (clearTimeout(c), 0 != u.status && u.status < 400 ? (l = "json" == o ? JSON.parse(u.responseText) : u.responseText, void h.resolve(l)) : void h.reject(u)) : void 0
                        }, void 0 !== a && (c = setTimeout(function() {
                            4 != u.readyState && (u.abort(), h.reject(u))
                        }, a)), u.send(r), h.promise()
                    },
                    extend: function(t) {
                        var e = Array.prototype.slice.call(arguments, 1);
                        return e.forEach(function(e) {
                            if (e)
                                for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n])
                        }), t
                    },
                    each: function(t, e, n) {
                        Object.keys(t).forEach(function(i) {
                            e.call(n || null, t[i], i)
                        })
                    },
                    find: function(t, e, n) {
                        var i;
                        return t.some(function(t) {
                            return e.call(n, t) ? (i = t, !0) : void 0
                        }), i
                    },
                    has: function(t, e) {
                        return Object.keys(t).indexOf(e) > -1
                    },
                    inherits: function(t, e) {
                        var n, i = this;
                        n = t && r.has(t, "constructor") ? t.constructor : function() {
                            return i.apply(this, arguments)
                        }, r.extend(n, i, e);
                        var o = function() {
                            this.constructor = n
                        };
                        return o.prototype = i.prototype, n.prototype = new o, t && r.extend(n.prototype, t), n.__super__ = i.prototype, n
                    },
                    without: function(t, e) {
                        var n = t.indexOf(e);
                        n > -1 && t.splice(n, 1)
                    },
                    result: function(t) {
                        var e = t;
                        return r.isFunction(e) && (e = t()), e
                    },
                    isFunction: function(t) {
                        return "function" == typeof t
                    },
                    after: function(t, e) {
                        return function() {
                            return --t < 1 ? e.apply(this, arguments) : void 0
                        }
                    },
                    isNull: function(t) {
                        return null === t
                    },
                    once: function(t) {
                        var e, n = !1;
                        return function() {
                            return n ? e : (n = !0, void(e = t.apply(this, arguments)))
                        }
                    }
                };
            t.exports = r
        }, function(t, e, n) {
            t.exports = n(10)
        }, function(t, e) {
            function n(t) {
                return t.test(window.navigator.userAgent.toLowerCase())
            }

            function i(t, e) {
                try {
                    return window.navigator.userAgent.toLowerCase().match(t)[e]
                } catch (n) {
                    return null
                }
            }

            function r() {
                try {
                    return parseInt(i(/chrom(e|ium)\/([0-9]+)\./, 2))
                } catch (t) {
                    return NaN
                }
            }

            function o() {
                return !u() && n(/safari/)
            }

            function s() {
                return o() && n(/version\/7\.1/)
            }

            function a() {
                return o() && n(/version\/8/)
            }

            function u() {
                return n(/chrom(e|ium)/)
            }

            function l() {
                return n(/firefox/)
            }

            function c() {
                try {
                    return window.hasOwnProperty("Audio") && !!(new window.Audio).canPlayType("audio/mpeg")
                } catch (t) {
                    return !1
                }
            }

            function h() {
                try {
                    var t = o() && n(/version\/5\.0/),
                        e = window.hasOwnProperty("Audio") && (!!(new window.Audio).canPlayType('audio/x-mpegURL; codecs="mp3"') || !!(new window.Audio).canPlayType('vnd.apple.mpegURL; codecs="mp3"'));
                    return !t && e
                } catch (i) {
                    return !1
                }
            }

            function f() {
                return p(d()) >= g
            }

            function d() {
                var t, e, n, i;
                if ("undefined" != typeof window.ActiveXObject) try {
                    i = new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash"), i && (t = i.GetVariable("$version"))
                } catch (r) {} else window.navigator && window.navigator.plugins && window.navigator.plugins.length > 0 && (n = "application/x-shockwave-flash", e = window.navigator.mimeTypes, e && e[n] && e[n].enabledPlugin && e[n].enabledPlugin.description && (t = e[n].enabledPlugin.description));
                return t
            }

            function p(t) {
                if (!t) return 0;
                var e = t.match(/\d\S+/)[0].replace(/,/g, ".").split(".");
                return parseFloat([e[0], e[1]].join(".")) || 0
            }
            var _, g = 9;
            _ = {
                flashPlugin: d,
                isSafari: o,
                isSafari71: s,
                isSafari8: a,
                isChrome: u,
                getChromeVersion: r,
                isFirefox: l,
                supportsHLSAudio: h,
                supportsHTML5Audio: c,
                supportsFlash: f
            }, t.exports = _
        }, function(t, e) {
            function n(t, e, n, i) {
                if (!n) return !0;
                if ("object" == typeof n)
                    for (var o in n) n.hasOwnProperty(o) && t[e].apply(t, [o, n[o]].concat(i));
                else {
                    if (!r.test(n)) return !0;
                    for (var s = n.split(r), a = 0, u = s.length; u > a; a++) t[e].apply(t, [s[a]].concat(i))
                }
            }

            function i(t, e) {
                var n, i = -1,
                    r = t.length;
                switch (e.length) {
                    case 0:
                        for (; ++i < r;) n = t[i], n.callback.call(n.ctx);
                        return;
                    case 1:
                        for (; ++i < r;)(n = t[i]).callback.call(n.ctx, e[0]);
                        return;
                    case 2:
                        for (; ++i < r;)(n = t[i]).callback.call(n.ctx, e[0], e[1]);
                        return;
                    case 3:
                        for (; ++i < r;)(n = t[i]).callback.call(n.ctx, e[0], e[1], e[2]);
                        return;
                    default:
                        for (; ++i < r;)(n = t[i]).callback.apply(n.ctx, e)
                }
            }
            var r = /\s+/,
                o = {
                    on: function(t, e, i) {
                        if (!n(this, "on", t, [e, i]) || !e) return this;
                        this._events || (this._events = {});
                        var r = this._events[t] || (this._events[t] = []);
                        return r.push({
                            callback: e,
                            context: i,
                            ctx: i || this
                        }), this
                    },
                    off: function(t, e, i) {
                        var r, o, s, a, u, l, c, h;
                        if (!this._events || !n(this, "off", t, [e, i])) return this;
                        if (!t && !e && !i) return this._events = {}, this;
                        for (a = t ? [t] : Object.keys(this._events), u = 0, l = a.length; l > u; u++)
                            if (t = a[u], s = this._events[t]) {
                                if (this._events[t] = r = [], e || i)
                                    for (c = 0, h = s.length; h > c; c++) o = s[c], (e && e !== o.callback && e !== o.callback._callback || i && i !== o.context) && r.push(o);
                                r.length || delete this._events[t]
                            }
                        return this
                    },
                    trigger: function(t) {
                        if (!this._events) return this;
                        var e = Array.prototype.slice.call(arguments, 1);
                        if (!n(this, "trigger", t, e)) return this;
                        var r = this._events[t],
                            o = this._events.all;
                        return r && i(r, e), o && i(o, arguments), this
                    }
                };
            t.exports = o
        }, function(t, e) {
            var n = {
                getUrlParams: function(t) {
                    var e = {},
                        n = t.indexOf("?");
                    return n > -1 && t.substr(n + 1).split("&").forEach(function(t) {
                        var n = t.split("=");
                        e[n[0]] = n[1]
                    }), e
                },
                getUrlHost: function(t) {
                    var e, n = t.split("//");
                    return e = n[0] === t ? n[0].split("/")[0] : n[1] ? n[1].split("/")[0] : ""
                }
            };
            t.exports = n
        }, function(t, e, n) {
            function i(t) {
                var e = s[t] = {};
                return r.each(t.split(o), function(t, n) {
                    e[n] = !0
                }), e
            }
            var r = t.exports = n(9),
                o = /\s+/,
                s = {};
            r.Callbacks = function(t) {
                t = "string" == typeof t ? s[t] || i(t) : r.extend({}, t);
                var e, n, o, a, u, l, c = [],
                    h = !t.once && [],
                    f = function p(i) {
                        for (e = t.memory && i, n = !0, l = a || 0, a = 0, u = c.length, o = !0; c && u > l; l++)
                            if (c[l].apply(i[0], i[1]) === !1 && t.stopOnFalse) {
                                e = !1;
                                break
                            }
                        o = !1, c && (h ? h.length && p(h.shift()) : e ? c = [] : d.disable())
                    },
                    d = {
                        add: function() {
                            if (c) {
                                var n = c.length;
                                ! function i(e) {
                                    r.each(e, function(e, n) {
                                        var o = r.type(n);
                                        "function" === o ? t.unique && d.has(n) || c.push(n) : n && n.length && "string" !== o && i(n)
                                    })
                                }(arguments), o ? u = c.length : e && (a = n, f(e))
                            }
                            return this
                        },
                        remove: function() {
                            return c && r.each(arguments, function(t, e) {
                                for (var n;
                                    (n = r.inArray(e, c, n)) > -1;) c.splice(n, 1), o && (u >= n && u--, l >= n && l--)
                            }), this
                        },
                        has: function(t) {
                            return r.inArray(t, c) > -1
                        },
                        empty: function() {
                            return c = [], this
                        },
                        disable: function() {
                            return c = h = e = void 0, this
                        },
                        disabled: function() {
                            return !c
                        },
                        lock: function() {
                            return h = void 0, e || d.disable(), this
                        },
                        locked: function() {
                            return !h
                        },
                        fireWith: function(t, e) {
                            return e = e || [], e = [t, e.slice ? e.slice() : e], !c || n && !h || (o ? h.push(e) : f(e)), this
                        },
                        fire: function() {
                            return d.fireWith(this, arguments), this
                        },
                        fired: function() {
                            return !!n
                        }
                    };
                return d
            }
        }, function(t, e) {
            function n(t) {
                return null == t ? String(t) : c[l.call(t)] || "object"
            }

            function i(t) {
                return "function" === u.type(t)
            }

            function r(t) {
                return "array" === u.type(t)
            }

            function o(t, e, n) {
                var r, o = 0,
                    s = t.length,
                    a = void 0 === s || i(t);
                if (n)
                    if (a) {
                        for (r in t)
                            if (e.apply(t[r], n) === !1) break
                    } else
                        for (; s > o && e.apply(t[o++], n) !== !1;);
                else if (a) {
                    for (r in t)
                        if (e.call(t[r], r, t[r]) === !1) break
                } else
                    for (; s > o && e.call(t[o], o, t[o++]) !== !1;);
                return t
            }

            function s(t) {
                return t && "object" === u.type(t) ? !0 : !1
            }

            function a() {
                var t, e, n, i, r, o, s = arguments[0] || {},
                    a = 1,
                    l = arguments.length,
                    c = !1;
                for ("boolean" == typeof s && (c = s, s = arguments[1] || {}, a = 2), "object" == typeof s || u.isFunction(s) || (s = {}), l === a && (s = this, --a); l > a; a++)
                    if (null != (t = arguments[a]))
                        for (e in t) n = s[e], i = t[e], s !== i && (c && i && (u.isPlainObject(i) || (r = u.isArray(i))) ? (r ? (r = !1, o = n && u.isArray(n) ? n : []) : o = n && u.isPlainObject(n) ? n : {}, s[e] = u.extend(c, o, i)) : void 0 !== i && (s[e] = i));
                return s
            }
            var u = t.exports = {
                    type: n,
                    isArray: r,
                    isFunction: i,
                    isPlainObject: s,
                    each: o,
                    extend: a,
                    noop: function() {}
                },
                l = Object.prototype.toString,
                c = {};
            "Boolean Number String Function Array Date RegExp Object".split(" ").forEach(function(t) {
                c["[object " + t + "]"] = t.toLowerCase()
            })
        }, function(t, e, n) {
            /*!
             * jquery-deferred
             * Copyright(c) 2011 Hidden <zzdhidden@gmail.com>
             * MIT Licensed
             */
            var i = t.exports = n(8),
                r = Array.prototype.slice;
            i.extend({
                Deferred: function(t) {
                    var e = [
                            ["resolve", "done", i.Callbacks("once memory"), "resolved"],
                            ["reject", "fail", i.Callbacks("once memory"), "rejected"],
                            ["notify", "progress", i.Callbacks("memory")]
                        ],
                        n = "pending",
                        r = {
                            state: function() {
                                return n
                            },
                            always: function() {
                                return o.done(arguments).fail(arguments), this
                            },
                            then: function() {
                                var t = arguments;
                                return i.Deferred(function(n) {
                                    i.each(e, function(e, r) {
                                        var s = r[0],
                                            a = t[e];
                                        o[r[1]](i.isFunction(a) ? function() {
                                            var t = a.apply(this, arguments);
                                            t && i.isFunction(t.promise) ? t.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[s + "With"](this === o ? n : this, [t])
                                        } : n[s])
                                    }), t = null
                                }).promise()
                            },
                            promise: function(t) {
                                return null != t ? i.extend(t, r) : r
                            }
                        },
                        o = {};
                    return r.pipe = r.then, i.each(e, function(t, i) {
                        var s = i[2],
                            a = i[3];
                        r[i[1]] = s.add, a && s.add(function() {
                            n = a
                        }, e[1 ^ t][2].disable, e[2][2].lock), o[i[0]] = s.fire, o[i[0] + "With"] = s.fireWith
                    }), r.promise(o), t && t.call(o, o), o
                },
                when: function(t) {
                    var e, n, o, s = 0,
                        a = r.call(arguments),
                        u = a.length,
                        l = 1 !== u || t && i.isFunction(t.promise) ? u : 0,
                        c = 1 === l ? t : i.Deferred(),
                        h = function(t, n, i) {
                            return function(o) {
                                n[t] = this, i[t] = arguments.length > 1 ? r.call(arguments) : o, i === e ? c.notifyWith(n, i) : --l || c.resolveWith(n, i)
                            }
                        };
                    if (u > 1)
                        for (e = new Array(u), n = new Array(u), o = new Array(u); u > s; s++) a[s] && i.isFunction(a[s].promise) ? a[s].promise().done(h(s, o, a)).fail(c.reject).progress(h(s, n, e)) : --l;
                    return l || c.resolveWith(o, a), c.promise()
                }
            })
        }, function(t, e, n) {
            function i(t) {
                this.listenTime += t.from - this.currentTime, this.currentTime = t.to
            }

            function r(t) {
                this.listenTime += t.position - this.currentTime, this.currentTime = t.position
            }

            function o(t) {
                this.currentTime = t.position
            }
            var s, a = n(1);
            s = t.exports = function(t) {
                this.scAudio = t, this.listenTime = 0, this.currentTime = 0, this.scAudio.on(a.SEEK, i, this).on(a.PLAY_START, o, this).on(a.PAUSE, r, this)
            }, s.prototype = {
                constructor: s,
                getListenTime: function() {
                    return this.listenTime + this.scAudio.currentTime() - this.currentTime
                }
            }
        }, function(t, e, n) {
            function i(t) {
                return "AudioPerfMonitor (" + this.scAudio.getId() + ") : " + t
            }

            function r() {
                return this.scAudio.controller ? this.controller ? void this.printWarning(i.call(this, "Setup was called while it was already initialized (returned with a no-op)")) : (this.scAudio.options.debug && window.console.info(i.call(this, "Initialized for instance %s"), this.scAudio.getId()), this.controller = this.scAudio.controller, this.protocol = this.scAudio.streamInfo.protocol, void(this.host = A.getUrlHost(this.scAudio.streamInfo.url))) : void this.printWarning("Can´t initialize when controller is null")
            }

            function o() {
                return this.controller ? (this.scAudio.options.debug && window.console.info(i.call(this, "Reset for instance %s"), this.scAudio.getId()), this.controller = null, this.protocol = null, this.host = null, void(this.timeToPlayMeasured = !1)) : void this.printWarning(i.call(this, "Reset was called while it was already de-initialized (returned with a no-op)"))
            }

            function s(t) {
                var e = this.scAudio.getAudioManagerStates();
                t === e.LOADING ? this.timeToPlayMeasured && d.call(this) : E.isNull(this.bufferingStartTime) || p.call(this)
            }

            function a() {
                this.metadataLoadStartTime = Date.now()
            }

            function u() {
                return E.isNull(this.metadataLoadStartTime) ? void this.printWarning(i.call(this, "onMetadataEnd was called without onMetadataStart being called before.")) : (this.log({
                    type: "metadata",
                    latency: Date.now() - this.metadataLoadStartTime
                }), void(this.metadataLoadStartTime = null))
            }

            function l() {
                this.playClickTime = Date.now()
            }

            function c() {
                if (!this.timeToPlayMeasured) {
                    if (E.isNull(this.playClickTime)) return void this.printWarning(i.call(this, "onPlayResume was called without onPlayStart being called before."));
                    this.log({
                        type: "play",
                        latency: Date.now() - this.playClickTime
                    }), this.playClickTime = null, this.timeToPlayMeasured = !0
                }
            }

            function h() {
                this.scAudio.isPaused() || (this.seekStartTime = Date.now())
            }

            function f() {
                if (!this.scAudio.isPaused()) {
                    if (E.isNull(this.seekStartTime)) return void this.printWarning(i.call(this, "onSeekEnd was called without onSeekStart being called before."));
                    this.log({
                        type: "seek",
                        latency: Date.now() - this.seekStartTime
                    }), this.seekStartTime = null
                }
            }

            function d() {
                this.bufferingStartTime || (this.bufferingStartTime = Date.now())
            }

            function p() {
                return E.isNull(this.bufferingStartTime) ? void this.printWarning(i.call(this, "onBufferingEnd was called without onBufferingStart being called before.")) : (_.call(this), void(this.bufferingStartTime = null))
            }

            function _() {
                E.isNull(this.bufferingStartTime) || (E.isNull(this.bufferingTimeAccumulated) && (this.bufferingTimeAccumulated = 0), this.bufferingTimeAccumulated += Date.now() - this.bufferingStartTime)
            }

            function g() {
                _.call(this), E.isNull(this.bufferingTimeAccumulated) || (this.log({
                    type: "buffer",
                    latency: this.bufferingTimeAccumulated
                }), this.bufferingStartTime = this.bufferingTimeAccumulated = null)
            }
            var m, y = n(1),
                v = n(6),
                A = n(7),
                E = n(3);
            m = t.exports = function(t, e) {
                this.scAudio = t, this.logFn = e, this.controller = null, this.reset(), t.on(y.CREATED, r, this).on(y.RESET, o, this).on(y.DESTROYED, o, this).on(y.SEEK, h, this).on(y.SEEKED, f, this).on(y.PLAY, l, this).on(y.PLAY_START, a, this).on(y.PLAY_RESUME, c, this).on(y.PAUSE, g, this).on(y.FINISH, g, this).on(y.STATE_CHANGE, s, this).on(y.METADATA, u, this)
            }, E.extend(m.prototype, v, {
                constructor: m,
                log: function(t) {
                    return this.controller ? (E.extend(t, {
                        protocol: this.protocol,
                        host: this.host,
                        playertype: this.controller.getType()
                    }), this.scAudio.options.debug && window.console.info(i.call(this, "%s latency: %d protocol: %s host: %s playertype: %s"), t.type, t.latency, t.protocol, t.host, t.playertype), void this.logFn(t)) : void this.printWarning(i.call(this, "Monitor log was called while controller is null (returned with a no-op)"))
                },
                reset: function() {
                    this.bufferingStartTime = this.bufferingTimeAccumulated = this.playClickTime = this.seekStartTime = this.metadataLoadStartTime = null, this.timeToPlayMeasured = !1
                },
                printWarning: function(t) {
                    this.scAudio.options.debug && window.console.warn(t)
                }
            })
        }, function(t, e) {
            var n = {
                AAC: "aac",
                MP3: "mp3",
                OGG: "ogg",
                OPUS: "opus",
                WAV: "wav"
            };
            t.exports = n
        }, function(t, e, n) {
            function i(t) {
                return l.isChrome() && l.getChromeVersion() >= 35 && t.mediaSourceEnabled || l.isSafari() && l.supportsHLSAudio()
            }

            function r(t) {
                return function(e) {
                    var n = !1;
                    switch (e) {
                        case u.RTMP:
                            n = l.supportsFlash();
                            break;
                        case u.HTTP:
                            n = l.supportsHTML5Audio() || l.supportsFlash();
                            break;
                        case u.HLS:
                            n = i(t)
                    }
                    return n
                }
            }

            function o(t) {
                return (l.isSafari71() || l.isSafari8() || l.isFirefox()) && (t = [u.HTTP, u.HLS, u.RTMP]), t
            }

            function s(t) {
                t.protocols = o(t.protocols).filter(r(t))
            }
            var a, u = n(2),
                l = n(5);
            a = {
                prioritizeAndFilter: s
            }, t.exports = a
        }, function(t, e, n) {
            function i(t, e) {
                if (!t) return !1;
                var n = t.issuedAt + r(t.protocol, t.duration);
                return o(t.protocol) ? Date.now() + t.duration - (e || 0) < n : Date.now() < n
            }

            function r(t, e) {
                var n = o(t);
                return h + (n ? l.result(e) : 0)
            }

            function o(t) {
                return t === u.HTTP || t === u.HLS
            }

            function s(t, e) {
                function n(t, e) {
                    return Math.abs(e - _) - Math.abs(t - _)
                }

                function i(t) {
                    return -1 * t
                }
                var r, o, s, a, u, c, h, f, d, p = {},
                    _ = e.maxBitrate,
                    g = e.protocols,
                    m = e.extensions;
                for (l.each(t, function(t, e) {
                        var n = e.split("_"),
                            i = n[0],
                            r = n[1],
                            o = n[2];
                        p[i] = p[i] || {}, p[i][r] = p[i][r] || {}, p[i][r][o] = t
                    }), u = 0, c = g.length; c > u; ++u)
                    for (a = g[u], f = 0, d = m.length; d > f; ++f)
                        if (h = m[f], p[a] && p[a][h]) return r = Object.keys(p[a][h]).map(Number).sort(i), o = _ === 1 / 0, s = _ === -(1 / 0), _ = o || s ? r[o ? "pop" : "shift"]() : r.sort(n).pop(), {
                            url: p[a][h][_],
                            bitrate: _,
                            protocol: a,
                            extension: h,
                            issuedAt: Date.now(),
                            duration: l.result(e.duration)
                        };
                return null
            }
            var a, u = n(2),
                l = n(3),
                c = .9,
                h = Math.floor(12e4 * c);
            a = t.exports = {
                choosePreferredStream: s,
                streamValidForPlayingFrom: i
            }, t.exports = a
        }])
    }])
});