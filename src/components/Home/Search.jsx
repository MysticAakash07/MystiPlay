import React from "react";
import { useStateProvider } from "../../utils/StateProvider";
import { reducerCases } from "../../utils/Constants";
import styled from "styled-components";
import axios from "axios";
import { fetchAndSetAlbum } from "../../utils/fetchAlbumDetails";

export default function Search() {
	const [{ searchResults, token }, dispatch] = useStateProvider();

	const handleClick = (type, item) => {
		switch (type) {
			case "album":
				fetchAndSetAlbum(item.id, token, dispatch);
				break;
			case "playlist":
				console.log("Selected Playlist ID:", item);
				dispatch({
					type: reducerCases.SET_PLAYLIST_ID,
					selectedPlaylistId: item,
				});
				dispatch({ type: reducerCases.SET_VIEW, currentView: "playlist" });
				break;
			default:
				break;
		}
	};

	const playTrack = async (trackUri, id, name, artists, image) => {
		const response = await axios.put(
			`https://api.spotify.com/v1/me/player/play/`,
			{
				uris: [trackUri],
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
	};

	return (
		<Container>
			<h2>Tracks</h2>
			<div className="tracks">
				{searchResults.tracks.items.map((track, idx) => (
					<div
						className="track"
						key={track.id}
						onClick={() =>
							playTrack(
								track.uri,
								track.id,
								track.name,
								track.artists,
								track.album.images[1]?.url
							)
						}
					>
						<span>{idx + 1}</span>
						<div className="image">
							<img src={track.album.images[2]?.url} alt={track.name} />
						</div>
						<div className="info">
							<span>{track.name}</span>
							<span>{track.artists[0].name}</span>
						</div>
					</div>
				))}
			</div>

			<h2>Albums</h2>
			<div className="albums">
				{searchResults.albums.items.map((album, idx) => (
					<div
						className="album"
						key={album.id}
						onClick={() => handleClick("album", album)}
					>
						<span>{idx + 1}</span>
						<div className="image">
							<img src={album.images[1]?.url} alt={album.name} />
						</div>
						<div className="info">
							<span>{album.name}</span>
							<span>{album.artists[0].name}</span>
						</div>
					</div>
				))}
			</div>

			<h2>Playlists</h2>
			<div className="playlists">
				{searchResults.playlists.items
					.filter((playlist) => playlist !== null)
					.map((playlist, idx) => (
						<div
							className="playlist"
							key={playlist.id}
							onClick={() => handleClick("playlist", playlist.id)}
						>
							<span>{idx + 1}</span>
							<div className="image">
								<img src={playlist.images?.[0]?.url} alt={playlist.name} />
							</div>
							<div className="info">
								<span>{playlist.name}</span>
								<span>{playlist.owner?.display_name || "Unknown"}</span>
							</div>
						</div>
					))}
			</div>

			<h2>Artists</h2>
			<div className="artists">
				{searchResults.artists.items.map((artist, idx) => (
					<div className="artist" key={artist.id}>
						<span>{idx + 1}</span>
						<div className="image">
							<img src={artist.images?.[0]?.url} alt={artist.name} />
						</div>
						<div className="info">
							<span>{artist.name}</span>
						</div>
					</div>
				))}
			</div>
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	margin: 0 2rem;
	gap: 0.5rem;
	color: white;
`;
