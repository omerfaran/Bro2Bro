import React, { Component } from 'react';
import Match from '../Match/Match';
import MessageForm from './Chat/MessageForm/MessageForm';
import MessageBubble from './Chat/MessageBubble/MessageBubble';
import RequestBubble from './Chat/MessageBubble/RequestBubble';
import cx from 'classnames'

import moment from 'moment';

import Spinner from '../../components/UI/Spinner/Spinner';
import Backdrop from '../../components/UI/Backdrop/Backdrop';

import ModalImage from '../UI/ModalImage/ModalImage'

import {databaseDictionary} from '../../APIs/EnumDictionary/database';

import classes from './Profile.css'

import Auxiliery from '../../hoc/Auxiliery'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Profile extends Component {
    state = {
        loading: false,
        name: null,
        status: null,
        online: null,
        image: null,
        chatRef: databaseDictionary.chatRef,
        usersRef: databaseDictionary.usersRef,
        relationship: null,
        chatKey: null,
        messagesArr: [],
        clickedImageURL: null,
        replaceConversation: false,
        searchInput: '',
        searchLoading: false,
        searchResults: [],
        mousePos: {
            x: null,
            y: null
        }
    }
 
    componentDidMount() {
        this.connectDBChat();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.username !== this.props.match.params.username) {
            // means user switched into a different converstaion
            this.setState({ replaceConversation: true})
        }
    }

    componentDidUpdate() {
        if (this.state.replaceConversation) {
            this.setState({
                replaceConversation: false,
                messagesArr: []
            }, () => {
                this.state.chatRef.off()
                this.connectDBChat();
            })
        }
    }

    connectDBChat = () => {
            this.setState({loading: true});
              // Get username details from DB. Username is passed as props from route url
              this.state.usersRef.child(this.props.match.params.username).once('value', snap => {
                if (snap.val()) {
                    const userDetails = snap.val();
                    // Set state from user details
                    this.setState({
                        name: userDetails.first_name + ' ' + userDetails.last_name,
                        status: userDetails.status,
                        online: userDetails.is_online,
                        image: userDetails.imageURL
                    })
                    this.addChatListeners();
                } else this.props.history.push('/pagenotfound') // REDIRECT TO NO-USER-FOUND PAGE
            })
            
    }

    addChatListeners = () => {
        // Determine chat key of the users (auth user + visited profile)
        let chatKey;
        if (this.props.localId < this.props.match.params.username) {
            chatKey = this.props.localId + '+' + this.props.match.params.username
        } else chatKey = this.props.match.params.username + '+' + this.props.localId;
        this.relationshipListener(chatKey);
        this.messagesListener(chatKey);
        this.setState({chatKey: chatKey, loading: false});
    }

    relationshipListener = (chatKey) => {
        // Listen to whether user sent/responded to 'bro_status -> request'
        this.state.chatRef.child(chatKey).child('bro_status').on("value", snap => { 
            if (snap.val()) {
                switch (snap.val().request) {
                    case this.props.localId:
                        this.setState({relationship: 'sent'});
                        break;
                    case this.props.match.params.username:
                        this.setState({relationship: 'requested'});
                        break;
                    case 'broed!':
                        this.setState({relationship: 'broed!'});
                        break;
                    default:
                        break;
                }
            } else this.setState({relationship: 'none'}) 
        })
    }

    messagesListener = (chatKey) => {
         // Listen to added messages on the specific two users chat 
         let loadedMessages = [];
         this.state.chatRef.child(chatKey).child('messages').on("child_added", snap => {
            // construct messages array
            const messageObj = {
                ...snap.val(),
                key: snap.key
            }
            messageObj.userId === 'broBotKey' ? loadedMessages.unshift(messageObj) : loadedMessages.push(messageObj)
            this.setState({messagesArr: loadedMessages})
        })
    }
    // createnotification should be merged to one function and called from here and from MessageForm

    createNotification = (otherUserImage, otherUserName, alreadyRead, content) => {
        const notification = {
            content: content,
            otherUserImage: otherUserImage,
            otherUserName: otherUserName,
            messageOwner: this.props.localId,
            timestamp: databaseDictionary.timestamp,
            alreadyRead: alreadyRead
        }
        return notification;
    }

    updateAuthNotification = (content) => {
        return this.state.usersRef.child(this.props.localId).child('notifications').child(this.props.match.params.username)
        .update(this.createNotification(this.state.image, this.state.name, true, content))
    }

    UpdatePeerNotification = (content) => {
        return this.state.usersRef.child(this.props.match.params.username).child('notifications').child(this.props.localId)
        .update(this.createNotification(this.props.ownImage, this.props.ownName, false, content))
    }

    broRequestHandler = () => {
            // Send bro to other user / respond to other user request
            let requestStatus;
            if (this.state.relationship === 'none') requestStatus = this.props.localId;
            if (this.state.relationship === 'requested') requestStatus = 'broed!';
            const userRequest = {
                request: requestStatus,
                timestamp: databaseDictionary.timestamp,
            }
            this.state.chatRef.child(this.state.chatKey).child('bro_status').update(userRequest)
                .then(() => {
                        if (this.state.relationship === 'sent') {
                            // Update for other user
                            this.UpdatePeerNotification('They have broed you!')
                                .then(() => this.setState({loading: false}))
                                .catch(err => this.addError(err))
                        };
                        if (this.state.relationship === 'broed!') {
                            Promise.all(this.UpdatePeerNotification('You are officially bros!'),
                                this.updateAuthNotification('You are officially bros!'))
                                .then(() =>  this.setState({loading: false}))
                                .catch(err => this.addError(err))
                        }           
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

    addError = (err) => {
        console.log(err);
        this.setState({loading: false})
    }

    handleSearch = (e) => {
        this.setState({
            searchInput: e.target.value,
            searchLoading: true
        }, () => this.performSearch())
    }

    performSearch = () => {
        const messages = this.state.messagesArr.slice();
        const regex = RegExp(this.state.searchInput, 'gi'); // global and case insensitive
        const searchResults = messages.reduce((acc, message) => {
            if (message.content && message.content.match(regex)) {
                acc.push(message)
            }
            return acc;
        }, []);
        this.setState({searchResults});
        setTimeout(() => this.setState({searchLoading: false}) , 1000);
    }

    compareMessageDates = (currentDate, prevDate) => {
        const currentMessageDate =  moment(currentDate).format('DD MMM');
        const prevMessageDate = moment(prevDate).format('DD MMM');
        if (currentMessageDate !== prevMessageDate) return this.checkIfToday(currentMessageDate); 
        return null;
    }

    setFirstDate = (firstDate) => {
        const messageDate = moment(firstDate).format('DD MMM');
        return (this.checkIfToday(messageDate));
    }

    checkIfToday = (messageDate) => {
        const currentDate = moment(Date.now()).format('DD MMM');
        return currentDate === messageDate ? 'today' : messageDate;
    }

    mapMessages = (messagesArray) => {
        let messages = []
        if (messagesArray) {
            messages = messagesArray.map((message, key) => {
                ;
                return (
                    <MessageBubble
                        key={message.key}
                        content={message.content}
                        side={message.userId === this.props.localId ? 'left' : 'right'}
                        imageClickHandler={this.imageClickHandler}
                        messageDate={key > 0 ? this.compareMessageDates(message.timestamp, messagesArray[key-1].timestamp) :
                            this.setFirstDate(message.timestamp)}
                        media={message.media}
                    />
            )})
            return messages;
        }
   
    }

    updateSearchIcon = () => {
        let searchIcon = {};
        if (this.state.searchLoading) {
            searchIcon = {
                spin: true,
                icon: 'spinner'
            }
        } else {
            searchIcon = {
                spin: false,
                icon: 'search'
            }
        }
        return searchIcon;
    }
    
    render(){
        // let redirect = null;
        const searchIcon = this.updateSearchIcon();
        
        let showSpinner = null;
        if (this.state.loading) showSpinner = (
            <div>
                <Backdrop show/><Spinner/>
            </div>
        )
        let statusMessage = null;
        if (this.state.relationship && this.state.name) {
                statusMessage = (
                <RequestBubble 
                broRequestHandler={this.broRequestHandler} key="broRequest" 
                relationship={this.state.relationship} theirName={this.state.name} 
                />)
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
            <Auxiliery>
                {showSpinner}

                <div style={{maxHeight: '65vh'}} className={cx("row", classes.ProfileRow)}>
                    <div className="col-md-6">
                        <Match conversation={true} name={this.state.name} status={this.state.status} online={this.state.online} image={this.state.image}/>
                    </div>
                    {/* Chat console */}
                    <div className="col-md-6">
                       
                        <div style={{height: '100%'}} className="d-flex flex-column">
                        <div className={classes.Card}>
                            <div className={cx("card-header", classes.CardHeader)}>
                                <ul className="nav active nav-tabs card-header-tabs">
                                    <li className="nav-item">
                                        <a  className='nav-link active'
                                        role="tab" data-toggle="tab" >Conversation with {this.state.name}</a>
                                    </li>
                                    <li> {/* Search Messages */}
                                        <div className="input-group">
                                            <input value={this.state.searchInput} onChange={this.handleSearch} style={{fontSize: '1.1rem', outline: 'none'}} className="form-control-lg my-0 border-right-0 border" type="search" placeholder="Search Messages" id="example-search-input"/>
                                            <span className="input-group-append">
                                                <div className="input-group-text bg-white"><FontAwesomeIcon spin={searchIcon.spin} icon={searchIcon.icon}/></div>
                                            </span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                                    <div className={classes.ChatMessageWindow}>
                                        {this.props.match.params.username !== 'broBotKey' && statusMessage}
                                        {this.state.searchInput ? this.mapMessages(this.state.searchResults) : this.mapMessages(this.state.messagesArr)}
                                    </div> 
                                    <div  className={classes.ChatMessageForm} >
                                    <MessageForm 
                                    localId={this.props.localId}
                                    localImage={this.props.ownImage}
                                    localName={this.props.ownName}
                                    otherUserId={this.props.match.params.username}
                                    otherUserImage={this.state.image}
                                    otherUserName={this.state.name}
                                    chatKey={this.state.chatKey}
                                    readonly={this.state.relationship !== 'broed!'}
                                    createNotification={this.createNotification}
                                    />
                                    </div>
                            </div>
                    </div>
                </div>
                {modal}
            </Auxiliery>
            )
    }
}

export default Profile;

