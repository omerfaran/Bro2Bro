import React, { Component } from 'react';

import Autocomplete from 'react-google-autocomplete';
import verifyLocation from '../verifyLocation/verifyLocation';

import cx from 'classnames';

import classes from './LocAutoComplete.css'


class LocAutoComplete extends Component {
    state = {
        locationValidation: null
    }

    componentDidUpdate(nextProps, nextState) {
        if (this.props.location !== null && this.props.location !== nextProps.location) {
            this.checkLocation(this.props.location)
        }
    }

    checkLocation = (e) => {
        this.setState({locationValidation: e})
        this.props.changeLocation(e);
    }

    render() {
        return (
            <div style={{position: 'relative'}}>
                {verifyLocation(this.state.locationValidation, this.props.reposition)}
                <Autocomplete
                    className={cx(classes.GoogleComplete, "form-control", classes.Input)}
                    onPlaceSelected={(place) => {
                    }}
                    types={['(regions)']}
                    haveri={this.checkLocation.bind(this)}
                />
            </div>
        )
    }
}

export  default LocAutoComplete;

