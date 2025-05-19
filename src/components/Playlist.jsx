import axios from "axios";
import styled from "styled-components";
import { useEffect, useState } from "react";
import {
	reducerCases,
	mstoMinutesAndSeconds,
	playTrack,
	msToHourMin,
} from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";
import { AiOutlineHeart, AiFillHeart, AiFillClockCircle } from "react-icons/ai";
import { FaPlay } from "react-icons/fa";
import Profile_FallBack from "../assets/Profile_FallBack.svg";
import Track_Album_Playlist_FallBack from "../assets/Track_Album_Playlist_FallBack.svg";

export default function Playlist({ headerBackground }) {
	const [{ userInfo, token, selectedPlaylistId, selectedPlaylist }, dispatch] =
		useStateProvider();
	const [isFollowing, setIsFollowing] = useState(false);

	useEffect(() => {
		const getInitialPlaylist = async () => {
			try {
				const baseUrl = `https://api.spotify.com/v1/playlists/${selectedPlaylistId}`;
				const headers = {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				};

				// First request to get metadata and total tracks
				const initialResponse = await axios.get(baseUrl, { headers });
				const totalTracks = initialResponse.data.tracks.total;
				const ownerId = initialResponse.data.owner.id;

				// Fetch all tracks using pagination
				let allTracks = [];
				let offset = 0;
				const limit = 100;

				while (offset < totalTracks) {
					const trackResponse = await axios.get(
						`${baseUrl}/tracks?offset=${offset}&limit=${limit}`,
						{ headers }
					);
					allTracks = allTracks.concat(trackResponse.data.items);
					offset += limit;
				}

				// Get owner details
				const ownerResponse = await axios.get(
					`https://api.spotify.com/v1/users/${ownerId}`,
					{ headers }
				);

				// Calculate total duration
				const totalDurationMs = allTracks.reduce(
					(total, item) => total + (item.track?.duration_ms || 0),
					0
				);

				const selectedPlaylist = {
					id: initialResponse.data.id,
					name: initialResponse.data.name,
					description: initialResponse.data.description.startsWith("<a")
						? ""
						: initialResponse.data.description,
					image: initialResponse.data.images[0].url,
					owner: initialResponse.data.owner.display_name,
					owner_id: ownerId,
					owner_image: ownerResponse.data.images?.[0]?.url || "",
					total_songs: totalTracks,
					uri: initialResponse.data.uri,
					duration: msToHourMin(totalDurationMs),
					tracks: allTracks.map(({ track }, index) => ({
						id: track.id,
						name: track.name,
						index,
						artists: track.artists.map((artist) => artist.name),
						image: track.album.images[2]?.url,
						duration: track.duration_ms,
						album: track.album.name,
						context_uri: track.album.uri,
						track_number: track.track_number,
					})),
				};

				dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist });
			} catch (err) {
				console.error("Failed to load full playlist:", err);
			}
		};

		getInitialPlaylist();
	}, [token, dispatch, selectedPlaylistId]);

	// Check follow status on component mount
	useEffect(() => {
		checkFollowStatus();
	}, [token, selectedPlaylistId]);

	// Check if user is following the playlist
	const checkFollowStatus = async () => {
		try {
			const headers = {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			};

			const response = await axios.get(
				`https://api.spotify.com/v1/playlists/${selectedPlaylistId}/followers/contains?ids=${userInfo.id}`,
				{ headers }
			);

			setIsFollowing(response.data[0]);
		} catch (error) {
			console.error("Error checking follow status:", error);
		}
	};

	// Follow/Unfollow Playlist
	const toggleFollow = async () => {
		try {
			const headers = {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			};

			if (isFollowing) {
				await axios.delete(
					`https://api.spotify.com/v1/playlists/${selectedPlaylistId}/followers`,
					{ headers }
				);
			} else {
				await axios.put(
					`https://api.spotify.com/v1/playlists/${selectedPlaylistId}/followers`,
					{ public: true },
					{ headers }
				);
			}

			setIsFollowing(!isFollowing);
		} catch (error) {
			console.error("Error toggling follow status:", error);
		}
	};

	if ( !userInfo || !selectedPlaylist) return <div>Loading playlist...</div>;

	return (
		<Container>
			<div className="playlist">
				<div className="image">
					<img
						src={selectedPlaylist.image || Track_Album_Playlist_FallBack}
						alt={selectedPlaylist}
					/>
				</div>
				<div className="details">
					<span className="type">PLAYLIST</span>
					<h1 className="title">{selectedPlaylist.name}</h1>
					<p className="description">{selectedPlaylist.description}</p>
					<div className="playlistDetails">
						<img
							src={selectedPlaylist.owner_image || Profile_FallBack}
							alt={selectedPlaylist.owner}
						/>
						<a
							href={`https://open.spotify.com/user/${selectedPlaylist.owner_id}`}
						>
							{selectedPlaylist.owner}
						</a>
						{userInfo?.id &&
							selectedPlaylist?.owner_id &&
							userInfo.id !== selectedPlaylist.owner_id && (
								<span className="follow-icon" onClick={toggleFollow}>
									{isFollowing ? (
										<AiFillHeart size={24} color=" #1db954" />
									) : (
										<AiOutlineHeart size={24} color="white" />
									)}
								</span>
							)}
						<span className="total-songs">
							<b>·</b> {selectedPlaylist.total_songs} songs
						</span>
						<span>
							<b>·</b> {selectedPlaylist.duration}
						</span>
					</div>
				</div>
			</div>
			<div className="list">
				{/* Pass headerBackground prop here */}
				<HeaderRow $headerBackground={headerBackground}>
					<div className="col">
						<span>#</span>
					</div>
					<div className="col">
						<span>TITLE</span>
					</div>
					<div className="col">
						<span>ALBUM</span>
					</div>
					<div className="col">
						<span>
							<AiFillClockCircle />
						</span>
					</div>
				</HeaderRow>
				<div className="tracks">
					{selectedPlaylist.tracks.map(
						({ id, index, name, artists, image, duration, album }) => (
							<div
								className="row"
								key={id}
								onClick={() =>
									playTrack(
										id,
										name,
										artists,
										image,
										selectedPlaylist.uri,
										index,
										token,
										dispatch
									)
								}
							>
								<div className="col index-col">
									<span className="track-number">{index + 1}</span>
									<span className="play-icon">
										<FaPlay />
									</span>
								</div>

								<div className="col detail">
									<div className="image">
										<img src={image} alt="track" />
									</div>
									<div className="info">
										<span className="name">{name}</span>
										<span className="artists">{artists.join(", ")}</span>
									</div>
								</div>
								<div className="col album">
									<span>{album}</span>
								</div>
								<div className="col duration">
									<span>{mstoMinutesAndSeconds(duration)}</span>
								</div>
							</div>
						)
					)}
				</div>
			</div>
		</Container>
	);
}

const Container = styled.div`
	.playlist {
		margin: 1rem 2rem;
		display: flex;
		align-items: flex-end;
		gap: 2rem;
		.image {
			img {
				height: 15rem;
				box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
				border-radius: 10px;
			}
		}

		.details {
			max-height: 15rem;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			color: #e0dede;
			overflow: hidden;
			.title {
				color: white;
				font-size: 3.5rem;
				line-height: 0.8;
				margin: 1rem 0;
			}
			.playlistDetails {
				margin: 1rem 0;
				display: flex;
				align-items: center;
				gap: 0.5rem;

				img {
					height: 5vh;
					border-radius: 50%;
				}

				a {
					text-decoration: none;
					font-weight: bold;
					color: #e0dede;
					&:hover {
						text-decoration: underline;
						color: white;
					}
				}

				.follow-icon {
					display: flex;
					align-self: center;
					justify-content: center;
				}
			}
		}

		@media (max-width: 786px) {
			gap: 1rem;
			.image {
				img {
					height: 12rem;
				}
			}
			.details {
				max-height: 12rem;
				font-size: 0.9rem;
				.title {
					font-size: 1.75rem;
					margin: 0.5rem 0;
				}
			}
			.playlistDetails {
				font-size: 0.9rem;
				margin: 0.5rem 0;
				img {
					height: 4vh;
				}
			}
		}

		@media (max-width: 450px) {
			flex-direction: column;
			justify-content: center;
			margin: 1rem 1rem;
			align-items: center;
			.type {
				display: none;
			}
			.image {
				img {
					height: 10rem;
				}
			}
			.details {
				align-self: flex-start;
				max-height: 10rem;
				font-size: 0.8rem;
				.title {
					font-size: 1.4rem;
				}
				.description {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
			.playlistDetails {
				font-size: 0.8rem;
				margin: 0.5rem 0;
				img {
					height: 3vh !important;
				}

				.follow-icon {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 24px; /* Adjust size as needed */
					height: 24px; /* Adjust size as needed */
					margin-left: 0.5rem;
				}
			}
		}
	}

	.list {
		.tracks {
			margin: 0 2rem;
			display: flex;
			flex-direction: column;
			.row {
				padding: 0.5rem 1rem;
				display: grid;
				grid-template-columns: 0.25fr 3.1fr 2fr 0.1fr;

				&:hover {
					background-color: rgba(0, 0, 0, 0.3);
				}

				.col {
					display: flex;
					align-items: center;
					color: #dddcdc;
				}

				.index-col {
					position: relative;
					width: 100%;
					justify-content: flex-start;

					.track-number {
						display: inline;
					}

					.play-icon {
						display: inline-block;
						opacity: 0;
						visibility: hidden;
						position: absolute;
						svg {
							color: white;
							height: 1rem;
						}
						transition: opacity 0.2s ease, visibility 0s 0.2s;
					}
				}

				&:hover .index-col {
					.track-number {
						display: none;
					}
					.play-icon {
						opacity: 1;
						visibility: visible;
						transition: opacity 0.2s ease, visibility 0s 0s;
					}
				}

				.detail {
					display: flex;
					gap: 1rem;
					.info {
						.name {
							color: white;
							font-weight: 500;
						}
						display: flex;
						flex-direction: column;
						.artists {
							color: #ccc;
						}
					}
					.image {
						img {
							border-radius: 6px;
						}
					}
				}
			}

			@media (max-width: 786px) {
				margin: 0 2rem;
				.row {
					align-items: center;

					.detail {
						display: flex;
						gap: 1rem;

						.image {
							img {
								height: 9vh;
								width: 9vh;
								object-fit: cover;
								border-radius: 6px;
							}
						}

						.info {
							display: flex;
							flex-direction: column;
							justify-content: center;
							max-height: 9vh;
							overflow: hidden;

							.name,
							.artists {
								padding-right: 1rem;
								display: -webkit-box;
								-webkit-line-clamp: 1;
								-webkit-box-orient: vertical;
								overflow: hidden;
								text-overflow: ellipsis;
								line-height: 1.2;
							}

							.name {
								color: white;
								font-weight: 500;
								font-size: 1rem;
							}

							.artists {
								font-size: 0.9rem;
								color: #ccc;
							}
						}
					}

					.album {
						max-width: 90%;
						font-size: 0.9rem;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						margin-right: 0.5rem;
					}

					.duration {
						font-size: 0.9rem;
					}
				}
			}

			@media (max-width: 480px) {
				margin: 0 0;
				.row {
					display: flex;

					.detail {
						gap: 1rem;
						.info {
							.name {
								color: white;
								font-weight: 500;
								font-size: 0.9rem;
							}
							.artists {
								font-size: 0.8rem;
								color: #ccc;
							}
						}
						.image {
							img {
								height: 8vh;
								width: 8vh;
							}
						}
					}
					.index-col {
						display: none;
					}

					.duration {
						display: none;
					}

					.album {
						display: none;
					}
				}
			}
		}
	}
`;

const HeaderRow = styled.div`
	display: grid;
	grid-template-columns: 0.25fr 3fr 2fr 0.1fr;
	color: #dddcdc;
	margin: 1rem 0 0 0;
	position: sticky;
	top: 15vh;
	padding: 1rem 3rem;
	transition: 0.3s ease-in-out;
	background-color: ${({ $headerBackground }) =>
		$headerBackground ? "#000000dc" : "none"};

	@media (max-width: 786px) {
		font-size: 1rem;
	}
	@media (max-width: 480px) {
		display: none;
	}
`;
