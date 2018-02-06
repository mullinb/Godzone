import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';
import ProfilePic from './profilepic';
import FriendButton from './friendbutton';
import Bio from './bio';

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otherUser: {
                id: '',
                first: '',
                last: '',
                bio: '',
                picUrl: '' || "https://s3.amazonaws.com/fluxlymoppings/pics/yEp--cx3qKRjQJk6NEhTJupEK3-mGuar.jpg"
            },
            page: "profile"
        };
        this.getOtherUserData = this.getOtherUserData.bind(this);
    }
    componentDidMount() {
        this.getOtherUserData(this.props.match);
    }
    componentWillReceiveProps(nextProps) {
        this.getOtherUserData(nextProps.match);
    }
    getOtherUserData (id) {
        axios.get("/userProfile/" + id)
        .then(({data}) => {
            let {id, first, last, bio, picUrl} = data.userInfo;
            this.setState({
                otherUser: {
                    id: id,
                    first: first,
                    last: last,
                    bio: bio || "gughughguhgugh",
                    picUrl: picUrl || "https://s3.amazonaws.com/fluxlymoppings/pics/yEp--cx3qKRjQJk6NEhTJupEK3-mGuar.jpg"
                }
            })
        })
    }
    render() {
        return (
            <div>
                <ProfilePic user={this.state.otherUser} page={this.state.page}/>
                <FriendButton user={this.state.otherUser}/>
                <Bio otherUser={true} user={this.state.otherUser}/>
            </div>
        )
    }
}
