import axios from "axios";
export const reducerCases = {
	SET_TOKEN: "SET_TOKEN",
	SET_PLAYLISTS: "SET_PLAYLISTS",
	SET_USER: "SET_USER",
	SET_PLAYLIST: "SET_PLAYLIST",
	SET_PLAYING: "SET_PLAYING",
	SET_PLAYER_STATE: "SET_PLAYER_STATE",
	SET_PLAYLIST_ID: "SET_PLAYLIST_ID",
	SET_VIEW: "SET_VIEW",
	SET_VOLUME: "SET_VOLUME",
	SET_SHUFFLE_STATE: "SET_SHUFFLE_STATE",
	SET_REPEAT_STATE: "SET_REPEAT_STATE",
	SET_DEVICES: "SET_DEVICES",
	SET_DEVICE_ID: "SET_DEVICE_ID",
	SET_ALBUM: "SET_ALBUM",
};

export const mstoMinutesAndSeconds = (ms) => {
	const minutes = Math.floor(ms / 60000);
	const seconds = ((ms % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

export const playTrack = async (
	id,
	name,
	artists,
	image,
	context_uri,
	index,
	token,
	dispatch
) => {
	try {
		const response = await axios.put(
			`https://api.spotify.com/v1/me/player/play/`,
			{
				context_uri,
				offset: { position: index },
				position_ms: 0,
			},
			{
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
			}
		);

		if (response.status === 204) {
			const currentlyPlaying = {
				id,
				name,
				artists,
				image,
			};
			dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying });
			dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
		}
	} catch (error) {
		console.error("Failed to play track:", error);

		if (error.response?.status === 401) {
			alert("Session expired. Please log in again.");
		}
	}
};

