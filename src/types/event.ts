import guineabotClient from '../musicClient';

export default interface Event {
	name: string;
	execute: (client: guineabotClient, data: string) => void;
}
