import { useState, useEffect } from "react";
import axios from "axios";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

const useFetchAlbums = (searchQuery = "", currentYear = new Date().getFullYear()) => {
    const [accessToken, setAccessToken] = useState("");
    const [albums, setAlbums] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Fetch access token from Spotify API
    const fetchAccessToken = async () => {
        const authString = `${clientId}:${clientSecret}`;
        const base64 = btoa(authString);

        try {
            const response = await axios.post(
                "https://accounts.spotify.com/api/token",
                new URLSearchParams({ grant_type: "client_credentials" }),
                {
                    headers: {
                        Authorization: `Basic ${base64}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            if (response.status === 200) {
                setAccessToken(response.data.access_token);
            } else {
                setError("Failed to get access token");
            }
        } catch (err) {
            console.error("Error fetching access token", err);
            setError("Error fetching access token");
        }
    };

    // Fetch albums from Spotify API
    const fetchAlbums = async () => {
        if (!accessToken) return;

        setLoading(true);
        const limit = 50;

        try {
            const response = await axios.get(`https://api.spotify.com/v1/search`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params: {
                    q: `${searchQuery ? `${searchQuery} ` : ""}year:${currentYear}`,
                    type: "album",
                    limit: limit,
                    offset: offset,
                },
            });

            let fetchedAlbums = response.data.albums.items;

            // Filter out singles
            const fullAlbums = fetchedAlbums.filter(
                (album) => album && album.album_type === 'album'
            );

            // Fetch track data to sum popularity
            const albumsWithTrackData = await Promise.all(
                fullAlbums.map(async (album) => {
                    const tracksResponse = await axios.get(
                        `https://api.spotify.com/v1/albums/${album.id}/tracks`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );

                    const tracks = tracksResponse.data.items;
                    let totalPopularity = 0;

                    for (let track of tracks) {
                        totalPopularity += track.popularity;
                    }

                    return { ...album, totalPopularity }; 
                })
            );

            // Sort by total popularity
            albumsWithTrackData.sort((a, b) => b.totalPopularity - a.totalPopularity);

            // Update state with the new albums
            if (albumsWithTrackData.length === 0) {
                setHasMore(false);
            } else {
                setAlbums((prevAlbums) => {
                    const allAlbums = [...prevAlbums, ...albumsWithTrackData];
                    const uniqueAlbums = allAlbums.filter(
                        (album, index, self) =>
                            index === self.findIndex((a) => a.id === album.id)
                    );
                    return uniqueAlbums;
                });
            }
        } catch (err) {
            console.error("Error fetching albums", err);
            setError("Error fetching albums");
        } finally {
            setLoading(false);
        }
    };

    // Load more albums
    const loadMoreAlbums = () => {
        if (albums.length < 1000) {
            setOffset((prevOffset) => prevOffset + 50);
        }
    };

    useEffect(() => {
        fetchAccessToken();
    }, []);

    useEffect(() => {
        if (accessToken) {
            setAlbums([]); 
            setOffset(0); 
            fetchAlbums();
        }
    }, [accessToken, searchQuery, offset]);

    return { albums, loading, error, hasMore, loadMoreAlbums };
};

export default useFetchAlbums;
