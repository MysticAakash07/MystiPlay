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
		const fetchDevices = async () => {
			try {
				if (token) {
					window.onSpotifyWebPlaybackSDKReady = async () => {
						const player = new window.Spotify.Player({
							name: "MysticAakash Web Player 🎧",
							getOAuthToken: (cb) => cb(token),
							volume: 0.5,
						});

						player.addListener("ready", async ({ device_id }) => {
							try {
								console.log("Ready with Device ID", device_id);
								dispatch({
									type: reducerCases.SET_DEVICE_ID,
									deviceId: device_id,
								});

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
							} catch (error) {
								console.error("Error in ready event listener:", error);
							}
						});

						player.addListener("not_ready", ({ device_id }) => {
							console.log("Device ID has gone offline", device_id);
						});

						try {
							await player.connect();
						} catch (error) {
							console.error("Error during player connection:", error);
						}
					};
				}
			} catch (error) {
				console.error("Error in fetching devices or SDK setup:", error);
			}
		};

		fetchDevices();
	}, [token, dispatch]);

	return <div>{token ? <Spotify /> : <Login />}</div>;
}
