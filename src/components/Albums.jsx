import { useState } from "react";
import { useDrag } from "react-dnd";
import useFetchAlbums from "../hooks/useFetchAlbums";
import Loader from "./Loader";
import PropTypes from "prop-types";
import { PiSpinnerBold } from "react-icons/pi";
import { IoSearch } from "react-icons/io5";

const Album = ({ album }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ALBUM",
    item: { album },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <li
      ref={drag}
      className={`album border border-gray-300 dark:border-black/20 rounded flex flex-col relative group ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <img src={album.images[0]?.url} alt={album.name} className="rounded" />
      <div className="absolute inset-0 flex items-center  bg-black text-white bg-opacity-80  opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded">
        <div className="album-details text-xs p-2 flex flex-col gap-1 capitalize">
          <h2 className="font-semibold">{album.name}</h2>
          <p className="">
            {album.artists.map((artist) => artist.name).join(", ")}
          </p>
          <p className="">
            {new Date(album.release_date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </li>
  );
};

const Albums = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { albums, loading, loadMoreAlbums } = useFetchAlbums(searchTerm);

  // Filter albums based on search term
  const filteredAlbums = albums.filter((album) =>
    album.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="pt-6 hidden md:block">
      <div className="relative">
        <input
          type="text"
          placeholder="Search albums..."
          className="border border-gray-300/20 bg-slate-100 dark:border-black/10 dark:bg-black/30 dark:focus:border-black/20 rounded p-2 mb-4 w-full  text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <IoSearch className="absolute top-3 text-sm right-6 text-gray-400" />
      </div>
      {loading && <Loader />}
      {!loading && filteredAlbums.length === 0 ? (
        <p className="text-center text-red-500">No albums found</p> // Display not found message
      ) : (
        <>
          <ul className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
            {filteredAlbums.slice(0, 12).map((album) => (
              <Album key={album.id} album={album} />
            ))}
          </ul>

          <div className="flex items-center mt-4 gap-4">
            <button
              onClick={loadMoreAlbums}
              className="bg-slate-200 dark:bg-black/30  dark:text-white px-4 py-2 rounded md:text-xs text-xs flex items-center gap-1 "
              title="Load More"
            >
              <PiSpinnerBold className="text-lg" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

Album.propTypes = {
  album: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      }),
    ).isRequired,
    artists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    ).isRequired,
    release_date: PropTypes.string.isRequired,
  }).isRequired,
};

export default Albums;
