import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';

import Input from '../../../components/UI/Form/Input/Input';
import Backdrop from '../../../components/UI/Backdrop/Backdrop';
import Spinner from '../../../components/UI/Spinner/Spinner';

import LocAutoComplete from '../../../components/UI/Form/Location/LocAutoComplete/LocAutoComplete';
import {LoginInputs, RegisterInputs} from './LoginInputs/LoginInputs'; // input elements for this.state.form

import  classes from './LoginForm.css';
import cx from 'classnames'

class RevisionForm extends Component {
    state = {
        locationValidation: null,
        form: RegisterInputs        
    }

    componentWillUpdate(nextProps) {
        if (this.props.userDetails !== nextProps.userDetails) {
            const updatedForm = {...this.state.form}
            for (let key in nextProps.userDetails) {
                if (updatedForm[key]) {
                    const updatedValue = {...updatedForm[key]};
                    updatedValue.value = nextProps.userDetails[key];
                    updatedForm[key] = updatedValue
                }
            }
            this.setState({form: updatedForm})
        }
  
    }

    checkLocation = (e) => {
        const updatedForm = {...this.state.form};
        const updatedValue = {...updatedForm.location};
        updatedValue.validation.errMessage = '';
        if (e == null) e = '';
        updatedValue.value = e;
        updatedForm.location = updatedValue;
        this.setState({form: updatedForm})
    }

    inputChangedHandler = (event) => {
        const updatedForm = {...this.state.form};
        const updatedValue = {...updatedForm[event.target.name]};
        updatedValue.value = event.target.value;
        updatedValue.validation.errMessage = '';
        updatedForm[event.target.name] = updatedValue;
        this.setState({form: updatedForm})
    }

    checkValidation = () => {
        let error = false
        const updatedForm = {...this.state.form};
        for (let key in this.state.form) {
            const updatedField = {...updatedForm[key]};
            const fieldValidation = {...updatedField.validation};
            if (this.state.form[key].validation.required && this.state.form[key].value == '') {
                fieldValidation.errMessage = 'is required';
                updatedForm[key].validation = fieldValidation;
                error = true;
            } else if (this.state.form[key].validation.minLength > this.state.form[key].value.length ) {
                fieldValidation.errMessage = ' must be at least ' 
                + this.state.form[key].validation.minLength + ' characters'
                updatedForm[key].validation = fieldValidation;
                error = true;
            } else {
                fieldValidation.errMessage = '';
                updatedForm[key].validation = fieldValidation;
            }
        }
        if (error) {
            this.setState({form: updatedForm});
            return false;
        } else return true;
    }
    
    formSubmit = (event) => { 
        event.preventDefault();
        if (this.checkValidation()) this.props.onAuth(this.state.form, this.state.formType, this.props.history);

    }

    changeInputs = (type) => {
        if (type == 'LoginInputs') this.setState({form: LoginInputs});
        if (type == 'RegisterInputs') this.setState({form: RegisterInputs})
    }


    render() {
        if (this.props.error) {
            const FBerror = this.props.error.response.data.error.message;
            if (FBerror == 'EMAIL_NOT_FOUND') this.state.form.email.validation.errMessage = ' is incorrect';
            if (FBerror == 'EMAIL_EXISTS') this.state.form.email.validation.errMessage = ' already exists';
            if (FBerror == 'INVALID_EMAIL') this.state.form.email.validation.errMessage = ' already exists';
            if (FBerror == 'INVALID_PASSWORD') this.state.form.password.validation.errMessage = ' is incorrect';
            
            this.props.error.response.data.error.message = '';
        }
        
        let inputTypesArray = [];
        for (let key in this.state.form) {
            inputTypesArray.push({
                id: key,
                config: this.state.form[key]
            })
        }
        let inputTypes = inputTypesArray.map(input => {
            if (input.config.type == 'location') return <
                Input errMessage={input.config.validation.errMessage} 
                changeLocation={this.checkLocation} value={input.config.value} changed={this.inputChangedHandler} label="Location" inputtype="location" />;

            return (<Input HTMLinputs={input.config.html}
            errMessage={input.config.validation.errMessage}
            key={input.id}
            name={input.id}
            value={input.config.value}
            changed={this.inputChangedHandler}
            label={input.config.label}/>)
        })
        
        return (
            <div className={classes.Card}>             
                <div className={cx("card-header", classes.CardHeader)}>
                    <ul className="nav nav-tabs card-header-tabs">
                        <li className="nav-item">
                            <a className="nav-link active">Your Details</a>
                        </li>
                    </ul>
                </div>
                <div className="card-body">
                    <div className="tab-content">
                        <div role="tabpanel" className="tab-panel" id="signup-form">
                        
                        {this.props.loading && (<div><Backdrop show/><Spinner/></div>)}
                        <form onSubmit={this.formSubmit}>
                            <div className="form-group">
                                <div style={{textAlign: 'center'}}>
                                    {inputTypes}                  
                                </div>  
                                <button btnType="Success">Create Account</button>                      
                            </div>
                        </form>
                        </div>
                <div role="tabpanel" className="tab-panel active" id="login-form">
                </div>
            </div>
            </div>
       </div>

        )
    }
}

export default RevisionForm;