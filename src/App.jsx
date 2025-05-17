import { useEffect, useState } from "react";
import Login from "./components/Login";
import Spotify from "./components/Spotify";
import { useStateProvider } from "./utils/StateProvider";
import { reducerCases } from "./utils/Constants";
import setFavicon from "./utils/setFavicon";
import axios from "axios";

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
			window._spotifyToken = _token; // Store globally for SDK
			localStorage.setItem("spotifyToken", _token); // Persist token
			window.location.hash = ""; // Clear hash
		}
	}, [dispatch]);

	// Ensure global token is always available
	useEffect(() => {
		if (token) {
			window._spotifyToken = token;
		}
	}, [token]);

	// Validate token to avoid being stuck in an empty state
	const validateToken = async (token) => {
		try {
			const response = await axios.get("https://api.spotify.com/v1/me", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.status === 200;
		} catch (error) {
			console.error("Token validation failed:", error);
			return false;
		}
	};

	// Check token validity on initial load
	useEffect(() => {
		const checkTokenValidity = async () => {
			if (token) {
				const isValid = await validateToken(token);
				if (!isValid) {
					console.log("Token is invalid or expired. Redirecting to login...");
					logout(); // Clear token and force re-login
				}
			}
		};

		checkTokenValidity();
	}, [token]);

	// Logout/Disconnect function
	const logout = () => {
		localStorage.removeItem("spotifyToken");
		dispatch({ type: reducerCases.SET_TOKEN, token: null });
		window.location.reload(); // Force a re-login
	};

	// Setup Spotify SDK script and playback logic
	useEffect(() => {
		if (!token || player) return; // Prevent multiple initializations

		window.onSpotifyWebPlaybackSDKReady = () => {
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
				dispatch({ type: reducerCases.SET_DEVICE_ID, deviceId: device_id });

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
				logout(); // If account error, force logout
			});

			newPlayer.addListener("authentication_error", ({ message }) => {
				console.error("Authentication Error:", message);
				logout();
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

	//Added to check player_state
	useEffect(() => {
		if (player) {
			player.addListener("player_state_changed", (state) => {
				if (state && !state.paused && state.duration > 0) {
					console.log("Playback started successfully");
				} else {
					console.log(
						"Playback paused or stopped unexpectedly, trying to resume..."
					);
					player.resume().catch((err) => console.error("Resume failed:", err));
				}
			});
		}
	}, [player]);

	return <div>{token ? <Spotify /> : <Login />}</div>;
}
