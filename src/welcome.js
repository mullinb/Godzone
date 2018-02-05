import React from 'react';
import { HashRouter, Route, BrowserRouter, Link } from 'react-router-dom';
import axios from 'axios';
import Registration from './registration';
import Login from './login';


export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <h1>GODLY ZONE FOR GODS</h1>
                <HashRouter>
                    <div>
                        <Route exact path="/" component={ Registration } />
                        <Route exact path="/login" component={ Login } />
                    </div>
                </HashRouter>
            </div>
        )
    }
}
