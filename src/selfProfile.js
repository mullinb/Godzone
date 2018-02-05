import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


export default class SelfProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.state = {
            user: {
                id: '',
                first: '',
                last: '',
                email: '',
                picUrl: '',
                bio: ''
            },
            uploaderVisible: false,
            page: "profile"
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.showUploader = this.showUploader.bind(this);
        this.displayNewPP = this.displayNewPP.bind(this);
        this.getUserData = this.getUserData.bind(this);
        this.logoutUser = this.logoutUser.bind(this);
        this.updateUserState = this.updateUserState.bind(this);
    }
    componentDidMount() {
        this.getUserData();
    }
    getUserData (id) {
        id = id || '';
        axios.get("/user" + id)
        .then(({data}) => {
            let {id, first, last, bio, picUrl} = data.userInfo;
            this.setState({
                user: {
                    id: id,
                    first: first,
                    last: last,
                    bio: bio || "gughughguhgugh",
                    picUrl: picUrl || "https://s3.amazonaws.com/fluxlymoppings/pics/yEp--cx3qKRjQJk6NEhTJupEK3-mGuar.jpg"
                }
            })
        })
    }
    showUploader() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible
        })
    }
    displayNewPP(imgUrl) {
        this.setState({
            user: {
                id: this.state.user.id,
                first: this.state.user.first,
                last: this.state.user.last,
                picUrl: imgUrl,
                bio: this.state.user.bio,
            }
        })
        this.showUploader();
    }
    displayNewBio(newBio) {
        this.setState({
            user: {
                id: this.state.user.id,
                first: this.state.user.first,
                last: this.state.user.last,
                picUrl: this.state.user.picUrl,
                bio: newBio
            }
        })
    }
    updateUserState({id, first, last, picUrl, bio}) {
        this.setState({
            user: {
                id: id || this.state.user.id,
                first: first || this.state.user.first,
                last: last || this.state.user.last,
                picUrl: picUrl || this.state.user.picUrl,
                bio: bio || newBio
            }
        })
    }
    logoutUser() {
        this.setState({
            user: {
                id: '',
                first: '',
                last: '',
                email: '',
                picUrl: '',
                bio: ''
            },
            uploaderVisible: false,
            page: "profile"
        })
        location.replace('/');
    }
    render() {
            return (
                <div>
                    <ProfilePic user={this.state.user} page={this.state.page} showUploader={this.showUploader}/>
                    <ProfilePicUpload visible={this.state.uploaderVisible} displayNewPP={this.displayNewPP}/>
                    <Bio bio={this.state.user.bio} displayNewBio={this.displayNewBio}/>
                </div>
        )
    }
}
