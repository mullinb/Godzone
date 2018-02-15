import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';
import styles from "../stylesheets/stylesheet.css";


export default class Footer extends React.Component {
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
        return (
            <div className={styles.footer}>
                HERE LIE LON FOOTER WELPS, BUT EVEN THAT GOOD FOOT STINK OF HIGHEST HEAVEN ARCHES. AMONGST THEM BE YON <Link to="/friends">FRIENDLIES</Link>
                <br />

                    OR MAYBE THON GODLY FRAME OF GOSSIP IST MAL CURIOUS, CURIOSO INDEED, C'É QUALCUNO CHI É <Link to="/onlinenow">JETZT ATOP OLYMPUS</Link>??
                    <br />

                    YA CAN EVEN <Link to="/chat">CHAT RIGHT THIS INSTANT WHOA</Link>??
                <p> Shouldst yon sickly mortal will it done, <span onClick={this.logoutRequest} className={styles.link}> descendin back to earthly ways</span>. </p>
            </div>
        )
    }
}
