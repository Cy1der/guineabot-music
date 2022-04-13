import guineabotClient from './musicClient';
import { Intents } from 'discord.js';
import { Manager, Payload } from 'erela.js';
import Deezer from 'erela.js-deezer';
import Spotify from 'erela.js-spotify';
import config from '../config.json';

const client = new guineabotClient({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
});

client.manager = new Manager({
	plugins: [
		new Spotify({
			clientID: config.spotify_client_id,
			clientSecret: config.spotify_client_secret,
			playlistLimit: 0,
			albumLimit: 0,
		}),
		new Deezer({
			playlistLimit: 0,
			albumLimit: 0,
		}),
	],
	clientName: 'Guineabot-Music',
	nodes: [
		{
			host: config.lavalink.server,
			password: config.lavalink.password,
			port: config.lavalink.port,
			secure: config.lavalink.secure,
			retryDelay: 1000,
			identifier: 'gm-node-1',
		},
		{
			host: config.lavalink.server,
			password: config.lavalink.password,
			port: config.lavalink.port,
			secure: config.lavalink.secure,
			retryDelay: 1000,
			identifier: 'gm-node-2',
		},
		{
			host: config.lavalink.server,
			password: config.lavalink.password,
			port: config.lavalink.port,
			secure: config.lavalink.secure,
			retryDelay: 1000,
			identifier: 'gm-node-3',
		},
	],
	send(id: string, payload: Payload) {
		const guild = client.guilds.cache.get(id);
		if (guild) guild.shard.send(payload);
	},
});

(async () => {
	await client
		.loadCommands()
		.then(
			(count) =>
				client.log({
					level: 'info',
					content: `Loaded ${count} commands`,
				}),
			(reason: string) =>
				client.log({
					level: 'error',
					content: `Failed to load commands: ${reason}`,
				})
		)
		.catch((e) => client.log({ level: 'fatal', content: e }));
	await client
		.loadEvents()
		.then((count) => {
			client.log({
				level: 'info',
				content: `${count[0]} Discord events loaded`,
			});
			client.log({
				level: 'info',
				content: `${count[1]} music events loaded`,
			}),
				(reason: string) =>
					client.log({
						level: 'error',
						content: `Failed to load events: ${reason}`,
					});
		})
		.catch((e) => client.log({ level: 'fatal', content: e }));
})();

client.connect();
