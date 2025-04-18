import { useEffect, useState } from "react";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Constants";
import styled from "styled-components";
import { BsArrowClockwise } from "react-icons/bs";
export default function Features() {
	const [{ token, devices }, dispatch] = useStateProvider();
	const [loading, setLoading] = useState(false);

	const fetchDevices = async () => {
		setLoading(true);
		const response = await axios.get(
			"https://api.spotify.com/v1/me/player/devices",
			{
				headers: {
					Authorization: "Bearer " + token,
				},
			}
		);
		dispatch({
			type: reducerCases.SET_DEVICES,
			devices: response.data.devices,
		});
		setLoading(false);
	};

	const transferPlayBack = async (deviceId) => {
		try {
			await axios.put(
				"https://api.spotify.com/v1/me/player",
				{
					device_ids: [deviceId],
					play: true,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);
		} catch (error) {
			console.error("Failed to transfer playback:", error);
		}
	};

	useEffect(() => {
		if (token) fetchDevices();
	}, [token]);

	return (
		<Container loading={loading}>
			<select
				onChange={(e) => transferPlayBack(e.target.value)}
				defaultValue=""
			>
				<option value="" disabled>
					Select Device
				</option>
				{devices?.map((device) => (
					<option key={device.id} value={device.id}>
						{device.name} {device.is_active ? "(Active)" : ""}
					</option>
				))}
			</select>
			<BsArrowClockwise onClick={fetchDevices} className="refresh-icon" />
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;

	select {
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		background-color: #282828;
		color: white;
		border: 1px solid #444;
		.active {
			color: #2ede6d;
		}
	}

	.refresh-icon {
		cursor: pointer;
		color: ${({ loading }) => (loading ? "#2EDE6D" : "white")};
	}
`;
