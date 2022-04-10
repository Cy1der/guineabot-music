import type guineabotClient from '../../../musicClient';

export const name = 'nodeRaw';
export const execute = (client: guineabotClient, payload: unknown) => {
	client.log({
		level: 'info',
		content: `${JSON.stringify(payload)}`,
	});
};
