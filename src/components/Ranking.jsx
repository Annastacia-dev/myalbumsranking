import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { AlbumSearchModal } from './AlbumSearchModal';

const RankingPosition = ({ album, index, addAlbum, openModal }) => {
    const [{ isOver }, drop] = useDrop({
        accept: 'ALBUM',
        drop: (item) => addAlbum(index, item.album),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <li
            ref={drop}
            className={`mb-2 border border-gray-300 rounded-lg p-4 ${isOver ? 'bg-green-100' : ''}`}
        >
            {album ? (
                <span>
                    {album.name} - {album.artists.map((artist) => artist.name).join(', ')}
                </span>
            ) : (
                <div>
                    {/* Show drag option for medium and larger screens */}
                    <span className='md:block hidden'>Drag an album here</span>
                    {/* Show "Add Album" button for small screens */}
                    <button className='block md:hidden' onClick={() => openModal(index)}>Add an album</button>
                </div>
            )}
        </li>
    );
};

const Ranking = () => {
    const [rankings, setRankings] = useState(Array(5).fill(null)); // Initialize 5 empty positions
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);

    const addAlbum = (index, album) => {
        const newRankings = [...rankings];
        newRankings[index] = album;
        setRankings(newRankings);
    };

    const openModal = (index) => {
        setCurrentIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAlbumSelect = (album) => {
        if (currentIndex !== null) {
            addAlbum(currentIndex, album);
            closeModal();
        }
    };

    const downloadRanking = () => {
        const rankingElement = document.getElementById('ranking');
        html2canvas(rankingElement).then((canvas) => {
            canvas.toBlob((blob) => {
                saveAs(blob, 'album-ranking.png');
            });
        });
    };

    return (
        <div className="p-5">
            <div id="ranking" className="p-4">
                <h2 className="text-lg font-semibold">My Album Rankings:</h2>
                <ol className="list-decimal pl-5">
                    {rankings.map((album, index) => (
                        <RankingPosition
                            key={index}
                            index={index}
                            album={album}
                            addAlbum={addAlbum}
                            openModal={openModal} // Pass function to open modal
                        />
                    ))}
                </ol>
            </div>

            <button
                onClick={downloadRanking}
                className="mt-4 bg-purple-500 text-white rounded px-4 py-2"
            >
                Download Ranking
            </button>

            {/* Render the modal */}
            {isModalOpen && (
                <AlbumSearchModal
                    closeModal={closeModal}
                    addAlbum={handleAlbumSelect} // Handle album selection
                />
            )}
        </div>
    );
};

export default Ranking;
