import type guineabotClient from '../../../musicClient';
import { CommandInteraction, Permissions } from 'discord.js';

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

	if (command.ownerOnly && !client.isOwner(interaction.user.id))
		return interaction.reply({
			content: `Command ${command.name} is owner only!`,
		});

	if (!interaction.member.permissions.has(command.userPermissions))
		return interaction.reply({
			embeds: [
				client.embed(
					{
						title:
							'You do not have the required permissions to run this command!',
						fields: [
							{
								name: 'Required Permissions',
								value: command.botPermissions
									.map((permission) => {
										let permissionString = new Permissions(
											permission
										).toArray()[0];
										return `${
											permissionString[0].toUpperCase() +
											permissionString
												.slice(1)
												.toLowerCase()
												.replace(/_/gi, ' ')
										}`;
									})
									.join(', '),
							},
						],
					},
					interaction
				),
			],
		});
	if (!interaction.guild.me.permissions.has(command.botPermissions))
		return interaction.reply({
			embeds: [
				client.embed(
					{
						title:
							'I do not have the required permissions to run this command!',
						fields: [
							{
								name: 'Required Permissions',
								value: command.botPermissions
									.map((permission) => {
										let permissionString = new Permissions(
											permission
										).toArray()[0];
										return `${
											permissionString[0].toUpperCase() +
											permissionString
												.slice(1)
												.toLowerCase()
												.replace(/_/gi, ' ')
										}`;
									})
									.join(', '),
							},
						],
					},
					interaction
				),
			],
		});

	command.execute(client, interaction);
};
