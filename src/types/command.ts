import { Message } from 'discord.js';

export default interface Command {
	name: string;
	description: string;
	aliases?: string[];
	cooldown?: number;
	ownerOnly?: boolean;
	userPermissions?: string[];
	botPermissions?: string[];
	execute: (message: Message, args: string[]) => Promise<any>;
}