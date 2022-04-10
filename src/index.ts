import guineabotClient from './musicClient';
import { Intents } from 'discord.js';

const client = new guineabotClient({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});

(async () => {
	await client.loadCommands().catch((e) => client.log({ level: "fatal", content: e }));
	await client.loadEvents().catch((e) => client.log({ level: "fatal", content: e }));
})();

client.connect();