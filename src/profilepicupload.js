import React from 'react';
import ReactDOM from 'react-dom';
import axios from './axios';
import { HashRouter, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from "../stylesheets/stylesheet.css";



export default class ProfilePicUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append('file', this.fileInput.files[0])
        axios.post("/PPUpload", formData)
        .then(({data}) => {
            if (data.success) {
                this.props.displayNewPP(data.imgUrl)
            }
        })
        .catch((err) => {
            console.log(err);
        })

    }
    render() {
        if (!this.props.visible) {
            return null;
        } else {
            return (
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Upload file:
                        <input
                            type="file"
                            ref={input => {
                                this.fileInput = input;
                            }}
                        />
                    </label>
                    <br />
                    <button type="submit">
                        Submit
                    </button>
                </form>
            );
        }
    }
}
