import React from "react";
import ReactDOM from "react-dom/client";
import { MotionConfig } from "framer-motion";
import App from "./App.jsx";
import { ThemeModeProvider } from "./lib/themeMode";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </ThemeModeProvider>
  </React.StrictMode>
);
