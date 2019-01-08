// Custom input fields with bootstrap styling
import React, { Component } from 'react';
import cx from 'classnames';
import classes from './Input.css';

import LocAutoComplete from '../Location/LocAutoComplete/LocAutoComplete';

class Input extends Component {
    state = {
        locationValidation: null
    }

    checkLocation = (e) => {
        this.setState({locationValidation: e})
        this.props.changeLocation(e);
    }

    componentDidMount() {
        if (this.props.inputtype === 'location') {
            this.checkLocation(this.props.value)
        }
    }

    render() {
        let inputElement = <input name={this.props.name} onChange={this.props.changed} 
        className={cx("form-control", classes.Input)} 
        {...this.props.HTMLinputs} value={this.props.value} readOnly={this.props.readonly}/> // default is <input>
        
        if (this.props.inputtype === 'location') inputElement = 
        <LocAutoComplete location={this.state.locationValidation} key={Input.id} changeLocation={this.checkLocation}
         reposition/>;

         return (
            <div className={classes.InputTotal}>
               <label>{this.props.label}</label><span className={classes.Error}> &nbsp; {this.props.errMessage}</span>
               {inputElement}
            </div>
           )
           
    }
};

export default Input;