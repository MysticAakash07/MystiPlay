import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { MdHomeFilled } from "react-icons/md";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import { useState } from "react";

export default function NavBar({ navBackground }) {
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
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = await response.json();
			console.log(data);
			dispatch({ type: reducerCases.SET_SEARCH_RESULTS, searchResults: data });
			dispatch({ type: reducerCases.SET_VIEW, currentView: "search" });
		}
	};

	return (
		<Container navBackground={navBackground}>
			<div className="left">
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
				<a href="">
					<CgProfile />
					<span>{userInfo?.userName}</span>
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
	background-color: ${({ navBackground }) =>
		navBackground ? "rgba(0,0,0,.7)" : "none"};
	box-sizing: border-box;
	z-index: 10;
	.left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		.home {
			padding: 1rem;
			background-color: white;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 3rem;
			width: 3rem;
		}
		.search__bar {
			background-color: white;
			width: 100%;
			padding: 0.4rem 1rem;
			border-radius: 2rem;
			display: flex;
			align-items: center;
			gap: 0.5rem;
			input {
				border: none;
				height: 2rem;
				width: 100%;
				&:focus {
					outline: none;
				}
			}
		}
	}
	.avatar {
		background-color: black;
		padding: 0.3rem 0.5rem;
		padding-right: 0.5rem;
		margin-right: 1rem;
		border-radius: 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		a {
			display: flex;
			// flex-direction: column;
			justify-content: center;
			align-items: center;
			text-decoration: none;
			color: white;
			gap: 0.5rem;
			font-weight: bold;
			svg {
				font-size: 1.8rem;
				background-color: #282828;
				padding: 0.2rem;
				border-radius: 1rem;
				color: #c7c5c5;
			}
		}
	}
`;
