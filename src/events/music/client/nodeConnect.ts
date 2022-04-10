import type guineabotClient from '../../../musicClient';
import type { Node } from 'erela.js';

export const name = 'nodeConnect';
export const execute = (client: guineabotClient, node: Node) => {
	client.log({
		level: 'info',
		content: `${node.options.identifier} connected to Lavalink`,
	});
};
