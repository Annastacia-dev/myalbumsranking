import { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { AlbumSearchModal } from "./AlbumSearchModal";
import { MdOutlineFileDownload, MdAdd } from "react-icons/md";
import PropTypes from "prop-types";

const RankingPosition = ({ album, index, moveAlbum, addAlbum, openModal }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ALBUM_RANK",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ["ALBUM", "ALBUM_RANK"],
    drop: (item, monitor) => {
      if (monitor.getItemType() === "ALBUM") {
        addAlbum(index, item.album);
      }
      if (monitor.getItemType() === "ALBUM_RANK") {
        moveAlbum(item.index, index);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const [albumCover, setAlbumCover] = useState(null);

  // Function to convert the album image to a base64 string
  const loadImageAsBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Allow CORS
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = (err) => reject(err);
    });
  };

  useEffect(() => {
    if (album && album.images && album.images[0]) {
      loadImageAsBase64(album.images[0].url)
        .then((base64Image) => {
          setAlbumCover(base64Image);
        })
        .catch((err) => {
          console.error("Error loading image:", err);
        });
    }
  }, [album]);

  return (
    <li
      ref={(node) => drag(drop(node))}
      className={`mb-2 border border-gray-300 dark:border-white/10 rounded p-1 ${isDragging ? "opacity-50" : ""} ${isOver ? "bg-secondary/20" : ""}`}
    >
      {album ? (
        <div className="flex items-center gap-3 relative">
          <img
            src={albumCover || album.images[0]?.url}
            alt={album.name}
            className="rounded w-20 object-cover"
          />
          <div className="flex flex-col gap-1  text-xs">
            <p className="font-semibold">{album.name}</p>
            <p>{album.artists.map((artist) => artist.name).join(", ")}</p>
          </div>
          <p className="font-black absolute opacity-50 right-1 bottom-1 md:text-sm text-xs">
            {index + 1}
          </p>
        </div>
      ) : (
        <div>
          <span className="md:block hidden p-3">Drag an album here</span>
          <button
            className="md:hidden flex items-center gap-3 p-3"
            onClick={() => openModal(index)}
          >
            <MdAdd /> Add an album
          </button>
        </div>
      )}
    </li>
  );
};

const Ranking = () => {
  const [rankings, setRankings] = useState(() => {
    const storedRankings = localStorage.getItem("rankings");
    return storedRankings ? JSON.parse(storedRankings) : Array(5).fill(null);
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const nullRankings = rankings.filter(ranking => ranking === null).length

  useEffect(() => {
    localStorage.setItem("rankings", JSON.stringify(rankings));
  }, [rankings]);

  const moveAlbum = (fromIndex, toIndex) => {
    const newRankings = [...rankings];
    const [movedAlbum] = newRankings.splice(fromIndex, 1);
    newRankings.splice(toIndex, 0, movedAlbum);
    setRankings(newRankings);
  };

  const addAlbum = (index, album) => {
    const newRankings = [...rankings];

    // Check for duplicates
    if (!newRankings.includes(album)) {
      newRankings[index] = album;
      setRankings(newRankings);
    } else {
      alert("This album is already in the rankings!");
    }
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
    html2canvas(rankingElement, { scale: 2 }).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, "album-ranking.png");
      });
    });
  };

  const currentYear = new Date().getFullYear()

  return (
    <div className="flex flex-col md:px-5">
      <div className="flex justify-between">
        <p></p>
        <button
          onClick={downloadRanking}
          className={`mb-2 ${nullRankings > 0 ? "bg-slate-300/10 dark:bg-black/10" : "bg-slate-200 dark:bg-white/10 dark:text-white"}  rounded px-3 py-2`}
          disabled={nullRankings > 0 }
          title="Download"
        >
          <MdOutlineFileDownload className="text-lg" />
        </button>
      </div>
      <div id="ranking" className="flex flex-col gap-3 md:-mt-1 bg-slate-50 dark:bg-black px-3 py-2">
        <h2 className="text-sm uppercase font-semibold ml-2">
          My {currentYear} Album Rankings
        </h2>
        <ul className="flex flex-col md:gap-0 gap-4">
          {rankings.map((album, index) => (
            <RankingPosition
              key={index}
              index={index}
              album={album}
              moveAlbum={moveAlbum}
              addAlbum={addAlbum}
              openModal={openModal}
            />
          ))}
        </ul>
      </div>
      {isModalOpen && (
        <AlbumSearchModal
          closeModal={closeModal}
          addAlbum={handleAlbumSelect}
        />
      )}
    </div>
  );
};

RankingPosition.propTypes = {
  album: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
      }),
    ),
    artists: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ),
    release_date: PropTypes.string,
  }),
  index: PropTypes.number,
  moveAlbum: PropTypes.func,
  addAlbum: PropTypes.func,
  openModal: PropTypes.func,
};

export default Ranking;
