import React from 'react';
import Auxiliery from '../../../hoc/Auxiliery';
import Backdrop from '../Backdrop/Backdrop';

import classes from './ModalImage.css'

const modal = (props) => {
    const posStyle = {
        '--x': props.x +'px',
        '--y': props.y +'px'
    }
    return (
        <Auxiliery>
            <Backdrop show={props.show} clicked={props.modalClosed}/>
            <div className={classes.Modal} 
            style={posStyle}>
                {props.children}
            </div>
        </Auxiliery>
        )
}


export default modal;