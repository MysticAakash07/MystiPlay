import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { reducerCases } from "../utils/Constants";
import { TbVolume, TbVolume2, TbVolume3 } from "react-icons/tb";

export default function Volume() {
	const [{ token, volume }, dispatch] = useStateProvider();
	const [localVolume, setLocalVolume] = useState(volume);
	const isDragging = useRef(false);
	const pollingInterval = useRef(null);

	// Function to fetch the current volume from Spotify
	const fetchCurrentVolume = async () => {
		try {
			const response = await axios.get("https://api.spotify.com/v1/me/player", {
				headers: {
					Authorization: "Bearer " + token,
					"Content-Type": "application/json",
				},
			});
			if (response?.data?.device?.volume_percent !== undefined) {
				const currentVolume = response.data.device.volume_percent;
				dispatch({ type: reducerCases.SET_VOLUME, volume: currentVolume });

				// Update local volume only if not dragging
				if (!isDragging.current) {
					setLocalVolume(currentVolume);
				}
			}
		} catch (err) {
			console.error("Error fetching volume:", err);
		}
	};

	// Sync volume from Spotify every 2 seconds
	useEffect(() => {
		pollingInterval.current = setInterval(fetchCurrentVolume, 2000);

		return () => clearInterval(pollingInterval.current);
	}, [token, dispatch]);

	const setVolume = async (newVolume) => {
		try {
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
			setLocalVolume(newVolume);
		} catch (err) {
			console.error("Error setting volume:", err);
		}
	};

	const handleMouseDown = () => {
		isDragging.current = true;
		clearInterval(pollingInterval.current);
	};

	const handleMouseUp = (e) => {
		const newVolume = parseInt(e.target.value);
		isDragging.current = false;
		setVolume(newVolume);
		pollingInterval.current = setInterval(fetchCurrentVolume, 2000);
	};

	const handleChange = (e) => {
		const newVolume = parseInt(e.target.value);
		setLocalVolume(newVolume);
	};

	const getVolumeIcon = () => {
		if (localVolume === 0) return <TbVolume3 className="volume-icon muted" />;
		if (localVolume <= 50) return <TbVolume2 className="volume-icon low" />;
		return <TbVolume className="volume-icon high" />;
	};

	return (
		<Container>
			{getVolumeIcon()}
			<input
				type="range"
				min={0}
				max={100}
				value={localVolume}
				onChange={handleChange}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
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
		background-color: #ccc;
		cursor: pointer;
	}

	.volume-icon {
		display: flex;
		font-size: 1.5rem;
		align-items: center;
		align-content: center;
		justify-content: flex-end;
	}

	.volume-icon.high {
		color: #2ede6d;
	}

	.volume-icon.low {
		color: #f1c40f;
	}

	.volume-icon.muted {
		color: #e74c3c;
	}

	@media(max-width: 768px){
		input{
			width: 5rem;
		}
	}
`;
