import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useStateProvider } from "../../utils/StateProvider";
import { reducerCases } from "../../utils/Constants";

export default function UserTopArtists({ token }) {
	const [, dispatch] = useStateProvider();
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
				<ArtistCard
					key={artist.id}
					onClick={() => {
						dispatch({
							type: reducerCases.SET_ARTIST_ID,
							selectedArtistId: artist.id,
						});
						dispatch({ type: reducerCases.SET_VIEW, currentView: "artist" });
					}}
				>
					<img src={artist.images[0]?.url} alt={artist.name} />
					<h4>
						{" "}
						#{idx + 1} {artist.name}
					</h4>
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

	@media (max-width: 350px) {
		gap: 1rem;
	}
`;
const ArtistCard = styled.div`
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
		width: 180px;
		height: 180px;
		object-fit: cover;
		border-radius: 50%;
	}

	h4 {
		width: 180px;
		text-align: center;
		margin-top: 0.5rem;
		font-size: 1rem;
	}

	&:hover {
		background-color: rgba(255, 255, 255, 0.2);
		cursor: pointer;
	}

	@media (max-width: 786px) {
		padding: 0.8rem;
		img {
			width: 130px;
			height: 130px;
		}
		h4 {
			width: 130px;
			font-size: 0.8rem;
			font-weight: 500;
		}
	}

	@media (max-width: 480px) {
	img {
		width: 110px;
		height: 110px;
	}
	h4 {
		width: 110px;
		font-size: 0.9rem;
	}
}

	@media (max-width: 375px) {
		background-color: transparent;
		padding: 0.5rem;
		img {
			width: 100px;
			height: 100px;
		}
		h4 {
			width: 100px;
			font-size: 0.8rem;
			font-weight: 500;
		}
	}
`;
