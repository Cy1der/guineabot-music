import type guineabotClient from '../../../musicClient';
import type { Player } from 'erela.js';
import { MessageEmbed, TextChannel } from 'discord.js';

export const name = 'playerMove';
export const execute = (client: guineabotClient, player: Player) => {
	const channel = client.channels.cache.get(player.textChannel) as TextChannel;
	const embed = new MessageEmbed({
		title: 'Channel change detected, destroying player...',
	});

	channel.send({
		embeds: [embed],
	});
	player.destroy();
};
