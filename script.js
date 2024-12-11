const CLIENT_ID = '98849fa771334fbb8cc42eef6be5087f';
const REDIRECT_URI = 'https://tlanss.github.io/T/callback';
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-read-currently-playing`;

async function getAccessToken() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    if (!params.has('access_token')) {
        window.location.href = AUTH_URL;
    }

    return params.get('access_token');
}

async function getCurrentlyPlaying(accessToken) {
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
        const accessToken = await getAccessToken();
        const songData = await getCurrentlyPlaying(accessToken);

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
