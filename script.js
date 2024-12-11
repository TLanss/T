const ACCESS_TOKEN = 'BQBu18P8LpdZB7jhq14XtbZx4oUVRdrsbsD-KjneYE2TPcEBSQRL635WGlKqEGWuIKpVncClqzCxXn8dV3WsxVWiygdhI5pK2WpbjhtrQsLWBM-TeghhRd_RbmBtS3hbektgl_4O9nE4DmNsISRY47-ilkB_BW5RHcmrrj33Yj5SH_fFob-_uqE&token_type=Bearer&expires_in=3600'; // Replace with your access token

async function getCurrentlyPlaying() {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
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

displaySong();
