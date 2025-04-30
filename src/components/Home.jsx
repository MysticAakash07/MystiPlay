import { useState } from "react";
import styled from "styled-components";
import UserAlbums from "./Home/UserAlbums";
import UserPlaylists from "./Home/UserPlaylists";
import UserTopArtists from "./Home/UserTopArtists";
import UserTopTracks from "./Home/UserToptracks";

export default function Home({ token }) {
	const [activeSection, setActiveSection] = useState("playlists");
	return (
		<Container>
			<Buttons>
				<Button
					onClick={() => {
						setActiveSection("playlists");
					}}
				>
					Playlists
				</Button>
				<Button
					onClick={() => {
						setActiveSection("albums");
					}}
				>
					Albums
				</Button>
				<Button
					onClick={() => {
						setActiveSection("artists");
					}}
				>
					Top Artists
				</Button>
				<Button
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
`;
const Buttons = styled.div`
	display: flex;
	gap: 1rem;
	margin-bottom: 2rem;
`;
const Button = styled.div`
	padding: 0.5rem 0.8rem;
	background-color: rgba(47, 48, 47, 0.9);
	border: 2px solid rgba(47, 48, 47, 0.9);
	border-radius: 50px;
	color: white;
	cursor: pointer;
	transition: 0.3s;

	&:hover {
		background-color: rgba(47, 48, 47, 0.5);
		border: 2px solid white;
	}
`;
const Content = styled.div`
`;
