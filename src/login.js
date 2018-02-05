import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            pass: '',
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
        console.log(this.state);
        axios.post("/login", this.state)
        .then(({data}) => {
            console.log(data.success);
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
                <h3>Are you truly heavenly?</h3>
                <form onSubmit={this.handleSubmit}>
                    <ul>
                        <input type="text" value={this.state.email} onChange={this.handleInputChange} name="email" placeholder="Email" />
                        <input type="text" value={this.state.pass} onChange={this.handleInputChange} name="pass" placeholder="Password" />
                        <input type="button" value="Complete ascension" onClick={this.handleSubmit} />
                    </ul>
                    <h3> If not, enfeeble yourself, before attempting <Link to="/">new godliness</Link></h3>
                </form>
            </div>
        );
    }
}
