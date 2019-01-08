import React, { Component } from 'react';

import {databaseDictionary} from '../../../APIs/EnumDictionary/database';

import PicsAuth from '../../../APIs/PicsAuth';

import DisplayUserMedia from '../../../components/UI/DisplayUserMedia/DisplayUserMedia';

import classes from './Backgrounds.css';
import cx from 'classnames';


class Backgrounds extends Component {
    state = {
        backgroundsRef: databaseDictionary.backgroundsRef,
        backgrounds: [],
        currentBackground: null,
        progress: 0,
        finishedUploading: false
    }

    componentDidMount() {
        // added backgrouds listener
            this.state.backgroundsRef.child(this.props.localId).on('value', snap => {
                let loadedBackgrounds = [];
                if (snap.val()) {
                    const backgroundList = Object.keys(snap.val());
                    for (let item in backgroundList) {
                        if (backgroundList[item] === 'current_background') {
                            this.setState({currentBackground: snap.val()[backgroundList[item]].imageURL})
                        } else {
                            let backgroundObj = {
                                imageURL: snap.val()[backgroundList[item]].imageURL,
                                key: backgroundList[item]
                            }
                            loadedBackgrounds.push(backgroundObj)
                        }
                     
                    }
                    this.setState({backgrounds: loadedBackgrounds})
                } else this.setState({backgrounds: []})
       
            })   
    }

    fileUpload = (e) => {
        if (e.target.files[0]) {
            if (PicsAuth(e.target.files[0].name)) {
                const uploadedImage = e.target.files[0];
                this.setState({image: uploadedImage});
                const key = this.state.backgroundsRef.push().key
                const uploadTask = databaseDictionary.storage.ref('Backgrounds/' + this.props.localId + '/' + key).put(e.target.files[0]);
                this.props.toggleBackdrop();
                uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100 )
                    this.setState({progress: progress})
                },
                (error) => {
                    // ERROR HERE
                },
                () => {
                    databaseDictionary.storage.ref('Backgrounds').child(this.props.localId).child(key).getDownloadURL().then(url => {
                        // Update user's backgrounds collections
                        this.updateBackgroundCollection(url, key);
                    })
                }
                )
            }

        }  
    }

    updateBackgroundCollection = (url, key) => {
        this.state.backgroundsRef.child(this.props.localId).child(key).update({imageURL: url})
            .then(() => {
                this.setState({
                    progress: 0, finishedUploading: true
                })
                this.props.toggleBackdrop();
            })
            .catch((err) => {
                console.log(err)
            })
    }

    selectBackground = (url) => {
        this.state.backgroundsRef.child(this.props.localId).child('current_background').update({imageURL: url})
            .then(() =>  this.props.modalClosed())
    }

    deleteBackground = (backgroundObj) => {
        this.state.backgroundsRef.child(this.props.localId).child(backgroundObj.key).remove()
            .then(() => {
                if (this.state.currentBackground === backgroundObj.imageURL) {
                    this.selectBackground('none');
                }
            })
    }

    render() {
        let modalStage = 'Choose from the existing backgrounds or upload a new one!'
        if (this.state.progress !== 0) modalStage = 'Uploading image . . .'
        return (
            <div>
                <div className="row">
                    <div className="col-lg">
                        <h4 className="mb-4">{modalStage}</h4> 
                    </div>
              
                </div>
                <div className="row">
                    <div className="progress">
                        <div style={{width: this.state.progress}}  className="progress-bar bg-info progress-bar-striped progress-bar-animated" ></div>
                    </div>
                </div>
                <div style={{display: this.state.progress !== 0 && 'none'}}>
                    <div className="row" >
                        <div className={cx("col-lg mb-4", classes.MainMargins)}>
                            {/* BACKGROUDS HERE */}
                            <div className={classes.Background}>
                                <img onClick={() => this.selectBackground('none')} src={require('../../../assets/images/defaultBackground.png')} alt="Background"/>
                            </div>
                            {this.state.backgrounds.length > 0 && 
                            <DisplayUserMedia media={this.state.backgrounds} selectBackground={this.selectBackground} 
                            deleteMediaItem={this.deleteBackground} currentBackground={this.state.currentBackground}/>}
                        </div>
                    </div>

                    <input type="file" onChange={this.fileUpload} style={{display: 'none'}} ref={fileInput => this.fileInput = fileInput}/>
        
                    <div >
                        <button className="btn btn-primary mr-2" onClick={() => this.fileInput.click()}>Upload</button>
                        <button onClick={this.props.modalClosed} className="btn btn-outline-primary">Cancel</button>
                    </div>
               </div>    
            </div>
        )
    }
}

export default Backgrounds;