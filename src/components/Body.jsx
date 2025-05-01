import { useStateProvider } from "../utils/StateProvider";
import Home from "./Home";
import Playlist from "./Playlist";
import Album from "./Album";

export default function Body({ headerBackground }) {
	const [{ token, currentView }, dispatch] = useStateProvider();

	return (
		<div>
			{currentView === "home" && <Home token={token} />}
			{currentView === "playlist" && (
				<Playlist headerBackground={headerBackground} />
			)}
			{currentView === "album" && <Album />}
		</div>
	);
}
