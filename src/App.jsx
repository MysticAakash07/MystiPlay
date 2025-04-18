import { useEffect } from "react";
import Login from "./components/Login";
import { useStateProvider } from "./utils/StateProvider";
import { reducerCases } from "./utils/Constants";
import Spotify from "./components/Spotify";

export default function App() {
	const [{ token }, dispatch] = useStateProvider();

	useEffect(() => {
		const hash = window.location.hash;
		if (hash) {
			const token = hash.substring(1).split("&")[0].split("=")[1];
			dispatch({ type: reducerCases.SET_TOKEN, token });
		}
	}, [token, dispatch]);

	useEffect(() => {
		if (token) {
			window.onSpotifyWebPlaybackSDKReady = () => {
				const player = new window.Spotify.Player({
					name: "MysticAakash Web Player 🎧",
					getOAuthToken: (cb) => cb(token),
					volume: 0.5,
				});

				player.addListener("ready", async ({ device_id }) => {
					console.log("Ready with Device ID", device_id);
					dispatch({ type: reducerCases.SET_DEVICE_ID, deviceId: device_id });

					// Pause playback just to register the device (optional but helpful)
					await fetch("https://api.spotify.com/v1/me/player/pause", {
						method: "PUT",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});

					// Transfer playback to your Web Playback SDK device
					await fetch("https://api.spotify.com/v1/me/player", {
						method: "PUT",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							device_ids: [device_id],
							play: false, // Set to true to auto-play last context
						}),
					});
				});



				player.addListener("not_ready", ({ device_id }) => {
					console.log("Device ID has gone offline", device_id);
				});

				player.connect();
			};
		}
	}, [token, dispatch]);

	return <div>{token ? <Spotify /> : <Login />}</div>;
}
