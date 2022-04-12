import {
	CommandInteraction,
	PermissionResolvable,
	Permissions,
} from 'discord.js';
import type guineabotClient from '../../musicClient';
import prettyms from 'pretty-ms';

export const name = 'nowplaying';
export const description = 'What is playing?';
export const botPermissions: PermissionResolvable[] = [
	Permissions.FLAGS.CONNECT,
	Permissions.FLAGS.SPEAK,
];
export const execute = async (
	client: guineabotClient,
	interaction: CommandInteraction
) => {
	const player = client.manager.players.get(interaction.guild.id);
	if (!player || !player.queue.current)
		return interaction.reply({
			embeds: [
				client.embed({ title: 'No music is being played!' }, interaction),
			],
		});

	return interaction.reply({
		embeds: [
			client.embed(
				{
					title: 'Current Track',
					fields: [
						{
							name: 'Track',
							value: `${player.queue.current.title}`,
						},
						{
							name: 'Author',
							value: `${player.queue.current.author}`,
						},
						{
							name: 'Duration',
							value: `${
								player.queue.current.isStream
									? 'Live'
									: prettyms(player.queue.current.duration, {
											verbose: true,
											separateMilliseconds: true,
											formatSubMilliseconds: true,
											secondsDecimalDigits: 0,
									  })
							}`,
						},
					],
					thumbnail: {
						url: player.queue.current.thumbnail,
					},
					url: player.queue.current.uri,
				},
				interaction
			),
		],
	});
};
