import type { CommandInteraction } from 'discord.js';
import type guineabotClient from '../../musicClient';
import prettyms from 'pretty-ms';
import os from 'os';
import cpustat from 'cpu-stat';
import formatHertz from '../../functions/formatHertz';
import formatBytes from '../../functions/formatBytes';

export const name = 'stats';
export const description = "View Guineabot's stats";
export const execute = async (
	client: guineabotClient,
	interaction: CommandInteraction
) => {
	let avgClockMHz = cpustat.avgClockMHz();
	let cpuName = os.cpus()[0].model;
	let cpuCores = os.cpus().length;
	let osType = os.type();
	let osArch = os.arch();
	let osBuild = os.release();
	let osVersion = os.version();
	let osPlatform = os.platform();

	let clientUptime = prettyms(client.uptime, {
		verbose: true,
		separateMilliseconds: true,
		formatSubMilliseconds: true,
		secondsDecimalDigits: 0,
	});

	let nodeVersion = process.version;

	let memUsage = formatBytes(process.memoryUsage().heapUsed);
	let memTotal = formatBytes(os.totalmem());

	return interaction.reply({
		embeds: [
			client.embed(
				{
					title: "Guineabot's stats",
					fields: [
						{
							name: 'CPU',
							value: `__Model:__ ${cpuName}\n__Core Count:__ ${cpuCores}\n__Clock Speed:__ ${formatHertz(
								avgClockMHz
							)}\n`,
						},
						{
							name: 'OS',
							value: `__Version:__ ${osVersion}\n__Platform:__ ${osPlatform}\n__Build:__ ${osBuild}\n__Type:__ ${osType}\n__Architecture:__ ${osArch}`,
						},
						{
							name: 'Memory',
							value: `__Total Memory:__ ${memTotal}\n__Memory Usage:__ ${memUsage}`,
						},
						{
							name: 'Client',
							value: `__Uptime:__ ${clientUptime}\n__Node Version:__ ${nodeVersion}`,
						},
					],
				},
				interaction
			),
		],
	});
};
