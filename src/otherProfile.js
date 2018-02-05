import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';



export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        <div>
            <ProfilePic user={this.state.user} page={this.state.page} showUploader={this.showUploader}/>
            <ProfilePicUpload visible={this.state.uploaderVisible} displayNewPP={this.displayNewPP}/>
            <Bio bio={this.state.user.bio} displayNewBio={this.displayNewBio}/>
        </div>
    }
}
