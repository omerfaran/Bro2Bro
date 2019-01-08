import React, { Component } from 'react';

import classes from './Filter.css';
import cx from 'classnames';

import LocAutocomplete from '../UI/Form/Location/LocAutoComplete/LocAutoComplete'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Filter extends Component {
    state = {
        locationValidation: null,
        ageFrom: 18,
        ageTo: 120,
        lastOnline: false
    }
    checkLocation = (e) => {
       this.setState({locationValidation: e})
    }

    onChange = (e) => { // set states for age boxes
        this.setState({[e.target.name]: e.target.value})
    }

    applyFilters = () => {
        this.props.applyFilters(this.state);
    }

    
    render() {

    return (
    <div className={classes.containerRed}>
        <div className={cx("p-1", classes.Padding)}>
                
                <div className={classes.Title}>
                <h5>Filters</h5>
                </div>
                
                <div className={classes.Box}>
                    <h5 className={classes.Seperator}><FontAwesomeIcon style={{verticalAlign: 'middle'}} icon="arrows-alt-h"/> Age</h5>
                    <div className="d-flex flex-row">
                        <p className="mr-2">From</p>
                        <input type="number" min="18" max="120" name="ageFrom" placeholder="18" onChange={this.onChange}></input>
                        <p className="mr-2 ml-2">to</p>
                        <input type="number" min="18" max="120" name="ageTo" placeholder="120" onChange={this.onChange}></input>
                    </div>
                </div>
             

                
                <div className={classes.Box} >
                    <h5 className={classes.Seperator}><FontAwesomeIcon icon="globe-asia"/> Location</h5>
                    <LocAutocomplete changeLocation={this.checkLocation}/>
                </div>

                <div className={classes.Box}>
                    <h5 className="mb-3"><FontAwesomeIcon icon="signal"/> Online</h5>
                
                    <label className={classes.CheckboxContainer}> 
                    <p>Order by last online</p>
                        <input type="checkbox" onChange={(e) => {this.setState({lastOnline: e.target.checked})}}>
                        </input>
                        <span className={classes.Checkmark}></span>
                    </label>
                    
                </div>
                <button className={cx("btn btn-primary mt-3 mb-3", classes.Button)} onClick={this.applyFilters}>Apply filters</button>
            </div>
        </div>
       
    )
    }
        }

export default Filter;