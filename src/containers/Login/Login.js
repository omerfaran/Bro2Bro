import React, { Component } from 'react';

import {LOGO, YOUTUBE as YOUTUBE_LINK} from '../../APIs/EnumDictionary/Images';

import LoginForm from './LoginForm/LoginForm';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Spinner from '../../components/UI/Spinner/Spinner'


import classes from './Login.css';

import {LoginInputs, RegisterInputs} from './LoginForm/LoginInputs/LoginInputs';

class Login extends Component {
    state = {
        loading: false
    }

    render() {
        return (
            <div className={classes.Wrapper}>
            {this.state.loading ? (<div><Backdrop show/><Spinner/></div>) :
        
        <div className="container" style={{maxWidth: 1300}}>
        <div className={classes.HeaderWrapper}>
        <header className="row justify-content-center">
            <img className={classes.BroLeft} src={LOGO.LOGO_PARTIAL} alt="Logo"/>
            <img className={classes.BroRight} src={LOGO.LOGO_PARTIAL} alt="Logo"/>
            <img className={classes.BroComplete} src={LOGO.LOGO_WHOLE} alt="Logo"/>
        </header>
        </div>
        <div className="row">
            <div className="col-lg-6">
                <LoginForm 
                form={
                    {
                        formTypes:[
                            {type: 'register', inputs: RegisterInputs, tab: 'Sign Up', button: 'Create Account'},
                            {type: 'login', inputs: LoginInputs, tab: 'Login', button: "Let's go!"} ]
                    }
                }
                history={this.props.history}
                showSpinner={this.spinnerHandler}
                />
            </div>
            <div className="col-lg-6">
                <iframe title="Silicon Valley" className={classes.Iframe} width="100%" src={YOUTUBE_LINK} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
            </div>
        </div>        
    </div>
        
        }    
            </div>
        )
    }
}

export default Login;