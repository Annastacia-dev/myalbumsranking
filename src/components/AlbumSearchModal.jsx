import React, { useState } from 'react';
import useFetchAlbums from '../hooks/useFetchAlbums';

export const AlbumSearchModal = ({ addAlbum, closeModal }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { albums, loading, error, loadMoreAlbums } = useFetchAlbums(searchQuery); // Use the hook with search query

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
                        <li key={album.id} className="flex justify-between items-center mb-2">
                            <span>{album.name} - {album.artist}</span>
                            <button
                                onClick={() => addAlbum(album)}
                                className="bg-green-500 text-white px-2 py-1 rounded"
                            >
                                Add
                            </button>
                        </li>
                    ))}
                </ul>
                {loading && <p>Loading...</p>}
                <button onClick={loadMoreAlbums} className="bg-blue-500 text-white px-4 py-2 rounded">Load More</button>
                <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
            </div>
        </div>
    );
};
