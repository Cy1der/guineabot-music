import type guineabotClient from '../../../musicClient';
import type { Node } from 'erela.js';

export const name = 'nodeError';
export const execute = (client: guineabotClient, node: Node, error: Error) => {
	client.log({
		level: 'error',
		content: `${node.options.identifier} crashed: ${error}`,
	});
};
