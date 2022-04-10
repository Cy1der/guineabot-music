import type guineabotClient from '../../../musicClient';
import type { Guild } from 'discord.js';

export const name = 'guildCreate';
export const execute = (client: guineabotClient, data: Guild) => {
	client.log({
		level: 'info',
		content: `Left guild "${data.name}" (${data.id})`,
	});
};
