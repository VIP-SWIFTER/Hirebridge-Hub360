import { createContext, useContext } from "react";

/** False while the intro loader is on screen; true once the page may start its entrance animations. */
export const ReadyContext = createContext(true);
export const useReady = () => useContext(ReadyContext);
