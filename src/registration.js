import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';
import { connect } from 'react-redux';
import { store } from './start';
import { addToAllUsers } from './actions'


const mapStateToProps = function(state) {
    return {
        ignore: "this"
    };
};

export default class makeRegistration extends React.Component {
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
        console.log(this.state);
        axios.post("/register", this.state)
        .then(({data}) => {
            console.log(data.success);
            if (data.success) {
                location.replace('/');
                store.dispatch(addToAllUsers(data.user))
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

export const Registration = connect(mapStateToProps)(makeRegistration);
