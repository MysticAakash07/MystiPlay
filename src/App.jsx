import { useEffect, useRef, useState } from "react";
import Login from "./components/Login";
import Spotify from "./components/Spotify";
import { useStateProvider } from "./utils/StateProvider";
import { reducerCases } from "./utils/Constants";
import setFavicon from "./utils/setFavicon";
import { exchangeSpotifyCodeForToken } from "./utils/spotifyAuth";
import axios from "axios";

export default function App() {
	const [{ token }, dispatch] = useStateProvider();
	const [player, setPlayer] = useState(null);
	const [localProduct, setLocalProduct] = useState(null);
	const exchangedCodeRef = useRef(false);

	useEffect(() => {
		setFavicon();
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const code = params.get("code");
		const error = params.get("error");
		const storedToken = localStorage.getItem("spotifyToken");

		const saveToken = (_token) => {
			dispatch({ type: reducerCases.SET_TOKEN, token: _token });
			window._spotifyToken = _token;
			localStorage.setItem("spotifyToken", _token);
			window.history.replaceState(null, "", window.location.pathname);
		};

		if (error) {
			console.error("Spotify login failed:", error);
			window.history.replaceState(null, "", window.location.pathname);
			return;
		}

		if (code && !exchangedCodeRef.current) {
			exchangedCodeRef.current = true;
			exchangeSpotifyCodeForToken(code)
				.then(saveToken)
				.catch((exchangeError) => {
					console.error("Spotify token exchange failed:", exchangeError);
					window.history.replaceState(null, "", window.location.pathname);
				});
			return;
		}

		if (storedToken) {
			saveToken(storedToken);
		}
	}, [dispatch]);

	useEffect(() => {
		if (token) {
			window._spotifyToken = token;
		}
	}, [token]);

	const validateToken = async (token) => {
		try {
			const response = await axios.get("https://api.spotify.com/v1/me", {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (response.status === 200) {
				const product = response.data.product;
				console.log("✅ User product:", product);
				setLocalProduct(product); // <- Use local state for timing-sensitive checks
				dispatch({ type: reducerCases.SET_USER_PRODUCT, userProduct: product });
				return true;
			}
		} catch (error) {
			console.error("Token validation failed:", error);
		}
		return false;
	};

	useEffect(() => {
		const checkTokenValidity = async () => {
			if (token) {
				const isValid = await validateToken(token);
				if (!isValid) {
					console.log("Token invalid or expired. Redirecting to login...");
					logout();
				}
			}
		};
		checkTokenValidity();
	}, [token]);

	const logout = () => {
		localStorage.removeItem("spotifyToken");
		dispatch({ type: reducerCases.SET_TOKEN, token: null });
		window.location.reload();
	};

	useEffect(() => {
		if (!token || localProduct !== "premium" || player) return;

		window.onSpotifyWebPlaybackSDKReady = () => {
			if (player) return;

			const newPlayer = new window.Spotify.Player({
				name: "MystiPlay🎧",
				getOAuthToken: (cb) => cb(window._spotifyToken),
				volume: 0.5,
			});

			newPlayer.addListener("ready", async ({ device_id }) => {
				console.log("✅ Player ready with Device ID:", device_id);
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
					console.error("❌ Error transferring playback:", err);
				}
			});

			newPlayer.addListener("not_ready", ({ device_id }) => {
				console.log("🔌 Device went offline:", device_id);
			});

			newPlayer.addListener("account_error", ({ message }) => {
				console.error("❌ Account error:", message);
				logout();
			});

			newPlayer.addListener("authentication_error", ({ message }) => {
				console.error("❌ Auth error:", message);
				logout();
			});

			newPlayer.addListener("initialization_error", ({ message }) => {
				console.error("❌ Init error:", message);
			});

			newPlayer.addListener("playback_error", ({ message }) => {
				console.error("❌ Playback error:", message);
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
	}, [token, localProduct, player, dispatch]);

	return <div>{token ? <Spotify /> : <Login />}</div>;
}
