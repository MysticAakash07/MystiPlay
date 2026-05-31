const CODE_VERIFIER_KEY = "spotifyCodeVerifier";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

const generateRandomString = (length) => {
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const values = crypto.getRandomValues(new Uint8Array(length));

	return values.reduce((acc, value) => acc + possible[value % possible.length], "");
};

const sha256 = async (plain) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(plain);
	return crypto.subtle.digest("SHA-256", data);
};

const base64UrlEncode = (input) =>
	btoa(String.fromCharCode(...new Uint8Array(input)))
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");

export const getSpotifyRedirectUri = () =>
	import.meta.env.PROD
		? import.meta.env.VITE_SPOTIFY_REDIRECT_URI_PROD
		: import.meta.env.VITE_SPOTIFY_REDIRECT_URI_DEV;

export const createSpotifyAuthorizationUrl = async () => {
	const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
	const redirectUri = getSpotifyRedirectUri();
	const apiUrl = import.meta.env.VITE_SPOTIFY_AUTH_URL;
	const scopes = import.meta.env.VITE_SPOTIFY_SCOPES;

	if (!clientId || !redirectUri || !apiUrl || !scopes) {
		throw new Error("Missing Spotify auth environment variables.");
	}

	const codeVerifier = generateRandomString(64);
	const codeChallenge = base64UrlEncode(await sha256(codeVerifier));
	localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);

	const params = new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		scope: scopes,
		response_type: "code",
		show_dialog: "true",
		code_challenge_method: "S256",
		code_challenge: codeChallenge,
	});

	return `${apiUrl}?${params.toString()}`;
};

export const exchangeSpotifyCodeForToken = async (code) => {
	const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
	const redirectUri = getSpotifyRedirectUri();
	const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY);

	if (!clientId || !redirectUri || !codeVerifier) {
		throw new Error("Missing Spotify PKCE login data.");
	}

	const response = await fetch(TOKEN_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: clientId,
			grant_type: "authorization_code",
			code,
			redirect_uri: redirectUri,
			code_verifier: codeVerifier,
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.error_description || data.error || "Spotify login failed.");
	}

	localStorage.removeItem(CODE_VERIFIER_KEY);
	return data.access_token;
};
