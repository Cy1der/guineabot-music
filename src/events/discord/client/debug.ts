import type guineabotClient from '../../../musicClient';

export const name = 'debug';
export const execute = (client: guineabotClient, data: string) => {
	client.log({
		level: 'info',
		content: data,
	});
};
