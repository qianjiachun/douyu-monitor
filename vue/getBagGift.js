// 该文件与项目运行依赖无关，仅用于获取静态数据
// 打开http://webconf.douyucdn.cn/，将此处的代码粘贴进控制台运行，获得的结果替换掉 src/global/utils/dydata/giftData.js，每隔一段时间更新一次
function getBagGift() {
    fetch('http://webconf.douyucdn.cn/resource/common/prop_gift_list/prop_gift_config.json',{
        method: 'GET',
        credentials: 'include'
    }).then(res => {
        return res.text();
    }).then(ret => {
        let json = ret.substring(String("DYConfigCallback(").length, ret.length);
        json = json.substring(0, json.lastIndexOf(")"));
        json = JSON.parse(json);
        let obj = {};
        for (const key in json.data) {
            let item = json.data[key];
            obj[key] = {
                n: item.name,
                pic: item.himg.replace("https://gfs-op.douyucdn.cn/dygift", ""),
                pc: item.pc, 
            }
        }
        console.log(obj);
    }).catch(err => {
        console.log("请求失败!", err);
    })
}
getBagGift();