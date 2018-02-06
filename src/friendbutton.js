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
                ['Forge Alliance', 'Abandon Alliance Attempt', 'Allied', 'Alliance Denied', 'Alliance Abandoned', 'You Have Excommunicated This False God', 'Feuding'],
                ['Forge Alliance', 'Accept Divine Alliance?', 'Allied', 'Alliance Denied', 'Forge Alliance', 'You Have Been Excommunicated', 'Feuding']
            ],
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
        axios.get("/friendstatus/" + id)
        .then(({data}) => {
            this.setState({
                status: data.friendRequestStatus,
                initiator: data.friendRequestInitiator
            })
        })
    }
    handleClick(e, id) {
        console.log(this.state.status)
        if (true) {
            if (true) {
                axios.post("/friendsmanager", {
                    status: this.state.status,
                    initiator: this.state.initiator,
                    id: this.props.user.id
                })
                .then(({data}) => {
                    console.log(data)
                    this.setState({
                        status: data.friendRequestStatus,
                        initiator: data.friendRequestInitiator
                    })
                    if (this.state.status===2) {
                        this.setUnclickable();
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
                <div> {this.state.buttonText[this.state.initiator][this.state.status]} </div>
            )
        }
    }
}
