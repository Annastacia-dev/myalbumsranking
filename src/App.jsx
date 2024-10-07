import Navbar from "./components/Navbar";
import Albums from "./components/Albums";
import Ranking from "./components/Ranking";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-slate-50 dark:bg-black dark:text-white min-h-screen">
        <Navbar />
        <div className=" grid md:grid-cols-2 mt-12 md:px-10 gap-10">
          <Albums />
          <Ranking />
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
