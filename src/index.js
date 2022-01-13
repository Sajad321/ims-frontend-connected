import React from "react";
import { render } from "react-dom";
import { HashRouter, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "@popperjs/core";
import "./assets/sass/styles.scss";
import "react-toastify/dist/ReactToastify.css";
import App from "./components/App";
import history from "./auth/history";

let root = document.createElement("div");

root.id = "root";
document.body.appendChild(root);

// const Router = () => {
//   if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
//     return (
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     );
//   } else {
//     return (
//       <HashRouter>
//         <App />
//       </HashRouter>
//     );
//   }
// };
// Now we can render our application into it
render(
  <HashRouter history={history}>
    <App />
  </HashRouter>,
  document.getElementById("root")
);
