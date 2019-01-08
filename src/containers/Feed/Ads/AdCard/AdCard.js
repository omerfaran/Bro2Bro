import React from 'react';

const adCard = (props) => (
    <div style={{cursor: 'pointer'}}>
        <img className="mb-2" style={{height: '100%', width: '100%'}} src={props.pic} alt="Ad"/>
        <h2 className="mb-2" style={{fontStyle: 'italic'}}>{props.title}</h2>
        <p className="mb-4">{props.content}</p>
    </div>
    )

export default adCard;