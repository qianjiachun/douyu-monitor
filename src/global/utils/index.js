export function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

export function getStrMiddle(str, before, after) {
	let m = str.match(new RegExp(before + '(.*?)' + after));
	return m ? m[1] : false;
}