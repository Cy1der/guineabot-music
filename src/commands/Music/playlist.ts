import {
	ApplicationCommandOption,
	CommandInteraction,
	GuildMember,
	PermissionResolvable,
	Permissions,
} from 'discord.js';
import type guineabotClient from '../../musicClient';
import type { Track, UnresolvedTrack } from 'erela.js';
import playlistSchema from '../../db/schemas/playlist';
import { v4 as uuidv4 } from 'uuid';

export const name = 'playlist';
export const description = 'Manage your playlists';
export const botPermissions: PermissionResolvable[] = [
	Permissions.FLAGS.CONNECT,
	Permissions.FLAGS.SPEAK,
];
export const options: ApplicationCommandOption[] = [
	{
		name: 'method',
		description: 'Select playlist method',
		type: 'NUMBER',
		required: true,
		choices: [
			{
				name: 'Create',
				value: 1,
			},
			{
				name: 'Delete',
				value: 2,
			},
			{
				name: 'Load',
				value: 3,
			},
			{
				name: 'List',
				value: 4,
			},
		],
	},
	{
		name: 'id',
		description: 'ID of playlist',
		type: 'STRING',
		required: false,
	},
	{
		name: 'name',
		description: 'Name of playlist',
		type: 'STRING',
		required: false,
	},
];
export const execute = async (
	client: guineabotClient,
	interaction: CommandInteraction
) => {
	if (!(interaction.member as GuildMember).voice.channel)
		return interaction.reply({
			content: 'You must be connected to a voice channel to use this command.',
		});

	if (interaction.guild.me.voice.channel) {
		if (
			interaction.guild.me.voice.channel.id !==
			(interaction.member as GuildMember).voice.channel.id
		) {
			return interaction.reply({
				content:
					"I'm already connected to a voice channel, please disconnect me first.",
			});
		}
	}

	const player = client.manager.players.get(interaction.guild.id);
	const method = interaction.options.getNumber('method');

	switch (method) {
		case 1: {
			const name = interaction.options.getString('name');
			if (!name)
				return interaction.reply({
					embeds: [client.embed({ title: 'No name entered' }, interaction)],
				});

			const queueWithCurrent: (Track | UnresolvedTrack)[] = player.queue.concat(
				player.queue.current ?? []
			);
			const uniqueID = uuidv4();

			playlistSchema.create(
				{
					Name: name,
					Tracks: queueWithCurrent,
					UserID: interaction.user.id,
					UID: uniqueID,
				},
				(e) => {
					if (e)
						return interaction.reply({
							embeds: [
								client.embed(
									{
										title: 'Error creating playlist',
										description: e.message,
									},
									interaction
								),
							],
						});
				}
			);

			const result = await playlistSchema.findOne({ UID: uniqueID });

			return interaction.reply({
				embeds: [
					client.embed(
						{
							title: 'Playlist created!',
							description: `ID: ${result.UID}\n${result.Tracks.length} tracks`,
						},
						interaction
					),
				],
			});
		}
		case 2: {
			const id = interaction.options.getString('id');
			if (!id)
				return interaction.reply({
					embeds: [client.embed({ title: 'No ID entered' }, interaction)],
				});

			const search = await playlistSchema.findOne({ UID: id });

			if (!search)
				return interaction.reply({
					embeds: [client.embed({ title: 'No playlist found' }, interaction)],
				});

			await playlistSchema.deleteOne({ UID: id });
			return interaction.reply({
				embeds: [
					client.embed(
						{ title: `Deleted playlist "${search.Name}"` },
						interaction
					),
				],
			});
		}
	}
};
