import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useStateProvider } from "../../utils/StateProvider";
import { fetchAndSetAlbum } from "../../utils/fetchAlbumDetails";

export default function UserAlbums({ token }) {
	const [albums, setAlbums] = useState([]);
	const [, dispatch] = useStateProvider();

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

	return (
		<AlbumGrid>
			{albums.map((alb, idx) => (
				<AlbumCard
					key={alb.album.id}
					onClick={() => fetchAndSetAlbum(alb.album.id, token, dispatch)}
				>
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
	cursor: default;

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
const AlbumCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.1);
	color: white;
	padding: 1rem;
	border-radius: 20px;
	overflow: hidden;
	width: fit-content;
	transition: background 0.3s;
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
	}

	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
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
			width: 70px;
			height: 70px;
		}

		h4 {
			padding: 0 1rem;
			width: 100%;
			font-size: 0.7rem;
		}
	}
`;
