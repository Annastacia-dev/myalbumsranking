import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { AlbumSearchModal } from "./AlbumSearchModal";

const RankingPosition = ({ album, index, moveAlbum, addAlbum, openModal }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ALBUM_RANK",
    item: { index }, // The index of the dragged album
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ["ALBUM", "ALBUM_RANK"], // Accept both ALBUM and ALBUM_RANK types
    drop: (item, monitor) => {
      // Handle dropping of an album from the Albums list
      if (monitor.getItemType() === "ALBUM") {
        addAlbum(index, item.album); // Add album from Albums
      }
      // Handle reordering within the Ranking list
      if (monitor.getItemType() === "ALBUM_RANK") {
        moveAlbum(item.index, index); // Reorder albums in ranking
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <li
      ref={(node) => drag(drop(node))} // Connect both drag and drop
      className={`mb-2 border border-gray-300 rounded-lg p-4 ${isDragging ? "opacity-50" : ""} ${isOver ? "bg-green-100" : ""}`}
    >
      {album ? (
        <div className="flex items-center gap-3">
          <img
            src={album.images[0]?.url}
            alt={album.name}
            className="rounded w-20 object-cover"
          />
          <div className="flex flex-col gap-1 md:text-sm text-xs">
            <p className="font-semibold md:w-3/4">{album.name}</p>
            <p>{album.artists.map((artist) => artist.name).join(", ")}</p>
          </div>
        </div>
      ) : (
        <div>
          <span className="md:block hidden">Drag an album here</span>
          <button className="block md:hidden" onClick={() => openModal(index)}>
            Add an album
          </button>
        </div>
      )}
    </li>
  );
};

const Ranking = () => {
  const [rankings, setRankings] = useState(() => {
    // Retrieve rankings from localStorage or initialize to empty
    const storedRankings = localStorage.getItem("rankings");
    return storedRankings ? JSON.parse(storedRankings) : Array(5).fill(null);
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    // Save rankings to localStorage whenever they change
    localStorage.setItem("rankings", JSON.stringify(rankings));
  }, [rankings]);

  const moveAlbum = (fromIndex, toIndex) => {
    const newRankings = [...rankings];
    const [movedAlbum] = newRankings.splice(fromIndex, 1); // Remove the album from its original position
    newRankings.splice(toIndex, 0, movedAlbum); // Insert it at the new position
    setRankings(newRankings);
  };

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
    const rankingElement = document.getElementById("ranking");
    html2canvas(rankingElement).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, "album-ranking.png");
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
              moveAlbum={moveAlbum} // Handle moving albums between positions
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
