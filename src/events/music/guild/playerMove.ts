import type guineabotClient from '../../../musicClient';
import type { Player } from 'erela.js';
import { MessageEmbed, TextChannel } from 'discord.js';

export const name = 'playerMove';
export const execute = (
	client: guineabotClient,
	player: Player,
	newChannel: string
) => {
	const channel = client.channels.cache.get(player.textChannel) as TextChannel;
	if (newChannel === null) {
		const embed = new MessageEmbed({
			title: 'Disconnected from voice, destroying player...',
		});

		channel.send({
			embeds: [embed],
		});
		player.destroy();
	} else {
		const embed = new MessageEmbed({
			title: 'Changed voice channels, clearing queue...',
		});

		channel.send({
			embeds: [embed],
		});
		player.queue.clear();
		player.stop();
	}
};
