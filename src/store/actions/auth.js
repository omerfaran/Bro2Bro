
import md5 from 'md5';

import {registerUserInDB, receiveBotMessage} from '../../APIs/RegisterUserInDB';
import * as actionTypes from './actionTypes';

import {databaseDictionary} from '../../APIs/EnumDictionary/database';
import {AuthTypes} from '../../APIs/EnumDictionary/AuthTypes';



export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, localId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        localId: localId
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};


export const logout = (historyProp) => {
    return dispatch => {
            var user = databaseDictionary.auth().currentUser;
            if (user) databaseDictionary.auth().signOut();
        return {
            type: actionTypes.AUTH_LOGOUT
        }
    }
}

export const auth = (userInputs, signType, historyProp) => {
    // let hashedPassowrd;
    // bcrypt.hash(10, userInputs.password.value, (err, hash) => {
    //     console.log(err);
    // })
    // let hashedPassowrd = passwordHash.generate(userInputs.password.value);
    // console.log(userInputs.password.value, hashedPassowrd);
    return dispatch => {
        dispatch(authStart());
        if (signType === AuthTypes.LOGIN) {
            databaseDictionary.auth().signInWithEmailAndPassword(userInputs.email.value, md5(userInputs.password.value))
            .then(response => {    
                dispatch(authSuccess(response.user.qa, response.user.uid));   
            }).catch(error => {
                dispatch(authFail(error))
            })
        } else if (signType === AuthTypes.REGISTER) {
                databaseDictionary.auth().createUserWithEmailAndPassword(userInputs.email.value, md5(userInputs.password.value))
                .then(response => {
                    registerUserInDB(userInputs, response.user.uid, null).then( () => {
                        receiveBotMessage(userInputs, response.user.uid).then(() => {
                            dispatch(authSuccess(response.user.qa, response.user.uid))
                            historyProp.replace('/')
                        });
                })
            }).catch(error => dispatch(authFail(error)));
        }
    }
}