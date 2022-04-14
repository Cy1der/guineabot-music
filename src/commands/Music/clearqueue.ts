import {
	CommandInteraction,
	GuildMember,
	PermissionResolvable,
	Permissions,
} from 'discord.js';
import type guineabotClient from '../../musicClient';

export const name = 'clearqueue';
export const description = 'Clear music queue';
export const botPermissions: PermissionResolvable[] = [
	Permissions.FLAGS.CONNECT,
	Permissions.FLAGS.SPEAK,
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

	if (!player)
		return interaction.reply({
			embeds: [
				client.embed(
					{
						title: 'No player found!',
					},
					interaction
				),
			],
		});

	player.queue.clear();

	interaction.reply({
		embeds: [
			client.embed(
				{
					title: 'Queue cleared!',
				},
				interaction
			),
		],
	});
};
