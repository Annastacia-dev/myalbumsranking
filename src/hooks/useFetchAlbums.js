import { useState, useEffect } from "react";
import axios from "axios";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

const useFetchAlbums = (
  searchQuery = "",
  currentYear = new Date().getFullYear(),
) => {
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const MIN_ALBUM_COUNT = 12; // Ensures at least 12 albums are displayed
  const LIMIT = 50; // Spotify API limit per request

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
        },
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

    try {
      let fetchedAlbums = [];
      let fullAlbums = [];
      let currentOffset = offset;

      // Loop until we have at least 12 albums of type "album"
      while (fullAlbums.length < MIN_ALBUM_COUNT && hasMore) {
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: `${searchQuery ? `${searchQuery} ` : ""}year:${currentYear}`,
            type: "album",
            limit: LIMIT,
            offset: currentOffset,
          },
        });

        fetchedAlbums = response.data.albums.items;

        // Filter out singles
        const newFullAlbums = fetchedAlbums.filter(
          (album) => album && album.album_type === "album",
        );

        fullAlbums = [...fullAlbums, ...newFullAlbums];
        currentOffset += LIMIT;

        // If no more albums to fetch, stop the loop
        if (fetchedAlbums.length < LIMIT) {
          setHasMore(false);
          break;
        }
      }

      // Update state with the new albums
      if (fullAlbums.length === 0) {
        setHasMore(false);
      } else {
        setAlbums((prevAlbums) => {
          const allAlbums = [...prevAlbums, ...fullAlbums];
          const uniqueAlbums = allAlbums.filter(
            (album, index, self) =>
              index === self.findIndex((a) => a.id === album.id),
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
      setOffset((prevOffset) => prevOffset + LIMIT);
    }
  };

  useEffect(() => {
    fetchAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      if (searchQuery === "") {
        setAlbums([]);
      } else {
        setAlbums([]);
        setOffset(0);
      }
      fetchAlbums();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, searchQuery, offset]);

  return { albums, loading, error, hasMore, loadMoreAlbums };
};

export default useFetchAlbums;
