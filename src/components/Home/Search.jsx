import { useStateProvider } from "../../utils/StateProvider";
import { reducerCases } from "../../utils/Constants";
import styled from "styled-components";
import axios from "axios";
import { fetchAndSetAlbum } from "../../utils/fetchAlbumDetails";
import Profile_FallBack from "../../assets/Profile_FallBack.svg";

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
									track.artists.map((artist) => artist.name),
									track.album.images[1]?.url
								)
							}
						>
							<span className="index">{idx + 1}</span>
							<img src={track.album.images[2]?.url} alt={track.name} />
							<div className="track-info">
								<p>{track.name}</p>
								<p className="artist">{track.artists[0].name}</p>
							</div>
						</div>
					))}
				</Tracks>

				<h2 className="artist-header-m">Top Artists</h2>
				<Artists>
					<h2 className="artist-header-lg">Top Artists</h2>
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
							<img
								src={artist.images?.[0]?.url || Profile_FallBack}
								alt={artist.name}
							/>
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
	cursor: default;
	color: white;
	padding: 2rem;
	display: flex;
	flex-direction: column;
	gap: 2rem;

	h2 {
		font-size: 2rem;
		margin: 1rem 0;
	}

	.artist-header-m {
		display: none;
	}

	@media (max-width: 768px) {
		padding: 1rem;

		h2 {
			margin: 0.5rem 0;
		}

		.artist-header-m {
			display: inline;
		}

		.artist-header-lg {
			display: none;
		}
	}

	@media (max-width: 480px) {
		padding: 0.5rem;

		h2 {
			margin-left: 1rem;
			font-size: 1.2rem;
		}
	}
`;

const MainSection = styled.div`
	display: flex;
	align-items: flex-start;

	gap: 2rem;
	@media (max-width: 768px) {
		flex-direction: column;
	}
`;

const Tracks = styled.div`
	flex: 2;

	.track {
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 1rem;

		img {
			width: 60px;
			height: 60px;
			border-radius: 5px;
		}

		.index {
			width: 1rem;
		}
		.track-info {
			p {
				margin: 0;
			}

			.artist {
				font-size: 0.85rem;
				color: #ccc;
			}
		}

		&:hover {
			background-color: rgba(0, 0, 0, 0.3);
		}
	}

	@media (max-width: 480px) {
		.track {
			img {
				width: 7vh;
				height: 7vh;
			}

			.index {
				display: none;
			}

			.track-info {
				font-size: 0.8rem;

				.artist {
					font-size: 0.8rem;
				}
			}
		}
	}
`;

const Artists = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;

	.artist {
		display: flex;
		margin: 1rem 0;
		align-items: center;
		flex-direction: column;

		img {
			height: 16vh;
			width: 16vh;
			border-radius: 50%;
			object-fit: cover;
			margin-bottom: 0.5rem;
		}

		p {
			font-size: 1rem;
			font-weight: 500;
		}
	}

	@media (max-width: 786px) {
		flex-direction: row;
		align-self: center;
		justify-content: center;
		gap: 3rem;
	}

	@media (max-width: 480px) {
		margin: 0 1rem;
		align-self: flex-start;
		flex-direction: column;
		gap: 0;

		.artist {
			display: flex;
			flex-direction: row;
			align-self: flex-start;
			gap: 1rem;

			img {
				height: 10vh;
				width: 10vh;
			}

			p {
				font-size: 0.9rem;
			}
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
			width: 8rem;
			height: 8rem;
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

	@media (max-width: 786px) {
		.card {
			img {
				width: 15vh;
				height: 15vh;
			}
		}
	}

	@media (max-width: 480px) {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;

		.card {
			padding: 0.8rem;
			width: 120px;
			img {
				width: 12vh;
				height: 12vh;
			}
			p {
				font-size: 0.8rem;
			}
		}
	}
`;
