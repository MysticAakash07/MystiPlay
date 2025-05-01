import { useStateProvider } from "../utils/StateProvider";
import styled from "styled-components";

export default function Album() {
	const [{ selectedAlbum }] = useStateProvider();

	if (!selectedAlbum) return <div>Loading...</div>;

	return (
		<AlbumContainer>
			<h2>{selectedAlbum.name}</h2>
			<img src={selectedAlbum.image} alt={selectedAlbum.name} />
			<ul>
				{selectedAlbum.tracks.map((track) => (
					<li key={track.id}>{track.name}</li>
				))}
			</ul>
		</AlbumContainer>
	);
}

const AlbumContainer = styled.div`
	padding: 2rem;
	color: white;
	h2 {
		margin-bottom: 1rem;
	}
	img {
		width: 300px;
		margin-bottom: 2rem;
	}
	ul {
		list-style: none;
		padding: 0;
		li {
			margin: 0.5rem 0;
		}
	}
`;
