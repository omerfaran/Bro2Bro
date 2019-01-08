import React, { Component } from 'react';

import {Route, Switch, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import {databaseDictionary} from './APIs/EnumDictionary/database';
import * as actions from './store/actions/index';


// Font awesome imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStroopwafel, faBullhorn, faQuestion, faCheck, faSearch,
   faPlus, faUndo, faCommentAlt, faBeer, faTimes, faCamera, faArrowsAltH, faGlobeAsia, faSignal, faSpinner, faFrown, faBirthdayCake} from '@fortawesome/free-solid-svg-icons';

import './App.css';

import MainApp from './containers/MainApp/MainApp';
import Login from './containers/Login/Login';

library.add(faStroopwafel, faBullhorn, faQuestion, faCheck, faSearch,
   faPlus, faUndo, faCommentAlt, faBeer, faTimes, faCamera, faArrowsAltH, faGlobeAsia, faSignal, faSpinner, faFrown, faBirthdayCake);

class App extends Component {
  state = {
    mainApp: false
  }

  componentDidMount() {
    databaseDictionary.auth().onAuthStateChanged(user => {
      if (user) {
        if (this.props.loading === false) { // check path to give user the option to change
            if (this.props.localId !== user.uid) this.props.updateState(user.qa, user.uid);
            console.log(this.props.location.pathname, 'LOCATION');
            if (this.props.location.pathname === '/login') this.props.history.replace('/');
        }
      } else {
        this.props.history.replace('/login')
      }
    })
  }
  render() {
    return (
      <Route>
        <Switch>
            <Route path="/login" exact component={Login}/>
            <Route path="/" component={MainApp}/> 
        </Switch>
     </Route>
    );
  }
}

const mapStateToProps = state => {
  return {
      isAuth: state.token !== null,
      localId: state.localId,
      token: state.token,
      loading: state.loading,
      userDetails: state.userDetails
  }
}

const mapDispatchToProps = dispatch => {
  return {
      updateState: (qa, uid) => dispatch(actions.authSuccess(qa, uid)),
  };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
