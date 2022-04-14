import {
	ApplicationCommandOption,
	CommandInteraction,
	GuildMember,
	PermissionResolvable,
	Permissions,
} from 'discord.js';
import type guineabotClient from '../../musicClient';

export const name = 'bass';
export const description = "Let's get this party STARTED!!!";
export const botPermissions: PermissionResolvable[] = [
	Permissions.FLAGS.CONNECT,
	Permissions.FLAGS.SPEAK,
];
export const options: ApplicationCommandOption[] = [
	{
		name: 'level',
		description: 'How much bass',
		type: 'STRING',
		required: true,
		choices: [
			{ name: 'Reduced', value: 'reduced' },
			{
				name: 'None',
				value: 'none',
			},
			{
				name: 'Low',
				value: 'low',
			},
			{
				name: 'Medium',
				value: 'medium',
			},
			{
				name: 'High',
				value: 'high',
			},
		],
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

	const level = interaction.options.getString('level');
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

	const levels = {
		none: 0.0,
		low: 0.4,
		medium: 0.5,
		high: 0.6,
	};

	const bands = new Array(3)
		.fill(null)
		.map((_, i) => ({ band: i, gain: levels[level] }));

	player.setEQ(...bands);

	return interaction.reply({
		embeds: [
			client.embed(
				{
					title: `Bass set to ${level}`,
					description:
						'Please wait a few seconds for the bass to adjust.\n⚠️ Some songs will sound bad on high bass! ⚠️',
				},
				interaction
			),
		],
	});
};
