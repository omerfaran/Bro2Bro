
import firebase from '../firebase';



export const registerUserInDB = (userInputs, localId, profilePicURL) => {
    const usersRef = firebase.database().ref('users');
    let DBInputs;
    if (!profilePicURL) { // Existing profilePicUrl means the function just edits an exisint profile, not registering
        DBInputs = { // Prepare JSON user data for DB, localId is unique username 
            first_name: userInputs.firstName.value,
            last_name: userInputs.lastName.value,
            age: userInputs.age.value,
            location: userInputs.location.value,
            email: userInputs.email.value,
            imageURL: 'https://firebasestorage.googleapis.com/v0/b/react-bro2bro.appspot.com/o/sweet_gifs%2Fprofile.jpg?alt=media&token=3b39bce7-f742-404e-a9b6-e81007a2a3d2',
            is_online: 'yes',
            status: ''
        }
        return usersRef.child(localId).update(DBInputs)
        .catch(err => {
            console.log(err);
        })


    } else {
        DBInputs = {
            imageURL: profilePicURL
        }

        return usersRef.child(localId).update(DBInputs)
        .then(response => {

        })
        .catch(err => {
            console.log(err);
        })
    }
}

export const receiveBotMessage = (userInputs, localId) => {
    
    // Send message from broBot
    const chatRef = firebase.database().ref('chats');
    const botMessage = 'Welcome to Bro2Bro, bro! Feel free to explore the website. For starters, you can search for other bros using the Browse Bros option. Send bro to people you like and if they bro you back, you can start talking. Also, you can post messages and data on the general feed, and also select a background picture to your liking. Enjoy(:'
    let chatKey;
    if (localId < 'broBotKey') {
        chatKey = localId + '+broBotKey'
    } else chatKey = 'broBotKey+' + localId;
    chatRef.child(chatKey)
        .child('bro_status').update({request: 'broed!'});
    const message = {
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        userId: 'broBotKey',
        content: botMessage
    }

    return chatRef.child(chatKey)
        .child('messages').child('broBotKey').update(message)
        .then(() => {
                // Send notification from broBot
                const usersRef = firebase.database().ref('users');
                const notification = {
                    content: botMessage,
                    otherUserImage: 'https://firebasestorage.googleapis.com/v0/b/react-bro2bro.appspot.com/o/sweet_gifs%2FbroBot.jpg?alt=media&token=c033722c-76cc-46c0-9d59-4d29c3c146af',
                    otherUserName: 'Bro Bot',
                    messageOwner: 'broBotKey',
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    alreadyRead: false
                }
                return usersRef.child(localId).child('notifications').child('broBotKey')
                    .set(notification)
        }).catch(err => {
            console.log(err);
        })
}




 export default {registerUserInDB, receiveBotMessage};