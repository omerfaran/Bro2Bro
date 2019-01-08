// Applying border to selected background is relevant only on choosing a background image and not on uploading media

import React from 'react';
import classes from './DisplayUserMedia.css';

import Auxiliery from '../../../hoc/Auxiliery'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const displayUserMedia = (props) => {
    const mediaThumbnail = props.media.map(media => (
        <div className={classes.Item} key={media.key}>
            <img style={{border: media.imageURL === props.currentBackground ? '4px solid #3498db' : null }} onClick={() => props.selectBackground(media.imageURL)} src={media.imageURL} alt="Media"/>
            <FontAwesomeIcon onClick={() => props.deleteMediaItem(media)} className={classes.faDelete} icon="times"/>
        </div>
    ))
    
    return (
        <Auxiliery>{mediaThumbnail}</Auxiliery>
    )
}

export default displayUserMedia;