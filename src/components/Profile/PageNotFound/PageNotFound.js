import React from 'react';
import classes from './PageNotFound.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const pageNotFound = () => (
    <div className={classes.Box}>
    <FontAwesomeIcon style={{fontSize: '10rem'}} icon="frown"/>
    <h1 className="mt-4 mb-4">Oops . . . Looks like this page is not available anymore.</h1>
    </div>
)

export default pageNotFound;