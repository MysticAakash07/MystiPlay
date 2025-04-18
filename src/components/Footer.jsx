import styled from "styled-components";
import CurrentTrack from "./CurrentTrack";
import PlayerControls from "./PlayerControls";
import Volume from "./Volume";
import Features from "./Features";
export default function Footer() {
	return (
		<Container>
			<CurrentTrack />
			<PlayerControls/>
			<Features/>
			<Volume />
		</Container>
	);
}

const Container = styled.div`
	background-color: #181818;
	color: white;
	height: 100%;
	width: 100%;
	border-top: 1px solid #282828;
	display: grid;
	grid-template-columns: 1fr 2fr 0.5fr 0.5fr;
	align-items: center;
	justify-content: center;
	padding: 0 1rem;
`;
