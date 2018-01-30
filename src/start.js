import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { HashRouter, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Registration from './registration';
import Login from './login';
import ProfilePic from './profilepic';
import ProfilePicUpload from './profilepicupload';


class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <div>
                <h1>GODLY ZONE FOR GODS</h1>
                <HashRouter>
                    <div>
                        <Route path="/app" component={ App } />
                        <Route exact path="/" component={ Registration } />
                        <Route exact path="/login" component={ Login } />
                    </div>
                </HashRouter>
            </div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                id: '',
                name: '',
                picUrl: ''
            },
            uploaderVisible: false
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.showUploader = this.showUploader.bind(this);
        this.displayNewPP = this.displayNewPP.bind(this);
    }
    componentDidMount() {
        axios.get("/user")
        .then(({data}) => {
            let {id, name, picUrl} = data.userInfo;
            this.setState({
                user: {
                    id: id,
                    name: name,
                    picUrl: picUrl || "https://s3.amazonaws.com/fluxlymoppings/pics/yEp--cx3qKRjQJk6NEhTJupEK3-mGuar.jpg"
                }
            })
        })
    }
    showUploader() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible
        })
    }
    displayNewPP(imgUrl) {
        this.setState({
            user: {
                id: this.state.user.id,
                name: this.state.user.name,
                picUrl: imgUrl
            }
        })
        this.showUploader();
    }
    render() {
        return (
            <div>
                Doin that thing ;
                <br></br>
                <ProfilePic user={this.state.user} showUploader={this.showUploader}/>
                <ProfilePicUpload visible={this.state.uploaderVisible} display={this.displayNewPP}/>
            </div>
        )
    }
}





ReactDOM.render(
        <Welcome />,
    document.querySelector('main')
);
