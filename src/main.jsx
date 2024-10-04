import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { DarkModeProvider } from "./contexts/DarkMode.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DarkModeProvider>
     <App />
    </DarkModeProvider>
  </StrictMode>,
);
