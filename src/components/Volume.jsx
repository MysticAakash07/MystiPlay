import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { useEffect } from "react";
import { reducerCases } from "../utils/Constants";
import { TbVolume, TbVolume2, TbVolume3 } from "react-icons/tb";

export default function Volume() {
	const [{ token, volume }, dispatch] = useStateProvider();

	// Sync volume from Spotify every 2 seconds
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
		}, 2000);

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

	const getVolumeIcon = () => {
		if (volume === 0) return <TbVolume3 className="volume-icon muted" />;
		if (volume <= 50) return <TbVolume2 className="volume-icon low" />;
		return <TbVolume className="volume-icon high" />;
	};

	return (
		<Container>
			{getVolumeIcon()}
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
	align-items: center;

	input {
		width: 10rem;
		border-radius: 2rem;
		height: 0.5rem;
		margin-left: 0.5rem;
	}

	.volume-icon {
		display: flex;
		font-size: 1.5rem;
		align-items: center;
		align-content: center;
		justify-content: flex-end;
	}

	.volume-icon.high {
		color: #2ede6d; /* Green for high volume */
	}

	.volume-icon.low {
		color: #f1c40f; /* Yellow for medium volume */
	}

	.volume-icon.muted {
		color: #e74c3c; /* Red for muted */
	}
`;

