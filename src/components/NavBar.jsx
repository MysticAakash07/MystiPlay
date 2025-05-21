import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdHomeFilled } from "react-icons/md";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import { useState } from "react";
import { IoLibrary } from "react-icons/io5";
import Profile_Fallback from "../assets/Profile_Fallback.svg";

export default function NavBar({ toggleSidebar, navBackground }) {
	const [{ userInfo, token }, dispatch] = useStateProvider();
	const [query, setQuery] = useState("");

	const gotoHome = () => {
		dispatch({ type: reducerCases.SET_VIEW, currentView: "home" });
	};

	const handleSearch = async (e) => {
		if (e.key === "Enter" && query.trim() !== "") {
			const response = await fetch(
				`https://api.spotify.com/v1/search?q=${encodeURIComponent(
					query
				)}&type=album,playlist,track,artist&limit=10`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			const data = await response.json();
			dispatch({ type: reducerCases.SET_SEARCH_RESULTS, searchResults: data });
			dispatch({ type: reducerCases.SET_VIEW, currentView: "search" });
		}
	};

	return (
		<Container $navBackground={navBackground}>
			<div className="left">
				<div onClick={toggleSidebar} className="menu">
					<IoLibrary />
				</div>
			</div>
			<div className="middle">
				<div onClick={gotoHome} className="home">
					<MdHomeFilled />
				</div>
				<div className="search__bar">
					<FaSearch />
					<input
						type="text"
						placeholder="Artists, songs, or Podcasts"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={handleSearch}
					/>
				</div>
			</div>
			<div className="avatar">
				<a href="#">
					{userInfo?.images?.[0]?.url ? (
						<img src={userInfo.images[0].url} alt="profile" />
					) : (
						<img src={Profile_Fallback} alt="profile_photo" />
					)}
					<span>{userInfo?.display_name}</span>
				</a>
			</div>
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 2rem;
	height: 15vh;
	position: sticky;
	top: 0;
	transition: 0.3s ease-in-out;
	background-color: ${({ $navBackground }) =>
		$navBackground ? "rgba(0,0,0,.7)" : "none"};
	box-sizing: border-box;
	z-index: 100;

	.left {
		display: flex;
		align-items: center;
		justify-content: center;
		.menu {
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			color: #ffffff;
			transition: background-color 0.2s ease;
			padding: 0.5rem;
			border-radius: 50%;
			height: 3rem;
			width: 3rem;
			z-index: 1101;

			svg {
				font-size: 1.5rem;
			}
			&:hover {
				background-color: rgba(255, 255, 255, 0.1);
			}
			@media (min-width: 769px) {
				display: none;
			}
			@media (max-width: 480px) {
				height: 2.5rem;
				width: 2.5rem;
				svg {
					font-size: 1.1rem;
				}
			}
		}
	}

	.middle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		justify-content: center;

		.home {
			height: 3rem;
			width: 3rem;
			background-color: white;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;

			svg {
				font-size: 1.5rem;
				color: black;
			}

			&:hover {
				background-color: #282828;
				transform: scale(1.1);
				svg {
					color: #ffffff;
				}
			}

			@media (max-width: 480px) {
				height: 2.5rem;
				width: 2.5rem;
				svg {
					font-size: 1rem;
				}
			}
		}

		.search__bar {
			background-color: white;
			border-radius: 2rem;
			height: 3rem;
			display: flex;
			align-items: center;
			padding: 0 1rem;
			gap: 0.5rem;
			flex: 1;
			max-width: 500px;

			svg {
				font-size: 1.2rem;
				color: #333;
			}

			input {
				border: none;
				width: 90%;
				height: 100%;
				font-size: 1rem;
				background: transparent;

				&:focus {
					outline: none;
				}
			}

			@media (max-width: 768px) {
				max-width: 25rem;
			}

			@media (max-width: 480px) {
				max-width: 10rem;
				height: 2.5rem;
				padding: 0 0.7rem;
				svg {
					font-size: 1rem;
				}
				input {
					font-size: 0.7rem;
				}
			}
		}
	}

	.avatar {
		background-color: black;
		padding: 0.5rem 0.5rem;
		margin-right: 1rem;
		border-radius: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		a {
			display: flex;
			justify-content: center;
			align-items: center;
			text-decoration: none;
			color: white;
			gap: 0.5rem;
			font-weight: bold;
			img {
				width: 2rem;
				border-radius: 50%;
			}
			svg {
				font-size: 1.8rem;
				background-color: #282828;
				padding: 0.2rem;
				border-radius: 1rem;
				color: #c7c5c5;
			}
		}
		@media (max-width: 480px) {
			margin-right: 0;
			padding: 0;
			img {
				width: 2.4rem !important;
			}
			span {
				display: none;
			}
		}
	}

	@media (max-width: 786px) {
		padding: 1rem;
	}
	@media (max-width: 480px) {
		padding: 0.5rem;
		height: 10vh;
	}
`;
