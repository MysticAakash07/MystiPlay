import { reducerCases } from "./Constants";

export const initialState = {
	token: null,
	playlists: [],
	userInfo: null,
	selectedPlaylistId: "1W0wGJ9I2oJ1WKxqSpKPbE",
	selectedAlbum: null,
	selectedArtistId: "0hEurMDQu99nJRq8pTxO14",
	selectedPlaylist: null,
	currentlyPlaying: null,
	playerState: false,
	currentView: "artist",
	searchResults: null,
	volume: 50,
	shuffleState: false,
	repeatState: "off",
	devices: [],
};

const reducer = (state, action) => {
	switch (action.type) {
		case reducerCases.SET_TOKEN: {
			return {
				...state,
				token: action.token,
			};
		}
		case reducerCases.SET_PLAYLISTS: {
			return {
				...state,
				playlists: action.playlists,
			};
		}
		case reducerCases.SET_USER: {
			return {
				...state,
				userInfo: action.userInfo,
			};
		}
		case reducerCases.SET_PLAYLIST: {
			return {
				...state,
				selectedPlaylist: action.selectedPlaylist,
			};
		}
		case reducerCases.SET_PLAYING: {
			return {
				...state,
				currentlyPlaying: action.currentlyPlaying,
			};
		}
		case reducerCases.SET_PLAYER_STATE: {
			return {
				...state,
				playerState: action.playerState,
			};
		}
		case reducerCases.SET_PLAYLIST_ID: {
			return {
				...state,
				selectedPlaylistId: action.selectedPlaylistId,
			};
		}
		case reducerCases.SET_VIEW: {
			return {
				...state,
				currentView: action.currentView,
			};
		}

		case reducerCases.SET_VOLUME: {
			return {
				...state,
				volume: action.volume,
			};
		}
		case reducerCases.SET_SHUFFLE_STATE:
			return {
				...state,
				shuffleState: action.shuffleState,
			};
		case reducerCases.SET_REPEAT_STATE:
			return {
				...state,
				repeatState: action.repeatState,
			};
		case reducerCases.SET_DEVICES: {
			return {
				...state,
				devices: action.devices,
			};
		}
		case reducerCases.SET_DEVICE_ID:
			return {
				...state,
				deviceId: action.deviceId,
			};
		case reducerCases.SET_ALBUM:
			return {
				...state,
				selectedAlbum: action.selectedAlbum,
			};
		case reducerCases.SET_SEARCH_RESULTS: {
			return {
				...state,
				searchResults: action.searchResults,
			};
		}
		case reducerCases.SET_ARTIST_ID: {
			return {
				...state,
				selectedArtistId: action.selectedArtistId,
			};
		}
		default:
			return state;
	}
};

export default reducer;
