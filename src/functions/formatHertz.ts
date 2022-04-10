export default function formatHertz(mhz: number) {
	if (mhz > 1000) {
		const ghz = mhz / 1000;
		return `${ghz.toFixed(1)} GHz`;
	} else return `${mhz} MHz`;
}
