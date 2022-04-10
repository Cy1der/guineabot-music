import type {
	CommandInteraction,
	ApplicationCommandNonOptions,
	GuildMember,
} from 'discord.js';
import type guineabotClient from '../../musicClient';
import prettyms from "pretty-ms";

export const name = 'spotify';
export const description = "View a user's Spotify status";
export const options: ApplicationCommandNonOptions[] = [
	{
		name: 'user',
		description: 'The user to view the Spotify status of',
		type: 'USER',
		required: true,
	},
];
export const execute = async (
	client: guineabotClient,
	interaction: CommandInteraction
) => {
	const target = interaction.options.getMember("user") as GuildMember;

	// TODO: the spotify command lmao

	return interaction.reply({
		content: "placeholder",
	});
};
