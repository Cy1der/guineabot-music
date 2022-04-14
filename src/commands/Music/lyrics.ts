import {
	ApplicationCommandOption,
	CommandInteraction,
	PermissionResolvable,
	Permissions,
} from 'discord.js';
import type guineabotClient from '../../musicClient';
import { Client } from 'genius-lyrics';

export const name = 'lyrics';
export const description = 'View the lyrics of a song.';
export const botPermissions: PermissionResolvable[] = [
	Permissions.FLAGS.CONNECT,
	Permissions.FLAGS.SPEAK,
];
export const options: ApplicationCommandOption[] = [
	{
		name: 'song',
		description: 'Song name',
		type: 'STRING',
		required: true,
	},
];
export const execute = async (
	client: guineabotClient,
	interaction: CommandInteraction
) => {
	const geniusClient = new Client(client.config.genius_key);
	const song = interaction.options.getString('song');
	const result = await geniusClient.songs.search(song);

	if (!result.length)
		return interaction.reply({
			embeds: [
				client.embed(
					{
						title: 'No lyrics found.',
					},
					interaction
				),
			],
		});

	const lyrics = await result[0].lyrics();

	return interaction.reply({
		embeds: [
			client.embed(
				{
					title: result[0].fullTitle,
					description:
						lyrics.length > 4096 ? lyrics.substring(0, 4093) + '...' : lyrics,
				},
				interaction
			),
		],
	});
};
