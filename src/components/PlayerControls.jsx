import styled from "styled-components";
import {
	BsFillPlayCircleFill,
	BsFillPauseCircleFill,
	BsShuffle,
	BsRepeat1,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Constants";
import { useEffect } from "react";

export default function PlayerControls() {
	const [{ playerState, token, shuffleState, repeatState }, dispatch] =
		useStateProvider();

	const changeTrack = async (type) => {
		await axios.post(
			`https://api.spotify.com/v1/me/player/${type}`,
			{},
			{
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
			}
		);
		const response = await axios.get(
			"https://api.spotify.com/v1/me/player/currently-playing",
			{
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
			}
		);

		if (response.data !== "") {
			const { item } = response.data;
			const currentlyPlaying = {
				id: item.id,
				name: item.name,
				artists: item.artists.map((artist) => artist.name),
				image: item.album.images[2].url,
			};
			dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying });
		} else {
			dispatch({ type: reducerCases.SET_PLAYING, currentlyPlaying: null });
		}
	};

	const changeState = async () => {
		const state = playerState ? "pause" : "play";
		await axios.put(
			`https://api.spotify.com/v1/me/player/${state}`,
			{},
			{
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
			}
		);
		dispatch({
			type: reducerCases.SET_PLAYER_STATE,
			playerState: !playerState,
		});
	};

	const toggleShuffle = async () => {
		const newShuffleState = !shuffleState;
		await axios.put(
			`https://api.spotify.com/v1/me/player/shuffle?state=${newShuffleState}`,
			{},
			{
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
			}
		);

		dispatch({
			type: reducerCases.SET_SHUFFLE_STATE,
			shuffleState: newShuffleState,
		});
	};

	const cycleRepeat = async () => {
		const next =
			repeatState === "off"
				? "context"
				: repeatState === "context"
				? "track"
				: "off";

		await axios.put(
			`https://api.spotify.com/v1/me/player/repeat?state=${next}`,
			{},
			{
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
			}
		);
		dispatch({ type: reducerCases.SET_REPEAT_STATE, repeatState: next });
	};

	useEffect(() => {
		const fetchPlayBackState = async () => {
			const response = await axios.get("https://api.spotify.com/v1/me/player", {
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
			});

			if (response.data) {
				dispatch({
					type: reducerCases.SET_SHUFFLE_STATE,
					shuffleState: response.data.shuffle_state,
				});
				dispatch({
					type: reducerCases.SET_REPEAT_STATE,
					repeatState: response.data.repeat_state, // "off", "context", or "track"
				});
			}
		};

		if (token) fetchPlayBackState();
	}, [token, dispatch]);

	useEffect(() => {
		const interval = setInterval(async () => {
			const response = await axios.get("https://api.spotify.com/v1/me/player", {
				headers: {
					Authorization: "Bearer " + token,
				},
			});

			if (response.data) {
				dispatch({
					type: reducerCases.SET_SHUFFLE_STATE,
					shuffleState: response.data.shuffle_state,
				});
				dispatch({
					type: reducerCases.SET_REPEAT_STATE,
					repeatState: response.data.repeat_state,
				});
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [token, dispatch]);

	return (
		<Container>
			<div className="shuffle" onClick={toggleShuffle}>
				<BsShuffle style={{ color: shuffleState ? "#2EDE6D" : "white" }} />
			</div>
			<div className="prev">
				<CgPlayTrackPrev onClick={() => changeTrack("previous")} />
			</div>
			<div className="state">
				{playerState ? (
					<BsFillPauseCircleFill onClick={changeState} />
				) : (
					<BsFillPlayCircleFill onClick={changeState} />
				)}
			</div>
			<div className="next">
				<CgPlayTrackNext onClick={() => changeTrack("next")} />
			</div>
			<div className="repeat" onClick={cycleRepeat}>
				{repeatState === "track" ? (
					<BsRepeat1 style={{ color: "#2EDE6D" }} />
				) : (
					<FiRepeat
						style={{
							color: repeatState !== "off" ? "#2EDE6D" : "white",
						}}
					/>
				)}
			</div>
		</Container>
	);
}
const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	svg {
		color: #b3b3b3;
		transition: 0.3s ease-in-out;
		&:hover {
			color: white;
		}
	}
	.state {
		svg {
			color: white;
		}
	}
	.prev,
	.next,
	.state {
		font-size: 2rem;
	}

	@media (max-width: 768px) {
		gap: 0.5rem;
	}

	@media (max-width: 490px) {
		width: 100%;
		justify-content: space-evenly;
		gap: 0;
	}
`;
