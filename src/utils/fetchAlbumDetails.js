import axios from "axios";
import { reducerCases } from "./Constants";
import { msToHourMin } from "./Constants";

export const fetchAndSetAlbum = async (albumId, token, dispatch) => {
	try {
		const response = await axios.get(
			`https://api.spotify.com/v1/albums/${albumId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		const album = response.data;

		const totalDurationMs = album.tracks.items.reduce(
			(total, track) => total + track.duration_ms,
			0
		);

		const albumData = {
			id: album.id,
			name: album.name,
			image: album.images[0]?.url,
			artists: album.artists.map((artist) => artist.name).join(", "),
			total_tracks: album.total_tracks,
			release_date: album.release_date,
			uri: album.uri,
			duration: msToHourMin(totalDurationMs),
			tracks: album.tracks.items.map((track, index) => ({
				id: track.id,
				index,
				name: track.name,
				artists: track.artists.map((artist) => artist.name),
				image: album.images[0]?.url,
				duration: track.duration_ms,
				album: album.name,
				uri: track.uri,
			})),
		};

		dispatch({ type: reducerCases.SET_ALBUM, selectedAlbum: albumData });
		dispatch({ type: reducerCases.SET_VIEW, currentView: "album" });
	} catch (error) {
		console.error("Error fetching album", error);
	}
};
