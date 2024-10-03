import React from 'react';
import { useDrag } from 'react-dnd';
import useFetchAlbums from '../hooks/useFetchAlbums';

const Album = ({ album }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ALBUM',
        item: { album },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <li
            ref={drag}
            className={`album border border-gray-300 rounded-lg flex flex-col relative group ${
                isDragging ? 'opacity-50' : ''
            }`}
        >
            <img
                src={album.images[0]?.url}
                alt={album.name}
                className="rounded-t-lg"
            />
            <div className="absolute inset-0 flex items-center  bg-black text-white bg-opacity-80  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="album-details text-sm p-2 flex flex-col gap-1 capitalize">
                    <h2 className="font-semibold">{album.name}</h2>
                    <p className="">
                        {album.artists.map((artist) => artist.name).join(", ")}
                    </p>
                    <p className="">{new Date(album.release_date).toLocaleDateString()}</p>
                </div>
            </div>
        </li>
    );
};

const Albums = () => {
    const { albums, loading, error, hasMore, loadMoreAlbums } = useFetchAlbums();

    return (
        <div className="p-5 hidden md:block">
            <h2 className="text-2xl font-bold mb-4">Albums</h2>
            <ul className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
                {albums.map((album, index) => (
                    <Album key={album.id} album={album} />
                ))}
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

export default Albums;
