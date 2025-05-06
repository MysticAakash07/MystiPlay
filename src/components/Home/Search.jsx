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
			<MainSection>
				<Tracks>
					<h2>Tracks</h2>
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
							<img src={track.album.images[2]?.url} alt={track.name} />
							<div>
								<p>{track.name}</p>
								<p className="artist">{track.artists[0].name}</p>
							</div>
						</div>
					))}
				</Tracks>

				<Artists>
					<h2>Top Artists</h2>
					{searchResults.artists.items.slice(0, 3).map((artist) => (
						<div
							className="artist"
							key={artist.id}
							onClick={() => {
								dispatch({
									type: reducerCases.SET_ARTIST_ID,
									selectedArtistId: artist.id,
								});
								dispatch({
									type: reducerCases.SET_VIEW,
									currentView: "artist",
								});
							}}
						>
							<img src={artist.images?.[0]?.url} alt={artist.name} />
							<p>{artist.name}</p>
						</div>
					))}
				</Artists>
			</MainSection>

			<h2>Albums</h2>
			<GridContainer>
				{searchResults.albums.items.map((album) => (
					<div
						className="card"
						key={album.id}
						onClick={() => handleClick("album", album)}
					>
						<img src={album.images[1]?.url} alt={album.name} />
						<p>{album.name}</p>
					</div>
				))}
			</GridContainer>

			<h2>Playlists</h2>
			<GridContainer>
				{searchResults.playlists.items
					.filter((playlist) => playlist !== null)
					.map((playlist) => (
						<div
							className="card"
							key={playlist.id}
							onClick={() => handleClick("playlist", playlist.id)}
						>
							<img src={playlist.images?.[0]?.url} alt={playlist.name} />
							<p>{playlist.name}</p>
						</div>
					))}
			</GridContainer>
		</Container>
	);
}

const Container = styled.div`
	color: white;
	padding: 2rem;
	display: flex;
	flex-direction: column;
	gap: 2rem;
	h2 {
		font-size: 2rem;
		margin: 1rem 0;
	}
`;

const MainSection = styled.div`
	display: flex;
`;

const Tracks = styled.div`
	flex: 2;

	.track {
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		cursor: pointer;

		img {
			width: 50px;
			height: 50px;
			border-radius: 8px;
		}

		p {
			margin: 0;
		}

		.artist {
			font-size: 0.85rem;
			color: #ccc;
		}

		&:hover {
			&:hover {
				background-color: rgba(0, 0, 0, 0.3);
			}
		}
	}
`;

const Artists = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	.artist {
		display: flex;
		margin: 1rem 0;
		flex-direction: column;

		img {
			height: 16vh;
			width: 16vh;
			border-radius: 50%;
			object-fit: cover;
			margin-bottom: 0.5rem;
		}

		p {
			display: flex;
			justify-content: center;
			text-align: center;
			font-size: 1rem;
			font-weight: 500;
		}
	}
`;

const GridContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
	gap: 1rem;

	.card {
		cursor: pointer;
		background-color: rgba(255, 255, 255, 0.08);
		padding: 1rem;
		border-radius: 10px;
		text-align: center;

		img {
			width: 100%;
			border-radius: 10px;
			margin-bottom: 0.5rem;
		}

		p {
			font-size: 0.9rem;
			font-weight: 500;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
`;
