import React from 'react';
import globalStyles from '../../App.css';
import classes from './FeedMessage.css';

import moment from 'moment';

const timeFromNow = timestamp => moment(timestamp).fromNow();

const feedMessage = (props) => {
    let media = null;
    if (props.messageObj.media) {
        media = props.messageObj.media.map(mediaItem => (
            <img className="mt-3" 
                style={{width: '100%', cursor: 'pointer'}} src={mediaItem.imageURL} 
                key={mediaItem.key} alt="Media" onClick={props.imageClickHanlder}
                />
        ))
    }
    return (
        <div className={globalStyles.Box}>
            <div className="d-flex flex-row">
                <img src={props.messageObj.user.imageURL} className={classes.Avatar} alt="User Pic"/>
                <div className="d-flex flex-column ml-3">
                    <h6>{props.messageObj.user.fullName}</h6>
                   <p style={{fontWeight: 300}}>{timeFromNow(props.messageObj.timestamp)}</p>
                </div>
            </div>
            <p className="mt-2">{props.messageObj.content}</p>
            <div>{media}</div>
        </div>
    )
}

export default feedMessage;