import {
	CommandInteraction,
	GuildMember,
	PermissionResolvable,
	Permissions,
} from 'discord.js';
import type guineabotClient from '../../musicClient';

export const name = 'join';
export const description = 'Join a voice channel';
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

	const { channel } = (interaction.member as GuildMember).voice;

	const player = client.manager.create({
		guild: interaction.guild.id,
		voiceChannel: channel.id,
		textChannel: interaction.channel.id,
		selfDeafen: true,
	});

	if (player.state !== 'CONNECTED') player.connect();

	interaction.reply({
		content: '👋',
	});
};
