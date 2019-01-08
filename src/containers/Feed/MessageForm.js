import React, { Component } from 'react';

import {databaseDictionary} from '../../APIs/EnumDictionary/database';

import PicsAuth from '../../APIs/PicsAuth';

import globalStyles from '../../App.css';

import DisplayUserMedia from '../../components/UI/DisplayUserMedia/DisplayUserMedia';
import Modal from '../../components/UI/Modal/Modal';

import cx from 'classnames';
import classes from '../../components/UI/Form/Input/Input.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class MessageForm extends Component {
    state = {
        message: '',
        loading: false,
        errors: [],
        progress: 0,
        useresRef: databaseDictionary.usersRef,
        media: [],
        finishedUploading: false
    }
    componentDidMount() {
        // Listens to new uploaded pending media to be sent
        this.state.useresRef.child(this.props.localId).child('mediaPending').on('value', snap => {
            let loadedMedia = [];
            if (snap.val()) {
                const mediaList = Object.keys(snap.val());
                for (let item in mediaList) {
                        let mediaObj = {
                            imageURL: snap.val()[mediaList[item]].imageURL,
                            key: mediaList[item]
                        }
                        loadedMedia.push(mediaObj)
                }
                this.setState({media: loadedMedia});
            } else this.setState({media: []})
   
        })
    }
    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }
    createMessage = () => {
        let message = {
            content: this.state.message,
            timestamp: databaseDictionary.timestamp,
            user: {
                id: this.props.localId,
                fullName: this.props.userDetails.firstName + ' ' + this.props.userDetails.lastName,
                imageURL: this.props.userDetails.imageURL
            }
        }
        if (this.state.media.length > 0) message.media = this.state.media; // Add media references
        return message;
    }
    sendMessage = () => {
        if (this.state.message || this.state.media) {
            this.setState({loading: true});
            this.props.feedRef
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({loading: false, message: '', errors: []});
                    // Remove media data from user
                    this.state.useresRef.child(this.props.localId + '/mediaPending').remove();
                })
                .catch(err => this.addError(err))
        }
    }

    fileUpload = (e) => {
        if (e.target.files[0]) {
            if (PicsAuth(e.target.files[0].name)) {
                const uploadedImage = e.target.files[0];
                this.setState({image: uploadedImage});
                const key = this.state.useresRef.child(this.props.localId).child('mediaPending').push().key
                const uploadTask = databaseDictionary.storage.ref('mediaUpload/' + this.props.localId + '/' + key).put(e.target.files[0]);
                uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100 )
                    this.setState({progress: progress})
                },
                (error) => {
                    // ERROR HERE
                },
                () => {
                    databaseDictionary.storage.ref('mediaUpload').child(this.props.localId).child(key).getDownloadURL().then(url => {
                        // Update user's backgrounds collections
                        this.updateMediaCollection(url, key);
                    })
                }
                )
            }  
        }
    }

    


    updateMediaCollection = (url, key) => {
        this.state.useresRef.child(this.props.localId + '/mediaPending').child(key).update({imageURL: url, key: key})
            .then(() => {
                this.setState({
                    progress: 0, finishedUploading: true
                })
            })
            .catch(err => this.addError(err))
    }
    deleteMediaItem = (mediaObj) => {
        this.state.useresRef.child(this.props.localId + '/mediaPending').child(mediaObj.key).remove()
    }
    addError = (err) => {
        console.log(err);
        this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
        })
    }
    render() {
        return (
            <div className={globalStyles.Box}>
                <input
                onChange={this.changeHandler}
                value={this.state.message}
                className={cx("form-control", classes.Input)}
                name="message" type="text" placeholder="What's on your mind, bro?"/>
                {/* Send and plus buttons */}
                <div className={this.state.media.length > 0 ? 'mt-2 mb-4' : 'mt-2'}>
                    <button disabled={this.state.loading} onClick={this.sendMessage} className="btn btn-danger mr-1">Send</button>
                    <button disabled={this.state.loading} onClick={() => this.fileInput.click()} className="btn btn-danger"><FontAwesomeIcon icon="plus"/></button>
                </div>
                {/* Media thumnbnails display */}
                {this.state.media.length > 0 && <DisplayUserMedia media={this.state.media} deleteMediaItem={this.deleteMediaItem}/>}
                <input type="file" onChange={this.fileUpload} style={{display: 'none'}} ref={fileInput => this.fileInput = fileInput}/>
                {/* Modal for uploading media files */}
                <Modal show={this.state.progress > 0}>
                    <h4 className="mb-4">Uploading Media . . .</h4>
                    <div className="progress">
                        <div style={{width: this.state.progress}}  className="progress-bar bg-info progress-bar-striped progress-bar-animated" ></div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default MessageForm;