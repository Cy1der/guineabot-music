import type guineabotClient from '../../../musicClient';
import type { Player } from 'erela.js';
import { MessageEmbed, TextChannel } from 'discord.js';

export const name = 'queueEnd';
export const execute = (client: guineabotClient, player: Player) => {
	const channel = client.channels.cache.get(player.textChannel) as TextChannel;
	const embed = new MessageEmbed({
		title: 'Queue Ended',
		description: 'Play a track to continue',
		color: 'RANDOM',
	});

	channel.send({
		embeds: [embed],
	});
	player.destroy();
};
