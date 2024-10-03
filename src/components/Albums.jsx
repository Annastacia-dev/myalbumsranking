import { useState } from "react";
import { useDrag } from "react-dnd";
import useFetchAlbums from "../hooks/useFetchAlbums";
import { FaSpinner } from "react-icons/fa";
import PropTypes from "prop-types";

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
      className={`album border border-gray-300 rounded-lg flex flex-col relative group ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <img src={album.images[0]?.url} alt={album.name} className="rounded" />
      <div className="absolute inset-0 flex items-center  bg-black text-white bg-opacity-80  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="album-details text-sm p-2 flex flex-col gap-1 capitalize">
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

  const { albums, loading } = useFetchAlbums(searchTerm);

  // Filter albums based on search term
  const filteredAlbums = albums.filter((album) =>
    album.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-5 hidden md:block">
      <input
        type="text"
        placeholder="Search albums..."
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {!loading && filteredAlbums.length === 0 ? (
        <p className="text-center text-red-500">No albums found</p> // Display not found message
      ) : (
        <ul className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
          {filteredAlbums.slice(0, 12).map((album) => (
            <Album key={album.id} album={album} />
          ))}
        </ul>
      )}

      {loading && (
        <div className="min-h-60 flex flex-col justify-center items-center gap-4 ">
          <FaSpinner className="2xl animate-spin" />
          <p>Hang on ...</p>
        </div>
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
