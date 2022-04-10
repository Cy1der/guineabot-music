import { CommandInteraction } from 'discord.js';
import type guineabotClient from '../../musicClient';

export const name = "ping";
export const description = "Test the connection between the bot and Discord servers.";
export const execute = async (client: guineabotClient, interaction: CommandInteraction) => {
    return interaction.reply({
        embeds: [
            client.embed({
                title: "Pong! 🏓",
                description: `${client.ws.ping}ms`,
            }, interaction),
        ]
    })
};