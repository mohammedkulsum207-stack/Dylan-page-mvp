import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import BackendPanel from "./BackendPanel";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><BackendPanel /><App /></React.StrictMode>);
