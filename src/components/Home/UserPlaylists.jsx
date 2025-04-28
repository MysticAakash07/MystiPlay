import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

export default function UserPlaylists({ token }) {
	const [playlists, setPlaylists] = useState([]);

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
				console.log("User Playlists:", response.data.items);
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
			{playlists.map((playlist) => (
				<PlaylistCard key={playlist.id}>
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
	background-color: rgba(47, 48, 47, 0.8);
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
		// Comment the 3 lines below for full playlist name
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
`;
