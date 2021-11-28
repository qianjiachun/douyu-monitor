function parseUrl() {
    let url = window.location.href;
    let info = {};
    const HOSTS = [
        "https://www.douyuex.com",
        "http://www.douyuex.com",
        "https://www.douyuex.com/",
        "http://www.douyuex.com/",
        "https://douyuex.com/",
        "http://douyuex.com/",
        "https://www.douyuex.com/introduction/",
        "https://www.douyuex.com/introduction",
        "https://www.douyuex.com/install/web.html",
        "https://www.douyuex.com/update/",
        "https://www.douyuex.com/update",
    ]
    if (HOSTS.includes(url)) {
        // 重定向
        location.href = "https://xiaochunchun.gitee.io/douyuex/";
    } else {
        // 本站
        info = getInfo(url);
    }
    return info;
}

function getInfo(url) {
    let ret = {};
    let rid = getQueryVariable("rid");
    let options = getQueryVariable("exoptions");
    options = options ? decodeURIComponent(options) : "";
    if (!rid) {
        let arr = String(url).split("/");
        ret.rid = arr[arr.length - 1].split("?")[0];
    } else {
        ret.rid = rid;
    }
    if (options) {
        ret.options = options;
    }
    return ret;
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

export {
    parseUrl
}