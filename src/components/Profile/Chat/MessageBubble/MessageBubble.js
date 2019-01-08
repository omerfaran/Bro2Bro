import React from 'react';
import classes from './Bubble.css';

import Auxiliery from '../../../../hoc/Auxiliery';

const messageBubble = (props) => {
    let media = null;
    if (props.media) {
        media = props.media.map(mediaItem => (
            <img onClick={props.imageClickHandler} className="mt-3" style={{width: '100%', cursor: 'pointer'}} 
            src={mediaItem.imageURL} key={mediaItem.key} alt="Media"/>
        ))
    }
    
    let messageDate = null;
    if (props.messageDate) messageDate = 
        <h6 className="mb-2 mt-2" style={{textAlign: 'center', textTransform: 'uppercase'}}>{props.messageDate}</h6>

    return (
        <Auxiliery>
            {messageDate}
            <div className={props.side === 'left' ? classes.LeftBubble : classes.RightBubble}>
                <p>{props.content}<br/>{media}</p>
            </div>
        </Auxiliery>
    )
 
}

export default messageBubble;