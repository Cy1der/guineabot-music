import type guineabotClient from '../../../musicClient';
import type { Player, Track } from 'erela.js';
import { MessageEmbed, TextChannel } from 'discord.js';
import prettyms from 'pretty-ms';

export const name = 'trackStart';
export const execute = (
	client: guineabotClient,
	player: Player,
	track: Track
) => {
	const channel = client.channels.cache.get(player.textChannel) as TextChannel;
	const embed = new MessageEmbed({
		title: 'Now Playing',
		description: `**Track:** ${track.title}\n**Author:** ${
			track.author
		}\n**Duration:** ${
			track.isStream
				? 'Live'
				: prettyms(track.duration, {
						verbose: true,
						separateMilliseconds: true,
						formatSubMilliseconds: true,
						secondsDecimalDigits: 0,
				  })
		}`,
		thumbnail: {
			url: track.thumbnail,
		},
		url: track.uri,
		color: 'RANDOM',
	});

	channel.send({
		embeds: [embed],
	});
};
