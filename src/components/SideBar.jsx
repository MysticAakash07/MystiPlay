import styled from "styled-components";
import { IoLibrary } from "react-icons/io5";
import { MdHomeFilled, MdSearch } from "react-icons/md";
import Playlists from "./Playlists";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function SideBar() {
	const [{}, dispatch] = useStateProvider();

	const gotoHome = () => {
		dispatch({ type: reducerCases.SET_VIEW, currentview: "home" });
	};

	return (
		<Container>
			<div className="top_links">
				<div className="logo">
					<img
						src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_White.png"
						alt="spotify"
					/>
				</div>
				<ul>
					<li onClick={gotoHome}>
						<MdHomeFilled />
						<span>Home</span>
					</li>
					<li>
						<IoLibrary />
						<span>Your Library</span>
					</li>
				</ul>
			</div>
			<Playlists />
		</Container>
	);
}

const Container = styled.div`
	background-color: black;
	color: #b3b3b3;
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	.top_links {
		display: flex;
		flex-direction: column;
	}
	.logo {
		text-align: center;
		margin: 1rem 0;
		img {
			max-inline-size: 80%;
			block-size: auto;
		}
	}
	ul {
		list-style-type: none;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		li {
			display: flex;
			gap: 1rem;
			cursor: pointer;
			transition: 0.3s ease-in-out;
			&:hover {
				color: white;
			}
		}
	}
`;
