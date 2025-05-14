import { useEffect } from "react";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Constants";

export default function CurrentTrack() {
	const [{ token, currentlyPlaying }, dispatch] = useStateProvider();

	useEffect(() => {
		let intervalId;

		const getCurrentTrack = async () => {
			try {
				const response = await axios.get(
					"https://api.spotify.com/v1/me/player/currently-playing",
					{
						headers: {
							Authorization: "Bearer " + token,
						},
					}
				);

				if (response.data && response.data.item) {
					const { item } = response.data;
					const newTrack = {
						id: item.id,
						name: item.name,
						artists: item.artists.map((artist) => artist.name),
						image: item.album.images[0].url,
					};

					if (!currentlyPlaying || currentlyPlaying.id !== newTrack.id) {
						dispatch({
							type: reducerCases.SET_PLAYING,
							currentlyPlaying: newTrack,
						});
					}
				} else {
					dispatch({
						type: reducerCases.SET_PLAYING,
						currentlyPlaying: null,
					});
				}
			} catch (error) {
				console.error("Error fetching current track:", error);
			}
		};

		getCurrentTrack();
		intervalId = setInterval(getCurrentTrack, 5000);

		return () => clearInterval(intervalId);
	}, [token, currentlyPlaying, dispatch]);

	return (
		<Container>
			{currentlyPlaying ? (
				<div className="track">
					<div className="track__image">
						<img src={currentlyPlaying.image} alt={currentlyPlaying.name} />
					</div>
					<div className="track__info">
						<h4>{currentlyPlaying.name}</h4>
						<h6>{currentlyPlaying.artists.join(", ")}</h6>
					</div>
				</div>
			) : (
				<div className="track">No track playing</div>
			)}
		</Container>
	);
}

const Container = styled.div`
	.track {
		display: flex;
		align-items: center;
		gap: 1rem;
		img {
			border-radius: 10%;
			width: 80px;
		}
	}

	.track__info {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		overflow: hidden;
		max-width: 100%;

		h4 {
			color: white;
			margin: 0;
			font-size: 1rem;
			line-height: 1.2;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		h6 {
			color: #b3b3b3;
			font-size: 0.8rem;
			margin: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
	@media (max-width: 768px) {
		.track {
			gap: 0.5rem;
			img {
				width: 60px;
			}
		}
		.track__info {
			h4 {
				font-size: 0.8rem;
			}
			h6 {
				font-size: 0.7rem;
			}
		}
	}

	@media (max-width: 490px) {
		width: 100%;

		.track__info {
			h4 {
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
				max-height: 2.4em;
				word-wrap: break-word;
			}

			h6 {
				white-space: nowrap;
			}
		}
	}
`;
