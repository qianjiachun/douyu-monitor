function parseUrl() {
    let url = window.location.href;
    let rid = "";
    const HOSTS = [
        "https://www.douyuex.com",
        "http://www.douyuex.com",
        "https://www.douyuex.com/",
        "http://www.douyuex.com/",
        "https://douyuex.com/",
        "http://douyuex.com/",
    ]
    if (HOSTS.includes(url)) {
        // 重定向
        location.href = "https://xiaochunchun.gitee.io/douyuex/";
    } else {
        // 本站
        rid = getRid(url);
    }
    return rid;
}

function getRid(url) {
    let ret = getQueryVariable("rid");
    if (!ret) {
        let arr = String(url).split("/");
        ret = arr[arr.length - 1].split("?")[0];
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