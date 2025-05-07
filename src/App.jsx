import { useEffect, useState } from "react";
import Login from "./components/Login";
import Spotify from "./components/Spotify";
import { useStateProvider } from "./utils/StateProvider";
import { reducerCases } from "./utils/Constants";
import setFavicon from "./utils/setFavicon";

export default function App() {
	const [{ token }, dispatch] = useStateProvider();
	const [playerInitialized, setPlayerInitialized] = useState(false);

	// Set Favicon Based on Light/Dark Mode

	useEffect(() => {
		setFavicon();
	}, []);

	// Extract token from URL on first load
	useEffect(() => {
		const hash = window.location.hash;
		if (hash) {
			const _token = hash.substring(1).split("&")[0].split("=")[1];
			dispatch({ type: reducerCases.SET_TOKEN, token: _token });
			window._spotifyToken = _token; // store globally for SDK
			window.location.hash = ""; // clear hash
		}
	}, [dispatch]);

	// Ensure global token is always available
	useEffect(() => {
		if (token) {
			window._spotifyToken = token;
		}
	}, [token]);

	// Setup Spotify SDK script and playback logic
	useEffect(() => {
		if (!token || playerInitialized) return;

		// Define SDK callback BEFORE script loads
		window.onSpotifyWebPlaybackSDKReady = () => {
			const player = new window.Spotify.Player({
				name: "MysticAakash Web Player 🎧",
				getOAuthToken: (cb) => cb(window._spotifyToken),
				volume: 0.5,
			});

			player.addListener("ready", async ({ device_id }) => {
				console.log("Ready with Device ID", device_id);
				dispatch({
					type: reducerCases.SET_DEVICE_ID,
					deviceId: device_id,
				});

				try {
					await fetch("https://api.spotify.com/v1/me/player", {
						method: "PUT",
						headers: {
							Authorization: `Bearer ${window._spotifyToken}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							device_ids: [device_id],
							play: false,
						}),
					});
				} catch (err) {
					console.error("Error transferring playback:", err);
				}
			});

			player.addListener("not_ready", ({ device_id }) => {
				console.log("Device ID has gone offline", device_id);
			});

			player.addListener("account_error", ({ message }) => {
				console.error("Account Error:", message);
				alert(
					"Playback requires a Spotify Premium account. Upgrade to Premium to enable playback."
				);
			});

			player.addListener("authentication_error", ({ message }) => {
				console.error("Authentication Error:", message);
			});

			player.addListener("initialization_error", ({ message }) => {
				console.error("Initialization Error:", message);
			});

			player.addListener("playback_error", ({ message }) => {
				console.error("Playback Error:", message);
			});

			player.connect();
			setPlayerInitialized(true);
		};

		// Load the SDK script if not already present
		if (!document.getElementById("spotify-sdk")) {
			const script = document.createElement("script");
			script.id = "spotify-sdk";
			script.src = "https://sdk.scdn.co/spotify-player.js";
			script.async = true;
			document.body.appendChild(script);
		} else if (window.Spotify) {
			// SDK already loaded; manually trigger the callback
			window.onSpotifyWebPlaybackSDKReady();
		}
	}, [token, dispatch, playerInitialized]);

	return <div>{token ? <Spotify /> : <Login />}</div>;
}
