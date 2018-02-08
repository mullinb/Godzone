import React from 'react';
import { HashRouter, Route, BrowserRouter, Switch, Link } from 'react-router-dom';
import axios from './axios';
import Footer from './footer';
import SelfProfile from './selfProfile';
import OtherProfile from './otherProfile';
import FourOhFour from './404';
import { ConnectedFriendsPage } from './friendsPage';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                id: '',
                first: '',
                last: '',
                picUrl: '',
                bio: ''
            }
        }
        this.getUserData = this.getUserData.bind(this);
        this.displayNewPP = this.displayNewPP.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }
    getUserData () {
        axios.get("/selfUser")
        .then(({data}) => {
            let {id, first, last, bio, picUrl} = data.userInfo;
            this.setState({
                user: {
                    id: id,
                    first: first,
                    last: last,
                    bio: bio || "gughughguhgugh",
                    picUrl: picUrl || "https://s3.amazonaws.com/fluxlymoppings/pics/yEp--cx3qKRjQJk6NEhTJupEK3-mGuar.jpg"
                }
            })
        })
    }
    logoutUser() {
        location.replace('/');
    }
    componentDidMount() {
        this.getUserData();
    }
    displayNewPP(imgUrl) {
        this.setState({
            user: {
                id: this.state.user.id,
                first: this.state.user.first,
                last: this.state.user.last,
                picUrl: imgUrl,
                bio: this.state.user.bio,
            }
        })
    }
    updateBio(newBio) {
        this.setState({
            user: {
                id: this.state.user.id,
                first: this.state.user.first,
                last: this.state.user.last,
                picUrl: this.state.user.picUrl,
                bio: newBio
            }
        })
    }
    // updateUserState({id, first, last, picUrl, bio}) {
    //     this.setState({
    //         user: {
    //             id: id || this.state.user.id,
    //             first: first || this.state.user.first,
    //             last: last || this.state.user.last,
    //             picUrl: picUrl || this.state.user.picUrl,
    //             bio: bio || newBio
    //         }
    //     })
    // }
    render() {
        return (
            <BrowserRouter>
                <div>
                    <h1>THESE WALLS HOUSE NO FALSE GODS</h1>                <br></br>
                <div>
                    <Switch>
                        <Route exact path="/" render={() => {
                            return (<SelfProfile user={this.state.user} updateBio={this.updateBio} displayNewPP={this.displayNewPP} />)
                        }} />
                        <Route exact path="/user/:id" render={(props) => {
                            if (this.state.user.id==props.match.params.id) {
                                props.history.push('/');
                                return null;
                            } else if (this.state.user.id) {
                                return (<OtherProfile match={props.match.params.id} user={this.state.user} displayNewPP={this.displayNewPP} />)
                            } else {
                                return null
                            }
                        }}  />
                        <Route exact path="/friends" component={ ConnectedFriendsPage }/>
                        <Route path="*" render={() => {
                            return (<FourOhFour logoutUser={this.logoutUser} />)
                        }}  />
                    </Switch>
                </div>
                <Footer logoutUser={this.logoutUser}/>
                </div>
            </BrowserRouter>
        )
    }
}
