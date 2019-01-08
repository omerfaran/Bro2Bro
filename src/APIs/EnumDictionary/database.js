import firebase from '../../firebase';
import {storage} from '../../firebase';

export const databaseDictionary = {
    userConnectedRef: firebase.database().ref('.info/connected'),
    usersRef: firebase.database().ref('users'),
    chatRef: firebase.database().ref('chats'),
    feedRef: firebase.database().ref('feed'),
    backgroundsRef: firebase.database().ref('backgrounds'),
    auth: firebase.auth,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    storage,
}