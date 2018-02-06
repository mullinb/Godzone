import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';
import ProfilePic from './profilepic';
import ProfilePicUpload from './profilepicupload';
import Bio from './bio';



export default class SelfProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                id: '',
                first: '',
                last: '',
                picUrl: '',
                bio: ''
            },
            uploaderVisible: false,
            page: "profile"
        };
        this.showUploader = this.showUploader.bind(this);
        this.displayNewPP = this.displayNewPP.bind(this);
    }
    showUploader() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible
        })
    }
    displayNewPP(imgUrl) {
        this.props.displayNewPP(imgUrl);
        this.showUploader();
    }
    // logoutUser() {
    //     this.setState({
    //         user: {
    //             id: '',
    //             first: '',
    //             last: '',
    //             email: '',
    //             picUrl: '',
    //             bio: ''
    //         },
    //         uploaderVisible: false,
    //         page: "profile"
    //     })
    //     location.replace('/');
    // }
    render() {
        if (!this.props.user) {
            return null
        } else {
            return (
                <div>
                    <ProfilePic user={this.props.user} page={this.state.page} showUploader={this.showUploader}/>
                    <ProfilePicUpload visible={this.state.uploaderVisible} displayNewPP={this.displayNewPP}/>
                    <Bio user={this.props.user} updateBio={this.props.updateBio}/>
                </div>
            )
        }
    }
}
