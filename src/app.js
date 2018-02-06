import React from 'react';
import { HashRouter, Route, BrowserRouter } from 'react-router-dom';
import axios from './axios';
import Footer from './footer';
import SelfProfile from './selfProfile';
import OtherProfile from './otherProfile';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    logoutUser() {
        location.replace('/');
    }
    render() {
        return (
            <div>
                <h1>THESE WALLS HOUSE NO FALSE GODS</h1>                <br></br>
            <BrowserRouter>
            <div>
                <Route exact path="/" component={ SelfProfile } />
                <Route exact path="/user/:id" component={ OtherProfile } />
                </div>
            </BrowserRouter>
            <Footer logoutUser={this.logoutUser}/>
            </div>
        )
    }
}
