import {
	ApplicationCommandOption,
	CommandInteraction,
	GuildMember,
	PermissionResolvable,
	Permissions,
} from 'discord.js';
import type guineabotClient from '../../musicClient';

export const name = 'earrape';
export const description = "How to kill your ears 101";
export const botPermissions: PermissionResolvable[] = [
	Permissions.FLAGS.CONNECT,
	Permissions.FLAGS.SPEAK,
];
export const options: ApplicationCommandOption[] = [
	{
		name: 'toggle',
		description: 'Do this at your own risk',
		type: 'BOOLEAN',
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

	const bool = interaction.options.getBoolean('toggle');
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

	const bands = new Array(14)
		.fill(null)
		.map((_, i) => ({ band: i, gain: bool ? 2 : 0 }));

	player.setEQ(...bands);

	return interaction.reply({
		embeds: [
			client.embed(
				{
					title: `Earrape ${bool ? "enabled" : "disabled"}`,
					description: "Please wait a few seconds for the audio to adjust.",
				},
				interaction
			),
		],
	});
};
