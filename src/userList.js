import React from 'react';
import axios from './axios';
import { connect } from 'react-redux';
import { buttonClick, getFriends } from './actions';
import styles from "../stylesheets/stylesheet.css";
import { Link } from 'react-router-dom';


const mapStateToProps = function(state) {
    return {
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
        console.log(listItems);
        if (type===1) {
            if (listItems===undefined) {
                return <div> A PITY, YE ARE PITIFUL INDEED, A GOD WITHOUT ALLIES IS SURE TO FALL </div>
            } else {
                const list = listItems.map((listItem) =>
                    <div key={listItem.id}>
                        <Link to={"user/" + listItem.id}>{listItem.first} {listItem.last}
                            <img src={listItem.pic_url} className={styles.onlineUserPic} />
                        </Link>
                        <button name="excom" id={listItem.id} onClick={this.props.buttonClick}>unfriend</button>
                    </div>
                )
                return (
                    <div> {list} </div>
                );
            }
        } else if (type===2) {
            if (listItems===undefined) {
                return <div> YOU ARE NOT IN FAVOR, FOOL. THERE BE NO REQUESTS FOR YOUR FAVOR </div>
            } else {
                const list = listItems.map((listItem) =>
                     <div key={listItem.id}>
                         <Link to={"user/" + listItem.id}>{listItem.first} {listItem.last}
                             <img src={listItem.pic_url} className={styles.onlineUserPic} />
                         </Link>
                        <button name="accept" id={listItem.id} onClick={this.props.buttonClick}>ACCEPT ALLIANCE</button>
                        <button name="reject" id={listItem.id} onClick={this.props.buttonClick}>BRUTALLY REJECT</button>
                    </div>
                )
                return (
                    <div>{list}</div>
                );
            }
        } else if (type===3) {
            if (listItems===undefined) {
                return <div> NO ONE BE YET HERE, FRIENDLY OR DEMONIC </div>
            } else {
                const list = listItems.map((listItem) =>
                     <div key={listItem.id}>
                        <Link to={"user/" + listItem.id}>{listItem.first} {listItem.last}
                            <img src={listItem.pic_url} className={styles.onlineUserPic} />
                        </Link>
                    </div>
                )
                return (
                    <div>{list}</div>
                );
            }
        } else if (type===4) {
            const list = listItems.map((listItem) =>
                 <div key={listItem.id}>
                    <Link to={"user/" + listItem.id}>{listItem.first} {listItem.last}
                        <img src={listItem.pic_url} className={styles.chatUserPic} />
                    </Link>
                </div>
            )
            return (
                <div>{list}</div>
            );
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
