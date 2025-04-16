import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { useEffect } from "react";
import { reducerCases } from "../utils/Constants";

export default function Volume() {
	const [{ token, volume }, dispatch] = useStateProvider();

	// Sync volume from Spotify every 3 seconds
	useEffect(() => {
		const interval = setInterval(async () => {
			const response = await axios.get("https://api.spotify.com/v1/me/player", {
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
			});
			if (response?.data?.device?.volume_percent !== undefined) {
				dispatch({
					type: reducerCases.SET_VOLUME,
					volume: response.data.device.volume_percent,
				});
			}
		}, 3000);

		return () => clearInterval(interval);
	}, [token, dispatch]);

	const setVolume = async (e) => {
		const newVolume = parseInt(e.target.value);
		await axios.put(
			`https://api.spotify.com/v1/me/player/volume`,
			{},
			{
				params: {
					volume_percent: newVolume,
				},
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
			}
		);
		dispatch({ type: reducerCases.SET_VOLUME, volume: newVolume });
	};

	return (
		<Container>
			<input
				type="range"
				min={0}
				max={100}
				value={volume}
				onChange={(e) =>
					dispatch({
						type: reducerCases.SET_VOLUME,
						volume: parseInt(e.target.value),
					})
				}
				onMouseUp={setVolume}
			/>
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	justify-content: flex-end;
	align-content: center;
	input {
		width: 10rem;
		border-radius: 2rem;
		height: 0.5rem;
	}
`;
