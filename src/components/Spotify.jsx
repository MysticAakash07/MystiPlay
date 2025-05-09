import styled from "styled-components";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import Body from "./Body";
import Footer from "./Footer";
import { useEffect, useRef, useState } from "react";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Constants";

export default function Spotify() {
	const [{ token }, dispatch] = useStateProvider();
	const bodyRef = useRef();
	const [navBackground, setNavBackground] = useState(false);
	const [headerBackground, setHeaderBackground] = useState(false);
	const [showSidebar, setShowSidebar] = useState(true);

	const toggleSidebar = () => setShowSidebar((prev) => !prev);

	const bodyScrolled = () => {
		if (bodyRef.current) {
			const scrollTop = bodyRef.current.scrollTop;
			setNavBackground(scrollTop >= 30);
			setHeaderBackground(scrollTop >= 268);
		}
	};

	useEffect(() => {
		const getUserInfo = async () => {
			const { data } = await axios.get("https://api.spotify.com/v1/me", {
				headers: { Authorization: "Bearer " + token },
			});
			dispatch({ type: reducerCases.SET_USER, userInfo: data });
		};
		if (token) getUserInfo();
	}, [token, dispatch]);

	useEffect(() => {
		const body = bodyRef.current;
		if (body) {
			body.addEventListener("scroll", bodyScrolled);
			return () => body.removeEventListener("scroll", bodyScrolled);
		}
	}, []);

	return (
		<Container showSidebar={showSidebar}>
			<div className="spotify_body">
				{showSidebar && (
					<div className={`sidebar-container ${showSidebar ? "show" : ""}`}>
						<SideBar toggleSidebar={toggleSidebar} />
					</div>
				)}

				<div className="body" ref={bodyRef}>
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
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.spotify_body {
		flex: 1;
		display: grid;
		grid-template-columns: ${({ showSidebar }) =>
			showSidebar ? "15vw 85vw" : "0 100vw"};
		transition: grid-template-columns 0.3s ease;
		background: linear-gradient(transparent, rgba(0, 0, 0, 1));
		background-color: rgb(32, 87, 108);
		min-height: 0;

		@media (max-width: 768px) {
			display: block;
			position: relative;
		}
	}

	.sidebar-container {
		@media (max-width: 768px) {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 30%;
			background-color: #000;
			z-index: 1000;
			transform: translateX(-100%);
			transition: transform 0.3s ease-in-out;

			&.show {
				transform: translateX(0%);
			}
		}

		@media (min-width: 769px) {
			display: block;
		}

		@media (max-width: 480px) {
			width: 60%;
		}
	}

	.body {
		height: 100%;
		width: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		position: relative;
	}

	.spotify_footer {
		height: 15vh;
	}
`;
