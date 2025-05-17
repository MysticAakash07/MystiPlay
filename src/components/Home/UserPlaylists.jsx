import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useStateProvider } from "../../utils/StateProvider";
import { reducerCases } from "../../utils/Constants";
import Track_Album_Playlist_FallBack from "../../assets/Track_Album_Playlist_FallBack.svg";


export default function UserPlaylists({ token }) {
	const [userPlaylists, setPlaylists] = useState([]);
	const [loading, setLoading] = useState(true);
	const [defaultPlaylist, setDefaultPlaylist] = useState(null);

	const [{ selectedPlaylistId }, dispatch] = useStateProvider();

	useEffect(() => {
		const getPlaylistData = async () => {
			setLoading(true);
			try {
				const response = await axios.get(
					"https://api.spotify.com/v1/me/playlists",
					{
						headers: {
							Authorization: "Bearer " + token,
							"Content-Type": "application/json",
						},
					}
				);
				const { items } = response.data;
				const playlists = items.map(({ name, id, images }) => {
					return { name, id, images };
				});

				dispatch({ type: reducerCases.SET_PLAYLISTS, playlists });
				setPlaylists(playlists);
			} catch (error) {
				console.error("Failed to fetch user playlists", error);
			} finally {
				setLoading(false);
			}
		};

		const getDefaultPlaylist = async () => {
			try {
				const response = await axios.get(
					`https://api.spotify.com/v1/playlists/${selectedPlaylistId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				const { name, images } = response.data;
				setDefaultPlaylist({
					name,
					image: images[0]?.url,
				});
			} catch (error) {
				console.error("Failed to fetch default playlist", error);
			}
		};
		if (token) {
			getPlaylistData();
			getDefaultPlaylist();
		}
	}, [token, dispatch]);

	const changeCurrentPlaylist = (selectedPlaylistId) => {
		dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId });
		dispatch({ type: reducerCases.SET_VIEW, currentView: "playlist" });
	};

	// If playlists are empty and not loading, show default playlist
	if (loading) {
		return <LoadingMessage>Loading playlists...</LoadingMessage>;
	}

	if (userPlaylists.length === 0 && defaultPlaylist) {
		return (
			<PlaylistGrid>
				<DefaultPlaylistCard
					onClick={() => changeCurrentPlaylist(selectedPlaylistId)}
				>
					<img
						src={defaultPlaylist.image || Track_Album_Playlist_FallBack}
						alt={defaultPlaylist.name}
					/>
					<h4>{defaultPlaylist.name}</h4>
				</DefaultPlaylistCard>
			</PlaylistGrid>
		);
	}

	return (
		<PlaylistGrid>
			{userPlaylists.map((playlist) => (
				<PlaylistCard
					key={playlist.id}
					onClick={() => changeCurrentPlaylist(playlist.id)}
				>
					<img src={playlist.images[0]?.url} alt={playlist.name} />
					<h4>{playlist.name}</h4>
				</PlaylistCard>
			))}
		</PlaylistGrid>
	);
}

const PlaylistGrid = styled.div`
	display: flex;
	gap: 1.5rem;
	flex-wrap: wrap;
	justify-content: center;

	@media (max-width: 768px) {
		gap: 1rem;
	}

	@media (max-width: 480px) {
		gap: 0.75rem;
	}

	@media (max-width: 375px) {
		gap: 0.5rem;
	}
`;

const PlaylistCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.1);
	color: white;
	padding: 1rem;
	border-radius: 20px;
	overflow: hidden;
	width: fit-content;
	transition: background-color 0.3s;

	img {
		width: 175px;
		height: 175px;
		object-fit: cover;
		border-radius: 10px;
	}

	h4 {
		width: 175px;
		margin-top: 0.5rem;
		font-size: 1rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		cursor: default;
	}

	&:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}

	@media (max-width: 768px) {
		padding: 0.8rem;

		img {
			width: 140px;
			height: 140px;
		}

		h4 {
			width: 140px;
			font-size: 0.9rem;
		}
	}

	@media (max-width: 480px) {
		padding: 0.6rem;

		img {
			width: 100px;
			height: 100px;
		}

		h4 {
			width: 100px;
			font-size: 0.7rem;
			font-weight: 500;
		}
	}

	@media (max-width: 375px) {
		width: 100%;
		flex-direction: row;
		border-radius: 10px;
		padding: 0rem;
		
		img {
			border-radius: 0;
			width: 70px;
			height: 70px;
		}

		h4 {
			padding : 0rem 1rem;
			width: 100%;
			font-size: 0.7rem;
		}
	}
`;

const DefaultPlaylistCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.1);
	color: white;
	padding: 1rem;
	border-radius: 20px;
	overflow: hidden;
	width: fit-content;

	img {
		width: 175px;
		height: 175px;
		object-fit: cover;
		border-radius: 10px;
	}

	h4 {
		width: 175px;
		margin-top: 0.5rem;
		font-size: 1rem;
	}
`;

const LoadingMessage = styled.div`
	color: white;
	font-size: 1.5rem;
	text-align: center;
	margin-top: 2rem;

	@media (max-width: 480px) {
		font-size: 1.2rem;
	}

	@media (max-width: 375px) {
		font-size: 1rem;
	}
`;