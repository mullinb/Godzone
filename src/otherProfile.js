import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';



export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.getUserData = this.getUserData.bind(this);
    }
    componentDidMount() {
        this.getUserData(this.props.match.params.id);
    }
    getOtherUserData (id) {
        axios.get("/user/" + id)
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
    componentWillReceiveProps(nextProps) {
        this.getUserData(nextProps.match.params.id);
    }
    render() {
        <div>
            <ProfilePic user={this.state.user} page={this.state.page} showUploader={this.showUploader}/>
            <Bio bio={this.state.user.bio} displayNewBio={this.displayNewBio}/>
        </div>
    }
}
