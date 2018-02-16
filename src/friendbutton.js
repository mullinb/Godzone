import React from 'react';
import { Link } from 'react-router-dom';
import axios from './axios';

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 0,
            initiator: null,
            buttonText: [['Forge Alliance'],
                ['Forge Alliance', 'Abort Alliance Attempt', 'Abandon Alliance', 'Alliance Denied', 'Has Your Divine Will Changed So Flippantly? Forge Alliance', 'You Have Excommunicated This False God', 'Feuding'],
                ['Forge Alliance', 'Accept Divine Alliance?', 'Abandon Alliance', 'Has Your Divine Will Changed So Flippantly? Forge Alliance', 'Forge Alliance', 'You Have Been Excommunicated', 'Feuding']
            ],
            statusText: ['Allied', 'Alliance Denied', 'Alliance Abandoned', 'You Have Excommunicated This False God', 'This Fool Has Excommunicated You! Savagery!', 'You Have Declared A Curse Upon This False God', 'This Foe Has Cursed You', ''],
            statusId: 8,
            clickable: true
        }
        this.checkStatus = this.checkStatus.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        if (this.props.user) {
            if (this.props.user.id) {
                this.checkStatus(this.props.user.id)
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.user) {
            if (nextProps.user.id) {
                this.checkStatus(nextProps.user.id)
            }
        }
    }
    checkStatus(id) {
        axios.get("/friends/friendstatus/" + id)
        .then(({data}) => {
            this.setState({
                status: data.friendRequestStatus,
                initiator: data.friendRequestInitiator
            })
        })
    }
    handleClick(e, id) {
        if (true) {
            if (true) {
                axios.post("/friends/friendsmanager", {
                    status: this.state.status,
                    initiator: this.state.initiator,
                    id: this.props.user.id
                })
                .then(({data}) => {
                    this.setState({
                        status: data.friendRequestStatus,
                        initiator: data.friendRequestInitiator
                    })
                    if (this.state.status===2) {
                        this.setUnclickable();
                        this.setState({
                            statusId: 0
                        })
                    }
                })
            }
        } else if (this.state.status===1) {

        }
    }
    setClickable() {
        this.setState({
            clickable: true
        })
    }
    setUnclickable() {
        this.setState({
            clickable: false
        })
    }
    render() {
        if (this.state.initiator === null) {
            return null
        } else if (this.state.clickable === true) {
            return(
                <button onClick={this.handleClick}> {this.state.buttonText[this.state.initiator][this.state.status]} </button>
            )
        } else {
            return(
                <div> {this.state.statusText[this.state.statusCode]} </div>
            )
        }
    }
}
