import {
	ApplicationCommandOption,
	CommandInteraction,
	PermissionResolvable,
	Permissions,
} from 'discord.js';
import type guineabotClient from '../../musicClient';

export const name = 'queue';
export const description = 'View the queue of the songs.';
export const botPermissions: PermissionResolvable[] = [
	Permissions.FLAGS.CONNECT,
	Permissions.FLAGS.SPEAK,
];
export const options: ApplicationCommandOption[] = [
	{
		name: 'page',
		description: 'The page number to view',
		type: 'INTEGER',
		required: false,
	},
];
export const execute = async (
	client: guineabotClient,
	interaction: CommandInteraction
) => {
	const page = interaction.options.getInteger('page') ?? 1;
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

	const queue = player.queue;
	const embed = client.embed({}, interaction).setAuthor({
		name: `Queue for ${interaction.guild.name}`,
		iconURL: interaction.guild.iconURL() ?? '',
	});
	const multiple = 10;
	const end = page * multiple;
	const start = end - multiple;
	const tracks = queue.slice(start, end);

	if (queue.current)
		embed.addField('Current', `[${queue.current.title}](${queue.current.uri})`);

	if (!tracks.length)
		embed.setDescription(
			`No tracks in ${page > 1 ? `page ${page}` : 'the queue'}`
		);
	else
		embed.setDescription(
			tracks.map((track, i) => `${start + ++i} - ${track.title}`).join('\n')
		);

	const maxPages = Math.ceil(queue.length / multiple);
	embed.setFooter({
		text: `Page ${page > maxPages ? maxPages : page} of ${maxPages}`,
	});
	return interaction.reply({ embeds: [embed] });
};
