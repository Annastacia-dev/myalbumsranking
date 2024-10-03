import Albums from "./components/Albums";
import Ranking from "./components/Ranking";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen grid md:grid-cols-2">
        <Albums />
        <Ranking />
      </div>
    </DndProvider>
  );
}

export default App;
