import styled from "styled-components";
export default function Login() {
	const handleClick = () => {
		const clientId = "eaba786aaaac4ba9893ac34f40b638b0";
		const redirectUrl = "http://localhost:5173/";
		const apiUrl = "https://accounts.spotify.com/authorize";
		const scope = [
			"user-read-email",
			"user-read-private",
			"user-read-playback-state",
			"user-modify-playback-state",
			"user-read-currently-playing",
			"user-read-playback-position",
			"user-top-read",
			"user-library-read",
			"user-read-recently-played",
			"streaming",
			"app-remote-control",
			"user-follow-read",
			"playlist-read-private",
		];
		window.location.href = `${apiUrl}?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope.join(
			"%20"
		)}&response_type=token&show_daialog=true`;
	};
	return (
		<Container>
			<img
				src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_Black.png"
				alt="spotify"
			/>
			<button onClick={handleClick}>Connect Spotify</button>
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
	width: 100vw;
	background-color: #1db954;
	gap: 5rem;
	img {
		height: 20vh;
	}
	button {
		padding: 1rem 5rem;
		border-radius: 5rem;
		border: none;
		background-color: black;
		color: #49f585;
		cursor: pointer;
		font-size: 1.4rem;
	}
`;
