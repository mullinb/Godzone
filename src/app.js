import React from 'react';
import { HashRouter, Route, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import ProfilePic from './profilepic';
import ProfilePicUpload from './profilepicupload';
import Footer from './footer';
import SelfProfile from './selfProfile';
import OtherProfile from './otherProfile';
import Bio from './bio';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>THESE WALLS HOUSE NO FALSE GODS</h1>                <br></br>
            <BrowserRouter>
                <Route exact path="/" component={ SelfProfile } />
                <Route exact path="/user/:id" component={ OtherProfile } />
            </BrowserRouter>
            <Footer logoutUser={this.logoutUser}/>
            </div>
        )
    }
}
