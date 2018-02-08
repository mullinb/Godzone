import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';
import { HashRouter, Route, BrowserRouter } from 'react-router-dom';
import Welcome from './welcome';
import App from './app';
import styles from "../stylesheets/stylesheet.css";
import * as io from 'socket.io-client';


import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reduxPromise from 'redux-promise';
import { reducer } from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

let guestRouter = (
    <HashRouter>
        <Welcome />
    </HashRouter>
);

let userRouter = (
    <Provider store={store}>
        <App />
    </Provider>
);

let router = location.pathname === "/welcome" ? guestRouter : userRouter;

ReactDOM.render(router, document.querySelector('main'));
