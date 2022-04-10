import type { VoicePacket } from 'erela.js';
import type guineabotClient from '../../../musicClient';

export const name = 'raw';
export const execute = (client: guineabotClient, data: VoicePacket) => {
	client.manager.updateVoiceState(data);
};
