! function(t) {
    function e(t, e, r, a) { return "function" == typeof e && (a = r, r = e, e = void 0), "function" != typeof r && (a = r, r = void 0), { url: t, data: e, fnSuc: r, dataType: a } }
    var r = {},
        a = /android/gi.test(navigator.appVersion),
        n = function() { var e = t.localStorage; return a && (e = os.localStorage()), e };
    r.trim = function(t) { return String.prototype.trim ? null == t ? "" : String.prototype.trim.call(t) : t.replace(/(^\s*)|(\s*$)/g, "") }, r.trimAll = function(t) { return t.replace(/\s*/g, "") }, r.isElement = function(t) { return !(!t || 1 != t.nodeType) }, r.isArray = function(t) { return Array.isArray ? Array.isArray(t) : t instanceof Array }, r.isEmptyObject = function(t) { return "{}" === JSON.stringify(t) ? !0 : !1 }, r.jsonToStr = function(t) { return "object" == typeof t ? JSON && JSON.stringify(t) : void 0 }, r.strToJson = function(t) { return "string" == typeof t ? JSON && JSON.parse(t) : void 0 }, r.setStorage = function(t, e) {
        if (2 === arguments.length) {
            var r = e;
            "object" == typeof r ? (r = JSON.stringify(r), r = "obj-" + r) : r = "str-" + r;
            var a = n();
            a && a.setItem(t, r)
        }
    }, r.getStorage = function(t) { var e = n(); if (e) { var r = e.getItem(t); if (!r) return; if (0 === r.indexOf("obj-")) return r = r.slice(4), JSON.parse(r); if (0 === r.indexOf("str-")) return r.slice(4) } }, r.rmStorage = function(t) {
        var e = n();
        e && t && e.removeItem(t)
    }, r.clearStorage = function() {
        var t = n();
        t && t.clear()
    }, r.fixIos7Bar = function(t) {
        if (!r.isElement(t)) return void console.warn("$api.fixIos7Bar Function need el param, el param must be DOM Element");
        var e = api.systemType;
        if ("ios" == e) {
            var a = api.systemVersion,
                n = parseInt(a, 10),
                i = api.fullScreen,
                o = api.iOS7StatusBarAppearance;
            n >= 7 && !i && o && (t.style.paddingTop = "20px")
        }
    }, r.fixStatusBar = function(t) {
        if (!r.isElement(t)) return void console.warn("$api.fixStatusBar Function need el param, el param must be DOM Element");
        var e = api.systemType;
        if ("ios" == e) r.fixIos7Bar(t);
        else if ("android" == e) {
            var a = api.systemVersion;
            a = parseFloat(a), a >= 4.4 && (t.style.paddingTop = "25px")
        }
    }, r.post = function() {
        var t = e.apply(null, arguments),
            r = {},
            a = t.fnSuc;
        if (t.url && (r.url = t.url), t.data && (r.data = t.data), t.dataType) {
            var n = t.dataType.toLowerCase();
            ("text" == n || "json" == n) && (r.dataType = n)
        } else r.dataType = "json";
        r.method = "post", api.ajax(r, function(t, e) { t && a && a(t) })
    }, r.get = function() {
        var t = e.apply(null, arguments),
            r = {},
            a = t.fnSuc;
        if (t.url && (r.url = t.url), t.dataType) {
            var n = t.dataType.toLowerCase();
            ("text" == n || "json" == n) && (r.dataType = n)
        } else r.dataType = "text";
        r.method = "get", api.ajax(r, function(t, e) { t && a && a(t) })
    }, t.$api = r
}(window);