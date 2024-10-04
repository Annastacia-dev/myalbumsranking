import { useState } from "react";
import useFetchAlbums from "../hooks/useFetchAlbums";
import PropTypes from "prop-types";
import Loader from "./Loader";
import { IoClose, IoSearch } from "react-icons/io5";
import { PiSpinnerBold } from "react-icons/pi";

export const AlbumSearchModal = ({ addAlbum, closeModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { albums, loading, loadMoreAlbums } = useFetchAlbums(searchQuery);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-100 dark:bg-black p-5 rounded">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            placeholder="Search for an album"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300/20 bg-slate-100 dark:border-gray-400/10 dark:bg-black/30 dark:focus:border-black/20 rounded px-4 py-1 w-full  text-sm"
          />
          <IoSearch className="absolute top-2 text-sm right-12 text-gray-400" />
          <button
            onClick={closeModal}
            className="bg-red-600 text-white px-2 py-2 rounded flex gap-1 text-xs items-center"
          >
            <IoClose className="text-md" />
          </button>
        </div>

        <ul className="mt-4">
          {albums.slice(0, 6).map((album) => (
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
        {loading && <Loader />}
        <div className="flex items-center mt-4 gap-4">
          <button
            onClick={loadMoreAlbums}
            className="dark:bg-slate-100 bg-black text-white dark:text-black px-4 py-2 rounded text-xs flex items-center gap-1 "
            title='Load More'
          >
            <PiSpinnerBold className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

AlbumSearchModal.propTypes = {
  addAlbum: PropTypes.func,
  closeModal: PropTypes.func,
};
