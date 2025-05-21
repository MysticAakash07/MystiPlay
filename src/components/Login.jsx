import styled from "styled-components";

export default function Login() {
	const handleClick = () => {
		const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
		const redirectUrl = import.meta.env.PROD
			? import.meta.env.VITE_SPOTIFY_REDIRECT_URI_PROD
			: import.meta.env.VITE_SPOTIFY_REDIRECT_URI_DEV;
		const apiUrl = import.meta.env.VITE_SPOTIFY_AUTH_URL;
		const scope = import.meta.env.VITE_SPOTIFY_SCOPES.split(" ");

		window.location.href = `${apiUrl}?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope.join(
			"%20"
		)}&response_type=token&show_dialog=true`;
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
	@media (max-width: 768px) {
		gap: 2rem;
		img {
			height: 15vh;
		}
		button {
			padding: 0.8rem 4rem;
			font-size: 1.2rem;
		}
	}
	@media (max-width: 480px) {
		img {
			height: 12vh;
		}
		button {
			padding: 0.6rem 3rem;
			font-size: 1rem;
		}
	}
`;
