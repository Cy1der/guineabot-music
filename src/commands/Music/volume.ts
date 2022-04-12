import {
	ApplicationCommandOption,
	CommandInteraction,
	GuildMember,
	PermissionResolvable,
	Permissions,
} from 'discord.js';
import type guineabotClient from '../../musicClient';

export const name = 'volume';
export const description = 'LOUD or quiet :)';
export const botPermissions: PermissionResolvable[] = [
	Permissions.FLAGS.CONNECT,
	Permissions.FLAGS.SPEAK,
];
export const options: ApplicationCommandOption[] = [
	{
		name: 'volume',
		description: 'The page number to view',
		type: 'INTEGER',
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

	const volume = interaction.options.getInteger('volume');
	const player = client.manager.players.get(interaction.guild.id);

	if (!player)
		return interaction.reply({
			embeds: [
				client.embed(
					{
						title: 'No music is being played!',
					},
					interaction
				),
			],
		});

	if (!volume)
		return interaction.reply({
			embeds: [
				client.embed(
					{
						title: `Current volume: ${player.volume}`,
					},
					interaction
				),
			],
		});

	if (volume < 1 || volume > 100)
		return interaction.reply({
			embeds: [
				client.embed(
					{ title: 'Volume must be a number between 1 and 100' },
					interaction
				),
			],
		});

	player.setVolume(volume);
	interaction.reply({ content: '👍' });
};
