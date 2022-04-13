import {
	ApplicationCommandOption,
	CommandInteraction,
	GuildMember,
	PermissionResolvable,
	Permissions,
} from 'discord.js';
import type guineabotClient from '../../musicClient';
import validateNumbers from '../../functions/validateNumbers';

export const name = 'swap';
export const description = 'Switch the position of 2 tracks';
export const botPermissions: PermissionResolvable[] = [
	Permissions.FLAGS.CONNECT,
	Permissions.FLAGS.SPEAK,
];
export const options: ApplicationCommandOption[] = [
	{
		name: 'from',
		description: 'Song queue position',
		type: 'INTEGER',
		required: true,
		minValue: 1,
	},
	{
		name: 'to',
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

	const from = interaction.options.getInteger('from');
	const to = interaction.options.getInteger('to');
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

	if (from > player.queue.length || to > player.queue.length)
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

	const queue = player.queue;

	validateNumbers(from, to, queue);
	const fromPosition = queue[from - 1];
	const toPosition = queue[to - 1];
	queue[from - 1] = toPosition;
	queue[to - 1] = fromPosition;

	return interaction.reply({
		content: '👍',
	});
};
