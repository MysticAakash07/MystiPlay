import { useEffect, useRef, useState } from "react";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Constants";
import styled from "styled-components";
import { BsArrowClockwise, BsDisplay } from "react-icons/bs";

export default function Features() {
	const [{ token, devices }, dispatch] = useStateProvider();
	const [loading, setLoading] = useState(false);
	const [showDevices, setShowDevices] = useState(false);
	const [activeDeviceId, setActiveDeviceId] = useState(null);
	const popupRef = useRef(null);

	const fetchDevices = async () => {
		setLoading(true);
		try {
			const [devicesRes, playerRes] = await Promise.all([
				axios.get("https://api.spotify.com/v1/me/player/devices", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
				axios.get("https://api.spotify.com/v1/me/player", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}),
			]);

			dispatch({
				type: reducerCases.SET_DEVICES,
				devices: devicesRes.data.devices,
			});
			setActiveDeviceId(playerRes.data?.device?.id || null);
		} catch (err) {
			console.error("Failed to fetch devices/player:", err);
		}
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

			await axios.put(
				`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);

			setShowDevices(false);
		} catch (error) {
			console.error("Failed to transfer playback or play:", error);
		}
	};

	useEffect(() => {
		if (token) {
			fetchDevices();

			const interval = setInterval(() => {
				fetchDevices();
			}, 3000);

			return () => clearInterval(interval);
		}
	}, [token]);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (popupRef.current && !popupRef.current.contains(e.target)) {
				setShowDevices(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<Container>
			<IconGroup>
				<BsDisplay
					onClick={() => setShowDevices(!showDevices)}
					className="device-icon"
				/>
				{/* For Manually Fetching Devices */}
				{/* <BsArrowClockwise   
					onClick={fetchDevices}
					className="refresh-icon"
					$loading={loading}
				/> */}
			</IconGroup>
			{showDevices && (
				<DevicePopup ref={popupRef}>
					{devices?.map((device) => (
						<div
							key={device.id}
							className={`device ${
								device.id === activeDeviceId ? "active" : ""
							}`}
							onClick={() => transferPlayBack(device.id)}
						>
							{device.name}
						</div>
					))}
				</DevicePopup>
			)}
		</Container>
	);
}

const Container = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-right: 1rem;
	gap: 1rem;

	@media(max-width: 768px){
		padding: 0;
	}
`;

const IconGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;

	.device-icon {
		cursor: pointer;
		font-size: 1.3rem;
		color: white;
	}
`;

const DevicePopup = styled.div`
	position: absolute;
	bottom: 2.5rem;
	right: 0;
	background: #282828;
	color: white;
	border: 1px solid #444;
	border-radius: 8px;
	padding: 0.5rem;
	z-index: 999;

	display: flex;
	flex-direction: column;
	gap: 0.25rem;

	.device {
		cursor: pointer;
		padding: 0.4rem 0.8rem;
		white-space: nowrap;
		-webkit-user-select: none;
		-ms-user-select: none; 
		user-select: none; 
		&:hover {
			background-color: #383838;
		}

		&.active {
			color: #2ede6d;
			font-weight: bold;
		}
	}
`;
