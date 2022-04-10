import { CommandInteraction, Permissions } from 'discord.js';
import type guineabotClient from '../../musicClient';

export const name = 'invite';
export const description = 'Invite Guineabot to your server!';
export const execute = async (
	client: guineabotClient,
	interaction: CommandInteraction
) => {
	const invite = client.generateInvite({
		permissions: Permissions.FLAGS.ADMINISTRATOR,
		scopes: ['applications.commands', 'bot'],
	});
	return interaction.reply({
		embeds: [
			client.embed(
				{
					title: 'Invite Links',
					fields: [
						{
							name: 'Bot Invite',
							value: `[discord.com](${invite})`,
						},
					],
				},
				interaction
			),
		],
	});
};
