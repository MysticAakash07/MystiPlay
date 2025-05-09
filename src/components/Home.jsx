import { useState } from "react";
import styled from "styled-components";
import UserAlbums from "./Home/UserAlbums.jsx";
import UserPlaylists from "./Home/UserPlaylists.jsx";
import UserTopArtists from "./Home/UserTopArtists.jsx";
import UserTopTracks from "./Home/UserTopTracks.jsx";

export default function Home({ token }) {
	const [activeSection, setActiveSection] = useState("playlists");
	return (
		<Container>
			<Buttons>
				<Button
					active={activeSection === "playlists"}
					onClick={() => {
						setActiveSection("playlists");
					}}
				>
					Playlists
				</Button>
				<Button
					active={activeSection === "albums"}
					onClick={() => {
						setActiveSection("albums");
					}}
				>
					Albums
				</Button>
				<Button
					active={activeSection === "artists"}
					onClick={() => {
						setActiveSection("artists");
					}}
				>
					Top Artists
				</Button>
				<Button
					active={activeSection === "tracks"}
					onClick={() => {
						setActiveSection("tracks");
					}}
				>
					Top Tracks
				</Button>
			</Buttons>

			<Content>
				{activeSection === "playlists" && <UserPlaylists token={token} />}
				{activeSection === "artists" && <UserTopArtists token={token} />}
				{activeSection === "albums" && <UserAlbums token={token} />}
				{activeSection === "tracks" && <UserTopTracks token={token} />}
			</Content>
		</Container>
	);
}

const Container = styled.div`
	padding: 0.5rem 2rem;

	@media (max-width: 480px) {
		padding: 0.2rem .5rem;
		font-size: .75rem;
		
	}
`;
const Buttons = styled.div`
	display: flex;
	gap: 1rem;
	margin-bottom: 2rem;

	@media (max-width: 480px) {
		justify-content: center;
		gap: 0.5rem;
	}
`;
const Button = styled.div`
	padding: 0.5rem 0.8rem;
	border: 2px solid rgba(47, 48, 47, 0.9);
	border-radius: 50px;
	color: white;
	cursor: pointer;
	transition: 0.3s;

	background-color: ${({ active }) =>
		active ? "white" : "rgba(47, 48, 47, 0.9)"};
	color: ${({ active }) => (active ? "black" : "white")};
	border: 2px solid
		${({ active }) => (active ? "white" : "rgba(47, 48, 47, 0.9)")};
	&:hover {
		background-color: ${({ active }) =>
			active ? "white" : "rgba(47, 48, 47, 0.5)"};
		border-color: white;
	}

	@media (max-width: 350px) {
		padding: 0.25rem 0.5rem;
		border-radius: 50px;
	}
`;
const Content = styled.div``;
