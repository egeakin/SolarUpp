import "react-app-polyfill/ie11";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
//import * as serviceWorker from './serviceWorker';
import { HashRouter } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import { Ion } from "cesium";


Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzOTRkMjdhOS04YWE2LTRhYjEtYWE1Zi1iZmJmOTFkMTE4MjUiLCJpZCI6Mjc1MDgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODk2MjcyODR9.fVpbgWlux0gwcPWXnxt04Yo-ZB9-IaUR43RQAHvAYu4";

ReactDOM.render(
  <HashRouter>
    <ScrollToTop>
      <App></App>
    </ScrollToTop>
  </HashRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
