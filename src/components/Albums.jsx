import React, { useEffect, useState } from 'react';
import axios from 'axios';

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

const App = () => {
    const [accessToken, setAccessToken] = useState('');
    const [albums, setAlbums] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const currentYear = new Date().getFullYear(); // Get the current year

    // Fetch access token from Spotify API
    const fetchAccessToken = async () => {
        const authString = `${clientId}:${clientSecret}`;
        const base64 = btoa(authString);

        try {
            const response = await axios.post(
                'https://accounts.spotify.com/api/token',
                new URLSearchParams({ grant_type: 'client_credentials' }),
                {
                    headers: {
                        'Authorization': `Basic ${base64}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            if (response.status === 200) {
                setAccessToken(response.data.access_token);
            } else {
                setError('Failed to get access token');
            }
        } catch (err) {
            console.error('Error fetching access token', err);
            setError('Error fetching access token');
        }
    };

    // Fetch albums released in the current year and filter by album type (full albums)
    const fetchAlbums = async (offset) => {
        if (!accessToken) return;

        setLoading(true);
        const limit = 50; // Spotify allows fetching up to 50 items per request

        try {
            const response = await axios.get(`https://api.spotify.com/v1/search`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    q: `year:${currentYear}`, // Query albums from the current year
                    type: 'album',
                    limit: limit,
                    offset: offset,
                }
            });

            let fetchedAlbums = response.data.albums.items;

            // Filter out singles (only keep full albums)
            const fullAlbums = fetchedAlbums.filter(album => album.album_type === 'album');

            // For each album, fetch its tracks and sum the popularity to approximate streams
            const albumsWithTrackData = await Promise.all(
                fullAlbums.map(async (album) => {
                    const tracksResponse = await axios.get(`https://api.spotify.com/v1/albums/${album.id}/tracks`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        }
                    });

                    // Sum the popularity of all tracks in the album
                    const tracks = tracksResponse.data.items;
                    let totalPopularity = 0;

                    for (let track of tracks) {
                        totalPopularity += track.popularity;
                    }

                    return { ...album, totalPopularity }; // Attach the summed popularity to the album
                })
            );

            // Sort albums by the total popularity (as a proxy for streams)
            albumsWithTrackData.sort((a, b) => b.totalPopularity - a.totalPopularity);

            if (albumsWithTrackData.length === 0) {
                setHasMore(false);
            } else {
                setAlbums(prevAlbums => [...prevAlbums, ...albumsWithTrackData]);
            }
        } catch (err) {
            console.error('Error fetching albums', err);
            setError('Error fetching albums');
        } finally {
            setLoading(false);
        }
    };

    // Load more albums when "Load More" button is clicked
    const loadMoreAlbums = () => {
        if (albums.length < 1000) {
            setOffset(prevOffset => prevOffset + 50);
        }
    };

    // Fetch access token on component mount
    useEffect(() => {
        fetchAccessToken();
    }, []);

    // Fetch albums when access token or offset changes
    useEffect(() => {
        if (accessToken) {
            fetchAlbums(offset);
        }
    }, [accessToken, offset]);

    return (
        <div className="p-5 md:flex flex-col hidden">
            {error && <p className="text-red-500 text-center">{error}</p>}
            <ul className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
                {albums.length > 0 ? (
                    albums.map((album, index) => (
                        <li key={index} className="border border-gray-300 rounded-lg flex flex-col">
                            <img src={album.images[0]?.url} alt={album.name} className="" />
                            <div className='absolute hidden'>
                                <h2 className="text-xl font-semibold">{album.name}</h2>
                                <p className="text-gray-600">Artist: {album.artists.map(artist => artist.name).join(', ')}</p>
                                <p className="text-gray-600">Release Date: {album.release_date}</p>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="text-center">Loading...</li>
                )}
            </ul>
            {loading && <p className="text-center">Loading more albums...</p>}
            {hasMore && !loading && (
                <button 
                    onClick={loadMoreAlbums} 
                    className="block mx-auto mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                    Load More
                </button>
            )}
        </div>
    );
};

export default App;
