import { CommandInteraction, ApplicationCommandNonOptions } from 'discord.js';
import type guineabotClient from '../musicClient';

export default interface Command {
	name: string;
	description: string;
	ownerOnly?: boolean;
	userPermissions?: string[];
	botPermissions?: string[];
	options?: ApplicationCommandNonOptions[];
	execute: (client: guineabotClient, interaction: CommandInteraction) => Promise<any>;
}