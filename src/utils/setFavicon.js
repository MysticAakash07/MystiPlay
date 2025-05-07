const setFavicon = () => {
	const darkModeIcon =
		"https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png";
	const lightModeIcon =
		"https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Black.png";

	const updateFavicon = (isDarkMode) => {
		const favicon = document.getElementById("favicon");
		if (favicon) {
			favicon.href = isDarkMode ? darkModeIcon : lightModeIcon;
		}
	};

	// Initial check
	const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
	updateFavicon(isDarkMode);

	// Listen for theme changes
	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", (event) => {
			updateFavicon(event.matches);
		});
};

export default setFavicon;
