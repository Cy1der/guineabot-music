import type {
	CommandInteraction,
	ApplicationCommandOption,
	GuildMember,
} from 'discord.js';
import type guineabotClient from '../../musicClient';
import prettyms from 'pretty-ms';

export const name = 'spotify';
export const description = "View a user's Spotify status";
export const options: ApplicationCommandOption[] = [
	{
		name: 'user',
		description: 'The user to view the Spotify status of',
		type: 'USER',
		required: true,
	},
];
export const execute = async (
	client: guineabotClient,
	interaction: CommandInteraction
) => {
	const target = interaction.options.getMember('user') as GuildMember;
	const status = target.presence.activities.find(
		(status) => status.name.toLowerCase() === 'spotify'
	);

	if (!status)
		return interaction.reply({
			embeds: [
				client.embed(
					{
						title: `${target.user.username} is not listening to Spotify`,
					},
					interaction
				),
			],
		});

	return interaction.reply({
		embeds: [
			client.embed(
				{
					title: `${target.user.username}'s Spotify status`,
					url: `https://open.spotify.com/track/${status.syncId}`,
					thumbnail: {
						url: `https://i.scdn.co/image/${status.assets.largeImage?.slice(
							8
						)}`,
					},
					fields: [
						{
							name: 'Track',
							value: status.details ?? 'Nothing found :(',
						},
						{
							name: 'Artist(s)',
							value: status.state
								? status.state.replace(/\;/g, ',')
								: 'Nothing found :/',
						},
						{
							name: 'Album',
							value: status.assets?.largeText ?? 'Nothing found :(',
						},
						{
							name: 'Duration',
							value: status.timestamps
								? prettyms(
										status.timestamps?.end.getTime() -
											status.timestamps?.start.getTime(),
										{
											verbose: true,
											secondsDecimalDigits: 0,
										}
								  )
								: 'Nothing found :/',
						},
					],
				},
				interaction
			),
		],
	});
};
