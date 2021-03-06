import ReactDOM from "react-dom";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

// Keep this before app.tsx
import "./styles/index.scss";
import App from "./App.tsx";

const rootElement = document.getElementById("root");

ReactDOM.render(<App />, rootElement);
