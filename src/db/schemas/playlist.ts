import { model, Schema } from 'mongoose';

const schema = new Schema({
	UserID: String,
	Name: {
		type: String,
		default: 'Untitled Playlist',
	},
	Tracks: {
		type: Array,
		default: [],
	},
	UID: String,
});

export default model('playlist', schema);
