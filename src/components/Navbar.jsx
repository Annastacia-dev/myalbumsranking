import { useContext} from "react";
import { DarkModeContext } from "../contexts/DarkMode";
import { FaRegLightbulb, FaLightbulb } from "react-icons/fa6";
import { LuBadgeHelp } from "react-icons/lu";
import { MdOutlineFeedback } from "react-icons/md";

const Navbar = () => {

  const { darkMode, setDarkMode} = useContext(DarkModeContext)

  const switchMode = () => {
    setDarkMode(!darkMode)
  }

  console.log(darkMode)

  return (
    <div className="md:px-10 px-3 py-2">
      <nav className="fixed w-11/12 bg-slate-100 dark:bg-black/10 shadow dark:shadow-black/50 p-2 flex justify-between items-center rounded">
        <div className="flex items-center gap-2">
          <img src='logo2.png' className="w-6" />
          <p className="md:block hidden font-semibold text-sm text-secondary dark:text-tertiary"> my albums ranking</p>
        </div>
        <div className="flex items-center md:gap-8 gap-4 md:text-lg text-sm">
          < LuBadgeHelp />
          < MdOutlineFeedback />
          <button onClick={switchMode} >
            { darkMode ? <FaRegLightbulb /> : <FaLightbulb />}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
