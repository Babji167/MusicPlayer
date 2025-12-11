🎵 Groove — Music Player (Spotify-Style UI)

A modern, responsive frontend music player application built using HTML, CSS, and JavaScript.
Inspired by Spotify, the app includes playlists, likes, shuffle, repeat, search, and full audio controls.

Perfect for frontend portfolio projects and resume enhancement.

🚀 Features
🎧 Core Music Player

Play / Pause

Next / Previous track

Seek bar with live timestamp updates

Volume control

Shuffle mode

Repeat (off / repeat all / repeat one)

🎨 UI & Design

Spotify-style dark theme

Responsive layout for mobile + desktop

Smooth UI with modern gradients

Thumbnail album artwork for each track

📚 Library & Search

Dynamic track library

Real-time search by title or artist

Auto-render track list with thumbnails

❤️ Likes & Playlists

Like/Unlike songs

Create custom playlists

Add tracks to playlists

Playlist storage using LocalStorage

💾 Data Storage

All user data is saved locally in the browser:

Likes

Playlists

Last selected track

Player state

🗂 Project Structure
music-player-app/
│── index.html      # Main UI
│── styles.css      # Styling (Spotify-style theme)
│── app.js          # Player functionality
└── assets/         # Optional folder for images or mp3 files

🔧 How to Run

Download the ZIP or clone your repository

Open project in VS Code

Install Live Server extension

Right-click index.html → Open with Live Server

You're ready to use the player 🎶

🔑 Adding Your Own Songs

Inside app.js, update the tracks array:

const tracks = [
  {
    id: 1,
    title: "My Song",
    artist: "Artist Name",
    src: "assets/song1.mp3",
    art: "assets/cover1.jpg"
  }
];


Add as many tracks as you want.

🛠 Tech Stack

HTML5

CSS3

Vanilla JavaScript

LocalStorage (browser data persistence)

No frameworks required.
