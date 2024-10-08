import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";

const Tutorial = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-black p-6 shadow-lg dark:shadow-white/10 border dark:border-white/10 max-w-[80vw] w-full rounded relative md:text-sm text-xs overflow-y-scroll">
        <div className="md:flex flex-col gap-2 hidden">
          <h2 className="text-xl font-semibold mb-4">How to Rank Albums</h2>
          <p className="mb-2">
            1. Drag albums from the list to the ranking section.
          </p>
          <p className="mb-2">
            2. Adjust rankings by dragging albums within the ranking list.
          </p>
          <img
            src="desktoptutorial.png"
            alt="Desktop Tutorial"
            className="mb-4 w-full rounded"
          />
        </div>
        <div className="md:hidden flex flex-col gap-2">
          <p className="mb-2">
            1. Use the &quot;Add Album&quot; button to search for and add albums
            manually.
          </p>
          <p className="mb-2">
            2. Adjust rankings by dragging albums within the ranking list.
          </p>
          <img
            src="mobiletutorial.png"
            alt="Screenshot 1"
            className="mb-4 w-full"
          />
        </div>
        <button
          className="text-lg px-4 py-2 rounded mt-4 absolute top-2 right-3"
          onClick={onClose}
        >
          <IoClose />
        </button>
      </div>
    </div>
  );
};

export default Tutorial;

Tutorial.propTypes = {
  onClose: PropTypes.func,
};
