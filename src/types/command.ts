import type {
	CommandInteraction,
	ApplicationCommandOption,
	PermissionResolvable,
} from 'discord.js';
import type guineabotClient from '../musicClient';

export default interface Command {
	name: string;
	description: string;
	ownerOnly?: boolean;
	userPermissions?: PermissionResolvable[];
	botPermissions?: PermissionResolvable[];
	options?: ApplicationCommandOption[];
	execute: (
		client: guineabotClient,
		interaction: CommandInteraction
	) => Promise<void>;
}
