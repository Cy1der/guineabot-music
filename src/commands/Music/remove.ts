import {
	ApplicationCommandOption,
	CommandInteraction,
	GuildMember,
	PermissionResolvable,
	Permissions,
} from 'discord.js';
import type guineabotClient from '../../musicClient';

export const name = 'remove';
export const description = 'Remove a track from the queue';
export const botPermissions: PermissionResolvable[] = [
	Permissions.FLAGS.CONNECT,
	Permissions.FLAGS.SPEAK,
];
export const options: ApplicationCommandOption[] = [
	{
		name: 'position',
		description: 'Song queue position',
		type: 'INTEGER',
		required: true,
		minValue: 1,
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

	const index = interaction.options.getInteger('position');
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

	if (index > player.queue.length)
		return interaction.reply({
			embeds: [
				client.embed(
					{
						title: `Number must be in between 1 and ${player.queue.length}`,
					},
					interaction
				),
			],
		});

	const removedTrack = player.queue.remove(index - 1);
	return interaction.reply({
		embeds: [
			client.embed(
				{
					title: `Track Removed`,
					fields: [
						{
							name: 'Name',
							value: `\`\`\`${removedTrack[0].title}\`\`\``,
						},
					],
				},
				interaction
			),
		],
	});
};
