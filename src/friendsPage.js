import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';
import { connect } from 'react-redux';
import { UserList } from './userList';
import { getFriends } from './actions';

const mapStateToProps = function(state) {
    return {
        friends: state.user && state.user.requests.filter((request) => request.status_code==2),
        requests: state.user && state.user.requests.filter((request) => request.status_code==1)
    };
};

const mapDispatchToProps = function(dispatch) {
    return {
        getFriends: () => dispatch(getFriends())
    };
};

class FriendsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        this.props.getFriends()
    }
    render() {
        return(
            <div>
                <div>
                    <h1> HOLY FESTOONED AND FASTENED </h1>
                    <UserList list={this.props.friends} type={1} />
                </div>
                <div>
                    <h1> YET PENDING GODSHIPS </h1>
                    <UserList list={this.props.requests} type={2} />
                </div>
            </div>
        )
    }
}

export const ConnectedFriendsPage = connect(mapStateToProps, mapDispatchToProps)(FriendsPage);
