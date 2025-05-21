import { useStateProvider } from "../utils/StateProvider";
import styled from "styled-components";
import { AiFillClockCircle } from "react-icons/ai";
import { FaPlay } from "react-icons/fa";
import { mstoMinutesAndSeconds } from "../utils/Constants";
import { playTrack } from "../utils/Constants";

export default function Album({ headerBackground }) {
	const [{ token, selectedAlbum }, dispatch] = useStateProvider();

	if (!selectedAlbum) return <div>Loading...</div>;
	return (
		<AlbumContainer>
			<div className="album">
				<div className="image">
					<img src={selectedAlbum.image} alt={selectedAlbum.name} />
				</div>
				<div className="details">
					<span className="type">ALBUM</span>
					<h1 className="title">{selectedAlbum.name}</h1>
					<div className="albumDetails">
						<span>By</span>
						<h3 className="artist-name">{selectedAlbum.artists}</h3>
						<span>
							<b> · </b>
							{selectedAlbum.release_date}
						</span>
						<span className="total-songs">
							<b> · </b> {selectedAlbum.total_tracks} songs
						</span>
						<span className="album-duration">
							<b> · </b> {selectedAlbum.duration}
						</span>
					</div>
				</div>
			</div>
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
				{selectedAlbum.tracks.map(
					({ id, index, name, artists, image, duration, album }) => (
						<div
							key={id}
							className="row"
							onClick={() =>
								playTrack(
									id,
									name,
									artists,
									image,
									selectedAlbum.uri,
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
		</AlbumContainer>
	);
}

const AlbumContainer = styled.div`
	.album {
		margin: 1rem 2rem;
		display: flex;
		align-items: flex-end;
		gap: 2rem;

		.image {
			img {
				height: 18rem;
				box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
				border-radius: 10px;
			}
		}
		.details {
			max-height: 18rem;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			color: #e0dede;

			.title {
				color: white;
				font-size: 3rem;
				line-height: 1.1;
			}

			.albumDetails {
				margin: 0.6rem 0;
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
				.albumDetails {
					font-size: 0.9rem;
					margin: 0.5rem 0;
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
				.artist-name {
					font-size: 0.9rem;
				}
				.albumDetails {
					font-size: 0.8rem;
					margin: 0.5rem 0;
				}
				.album-duration {
					display: none;
				}
			}

			.total-songs {
				display: none;
			}
		}
	}

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
						margin-right: 0.5rem;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						overflow: hidden;
						text-overflow: ellipsis;
						color: white;
						font-weight: 500;
					}
					display: flex;
					flex-direction: column;
				}
				.image {
					img {
						height: 4rem;
						border-radius: 6px;
					}
				}
			}

			.album {
				margin-left: 0;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
				text-wrap: nowrap;
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
