import {
	Client,
	Intents,
	Collection,
	MessageEmbed,
	Message,
	ClientOptions,
	Command,
	Event,
} from 'discord.js';
import { promisify } from 'util';
import consola from 'consola';
import glob from 'glob';
import ms from 'ms';
import config from '../config.json';
import { Manager, Structure } from 'erela.js';
import Spotify from 'erela.js-spotify';
import Deezer from 'erela.js-deezer';

const globPromise = promisify(glob);

declare module 'discord.js' {
	export interface Client {
		config: typeof config;
		commands: Collection<unknown, Command>;
		manager: Manager;
		consola: typeof consola;
		events: Collection<unknown, Event>;
		musicEvents: Collection<unknown, Event>;
		shardEvents: Collection<unknown, Event>;
		aliases: Collection<string, string>;
	}

	export interface Command {
		name: string;
		description: string;
		aliases?: string[];
		cooldown?: number;
		ownerOnly?: boolean;
		userPermissions?: string[];
		botPermissions?: string[];
		execute: (message: Message, args: string[]) => Promise<any>;
	}

	export interface Event {
		name: string;
		execute: (client: Client, data: any) => void;
	}
}

Structure.extend(
	'Queue',
	(Queue) =>
		class extends Queue {
			switch(from: number, to: number): void {
				if (typeof from !== 'number')
					throw new TypeError('[BOT] > from must be a number');
				if (typeof to !== 'number')
					throw new TypeError('[BOT] > to must be a number');
				if (from < 1 || to < 1 || from > this.length || to > this.length)
					throw new Error(
						`[BOT] > from/to must be between 1 and ${this.length}`
					);
				const fromPosition = this[from - 1];
				const toPosition = this[to - 1];
				this[from - 1] = toPosition;
				this[to - 1] = fromPosition;
			}
			move(from: number, to: number): void {
				if (typeof from !== 'number')
					throw new TypeError('[BOT] > from must be a number');
				if (typeof to !== 'number')
					throw new TypeError('[BOT] > to must be a number');
				if (from < 1 || to < 1 || from > this.length || to > this.length)
					throw new Error(
						`[BOT] > from/to must be between 1 and ${this.length}`
					);
				const fromPosition = this[from - 1];
				const toPosition = this[to - 1];
				this[to - 1] = fromPosition;
				this.remove(from - 1);
				for (let i = to; i < this.length; i++) {
					i === to ? (this[i - 1] = toPosition) : (this[i - 1] = this[i]);
				}
				this[to] = toPosition;
			}
		}
);

export default class guineabotClient extends Client {
	constructor(options: ClientOptions) {
		super(options);
		this.config = config;
		this.commands = new Collection();
		this.events = new Collection();
		this.musicEvents = new Collection();
		this.shardEvents = new Collection();
		this.aliases = new Collection();
		this.consola = consola;
		this.manager = new Manager({
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
					retryDelay: 1000,
					identifier: 'Guineabot-Music',
				},
			],
			send(id, payload) {
				const guild = this.guilds.cache.get(id);
				if (guild) guild.shard.send(payload);
			},
		});
	}

	public config: typeof config;
	public commands: Collection<string, Command>;
	public events: Collection<string, Event>;
	public musicEvents: Collection<string, Event>;
	public shardEvents: Collection<string, Event>;
	public aliases: Collection<string, string>;
	public consola: typeof consola;
	public manager: Manager;

	public async loadCommands(): Promise<void> {
		const commandFiles = await globPromise(`${__dirname}/commands/**/*.ts`);

		this.consola.success(`[BOT] > ${commandFiles.length} commands loaded`);

		commandFiles.map((command) => {
			const file = require(command);
			this.commands.set(file.name, file);
			if (file.aliases)
				file.aliases.map((alias: string) => this.aliases.set(alias, file.name));
			if (!file.cooldown) file.cooldown = ms('1s');
			if (!file.ownerOnly) file.ownerOnly = false;
			if (!file.userPermissions) file.userPermissions = [];
			if (!file.botPermissions) file.botPermissions = [];
		});
	}

	public async loadEvents(): Promise<void> {
		const eventFiles = await globPromise(`${__dirname}/events/**/*.ts`);
		const musicEventFiles = await globPromise(
			`${__dirname}/musicevents/**/*.ts`
		);
		const shardFiles = await globPromise(`${__dirname}/shardevents/**/*.ts`);

		this.consola.success(`[BOT] > ${eventFiles.length} events loaded`);
		this.consola.success(`[BOT] > ${musicEventFiles.length} events loaded`);
		this.consola.success(`[BOT] > ${shardFiles.length} events loaded`);

		eventFiles.map((event) => {
			const file = require(event);
			this.events.set(file.name, file);
			this.on(file.name, file.execute.bind(null, this));
		});
		musicEventFiles.map((event) => {
			const file = require(event);
			this.musicEvents.set(file.name, file);
			this.on(file.name, file.execute.bind(null, this));
		});
		shardFiles.map((event) => {
			const file = require(event);
			this.shardEvents.set(file.name, file);
			this.on(file.name, file.execute.bind(null, this));
		});
	}

	public connect(): void {
		this.login(this.config.bot_token);
	}
}
