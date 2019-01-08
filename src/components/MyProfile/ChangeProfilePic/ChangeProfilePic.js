import React , {Component} from 'react';
import {storage} from '../../../firebase'

import PicsAuth from '../../../APIs/PicsAuth';

import {registerUserInDB} from '../../../APIs/RegisterUserInDB';
import classes from './ChangeProfilePic.css'

class ChangeProfilePic extends Component { 
    state = {
        finishedUploading: false,
        progress: 0,
        url: null,
    }

    fileUpload = (e) => {
        if (e.target.files[0]) {
            if (PicsAuth(e.target.files[0].name)) {
                const uploadedImage = e.target.files[0];
                this.setState({image: uploadedImage, finishedUploading: false});
                const uploadTask = storage.ref('ProfilePics/' + this.props.localId).put(e.target.files[0]);
                this.props.toggleBackdrop();
                uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100 )
                    this.setState({progress: progress})
                },
                (error) => {
                    console.log(error)
                },
                () => {
                    storage.ref('ProfilePics').child(this.props.localId).getDownloadURL().then(url => {
                        registerUserInDB(null, this.props.localId, url);
                        this.setState({
                            progress: 0, finishedUploading: true, url: url
                        })
                        this.props.toggleBackdrop();
                    })
                }
                )
            }

        }  
    }
    
    render() {
        let modalStage = 'Click the Upload button to select your new profile pic!';
        if (this.state.progress !== 0) modalStage = 'Uploading image . . .'
        if (this.state.finishedUploading) modalStage = (
            <div style={{textAlign: 'center'}}> 
                <h1 className="mb-4 display-4" >Bro, you look fantastic!</h1>
                <img src={this.state.url} alt="New profile pic" width='90%' style={{maxHeight: '24rem'}}></img>
            </div>
        )
        return (
            <div className={classes.Margins}>
               <input type="file" onChange={this.fileUpload} style={{display: 'none'}} ref={fileInput => this.fileInput = fileInput}/>
               {modalStage}
               <br/>
   
               <div className="progress">
                   <div style={{width: this.state.progress}}  className="progress-bar bg-info progress-bar-striped progress-bar-animated" ></div>
              </div>
              <div style={{display: this.state.progress !== 0 && 'none'}}>
                  <button className="btn btn-primary mr-2" onClick={() => this.fileInput.click()}>{this.state.finishedUploading ? 'Change' : 'Upload'}</button>
                  <button onClick={this.props.modalClosed} className="btn btn-outline-primary">{this.state.finishedUploading ? 'Keep' : 'Cancel'}</button>
               </div>
            </div>
        )
    }
}

export default ChangeProfilePic;