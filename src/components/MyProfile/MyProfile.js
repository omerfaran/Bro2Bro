import React, { Component } from 'react';

import Auxiliery from '../../hoc/Auxiliery';
import classes from './MyProfile.css';

import LoginForm from '../../containers/Login/LoginForm/LoginForm';
import Modal from '../UI/Modal/Modal';
import ChangeProfilePic from './ChangeProfilePic/ChangeProfilePic'
import {RevisionInputs} from '../../containers/Login/LoginForm/LoginInputs/LoginInputs';

import cx from 'classnames';

class myProfile extends Component {
    state = {
        changeProfilePic: false,
        forceBackdrop: false
    }
    componentWillMount() {
        const RevisionInputsValues ={
            ...RevisionInputs,
        firstName: {...RevisionInputs.firstName, value: this.props.userDetails.firstName},
        lastName: {...RevisionInputs.lastName, value: this.props.userDetails.lastName},
        age: {...RevisionInputs.age, value: this.props.userDetails.age},
        location: {...RevisionInputs.location, value: this.props.userDetails.location},
        email: {...RevisionInputs.email, value: this.props.userDetails.email}
        }
        this.setState({RevisionInputsValues: RevisionInputsValues})
    }

    toggleBackdrop = () => {
        this.setState(prevState => ({forceBackdrop: !prevState.forceBackdrop}))
    }

    render() {
        return (
            <Auxiliery>
                <div className="row">
                    <div className="col-lg-4 col-md-12 d-flex flex-column">
                        <img className={cx("card-img-top img-fluid", classes.ProfilePic)} src={this.props.userDetails.imageURL} alt="Profile Pic"/>
                        <button onClick={() => this.setState({changeProfilePic: true})} className={cx("btn btn-primary", classes.ImageBtn)}>Change Profile Pic</button>
                    </div>
                    <div className="col-lg-8 col-md-12" >
                        <LoginForm 
                                    form={
                                        {
                                            formTypes:[
                                                {type: 'register', inputs: this.state.RevisionInputsValues, tab: 'Your Details', button: 'Save Changes'},
                                                ]
                                        }
                                    }
                                    />
                    </div>
                </div>
                <Modal show={this.state.changeProfilePic} 
                    modalClosed={() => !this.state.forceBackdrop && this.setState({changeProfilePic: false})}>
                    <ChangeProfilePic 
                    toggleBackdrop={this.toggleBackdrop} 
                    modalClosed={() => this.setState({changeProfilePic: false})} localId={this.props.localId}/>
                </Modal>              
            </Auxiliery>
            )
    
    }
  
   
}

export default myProfile;

