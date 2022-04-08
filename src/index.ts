import { Client, Intents, Collection, MessageEmbed, Message } from "discord.js";
import { promisify } from 'util';
import consola from 'consola';
import glob from 'glob';
import ms from 'ms';
import config from "../config.json";
import { Manager, Structure } from "erela.js";
import Spotify from "erela.js-spotify";
import Deezer from "erela.js-deezer";

declare module "discord.js" {
    export interface Client {
        config: typeof config,
        commands: Collection<unknown, Command>,
        manager: Manager,
        consola: typeof consola,
        events: Collection<unknown, Event>,
        musicEvents: Collection<unknown, Event>,
        shardEvents: Collection<unknown, Event>,
        aliases: Collection<string, string>
    }

    export interface Command {
        name: string,
        description: string,
        aliases?: string[],
        cooldown?: number,
        ownerOnly?: boolean,
        userPermissions?: string[],
        botPermissions?: string[],
        execute: (message: Message, args: string[]) => Promise<any>
    }

    export interface Event {
        name: string,
        execute: (client: Client, data: any) => void
    }
}

const globPromise = promisify(glob);

Structure.extend(
	"Queue",
	(Queue) =>
		class extends Queue {
			switch(from: number, to: number) {
				if (typeof from !== "number")
					throw new TypeError("[BOT] > from must be a number");
				if (typeof to !== "number")
					throw new TypeError("[BOT] > to must be a number");
				if (
					from < 1 ||
					to < 1 ||
					from > this.length ||
					to > this.length
				)
					throw new Error(
						`[BOT] > from/to must be between 1 and ${this.length}`
					);
				const fromPosition = this[from - 1];
				const toPosition = this[to - 1];
				this[from - 1] = toPosition;
				this[to - 1] = fromPosition;
			}
		}
);

Structure.extend(
	"Queue",
	(Queue) =>
		class extends Queue {
			move(from: number, to: number) {
				if (typeof from !== "number")
					throw new TypeError("[BOT] > from must be a number");
				if (typeof to !== "number")
					throw new TypeError("[BOT] > to must be a number");
				if (
					from < 1 ||
					to < 1 ||
					from > this.length ||
					to > this.length
				)
					throw new Error(
						`[BOT] > from/to must be between 1 and ${this.length}`
					);
				const fromPosition = this[from - 1];
				const toPosition = this[to - 1];
				this[to - 1] = fromPosition;
				this.remove(from - 1);
				for (let i = to; i < this.length; i++) {
					i === to
						? (this[i - 1] = toPosition)
						: (this[i - 1] = this[i]);
				}
				this[to] = toPosition;
			}
		}
);

const client: Client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES],
});

client.config = config;
client.commands = new Collection();
client.events = new Collection();
client.musicEvents = new Collection();
client.shardEvents = new Collection();
client.aliases = new Collection();
client.consola = consola;
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
            albumLimit: 0
        })
    ],
    clientName: "Guineabot-Music",
    nodes: [
        {
            host: config.lavalink.server,
            password: config.lavalink.password,
            port: config.lavalink.port,
            retryDelay: 1000,
            identifier: "Guineabot-Music"
        }
    ],
    send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    }
});

(async () => {
    const eventFiles = await globPromise(`${__dirname}/events/**/*.ts`);
    const musicEventFiles = await globPromise(`${__dirname}/musicevents/**/*.ts`);
    const commandFiles = await globPromise(`${__dirname}/commands/**/*.ts`);
    const shardFiles = await globPromise(`${__dirname}/shardevents/**/*.ts`);

    consola.success(`[BOT] > ${commandFiles.length} commands loaded`);
	consola.success(`[BOT] > ${eventFiles.length} events loaded`);
	consola.success(`[BOT] > ${musicEventFiles.length} music events loaded`);
	consola.success(`[BOT] > ${shardFiles.length} shard events loaded`);

    eventFiles.map((event) => {
        const file = require(event);
        client.events.set(file.name, file);
        client.on(file.name, file.execute.bind(null, client));
    });

    musicEventFiles.map((event) => {
        const file = require(event);
        client.musicEvents.set(file.name, file);
        client.on(file.name, file.execute.bind(null, client));
    });

    shardFiles.map((event) => {
        const file = require(event);
        client.shardEvents.set(file.name, file);
        client.on(file.name, file.execute.bind(null, client));
    });

    commandFiles.map((command) => {
        const file = require(command);
        client.commands.set(file.name, file);
        if (file.aliases) file.aliases.map((alias: string) => client.aliases.set(alias, file.name));
        if (!file.cooldown) file.cooldown = ms("1s");
        if (!file.ownerOnly) file.ownerOnly = false;
        if (!file.userPermissions) file.userPermissions = [];
        if (!file.botPermissions) file.botPermissions = [];
    })
})();

client.login(config.bot_token);

export default client;