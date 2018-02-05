import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { HashRouter, Route, BrowserRouter } from 'react-router-dom';
import Welcome from './welcome';
import App from './app';
import styles from "../stylesheets/stylesheet.css";

let guestRouter = (
    <HashRouter>
        <Welcome />
    </HashRouter>
);

let userRouter = (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

let router = location.pathname === "/welcome" ? guestRouter : userRouter;

ReactDOM.render(router, document.querySelector('main'));
