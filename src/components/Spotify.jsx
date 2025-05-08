import styled from "styled-components";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import Body from "./Body";
import Footer from "./Footer";
import { useEffect, useRef, useState } from "react";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Constants";
import { FiMenu } from "react-icons/fi";

export default function Spotify() {
	const [{ token }, dispatch] = useStateProvider();
	const bodyRef = useRef();
	const [navBackground, setNavBackground] = useState(false);
	const [headerBackground, setHeaderBackground] = useState(false);
	const [showSidebar, setShowSidebar] = useState(true);

	const toggleSidebar = () => {
		setShowSidebar((prev) => !prev);
	};

	const bodyScrolled = () => {
		bodyRef.current.scrollTop >= 30
			? setNavBackground(true)
			: setNavBackground(false);
		bodyRef.current.scrollTop >= 268
			? setHeaderBackground(true)
			: setHeaderBackground(false);
	};

	useEffect(() => {
		const getUserInfo = async () => {
			const { data } = await axios.get("https://api.spotify.com/v1/me", {
				headers: {
					Authorization: "Bearer " + token,
				},
			});
			dispatch({ type: reducerCases.SET_USER, userInfo: data });
		};
		getUserInfo();
	}, [token, dispatch]);

	return (
		<Container showSidebar={showSidebar}>
			<div className="spotify_body">
				{/* Sidebar - Hidden on small screens */}
				{showSidebar && <SideBar />}

				<div className="body" ref={bodyRef} onScroll={bodyScrolled}>
					<NavBar toggleSidebar={toggleSidebar} navBackground={navBackground} />
					<div className="body_contents">
						<Body headerBackground={headerBackground} />
					</div>
				</div>
			</div>

			<div className="spotify_footer">
				<Footer />
			</div>
		</Container>
	);
}

const Container = styled.div`
	max-width: 100vw;
	max-height: 100vh;
	overflow: hidden;
	display: grid;
	grid-template-rows: 85vh 15vh;

	.spotify_body {
		display: grid;
		grid-template-columns: ${({ showSidebar }) =>
			showSidebar ? "60vw 40vw" : "100vw"};
		transition: grid-template-columns 0.3s ease;
		height: 100%;
		width: 100%;
		background: linear-gradient(transparent, rgba(0, 0, 0, 1));
		background-color: rgb(32, 87, 108);

		@media (min-width: 769px) {
			grid-template-columns: 15vw 85vw;
		}
	}

	.body {
		height: 100%;
		width: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		position: relative;
	}
`;

