import {
	ApplicationCommandOption,
	Collection,
	CommandInteraction,
	GuildMember,
	Message,
	PermissionResolvable,
	Permissions,
} from 'discord.js';
import { SearchResult } from 'erela.js';
import type guineabotClient from '../../musicClient';

export const name = 'play';
export const description = 'Play a song';
export const botPermissions: PermissionResolvable[] = [
	Permissions.FLAGS.CONNECT,
	Permissions.FLAGS.SPEAK,
];
export const options: ApplicationCommandOption[] = [
	{
		name: 'search',
		description: 'Search for a track/playlist using keywords or a URL',
		type: 'STRING',
		required: true,
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

	const { channel } = (interaction.member as GuildMember).voice;
	const player = client.manager.create({
		guild: interaction.guild.id,
		voiceChannel: channel.id,
		textChannel: interaction.channel.id,
		selfDeafen: true,
	});

	if (player.state !== 'CONNECTED') player.connect();

	const search = interaction.options.getString('search');
	let res: SearchResult;

	try {
		res = await player.search(search, interaction.user);
		if (res.loadType === 'LOAD_FAILED') {
			if (!player.queue.current) player.destroy();
			throw res.exception;
		}
	} catch (e) {
		return interaction.reply({
			embeds: [
				client.embed(
					{
						title: 'An error occurred!',
						description: 'Please report this error to the developer!',
						fields: [{ name: 'Message', value: `\`${e.interaction}\`` }],
					},
					interaction
				),
			],
		});
	}

	switch (res.loadType) {
		case 'NO_MATCHES':
			if (!player.queue.current) player.destroy();
			return interaction.reply({
				embeds: [
					client.embed(
						{
							title: 'No results found',
						},
						interaction
					),
				],
			});
		case 'TRACK_LOADED':
			player.queue.add(res.tracks[0]);

			if (!player.playing && !player.paused && !player.queue.size)
				player.play();
			return interaction.reply({
				embeds: [
					client.embed(
						{
							title: 'Enqueuing Track',
							fields: [
								{
									name: 'Name',
									value: `\`\`\`${res.tracks[0].title}\`\`\``,
								},
							],
						},
						interaction
					),
				],
			});
		case 'PLAYLIST_LOADED':
			player.queue.add(res.tracks);

			if (
				!player.playing &&
				!player.paused &&
				player.queue.totalSize === res.tracks.length
			)
				player.play();
			return interaction.reply({
				embeds: [
					client.embed(
						{
							title: 'Enqueuing Playlist',
							fields: [
								{
									name: 'Info',
									value: `\`\`\`Name: ${res.playlist.name}\nTrack Count: ${res.tracks.length}\`\`\``,
								},
							],
						},
						interaction
					),
				],
			});
		case 'SEARCH_RESULT':
			let max = 8,
				collected: Collection<string, Message<boolean>>,
				filter = (m: { author: { id: string }; content: string }) =>
					m.author.id === interaction.user.id && /^(\d+|end)$/i.test(m.content);
			if (res.tracks.length < max) max = res.tracks.length;

			const results = res.tracks
				.slice(0, max)
				.map((track, index) => `${++index} - ${track.title}`)
				.join('\n');

			interaction.reply({
				embeds: [
					client.embed(
						{
							title: 'Select A Track or "end" to Cancel',
							author: { name: `Enter A Number: (1-${max})` },
							description: results,
						},
						interaction
					),
				],
			});

			try {
				collected = await interaction.channel.awaitMessages({
					max: 1,
					time: 10000,
					errors: ['time'],
					filter,
				});
			} catch (e) {
				if (!player.queue.current) player.destroy();
				return interaction.followUp({
					embeds: [
						client.embed(
							{
								title: 'You did not provide a selection!',
							},
							interaction
						),
					],
				});
			}

			const first = collected.first().content;

			if (first.toLowerCase() === 'end') {
				if (!player.queue.current) player.destroy();
				return interaction.reply({
					embeds: [
						client.embed(
							{
								title: 'Selection cancelled',
							},
							interaction
						),
					],
				});
			}

			const index = Number(first) - 1;

			if (isNaN(index))
				return interaction.reply({
					embeds: [
						client.embed(
							{
								title: `Please provive a numerical value!`,
							},
							interaction
						),
					],
				});

			if (index < 0 || index > max - 1)
				return interaction.reply({
					embeds: [
						client.embed(
							{
								title: `The number you provided was too small or too big (1-${max})!`,
							},
							interaction
						),
					],
				});

			const track = res.tracks[index];
			player.queue.add(track);

			if (!player.playing && !player.paused && !player.queue.size)
				player.play();
			return interaction.followUp({
				embeds: [
					client.embed(
						{
							title: 'Enqueuing Track',
							fields: [
								{
									name: 'Name',
									value: `\`\`\`${track.title}\`\`\``,
								},
							],
						},
						interaction
					),
				],
			});
	}
};
