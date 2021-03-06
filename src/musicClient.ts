import {
	Client,
	Collection,
	MessageEmbed,
	MessageEmbedOptions,
	ClientOptions,
	MessageInteraction,
} from 'discord.js';
import { promisify } from 'util';
import consola from 'consola';
import glob from 'glob';
import config from '../config.json';
import { Manager } from 'erela.js';
import type Command from './types/command';
import type Event from './types/event';
import type consolatypes from './types/consolatypes';

const globPromise = promisify(glob);

export default class guineabotClient extends Client {
	public config: typeof config;
	public commands: Collection<string, Command>;
	public events: Collection<string, Event>;
	public musicEvents: Collection<string, Event>;
	public consola: typeof consola;
	public manager: Manager;

	constructor(options: ClientOptions) {
		super(options);
		this.config = config;
		this.commands = new Collection();
		this.events = new Collection();
		this.musicEvents = new Collection();
		this.consola = consola;
	}

	public async loadCommands(): Promise<number> {
		const commandFiles = await globPromise(
			`${__dirname}/commands/**/{*.ts,*.js}`
		);

		commandFiles.map((command) => {
			const file = require(command);
			this.commands.set(file.name, file);
			if (!file.ownerOnly) file.ownerOnly = false;
			if (!file.userPermissions) file.userPermissions = [];
			if (!file.botPermissions) file.botPermissions = [];
			if (!file.options) file.options = [];
		});

		return commandFiles.length;
	}

	public async loadEvents(): Promise<number[]> {
		const eventFiles = await globPromise(
			`${__dirname}/events/discord/**/{*.ts,*.js}`
		);
		const musicEventFiles = await globPromise(
			`${__dirname}/events/music/**/{*.ts,*.js}`
		);

		eventFiles.map((event) => {
			const file = require(event);
			this.events.set(file.name, file);
			this.on(file.name, file.execute.bind(null, this));
		});

		musicEventFiles.map((event) => {
			const file = require(event);
			this.musicEvents.set(file.name, file);
			this.manager.on(file.name, file.execute.bind(null, this));
		});

		return [eventFiles.length, musicEventFiles.length];
	}

	public embed(
		options: MessageEmbedOptions,
		interaction: MessageInteraction
	): MessageEmbed {
		return new MessageEmbed({
			color: 'RANDOM',
			footer: {
				text: `${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({
					dynamic: true,
					format: 'png',
				}),
			},
			...options,
		}).setTimestamp();
	}

	public log(options: consolatypes): void {
		this.consola[`${options.level}`](`[BOT] > ${options.content}`);
	}

	public connect(): void {
		this.login(this.config.bot_token);
	}

	public isOwner(id: string): boolean {
		return this.config.owner_id.includes(id);
	}
}
