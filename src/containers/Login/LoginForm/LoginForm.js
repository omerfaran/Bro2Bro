import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';

import Input from '../../../components/UI/Form/Input/Input';

import globalStyles from '../../../App.css';
import cx from 'classnames'

import classes from './LoginForm.css';

import Auxiliery from '../../../hoc/Auxiliery'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class LoginForm extends Component {
    state = {
        locationValidation: null,
        formType: this.props.form.formTypes[0].type, 
        form: this.props.form.formTypes[0].inputs,  // First form type passed as props
        button: this.props.form.formTypes[0].button
    }

    

    checkLocation = (e) => {
        const updatedForm = {...this.state.form};
        const updatedValue = {...updatedForm.location};
        updatedValue.validation.errMessage = '';
        if (e === null) e = '';
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
            if (this.state.form[key].validation.required && this.state.form[key].value === '') {
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
        if (this.state.formType === 'register') {
            if (this.state.form.location.value === 'false') error = true;
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

    setError = (err, type) => {
        let errState = {...this.state.form};
        type === 'email' ? errState.email.validation.errMessage = ' ' + err : errState.password.validation.errMessage = ' ' + err;
    }

    render() {
        const spinnerIcon = (
            <Auxiliery>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <FontAwesomeIcon spin icon='spinner'/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Auxiliery>
        )

        const formTypesJsx = this.props.form.formTypes.map((type, key) => {
            return (
                <li className="nav-item" key={key}>
                    <a onClick={() => this.setState({form: type.inputs, formType: type.type, button: type.button})} className={this.state.formType === type.type ? 'nav-link active' : 'nav-link'} 
                    role="tab" data-toggle="tab" href="#signup-form">{type.tab}</a>
               </li>
            )
        })
        if (this.props.error) {
            const FBerror = this.props.error.code;
            if (FBerror === 'auth/user-not-found') this.setError('is incorrect', 'email')
            if (FBerror === 'auth/email-already-in-use') this.setError('already exists', 'email')
            if (FBerror === 'auth/wrong-password') this.setError('is incorrect', 'password')
            
            this.props.error.code = '';
        }
        
        let inputTypesArray = [];
        for (let key in this.state.form) {
            inputTypesArray.push({
                id: key,
                config: this.state.form[key]
            })
        }
        let inputTypes = inputTypesArray.map((input, key) => {
            if (input.config.type === 'location') return <
                Input key={key} errMessage={input.config.validation.errMessage} 
                changeLocation={this.checkLocation} value={input.config.value} changed={this.inputChangedHandler} label="Location" inputtype="location" />;

            return (<Input HTMLinputs={input.config.html}
            readonly={input.config.html.placeholder === 'READONLY'}
            errMessage={input.config.validation.errMessage}
            key={input.id}
            name={input.id}
            value={input.config.value}
            changed={this.inputChangedHandler}
            label={input.config.label}/>)
        })
        
        return (
            <div className={globalStyles.Card}>
                <div className={cx("card-header", globalStyles.CardHeader)}>
                    <ul className="nav nav-tabs card-header-tabs">
                        {formTypesJsx}
                    </ul>
                </div>
                <div className="card-body">
                    <div className="tab-content">
                        <div role="tabpanel" className="tab-panel" id="signup-form">        
                            <form onSubmit={this.formSubmit}>
                                <div className="form-group">
                                    <div className={classes.InputGrid} style={{textAlign: 'center', margin: '0 auto'}}>
                                        {inputTypes}
                                        
                                        
                                    </div>  
                                    <button disabled={this.props.loading} className="btn btn-primary mt-2">{!this.props.loading ? this.state.button : spinnerIcon}</button>               
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

const mapStateToProps = state => {
    return {
        loading: state.loading,
        error: state.error,
    }    
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (userInputs, signType, historyProp) => dispatch(actions.auth(userInputs, signType, historyProp))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);