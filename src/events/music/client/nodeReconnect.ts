import type guineabotClient from '../../../musicClient';
import type { Node } from 'erela.js';

export const name = 'nodeReconnect';
export const execute = (client: guineabotClient, node: Node) => {
	client.log({
		level: 'info',
		content: `${node.options.identifier} reconnected to Lavalink`,
	});
};
