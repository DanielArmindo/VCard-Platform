import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./assets/temp.css";
import { Provider } from "react-redux";

import store from "./stores";
import { routes } from "./router/index";

// store.subscribe(() => console.log(store.getState()))

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>
  </React.StrictMode>,
);
