import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const root = document.getElementById("root");

if (!root) {
	console.error(
		"Failed to find the root element. Ensure <div id='root'></div> exists in your index.html",
	);
} else {
	createRoot(root).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}
