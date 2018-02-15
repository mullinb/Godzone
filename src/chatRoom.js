import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';
import { connect } from 'react-redux';
import { UserList } from './userList';
import { store } from './start';
import { sendChatMessage, initChat, leaveChat } from './socket';
import styles from "../stylesheets/stylesheet.css";



const mapStateToProps = function(state) {
    return {
        users: state.chatUsers,
        chatlog: state.chatlog
    };
};

class makeChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    handleClick() {
        sendChatMessage(this.state.message);
    }
    generateChat(arr) {
        if (arr) {
            const messageList = arr.map((arrItem) => {
                for (var i = 0; i<this.props.users.length; i++) {
                    if (this.props.users[i].id == arrItem.userId) {
                        arrItem.img = this.props.users[i].pic_url;
                    }
                }
                return (
                <div key={arrItem.id}>
                    <div>
                        {arrItem.message}
                    </div>
                    <div>
                        {arrItem.timestamp}
                    </div>
                    <img src={arrItem.img} className={styles.onlineUserPic}/>
                </div>
                )
            })
            return messageList;
        }
    }
    componentDidMount() {
        initChat()
    }
    componentWillUnmount() {
        leaveChat();
    }
    render() {
        return(
            <div>
                <h2> <i>ENEMIES, FOES, UNKNOWNS ABOUND...FLIP YOUR COMMS SWITCH SHOULD YA BE DARIN' </i></h2>
                <div className={styles.chatwindow}>
                    <div className={styles.leftchat}>
                        <div className={styles.chatbox}>
                            {this.generateChat(this.props.chatlog)}
                        </div>
                        <textarea type="text" value={this.state.message} onChange={this.handleInputChange} name="message" placeholder="Show off your godliness with language"  required />
                        <button onClick={this.handleClick}>JACK IN THAT MSG YEA</button>
                    </div>

                    <div className={styles.chatlist}>
                        <div> GODS THAT BE PRESENT </div>
                        <br />
                        <UserList list={this.props.users} type={4} />
                    </div>
                    <br />
                    <br />
                    <br />
                </div>
            </div>
        )
    }
}

export const chatRoom = connect(mapStateToProps)(makeChatRoom);
