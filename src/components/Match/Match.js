import React from 'react';

import cx from 'classnames';
import classes from './Match.css';


const match = (props) => {

    let isOnlineButton = null;
    if (props.online === 'yes') isOnlineButton = (<img className={classes.buttonIcon} src={require('../../assets/icons/green-button.png')} alt="Online"></img>)
    if (props.online === 'no') isOnlineButton = (<img className={classes.buttonIcon} src={require('../../assets/icons/red-button.png')} alt="Offline"></img>);
    
    let cardStyle = classes.CardMatches; // default style for showing matches cards deck
    if (props.conversation) cardStyle = classes.CardConversation // in converstaion window set height to 100%

    return (
        <div className="card" style={{textAlign: 'left', padding: props.padding && 15, height: props.conversation && '100%'}}>
                <img className={cx("card-img-top img-fluid img-responsive", cardStyle)} src={props.image} alt=""></img>
                <div className={cx("card-body", classes.CardBody)}>
                    <div className="card-text mb-3" style={{textShadow: '.2px .1px'}}>
                        {isOnlineButton}
                        <h4 className={classes.profileStatus}>{props.name}{props.age}</h4>
                        <p>{props.location}</p>
                    </div>
                </div>
        </div>
    )
}


export default match;