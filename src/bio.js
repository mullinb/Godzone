import React from 'react';
import axios from 'axios';

export default class Bio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updating: false,
            bio: this.props.bio
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showUpdater = this.showUpdater.bind(this);
    }
    showUpdater(e) {
        e.preventDefault();
        this.setState({
            updating: true
        })
    }
    handleSubmit() {
        axios.post("/BioUpload", this.state.bio)
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
        if (this.state.updating === false) {
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
                <textarea/>
                </div>
            )
        }
    }
}
