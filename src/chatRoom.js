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
        allUsers: state.allUsers,
        users: state.chatUsers,
        messages: state.messages
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
        this.handleEnter = this.handleEnter.bind(this);
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
        this.setState({
            message: ''
        })
    }
    handleEnter(e) {
        if (e.key == "Enter") {
            e.preventDefault();
            this.handleClick();
        }
    }
    generateChat(arr) {
        if (arr && this.props.allUsers) {
            let userData = this.props.allUsers;
            let messageList = arr.map((arrItem) => {
                for (var i = 0; i<userData.length; i++) {
                    if (userData[i].id == arrItem.user_id) {
                        arrItem.img = userData[i].pic_url || "https://s3.amazonaws.com/fluxlymoppings/pics/yEp--cx3qKRjQJk6NEhTJupEK3-mGuar.jpg";
                        arrItem.name = userData[i].first + " " + userData[i].last;
                    }
                }
                arrItem.date = (new Date(arrItem.created_at).toLocaleString())
                return (
                <div key={arrItem.id} className={styles.messageline}>
                    <img src={arrItem.img} className={styles.otherChatUserPic}/>
                    <span className={styles.textspan}>
                        {arrItem.message}
                    </span>
                    <div className={styles.userinfo}>
                        {arrItem.date} <br/>
                        {arrItem.name}
                    </div>
                </div>
                )
            })
            messageList = messageList.slice(-10);
            return messageList;
        }
    }
    componentDidMount() {
        initChat()
    }
    componentWillUnmount() {
        leaveChat();
    }
    componentDidUpdate() {
        this.elem.scrollTop = 10000000;
    }
    render() {
        return(
            <div>
                <h2> <i>ENEMIES, FOES, UNKNOWNS ABOUND...FLIP YOUR COMMS SWITCH SHOULD YA BE DARIN' </i></h2>
                <div className={styles.chatwindow}>
                    <div className={styles.leftchat}>
                        <div className={styles.chatbox} ref={elem => (this.elem = elem)}>
                            <div className={styles.innerBox}>
                                {this.generateChat(this.props.messages)}
                            </div>
                        </div>
                        <textarea type="text" value={this.state.message} onKeyPress={this.handleEnter} onChange={this.handleInputChange} name="message" placeholder="Show off your godliness with language"  required />
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
