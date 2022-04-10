import type guineabotClient from '../../../musicClient';
import type { CommandInteraction } from 'discord.js';

export const name = 'interactionCreate';
export const execute = async (
	client: guineabotClient,
	interaction: CommandInteraction
) => {
	if (!interaction.isCommand()) return;
	if (!interaction.inCachedGuild()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command)
		return interaction.reply({
			embeds: [client.embed({ title: 'An error occurred...' }, interaction)],
		});

	command.execute(client, interaction);
};
