import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';
import { connect } from 'react-redux';
import { UserList } from './userList';
import { getFriends } from './actions';

const mapStateToProps = function(state) {
    return {
        friends: state.user && state.user.onlineNow.filter((userOnline) => {
            for (let i=0; i<state.user.requests.length; i++) {
                if (state.user.requests[i].status_code == 2 && state.user.requests[i].id == userOnline.id) {
                    return true;
                }
                return false;
            }
        }),
        others: state.user && state.user.onlineNow.filter((userOnline) => {
            for (let i=0; i<state.user.requests.length; i++) {
                if (state.user.requests[i].status_code !== 2 && state.user.requests[i].id == userOnline.id) {
                    return true;
                }
            return false;
            }
        })
    };
};

const mapDispatchToProps = function(dispatch) {
    return {
        getFriends: () => dispatch(getFriends())
    };
};

class MakeOnlineFriends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
    }
    render() {
        console.log(this.props.onlineFriends)
        return(
            <div>
                <div>
                    <h1> THESE FRIENDLY DEITIES ARE RDY TO CHAT YA UP, MAYBE LATER YOU CAN PERSONALLY ENGAGE IN GREEK DRAMATICS </h1>
                    <UserList list={this.props.friends} type={3} />
                </div>
                <div>
                    <h1> ENEMIES, FOES, UNKNOWNS ABOUND... </h1>
                    <UserList list={this.props.others} type={3} />
                </div>
            </div>
        )
    }
}

export const OnlineFriends = connect(mapStateToProps, mapDispatchToProps)(MakeOnlineFriends);
