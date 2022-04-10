import type guineabotClient from '../../../musicClient';

export const name = 'error';
export const execute = (client: guineabotClient, data: string) => {
	client.log({
		level: 'error',
		content: data,
	});
};
