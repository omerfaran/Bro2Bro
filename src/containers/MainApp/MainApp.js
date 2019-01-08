import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';

import {databaseDictionary} from '../../APIs/EnumDictionary/database';

import Modal from '../../components/UI/Modal/Modal';
import Backgrounds from '../Navbar/Backgrounds/Backgrounds';

import * as actions from '../../store/actions/index';

import PageNotFound from '../../components/Profile/PageNotFound/PageNotFound';

import NavBar from '../Navbar/Navbar';
import BrowseBros from '../BrowseBros/BrowseBros';
import Profile from '../../components/Profile/Profile';
import MyProfile from '../../components/MyProfile/MyProfile';
import Feed from '../Feed/Feed';
import classes from './MainApp.css';

import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Spinner from '../../components/UI/Spinner/Spinner';

import Auxiliery from '../../hoc/Auxiliery';

import { Route } from 'react-router-dom';

class MainApp extends Component  {
    state = {
        user: {
            imageURL: null
        },
        userConnectedRef: databaseDictionary.userConnectedRef,
        usersRef: databaseDictionary.usersRef,
        backgroundsRef: databaseDictionary.backgroundsRef,
        changeBackground: false,
        forceBackdrop: false,
        backgroundURL: '',
        startedLoading: false
    }

    componentDidMount() {
        this.getUserHandler();
    }

    componentDidUpdate() {
        this.getUserHandler();
    }

    componentWillUnmount() {
        if (this.props.localId) {
            this.state.usersRef.child(this.props.localId).off();
        }
        this.state.userConnectedRef.off();
        this.state.backgroundsRef.off();
    }        

    getUserHandler = () => {
        if (this.props.isAuth && this.state.startedLoading === false) {
            this.getUser();    
        } 
    }

    getUser = () => {
        this.setState({startedLoading: true})
        this.state.userConnectedRef.on('value', snap => {
            if (snap.val() === true) {
                
                // Set user's online status; remove on disconnect
                this.state.usersRef.child(this.props.localId).update({is_online: 'yes'});
                this.state.usersRef.child(this.props.localId).onDisconnect().update({is_online: 'no'});

                // Read user data
                this.state.usersRef.child(this.props.localId).on('value', snap => {

                    this.setState({
                        user: {
                            imageURL: snap.val().imageURL,
                            firstName: snap.val().first_name,
                            lastName: snap.val().last_name,
                            age: snap.val().age,
                            location: snap.val().location,
                            email: snap.val().email,
                            status: snap.val().status
                        }
                    })
                })
                this.addListeners();
            }
        })
    }

    addListeners = () => {
        // Listen to background picture changes
        this.state.backgroundsRef.child(this.props.localId +'/current_background/imageURL').on('value', snap => {
            if (snap.val() && snap.val() !== 'none') {
                this.setState({backgroundURL: snap.val()})
            } else {
                this.setState({backgroundURL: ''})
            }
        })
        // Listen to profilce pic change
        this.state.usersRef.child(this.props.localId).child('imageURL').on('value', snap => {
            if (snap.val()) {
                const updatedUser = {...this.state.user}
                updatedUser.imageURL = snap.val();
                this.setState({user: updatedUser})
            }
         })
    }

    toggleBackdrop = () => {
        this.setState(prevState => ({forceBackdrop: !prevState.forceBackdrop}))
    }
    
    changeBackground = () => {
        this.setState({changeBackground: true})
    }
    logoutHandler = () => {
        this.state.usersRef.child(this.props.localId).update({is_online: 'no'}).then(() => {
            this.state.usersRef.onDisconnect().cancel();
            this.props.Logout()
        });
        
    }
    render() {
        let MainAppBrowse = null;
        let MainAppAxios = (
            <div>
                <Backdrop show/><Spinner/>
            </div>
        )
        if (this.state.user.firstName) {
            MainAppAxios = (
            <div style={{marginTop: '8rem'}}>
                <Switch>
                    <Route path="/" exact render={() => <Feed userDetails={this.state.user} localId={this.props.localId}/>}/> 
                    <Route path={"/profile/:username"} exact render={(props) => <Profile {...props}
                    ownName={this.state.user.firstName + ' ' + this.state.user.lastName} 
                    ownImage={this.state.user.imageURL} 
                    localId={this.props.localId}/>} />
                    <Route path={"/profile"} exact render={() => <MyProfile userDetails={this.state.user} localId={this.props.localId}/>} />
                    {/* Any other page will be considered unknown: */}
                    <Route path="/browse" exact/>
                    <Route path={"/"} component={PageNotFound}/>
                </Switch>
            </div>
            )
            MainAppBrowse = ( // is seperated to be moved outside of bootstrap container
            <Route path="/browse" exact render={() => <BrowseBros localId={this.props.localId}/>}/>
            )
            }

        return (
            <Auxiliery>
            {this.props.isAuth && (
                     <div className={classes.DashBoard} style={{backgroundImage: 'url(' + this.state.backgroundURL + ')'}}>
                     {MainAppBrowse}
                     <div className="container" style={{maxWidth: 1400}}>
                     
                     {MainAppAxios}
     
                     <NavBar 
                         imageURL={this.state.user.imageURL} 
                         logout={this.logoutHandler}
                         localId={this.props.localId}
                         changeBackground={this.changeBackground}
                         />                    
                     </div>
     
                     <Modal show={this.state.changeBackground} 
                         modalClosed={() => !this.state.forceBackdrop && this.setState({changeBackground: false})}>
                         <Backgrounds
                         toggleBackdrop={this.toggleBackdrop} 
                         modalClosed={() => this.setState({changeBackground: false})} localId={this.props.localId}/>
                     </Modal>
                 </div>
            )}
            </Auxiliery>    
           )
       }
    }

const mapStateToProps = state => {
    return {
        isAuth: state.token !== null,
        localId: state.localId,
        token: state.token,
        userDetails: state.userDetails
    }
}

const mapDispatchToProps = dispatch => {
    return {
        Logout: () => dispatch(actions.logout()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(MainApp);