export default function formatBytes(a: number, b: number = 2) {
	if (0 == a) return '0 Bytes';
	let c = 1024;
	let d = b || 2;
	let e = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let f = Math.floor(Math.log(a) / Math.log(c));

	return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f];
}
