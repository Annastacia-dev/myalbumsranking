import { FaSpinner } from "react-icons/fa";
import { useState, useEffect } from "react";

const Loader = () => {
  const loadingMessages = [
    "Cranking up the jams...",
    "Tuning the airwaves...",
    "Dropping the bass...",
    "Spinning some sick beats...",
    "Turning up the volume...",
    "Finding the perfect groove...",
    "Fetching the beats, hold tight!",
    "Digging through the crates...",
    "Preparing your sonic journey...",
    "Hold on, we're making it funky...",
    "Just a sec, we're bringing the noise...",
  ];

  // Pick a random message on mount
  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    setMessage(loadingMessages[randomIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-[50vh]">
      <FaSpinner className="8xl animate-spin" />
      <p className="text-base font-semibold text-center">{message}</p>
    </div>
  );
};

export default Loader;
