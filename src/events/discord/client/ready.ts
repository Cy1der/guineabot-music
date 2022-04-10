import type guineabotClient from '../../../musicClient';
import ms from 'ms';
import type {
	PresenceData,
	ClientPresence,
	ApplicationCommandManager,
} from 'discord.js';

export const name = 'ready';
export const execute = async (client: guineabotClient) => {
	client.manager.init(client.user.id);
	client.log({
		level: 'success',
		content: `Logged in as ${client.user.tag}`,
	});
	setPresence(client);
	setInterval(() => setPresence(client), ms('15m'));

	const commands: ApplicationCommandManager = client.application?.commands;
	const testingServer = client.guilds.cache.get(
		client.config.testing_server_id
	);

	if (commands) {
		for (const command of client.commands) {
			await testingServer.commands.create({
				name: command[1].name,
				description: command[1].description,
				options: command[1].options,
			});

			await commands.create({
				name: command[1].name,
				description: command[1].description,
				options: command[1].options,
			});
		}
	} else client.log({ level: 'warn', content: 'No global commands created' });
};

function setPresence(client: guineabotClient): ClientPresence {
	const servers = client.guilds.cache.size;
	const options: PresenceData = {
		status: 'online',
		activities: [
			{
				name: `${servers} servers for ${client.commands.size} commands`,
				type: 'LISTENING',
			},
		],
	};
	return client.user.setPresence(options);
}
