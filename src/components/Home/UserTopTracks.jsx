import styled from "styled-components";
import axios from "axios";
import { useState, useEffect } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { FaPlay } from "react-icons/fa";
import { reducerCases } from "../../utils/Constants";
import { useStateProvider } from "../../utils/StateProvider";

export default function UserTopTracks({ token }) {
	const [topTracks, setTopTracks] = useState([]);
	const [dispatch] = useStateProvider();

	const mstoMinutesAndSeconds = (ms) => {
		const minutes = Math.floor(ms / 60000);
		const seconds = ((ms % 60000) / 1000).toFixed(0);
		return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
	};

	const playTrack = async (trackUri, id, name, artists, image) => {
		const response = await axios.put(
			`https://api.spotify.com/v1/me/player/play/`,
			{
				uris: [trackUri],
				position_ms: 0,
			},
			{
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
			}
		);

		if (response.status === 204) {
			const currentlyPlaying = {
				id,
				name,
				artists,
				image,
			};
			dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying });
			dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
		}
	};

	useEffect(() => {
		const fetchTopTracks = async () => {
			try {
				const response = await axios.get(
					"https://api.spotify.com/v1/me/top/tracks?limit=20",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setTopTracks(response.data.items);
				console.log("Top Tracks:", response.data.items);
			} catch (error) {
				console.error("Failed to fetch top Tracks", error);
			}
		};

		if (token) {
			fetchTopTracks();
		}
	}, [token]);

	return (
		<Tracks>
			<h1>Your Top Tracks!</h1>
			<div className="list">
				<div className="header__row">
					<div className="col">
						<span>#</span>
					</div>
					<div className="col">
						<span>TITLE</span>
					</div>
					<div className="col">
						<span>ALBUM</span>
					</div>
					<div className="col">
						<span>
							<AiFillClockCircle />
						</span>
					</div>
				</div>
			</div>

			{topTracks.map((track, idx) => (
				<Track
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
					<div className="col index-col">
						<span className="track-number">{idx + 1}</span>
						<span className="play-icon">
							<FaPlay />
						</span>
					</div>

					<div className="col detail">
						<div className="image">
							<img src={track.album.images[1]?.url} alt="track" />
						</div>
						<div className="info">
							<span className="name">{track.name}</span>
							<span>
								{track.artists.map((artist) => artist.name).join(", ")}
							</span>
						</div>
					</div>
					<div className="col">
						<span>{track.album.name}</span>
					</div>
					<div className="col">
						<span>{mstoMinutesAndSeconds(track.duration_ms)}</span>
					</div>
				</Track>
			))}
		</Tracks>
	);
}

const Tracks = styled.div`
	h1 {
		color: white;
	}
	.list {
		.header__row {
			display: grid;
			grid-template-columns: 0.25fr 3fr 2fr 0.1fr;
			color: #dddcdc;
			margin: 1rem 0 0 0;
			position: sticky;
			top: 15vh;
			padding: 1rem 2rem;
			transition: 0.3s ease-in-out;
			background-color: ${({ headerBackground }) =>
				headerBackground ? "#000000dc" : "none"};
		}
	}
`;
const Track = styled.div`
	padding: 0.5rem 2rem;
	display: grid;
	grid-template-columns: 0.25fr 3fr 2fr 0.1fr;

	&:hover {
		background-color: rgba(0, 0, 0, 0.3);
	}

	.col {
		display: flex;
		align-items: center;
		color: #dddcdc;
	}

	.index-col {
		position: relative;
		width: 100%;
		justify-content: flex-start;

		.track-number {
			display: inline;
		}

		.play-icon {
			display: inline-block;
			opacity: 0;
			visibility: hidden;
			position: absolute;
			svg {
				color: white;
				height: 1rem;
			}
			transition: opacity 0.2s ease, visibility 0s 0.2s;
		}
	}

	&:hover .index-col {
		.track-number {
			display: none;
		}
		.play-icon {
			opacity: 1;
			visibility: visible;
			transition: opacity 0.2s ease, visibility 0s 0s;
			cursor: pointer;
		}
	}

	.detail {
		img {
			width: 100px;
			height: 100px;
			border-radius: 5px;
		}
		display: flex;
		gap: 1rem;
		.info {
			display: flex;
			flex-direction: column;
		}
	}
`;
