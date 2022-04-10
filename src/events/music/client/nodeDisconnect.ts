import type guineabotClient from '../../../musicClient';
import type { Node } from 'erela.js';

export const name = 'nodeDisconnect';
export const execute = (client: guineabotClient, node: Node) => {
	client.log({
		level: 'warn',
		content: `${node.options.identifier} disconnected from Lavalink`,
	});
};
