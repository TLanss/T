// BQBu18P8LpdZB7jhq14XtbZx4oUVRdrsbsD-KjneYE2TPcEBSQRL635WGlKqEGWuIKpVncClqzCxXn8dV3WsxVWiygdhI5pK2WpbjhtrQsLWBM-TeghhRd_RbmBtS3hbektgl_4O9nE4DmNsISRY47-ilkB_BW5RHcmrrj33Yj5SH_fFob-_uqE&token_type=Bearer&expires_in=3600
const CLIENT_ID = '98849fa771334fbb8cc42eef6be5087f'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'https://tlanss.github.io/T'; // Replace with your GitHub Pages URL
const SCOPES = 'user-read-currently-playing';

// Check if the token is in the URL hash
const hash = window.location.hash;
let accessToken = 'BQBu18P8LpdZB7jhq14XtbZx4oUVRdrsbsD-KjneYE2TPcEBSQRL635WGlKqEGWuIKpVncClqzCxXn8dV3WsxVWiygdhI5pK2WpbjhtrQsLWBM-TeghhRd_RbmBtS3hbektgl_4O9nE4DmNsISRY47-ilkB_BW5RHcmrrj33Yj5SH_fFob-_uqE&token_type=Bearer&expires_in=3600';

if (hash) {
    // Extract the access token from the URL hash
    const params = new URLSearchParams(hash.substring(1));
    accessToken = params.get('access_token');
    window.location.hash = ''; // Clear the hash to avoid confusion
} else {
    // Redirect the user to Spotify Authorization if no token is found
    const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = AUTH_URL;
}

async function getCurrentlyPlaying() {
    if (!accessToken) {
        console.error('Access token is missing!');
        return null;
    }

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.ok) {
        return response.json();
    }

    throw new Error('Failed to fetch currently playing song.');
}

async function displaySong() {
    try {
        const songData = await getCurrentlyPlaying();

        if (songData && songData.item) {
            const song = songData.item;
            document.getElementById('song').innerHTML = `
                <div class="song-info">
                    <img src="${song.album.images[0].url}" alt="${song.name}">
                    <h2>${song.name}</h2>
                    <p>${song.artists.map(artist => artist.name).join(', ')}</p>
                </div>
            `;
        } else {
            document.getElementById('song').innerHTML = `<p>No song is currently playing.</p>`;
        }
    } catch (error) {
        console.error(error);
        document.getElementById('song').innerHTML = `<p>Failed to fetch song data. Please try again.</p>`;
    }
}

if (accessToken) {
    displaySong();
}
