import React from 'react';
import Auxiliery from '../../../hoc/Auxiliery';
import Backdrop from '../Backdrop/Backdrop';

import classes from './Modal.css'

const modal = (props) => (
        <Auxiliery>
            <Backdrop show={props.show} clicked={props.modalClosed}/>
            <div className={classes.Modal} 
            style={{transform: props.show ? 'translate(-50%, -50%)' : 'translate(-400%, -50%)', opacity: props.show ? '1' : '0'}}>
                {props.children}
            </div>
        </Auxiliery>
)


export default modal;