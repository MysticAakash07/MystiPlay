import { useEffect, useState } from "react";
import Login from "./components/Login";
import Spotify from "./components/Spotify";
import { useStateProvider } from "./utils/StateProvider";
import { reducerCases } from "./utils/Constants";
import setFavicon from "./utils/setFavicon";

export default function App() {
	const [{ token }, dispatch] = useStateProvider();
	const [player, setPlayer] = useState(null);

	// Set Favicon Based on Light/Dark Mode
	useEffect(() => {
		setFavicon();
	}, []);

	// Extract token from URL on first load or check local storage
	useEffect(() => {
		const hash = window.location.hash;
		let _token = hash ? hash.substring(1).split("&")[0].split("=")[1] : null;

		if (!_token) {
			_token = localStorage.getItem("spotifyToken");
		}

		if (_token) {
			dispatch({ type: reducerCases.SET_TOKEN, token: _token });
			window._spotifyToken = _token; // store globally for SDK
			localStorage.setItem("spotifyToken", _token); // persist token
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
		if (!token || player) return; // Prevent multiple initializations

		window.onSpotifyWebPlaybackSDKReady = () => {
			// Check if a player instance already exists
			if (player) {
				console.log("Player already initialized");
				return;
			}

			const newPlayer = new window.Spotify.Player({
				name: "MystiPlay🎧",
				getOAuthToken: (cb) => cb(window._spotifyToken),
				volume: 0.5,
			});

			newPlayer.addListener("ready", async ({ device_id }) => {
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

			newPlayer.addListener("not_ready", ({ device_id }) => {
				console.log("Device ID has gone offline", device_id);
			});

			newPlayer.addListener("account_error", ({ message }) => {
				console.error("Account Error:", message);
			});

			newPlayer.addListener("authentication_error", ({ message }) => {
				console.error("Authentication Error:", message);
			});

			newPlayer.addListener("initialization_error", ({ message }) => {
				console.error("Initialization Error:", message);
			});

			newPlayer.addListener("playback_error", ({ message }) => {
				console.error("Playback Error:", message);
			});

			newPlayer.connect();
			setPlayer(newPlayer);
		};

		if (!document.getElementById("spotify-sdk")) {
			const script = document.createElement("script");
			script.id = "spotify-sdk";
			script.src = "https://sdk.scdn.co/spotify-player.js";
			script.async = true;
			document.body.appendChild(script);
		} else if (window.Spotify) {
			window.onSpotifyWebPlaybackSDKReady();
		}
	}, [token, player, dispatch]);

	return <div>{token ? <Spotify /> : <Login />}</div>;
}
