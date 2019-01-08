import React, { Component } from 'react';
import {databaseDictionary} from '../../APIs/EnumDictionary/database';

import FeedMessage from './FeedMessage';
import MessageForm from './MessageForm';
import Match from '../../components/Match/Match';
import Ads from './Ads/Ads';

import ModalImage from '../../components/UI/ModalImage/ModalImage';

class Feed extends Component {
    state = {
        feedMessages: [],
        feedRef: databaseDictionary.feedRef,
        messagesLoading: true,
        clickedImageURL: null,
        mousePos: {
            x: null,
            y: null
        }
    }

    componentDidMount() {
        // listener for new feed messages
        if (this.props.localId) {
            this.addMessageListener();
        }
    }

    addMessageListener = () => {
        let loadedMessages = [];
        this.state.feedRef.on('child_added', snap => {
            loadedMessages.push(snap.val());
            this.setState({
                feedMessages: loadedMessages,
                messagesLoading: false
            })
        })
    }

    imageClickHandler = (e) => {
        this.setState({
            clickedImageURL: e.target.src,
            mousePos: {
                x: e.nativeEvent.screenX,
                y: e.nativeEvent.screenY
            }
        }); 
    }


    componentWillUnmount() {
        // remove listeners
        this.state.feedRef.off()
    }

    render() {
        let reverseFeedMessages = [];
        if (this.state.feedMessages.length > 0) {
            reverseFeedMessages = [...this.state.feedMessages];
            reverseFeedMessages.reverse();
        }
        
        let modal;
        if (this.state.mousePos.x) modal =
        (
            <ModalImage show={this.state.clickedImageURL} 
                modalClosed={() => this.setState({clickedImageURL: null, mousePos: {
                    x: null,
                    y: null
                }})}
                x={this.state.mousePos.x}
                y={this.state.mousePos.y}
                >
                    <img style={{width: '100%', height:'100%'}} src={this.state.clickedImageURL} alt=""/>
                </ModalImage>
        )
        return (
            <div className="row">
                <div className="col-md-4">
                    <Match
                    name={'Welcome, ' + this.props.userDetails.firstName}
                    status={this.props.userDetails.status} 
                    image={this.props.userDetails.imageURL}
                    padding />  
                </div>
                <div className="col-md-5">
                    <MessageForm feedRef={this.state.feedRef} userDetails={this.props.userDetails} localId={this.props.localId}/>

                    {reverseFeedMessages.length > 0 && reverseFeedMessages.map(messageObj => (
                        <FeedMessage messageObj={messageObj} 
                            localId={this.props.localId} key={messageObj.timestamp} 
                            imageClickHanlder={this.imageClickHandler}
                            />
                    ))}
                </div>
                <div className="col-md-3 d-sm-none d-md-block">
                        <Ads/>
                </div>
                {modal}
            </div>
        )
    }
}

export default Feed;