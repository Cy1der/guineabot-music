import type { Guild } from 'discord.js';
import type guineabotClient from '../../../musicClient';

export const name = 'guildCreate';
export const execute = (client: guineabotClient, data: Guild) => {
	client.log({
		level: 'info',
		content: `Joined guild "${data.name}" (${data.id})`,
	});
};
