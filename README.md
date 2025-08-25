
# 🎵 MystiPlay – A Spotify Clone Built with React + Vite

MystiPlay is a sleek and feature-rich Spotify Web Player clone, built using **React**, **Vite**, and the **Spotify Web API**. It allows users to authenticate with Spotify, browse their playlists, albums, top songs, play music, and control playback – all in a fast, modern UI with responsive design.

> 🚨 As of **May 15, 2025**, Spotify no longer allows **individual developers** to apply for production access (extended quota mode). This app remains in **development mode**, which limits access to only pre-approved test users. For full access, you must [run your own version](#-run-your-own-copy) with your own Spotify credentials.

---

## 📸 Demo

Try the live version (if you're added as a dev/test user):  
🔗 [https://mystiplay.vercel.app/](https://mystiplay.vercel.app/)

> If you're not on the allowlist, login will fail due to Spotify's restriction in development mode.

---

## ✉️ Request Access

If you'd like to try MystiPlay and be added as a dev tester (Spotify allows up to 25 in development mode), please **email me at:**  
📬 `rahulsagar460@gmail.com`  
Subject: `MystiPlay - Access Request`  
Include your **Spotify email address** so I can add it to the allowlist.

---

## 🧠 Features

- 🔐 Spotify Authentication with OAuth
- 🏠 Home view with featured playlists
- 📁 Full playlist & album views
- 🎧 Play, pause, skip, shuffle, repeat
- ❤️ Like/unlike playlists
- 🔍 Search across tracks, albums, and playlists
- 📱 Responsive UI (mobile-first support)
- 🎵 Current playing song UI with controls

---

## 🛠 Tech Stack

- **Frontend:** React (with Vite), Styled Components
- **State Management:** Context API + custom hooks
- **API Integration:** Spotify Web API
- **Auth:** Implicit grant OAuth flow
- **Hosting:** Vercel

---

## 💻 Run Your Own Copy

If you're not on the allowlist or want to explore the codebase yourself, you can run your own version by following these steps.

### 1. Clone the Repo

```bash
git clone https://github.com/MysticAakash07/mystiplay.git
cd mystiplay
npm install
````

### 2. Create a Spotify Developer App

* Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
* Create a new app
* Add the following **Redirect URIs** in the app settings:

  * `http://localhost:5173/`
  * (Optional for prod) `https://your-deployed-url.com/`

### 3. Configure Environment Variables

Create a `.env` file at the root of the project:

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_REDIRECT_URI=http://localhost:5173/
VITE_AUTH_ENDPOINT=https://accounts.spotify.com/authorize
VITE_SCOPES=user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read user-library-modify user-follow-read user-follow-modify streaming app-remote-control user-read-playback-state user-modify-playback-state user-read-currently-playing
```

> You can adjust scopes as needed. The above includes all features MystiPlay supports.

### 4. Start the Dev Server

```bash
npm run dev
```
OR

```bash
yarn run dev
```
---

## ⚠️ Spotify API Limitations

As of May 15, 2025, Spotify has changed its developer policy:

> “Spotify only accepts applications for extended quota access from **registered organizations**.”

This means **individual developers cannot make Spotify apps publicly accessible** beyond 25 test users. Learn more: [Spotify Quota Modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes).

MystiPlay is currently in **development mode**. If Spotify reverts this decision or offers better access to indie devs, this project will go public.

---

## 🙌 Acknowledgements

* Spotify Web API team
* Vite, React, Tailwind CSS maintainers
* Inspired by the official Spotify Web Player

---

## 👨‍💻 Author

**Aakash Sagar**
🎸 Music lover | 👨‍💻 Developer | 🎮 Builder
🔗 [LinkedIn](https://www.linkedin.com/in/mysticaakash)
🔗 [GitHub](https://github.com/MysticAakash07)
📬 `rahulsagar460@gmail.com`

---

## 📜 License

This project is open-source for educational and learning purposes. Not affiliated with Spotify.


