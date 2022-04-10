import guineabotClient from './musicClient';
import { Intents } from 'discord.js';
import { Structure } from 'erela.js';
import validateNumbers from './functions/validateNumbers';

Structure.extend(
	'Queue',
	(Queue) =>
		class extends Queue {
			swap(where: number, to: number): void {
				validateNumbers(where, to, this);
				const fromPosition = this[where - 1];
				const toPosition = this[to - 1];
				this[where - 1] = toPosition;
				this[to - 1] = fromPosition;
			}
			move(where: number, to: number): void {
				validateNumbers(where, to, this);
				const fromPosition = this[where - 1];
				const toPosition = this[to - 1];
				this[to - 1] = fromPosition;
				this.remove(where - 1);
				for (let i = to; i < this.length; i += 1) {
					i === to ? (this[i - 1] = toPosition) : (this[i - 1] = this[i]);
				}
				this[to] = toPosition;
			}
		}
);

const client = new guineabotClient({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MEMBERS
	],
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
