import styled from "styled-components";
import { createSpotifyAuthorizationUrl } from "../utils/spotifyAuth";

export default function Login() {
	const handleClick = async () => {
		try {
			window.location.href = await createSpotifyAuthorizationUrl();
		} catch (error) {
			console.error(error);
		}
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
