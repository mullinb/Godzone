import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';
import styles from "../stylesheets/stylesheet.css";


export default class FourOhFour extends React.Component {
    constructor(props) {
        super(props);
        this.logoutRequest = this.logoutRequest.bind(this);
    }
    logoutRequest() {
        axios.get("/logout")
        .then(({data}) => {
            if (data.success) {
                this.props.logoutUser()
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }
    render() {
        return <div> This be a 404 but you still get that rad footer down thar, ya may even feel a bit like <span onClick={this.logoutRequest} className={styles.link}><i>descendin</i></span> or just <Link to="/"> <i>redirectin</i></Link>. </div>
    }
}
