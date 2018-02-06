import React from 'react';
import axios from './axios';

export default class Bio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updating: false,
            bio: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showUpdater = this.showUpdater.bind(this);
    }
    componentDidMount() {
        this.setState({
            bio: this.props.user.bio
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            bio: nextProps.user.bio
        })
    }
    showUpdater(e) {
        e.preventDefault();
        this.setState({
            updating: true
        })
    }
    handleChange(event) {
        this.setState({bio: event.target.value});
    }
    handleSubmit() {
        axios.post("/BioUpload", {
            bio: this.state.bio
        })
        .then(({data}) => {
            if (data.success) {
                this.props.updateBio(data.newBio)
            }
            this.setState({
                updating: false
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }
    render() {
        if (this.props.otherUser) {
            return(
                <div>
                    <h2>GodStory</h2>
                    <p>{this.state.bio}</p>
                </div>
            )
        } else if (this.state.updating === false) {
            return(
                <div>
                    <h2>GodStory</h2>
                    <p>{this.state.bio}</p>
                    <div>
                        <button type="submit" onClick={this.showUpdater}>
                            Edit thy GodStory, thou mustest allure the fidelitous, give on Oracular Truth (lest thou be disbelieved)
                        </button>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <h2>Edit thy GodStory, holiest of scriptures</h2>
                <textarea value={this.state.bio} onChange={this.handleChange} />
                <button type="submit" onClick={this.handleSubmit}>
                    Consecrate
                </button>
                </div>
            )
        }
    }
}
