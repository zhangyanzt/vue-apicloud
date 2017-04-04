//常量
export const HOST = "https://d.apicloud.com/";
export const ANI = {
    type: "movein",
    subType: "from_right",
    duration: 200
};
export const version = 1;

//公共函数
export const fixIos7Bar = function(t) {
    var e = api.systemType;
    if ("ios" == e) {
        var a = api.systemVersion,
            n = parseInt(a, 10),
            i = api.fullScreen,
            o = api.iOS7StatusBarAppearance;
        n >= 7 && !i && o && (t.style.paddingTop = "1rem", t.style.height = "3.2rem")
    }
}

export const fixStatusBar = function(t) {
    var e = api.systemType;
    if ("ios" == e) fixIos7Bar(t);
    else if ("android" == e) {
        var a = api.systemVersion;
        a = parseFloat(a), a >= 4.4 && (t.style.paddingTop = "1.36rem", t.style.height = "3.56rem", t.style.lineHeight = "2.2rem");
    }
}

export const fixContent = function(t) {
    var e = api.systemType;
    if ("ios" == e) t.style.top = "3.2rem";
    else if ("android" == e) {
        var a = api.systemVersion;
        a = parseFloat(a), a >= 4.4 && (t.style.top = "3.56rem")
    }
}

export const getHeight = function(id) {
    return document.getElementById(id).offsetHeight;
}

export const showLoading = function(state) {
    if (state == "on") {
        api.showProgress({
            style: 'default',
            animationType: 'fade',
            title: '',
            text: "稍等一下哦…",
            modal: true
        });
    } else {
        api.hideProgress();
    }
}