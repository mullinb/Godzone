import React from 'react';
import styles from "../stylesheets/stylesheet.css";
var classNames = require('classnames');


export default class ProfilePic extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (!this.props.user) {
            return null
        } else {
            return (<img src={this.props.user.picUrl} alt={this.props.user.first + " " + this.props.user.last} className={styles.pp + " " + styles[this.props.page]} onClick={this.props.showUploader} />
            )
        }
    }
}
