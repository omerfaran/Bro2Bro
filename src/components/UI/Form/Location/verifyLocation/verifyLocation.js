import React from 'react';

import classes from './verifyLocation.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const verifyLocation = (locationValidation, reposition) => {
    let positionClass = null;
    reposition ? positionClass = (classes.LocationHelperPosition) : positionClass = (classes.LocationHelperNormal);
    
    let verifyLocation = null;
    if (locationValidation !== 'false' && locationValidation !== null && locationValidation !== '') {
       
        verifyLocation = 
       (<div className={positionClass}> 
            <span>
                <p>{locationValidation}</p>
                <FontAwesomeIcon icon="check" className={classes.IconTrue} /> 
            </span>
            
       </div>)
    } else if (locationValidation === 'false') {
        verifyLocation = (
        <div className={positionClass}>
            <span>
            <p> </p>
             <FontAwesomeIcon icon="question" className={classes.IconFalse} />
            </span>
        </div>
        )
    }
    return verifyLocation;
}

export  default verifyLocation;