import React from 'react';

export default class ProfilePic extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<img src={this.props.user.picUrl} alt={this.props.user.name} style={{height: "100px", width: "100px", float: "right"}} onClick={this.props.showUploader} />
        )
    }
}
