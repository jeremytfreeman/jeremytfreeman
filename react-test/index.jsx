import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Header from "./Header";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);

const headerElement = document.getElementById("header");
const header = createRoot(headerElement);
header.render(<Header />);
