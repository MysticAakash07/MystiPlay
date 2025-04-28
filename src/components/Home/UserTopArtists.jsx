import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

export default function UserTopArtists({ token }) {
	const [topArtists, setTopArtists] = useState([]);

	useEffect(() => {
		const fetchTopArtists = async () => {
			try {
				const response = await axios.get(
					"https://api.spotify.com/v1/me/top/artists?limit=10",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setTopArtists(response.data.items);
				console.log("Top Artists:", response.data.items);
			} catch (error) {
				console.error("Failed to fetch top artists", error);
			}
		};

		if (token) {
			fetchTopArtists();
		}
	}, [token]);
	return (
		<ArtistGrid>
			{topArtists.map((artist, idx) => (
				<ArtistCard key={artist.id}>
					<img src={artist.images[0]?.url} alt={artist.name} />
					<h4> #{idx +1} {artist.name}</h4>
				</ArtistCard>
			))}
		</ArtistGrid>
	);
}

const ArtistGrid = styled.div`
	display: flex;
	gap: 2rem;
	flex-wrap: wrap;
	justify-content: center;
`;
const ArtistCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: rgba(47, 48, 47, 0.8);
	color: white;
	padding: 1rem;
	border-radius: 20px;
	overflow: hidden;
	width: fit-content;
	transition: background-color 0.3s;

	img {
		width: 200px;
		height: 200px;
		object-fit: cover;
		border-radius: 50%;
	}

	h4 {
		width: 200px;
		text-align: center;
		margin-top: 0.5rem;
		font-size: 1rem;
	}

	&:hover {
		background-color: rgba(47, 48, 47, 0.6);
		cursor: pointer;
	}
`;
