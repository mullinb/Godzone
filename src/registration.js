import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first: '',
            last: '',
            email: '',
            pass1: '',
            pass2: '',
            error: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    handleSubmit(event) {
        axios.post("/register", this.state)
        .then(({data}) => {
            if (data.success) {
                location.replace('/');
            } else {
                this.setState({
                    error: true
                })
            }
        })
    }
    render() {
        return (
            <div>
                <h3>YOU LOON. If you think you're unique, join the club:</h3>
                {this.state.error && <div> PROB LIMO </div>}
                    <ul>
                        <input type="text" value={this.state.first} onChange={this.handleInputChange} name="first" placeholder="First name"  required />
                        <input type="text" value={this.state.last} onChange={this.handleInputChange} name="last" placeholder="Last name" required />
                        <input type="text" value={this.state.email} onChange={this.handleInputChange} name="email" placeholder="Email" required />
                        <input type="password" value={this.state.pass} onChange={this.handleInputChange} name="pass1" placeholder="Password" required />
                        <input type="password" value={this.state.pass} onChange={this.handleInputChange} name="pass2" placeholder="Repeat Password" required />
                        <input type="button" value="Take Your Throne" onClick={this.handleSubmit} />
                    </ul>
                    <h3> Already godlike? <Link to="/login">Ascend</Link></h3>
            </div>
        );
    }
}
