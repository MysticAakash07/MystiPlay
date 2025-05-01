import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useStateProvider } from "../../utils/StateProvider";
import { reducerCases } from "../../utils/Constants";

export default function UserAlbums({ token }) {
	const [albums, setAlbums] = useState([]);
	const [,dispatch] = useStateProvider();

	useEffect(() => {
		const fetchalbums = async () => {
			try {
				const response = await axios.get(
					"https://api.spotify.com/v1/me/albums",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setAlbums(response.data.items);
				console.log("User albums:", response.data.items);
			} catch (error) {
				console.error("Failed to fetch user albums", error);
			}
		};

		if (token) {
			fetchalbums();
		}
	}, [token]);

	const changeCurrentAlbum = async (albumId) => {
		try {
			const response = await axios.get(
				`https://api.spotify.com/v1/albums/${albumId}`,
				{
					headers: {
						Authorization: "Bearer " + token,
						"Content-Type": "application/json",
					},
				}
			);

			const album = response.data;
			const albumData = {
				id: album.id,
				name: album.name,
				image: album.images[0]?.url,
				artists: album.artists.map((artist) => artist.name).join(", "),
				total_tracks: album.total_tracks,
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


	return (
		<AlbumGrid>
			{albums.map((alb, idx) => (
				<AlbumCard key={alb.album.id} onClick={() => changeCurrentAlbum(alb.album.id)}>
					<img src={alb.album.images[0]?.url} alt={alb.album.name} />
					<h4>{alb.album.name}</h4>
				</AlbumCard>
			))}
		</AlbumGrid>
	);
}

const AlbumGrid = styled.div`
	display: flex;
	gap: 1.5rem;
	flex-wrap: wrap;
	justify-content: center;
`;
const AlbumCard = styled.div`
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
