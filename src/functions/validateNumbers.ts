import type { Track, UnresolvedTrack } from 'erela.js';

export default function validateNumbers(
	where: number,
	to: number,
	queue: (Track | UnresolvedTrack)[]
) {
	if (typeof where !== 'number')
		throw new TypeError('[BOT] > from must be a number');
	if (typeof to !== 'number')
		throw new TypeError('[BOT] > to must be a number');
	if (where < 1 || to < 1 || where > queue.length || to > queue.length)
		throw new RangeError(
			`[BOT] > from/to must be between 1 and ${queue.length}`
		);
}
