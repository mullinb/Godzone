import React from 'react';
import axios from './axios';
import { connect } from 'react-redux';
import { buttonClick, getFriends } from './actions';


const mapStateToProps = function(state) {
    return {
        friends: state.user && state.user.friends,
        requests: state.user && state.user.requests
    };
};

const mapDispatchToProps = function(dispatch) {
    return {
        buttonClick: (e) => dispatch(buttonClick(e)),
        updateFriends: () => dispatch(getFriends())
    }
}

class Lists extends React.Component {
    constructor(props) {
        super(props);
        this.generateList = this.generateList.bind(this);
    }
    generateList(listItems, type) {
        if (type===1) {
            if (listItems===undefined) {
                return <div> You have no friends </div>
            } else {
                const list = listItems.map((listItem) =>
                    <div key={listItem.id}>
                        {listItem.id}
                        <button name="excom" id={listItem.id} onClick={this.props.buttonClick}>unfriend</button>
                    </div>
                )
                return (
                    <div>{list}</div>
                );
            }
        } else if (type===2) {
            if (listItems===undefined) {
                return <div> YOU ARE NOT IN FAVOR, FOOL. THERE BE NO REQUESTS FOR YOUR FAVOR </div>
            } else {
                const list = listItems.map((listItem) =>
                     <div key={listItem.id}>
                        {listItem.id}
                        <button name="accept" id={listItem.id} onClick={this.props.buttonClick}>ACCEPT ALLIANCE</button>
                        <button name="reject" id={listItem.id} onClick={this.props.buttonClick}>BRUTALLY REJECT</button>
                    </div>
                )
                return (
                    <div>{list}</div>
                );
            }
        }
    }
    render() {
        if (this.props.list) {
            return (
                <div>
                    {this.generateList(this.props.list, this.props.type)}
                </div>
            )
        } else {
            return null
        }
    }
}

export const UserList = connect(mapStateToProps, mapDispatchToProps)(Lists);
