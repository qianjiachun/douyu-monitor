export function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

export function getStrMiddle(str, before, after) {
	let m = str.match(new RegExp(before + '(.*?)' + after));
	return m ? m[1] : false;
}

export function saveLocalData(name, data) {
	localStorage.setItem(name, data);
}

export function getLocalData(name) {
	return localStorage.getItem(name);
}

export function deepCopy(v) {
	return JSON.parse(JSON.stringify(v));
}

export function getClassStyle(dom, attr) {
	// 获取dom的class里的css属性值
	var ie = !+"\v1"; //简单判断ie6~8
	if (attr == "backgroundPosition") { //IE6~8不兼容backgroundPosition写法，识别backgroundPositionX/Y
		if (ie) {
			return dom.currentStyle.backgroundPositionX + " " + dom.currentStyle.backgroundPositionY;
		}
	}
	if (dom.currentStyle) {
		return dom.currentStyle[attr];
	} else {
		return document.defaultView.getComputedStyle(dom, null)[attr];
	}
}

export function formatObj(obj, objTemplate) {
	let ret = {};
	// 将obj格式化成objTemplate的属性格式，而obj的值不变，缺少的属性会增加上去
	for (const key in objTemplate) {
		if (key in obj) {
			if (Object.prototype.toString.call(objTemplate[key]) === "[object Object]") {
				let childRet = formatObj(obj[key], objTemplate[key]);
				ret[key] = childRet;
			} else {
				ret[key] = obj[key];
			}
		} else {
			ret[key] = objTemplate[key];
		}
	}
	return ret;
}