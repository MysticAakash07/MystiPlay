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
							"Content-Type": "application/json",
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

					// Update only if the track has changed
					if (!currentlyPlaying || currentlyPlaying.id !== newTrack.id) {
						dispatch({
							type: reducerCases.SET_PLAYING,
							currentlyPlaying: newTrack,
						});
					}
				} else {
					// No track playing, reset currentlyPlaying
					if (currentlyPlaying) {
						dispatch({
							type: reducerCases.SET_PLAYING,
							currentlyPlaying: null,
						});
					}
				}
			} catch (error) {
				console.error("Error fetching current track:", error);
			}
		};

		// Fetch immediately and then at intervals
		getCurrentTrack();
		intervalId = setInterval(getCurrentTrack, 5000); // 5-second interval

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
		h4 {
			color: white;
			margin: 0;
		}
		h6 {
			color: #b3b3b3;
			font-size: 0.8rem;
			margin: 0;
		}
	}
`;
