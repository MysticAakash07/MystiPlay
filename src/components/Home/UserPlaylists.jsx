import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useStateProvider } from "../../utils/StateProvider";
import { reducerCases } from "../../utils/Constants";

export default function UserPlaylists({ token }) {
	const [userPlaylists, setPlaylists] = useState([]);

	const [, dispatch] = useStateProvider();
	useEffect(() => {
		const getPlaylistData = async () => {
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
			const playlists = items.map(({ name, id }) => {
				return { name, id };
			});

			dispatch({ type: reducerCases.SET_PLAYLISTS, playlists });
		};
		getPlaylistData();
	}, [token, dispatch]);

	const changeCurrentPlaylist = (selectedPlaylistId) => {
		dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId });
		dispatch({ type: reducerCases.SET_VIEW, currentView: "playlist" });
	};

	useEffect(() => {
		const fetchPlaylists = async () => {
			try {
				const response = await axios.get(
					"https://api.spotify.com/v1/me/playlists",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setPlaylists(response.data.items);
			} catch (error) {
				console.error("Failed to fetch user playlists", error);
			}
		};

		if (token) {
			fetchPlaylists();
		}
	}, [token]);

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
		// Comment the 3 lines below for full playlist name
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		cursor: default;
	}

	&:hover {
		background-color: rgba(255, 255, 255, 0.2);
	}
`;
