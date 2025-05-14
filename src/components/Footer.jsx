import styled from "styled-components";
import CurrentTrack from "./CurrentTrack";
import PlayerControls from "./PlayerControls";
import Volume from "./Volume";
import Features from "./Features";

export default function Footer() {
	return (
		<Container>
			<LeftSection>
				<CurrentTrack />
				<span id="mobile">
					<Features />
				</span>
			</LeftSection>

			<MiddleSection>
				<PlayerControls />
			</MiddleSection>

			<RightSection>
				<Features />
				<Volume />
			</RightSection>
		</Container>
	);
}

const Container = styled.div`
	background-color: #181818;
	color: white;
	width: 100%;
	border-top: 1px solid #282828;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 1rem;
	height: 100px;

	#mobile {
		display: none;
	}

	@media (max-width: 768px) {
		padding: 0 0.5rem;
	}

	@media (max-width: 490px) {
		flex-direction: column;
		gap: 0.5rem;
		height: auto;
		padding: 1rem 0;
		#mobile {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
`;

const LeftSection = styled.div`
	width: 30%;

	@media (max-width: 768px) {
		width: 35%;
	}

	@media (max-width: 490px) {
		width: 100%;
		display: flex;
		padding: 0 1rem;
	}
`;

const MiddleSection = styled.div`
	width: 40%;
	display: flex;
	justify-content: center;

	@media (max-width: 490px) {
		width: 100%;
		justify-content: center;
	}
`;

const RightSection = styled.div`
	width: 30%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 1rem;

	@media (max-width: 490px) {
		display: none;
	}
`;
