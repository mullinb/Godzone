import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';
import { connect } from 'react-redux';
import { UserList } from './userList';

const mapStateToProps = function(state) {
    return {
        users: state.onlineUsers
    };
};

class MakeOnlineFriends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return(
            <div>
                <h1> THESE FRIENDLY DEITIES ARE RDY TO CHAT YA UP, MAYBE LATER YOU CAN PERSONALLY ENGAGE IN GREEK DRAMATICS </h1>
                <UserList list={this.props.users} type={3} />
            </div>
        )
    }
}

export const OnlineFriends = connect(mapStateToProps)(MakeOnlineFriends);
