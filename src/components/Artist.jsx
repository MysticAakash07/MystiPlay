import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import { fetchAndSetAlbum } from "../utils/fetchAlbumDetails";
import Profile_FallBack from "../assets/Profile_FallBack.svg";
import Track_Album_Playlist_FallBack from "../assets/Track_Album_Playlist_FallBack.svg";

export default function Artist() {
	const [{ selectedArtistId, token }, dispatch] = useStateProvider();
	const [artistInfo, setArtistInfo] = useState(null);
	const [topTracks, setTopTracks] = useState([]);
	const [albums, setAlbums] = useState([]);

	useEffect(() => {
		const fetchArtist = async () => {
			try {
				const [artistRes, topTracksRes, albumsRes] = await Promise.all([
					axios.get(`https://api.spotify.com/v1/artists/${selectedArtistId}`, {
						headers: { Authorization: `Bearer ${token}` },
					}),
					axios.get(
						`https://api.spotify.com/v1/artists/${selectedArtistId}/top-tracks?market=IN`,
						{
							headers: { Authorization: `Bearer ${token}` },
						}
					),
					axios.get(
						`https://api.spotify.com/v1/artists/${selectedArtistId}/albums?include_groups=album,single&market=IN`,
						{ headers: { Authorization: `Bearer ${token}` } }
					),
				]);

				setArtistInfo(artistRes.data);
				setTopTracks(topTracksRes.data.tracks.slice(0, 10));
				setAlbums(albumsRes.data.items);
			} catch (err) {
				console.error("Failed to fetch artist data", err);
			}
		};

		if (selectedArtistId && token) fetchArtist();
	}, [selectedArtistId, token]);

	const playTrack = async (trackUri, id, name, artists, image) => {
		await axios.put(
			`https://api.spotify.com/v1/me/player/play`,
			{ uris: [trackUri], position_ms: 0 },
			{ headers: { Authorization: "Bearer " + token } }
		);
		dispatch({
			type: reducerCases.SET_PLAYING,
			currentlyPlaying: {
				id,
				name,
				artists: artistsArray.map((artist) => artist.name),
				image,
			},
		});
		dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
	};

	if (!artistInfo) return <Container>Loading artist...</Container>;

	return (
		<Container>
			<ArtistHeader>
				<img
					src={artistInfo.images?.[0]?.url || Profile_FallBack}
					alt={artistInfo.name}
				/>
				<div className="artist-details">
					<h1>{artistInfo.name}</h1>
					<p>Genres: {artistInfo.genres.join(", ") || "N/A"}</p>
					<p>Followers: {artistInfo.followers.total.toLocaleString()}</p>
					<p>Popularity: {artistInfo.popularity}/100</p>
				</div>
			</ArtistHeader>
			<TrackList>
				<h2>Top 10 Tracks</h2>
				{topTracks.map((track, index) => (
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
						<span className="index">{index + 1}.</span>
						<img
							src={track.album.images[2]?.url || Track_Album_Playlist_FallBack}
							alt={track.name}
						/>
						<div>
							<span className="track-name">{track.name}</span>
							<span className="artist-name">{track.artists[0].name}</span>
						</div>
					</div>
				))}
			</TrackList>

			{albums.length > 0 && (
				<AlbumsSection>
					<h2>Albums</h2>
					<AlbumGrid>
						{albums.map((album) => (
							<AlbumCard
								key={album.id}
								onClick={() => fetchAndSetAlbum(album.id, token, dispatch)}
							>
								<img
									src={album.images[1]?.url || Track_Album_Playlist_FallBack}
									alt={album.name}
								/>
								<p>{album.name}</p>
							</AlbumCard>
						))}
					</AlbumGrid>
				</AlbumsSection>
			)}
		</Container>
	);
}

const Container = styled.div`
	padding: 2rem;
	color: white;
	cursor: default;

	@media (max-width: 768px) {
		padding: 1rem;
	}

	@media (max-width: 480px) {
		padding: 0.5rem;
	}
`;

const ArtistHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 2rem;

	img {
		width: 30vh;
		height: 30vh;
		object-fit: cover;
		border-radius: 50%;
	}
	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}
	p {
		margin: 0.2rem 0;
	}

	.artist-details {
		font-weight: 500;
	}

	@media (max-width: 768px) {
		gap: 1.5rem;
		img {
			width: 25vh;
			height: 25vh;
		}
		h1 {
			font-size: 2rem;
		}
	}

	@media (max-width: 480px) {
		margin: 0;
		padding: 0;
		gap: 0.5rem;
		flex-direction: column;
		text-align: center;

		img {
			width: 20vh;
			height: 20vh;
		}
		h1 {
			font-size: 1.8rem;
		}
		p {
			font-size: 0.9rem;
		}
		.artist-details {
		}
	}
`;

const TrackList = styled.div`
	h2 {
		margin: 2rem 0;
	}
	.track {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
		background-color: rgba(255, 255, 255, 0.05);
		padding: 1rem;
		border-radius: 10px;
		img {
			height: 8vh;
			border-radius: 10px;
		}

		.index {
			width: 1rem;
		}

		div {
			display: flex;
			flex-direction: column;
			.track-name {
				font-weight: 500;
			}
			.artist-name {
				color: #e0dede;
			}
		}

		&:hover {
			background-color: rgba(0, 0, 0, 0.2);
		}
	}

	@media (max-width: 768px) {
		.track {
			padding: 0.8rem;
			img {
				height: 7vh;
			}
		}
	}

	@media (max-width: 480px) {
		h2 {
			font-size: 1.2rem;
		}
		.track {
			padding: 0.5rem;

			img {
				height: 6vh;
				width: 6vh;
			}

			div {
				.track-name,
				.artist-name {
					font-size: 0.9rem;
				}
			}
			.index {
				display: none;
			}
		}
	}
`;

const AlbumsSection = styled.div`
	margin-top: 2rem;
	color: white;

	h2 {
		margin-bottom: 1rem;
	}

	@media (max-width: 480px) {
		h2 {
			font-size: 1.2rem;
		}
	}
`;

const AlbumGrid = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	justify-content: center;
`;

const AlbumCard = styled.div`
	background-color: rgba(255, 255, 255, 0.05);
	border-radius: 10px;
	padding: 1rem;
	width: 150px;
	text-align: center;

	img {
		width: 15vh;
		height: 15vh;
		border-radius: 10px;
	}

	p {
		margin-top: 0.5rem;
		font-size: 0.9rem;
		font-weight: 500;
		overflow: hidden;
		text-wrap: nowrap;
		text-overflow: ellipsis;
	}

	small {
		color: #aaa;
	}

	@media (max-width: 480px) {
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
`;
