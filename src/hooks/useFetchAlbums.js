import { useState, useEffect } from "react";
import axios from "axios";

const clientId1 = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret1 = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const clientId2 = import.meta.env.VITE_SPOTIFY_CLIENT_ID_2;
const clientSecret2 = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET_2;

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
  const [activeCredentials, setActiveCredentials] = useState(1); // Track which client ID/secret is in use

  const MIN_ALBUM_COUNT = 12; // Ensures at least 12 albums are displayed
  const LIMIT = 50; // Spotify API limit per request

  const fetchAccessToken = async () => {
    const clientId = activeCredentials === 1 ? clientId1 : clientId2;
    const clientSecret =
      activeCredentials === 1 ? clientSecret1 : clientSecret2;

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

  const fetchAlbums = async () => {
    if (!accessToken) return;
    setLoading(true);

    try {
      let fetchedAlbums = [];
      let fullAlbums = [];
      let currentOffset = offset;

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

        const newFullAlbums = fetchedAlbums.filter(
          (album) => album && album.album_type === "album",
        );

        fullAlbums = [...fullAlbums, ...newFullAlbums];
        currentOffset += LIMIT;

        if (fetchedAlbums.length < LIMIT) {
          setHasMore(false);
          break;
        }
      }

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
      if (err.response?.status === 429) {
        // On 429 error, switch to the other credentials
        setActiveCredentials((prev) => (prev === 1 ? 2 : 1));
        fetchAccessToken(); // Retry fetching token with new credentials
      } else {
        console.error("Error fetching albums", err);
        setError("Error fetching albums");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMoreAlbums = () => {
    if (albums.length < 1000) {
      setOffset((prevOffset) => prevOffset + LIMIT);
    }
  };

  useEffect(() => {
    fetchAccessToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCredentials]); // Re-fetch access token when credentials change

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
