import React from 'react';
import classes from './Bubble.css';

const requestBubble = (props) => {
    let bubble = null;
    switch (props.relationship) {
        case 'none':
            bubble = <p onClick={props.broRequestHandler}>Click here to bro {props.theirName} so that you can start talking.</p>
            break;
        case 'sent':
            bubble = <p>You broed {props.theirName}. Please wait for their response.</p>
            break;
        case 'requested':
            bubble = <p onClick={props.broRequestHandler}>{props.theirName} broed you. Click here to accept.</p>
            break;
        case 'broed!':
            bubble = <p>You and {props.theirName} broed each other!</p>;
            break;
        default:
            break;
    }
    return (
       <div className={classes.RequestBubble}>
        <div>{bubble}</div>
       </div>
    )
}

export default requestBubble;