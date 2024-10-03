import { useState } from "react";
import useFetchAlbums from "../hooks/useFetchAlbums";
import PropTypes from "prop-types";

export const AlbumSearchModal = ({ addAlbum, closeModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { albums, loading, loadMoreAlbums } = useFetchAlbums(searchQuery);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Search Albums</h2>
        <input
          type="text"
          placeholder="Search for an album"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 mb-4"
        />

        <ul>
          {albums.map((album) => (
            <li
              key={album.id}
              className="flex items-center gap-3 mb-2"
              onClick={() => addAlbum(album)}
            >
              <img
                src={album.images[0]?.url}
                alt={album.name}
                className="rounded w-20"
              />
              <div className="flex flex-col gap-1 md:text-sm text-xs">
                <p className="font-semibold md:w-3/4">{album.name}</p>
                <p>{album.artists.map((artist) => artist.name).join(", ")}</p>
              </div>
            </li>
          ))}
        </ul>
        {loading && <p>Loading...</p>}
        <button
          onClick={loadMoreAlbums}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Load More
        </button>
        <button
          onClick={closeModal}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

AlbumSearchModal.propTypes = {
  addAlbum: PropTypes.func,
  closeModal: PropTypes.func,
};
