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