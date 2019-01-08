import React, { Component } from 'react';
import {databaseDictionary} from '../../APIs/EnumDictionary/database';
import {Link} from 'react-router-dom';

import Auxiliery from '../../hoc/Auxiliery'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import globalStyles from "bootstrap/dist/css/bootstrap.css";

import moment from 'moment';

import cx from 'classnames';
import classes from './Navbar.css';

class Navbar extends Component {
  state = {
    usersRef: databaseDictionary.usersRef,
    notifications: [],
    notificationsCount: 0,
  }

  componentDidMount() {
    // listen to new messages
      this.state.usersRef.child(this.props.localId).child('notifications').on('value', snap => {
        // add to array every item is an objetc of content,imageURL, who wrote the message
        // later will be added property of alreadyRead to show notifications
        if (snap.val()) {
          const obj = Object.keys(snap.val());
          let notificationObj;
          let notificationArr = []
          for (let key in obj) {
            let notification = snap.val()[obj[key]];
            let slicedContent = notification.content.slice(0, 30);
            if (notification.content.length > 30) slicedContent += ' . . .'
            notificationObj = {
              content: slicedContent,
              imageURL: notification.otherUserImage,
              name: notification.otherUserName,
              isMessageOwner: notification.messageOwner === obj[key] ? false : true,
              officiallyBros: slicedContent === 'You are officially bros!',
              peerId: obj[key],
              key: obj[key],
              timestamp: notification.timestamp,
              alreadyRead: notification.alreadyRead
            }
            notificationArr.push(notificationObj)
            if (!notification.alreadyRead) {
              this.setState(prevState => ({notificationsCount: prevState.notificationsCount+1}))
            }
          }
            notificationArr.sort(this.sortArrayByTimestamp);
            this.setState({
              notifications: notificationArr
            })
        }
       
      })
  
  }

  sortArrayByTimestamp = (a, b) => {
      if (a.timestamp > b.timestamp)
        return -1;
      if (a.timestamp < b.timestamp)
        return 1;
      return 0;
  }

  markAsRead = (key) => {
    this.setState({notificationsCount: 0})
    this.state.usersRef.child(this.props.localId).child('notifications').child(key).update({alreadyRead: true})
  }

  addMessageIcon = (notification) => {
    let icon = null;
    icon = notification.isMessageOwner ? (<FontAwesomeIcon icon="undo" className={classes.faRotate}/>) : null;
    if (notification.officiallyBros) icon = (<FontAwesomeIcon icon="birthday-cake" className={classes.faBirthday}/>);
    return icon;
  }

  render() {
    const timeFromNow = timestamp => moment(timestamp).fromNow();
    let notificationsCount = null, scrollerClass = null;
    if (this.state.notifications.length > 4) scrollerClass = classes.NotificationsScroller;
    if (this.state.notificationsCount > 0) notificationsCount = (<span className={classes.Count}>{this.state.notificationsCount}</span>)
    let notificationsDropdown = null;
    if (this.state.notifications.length > 0) {
      notificationsDropdown = this.state.notifications.map(notification => {
        let messageIcon;
        messageIcon = this.addMessageIcon(notification);
        return (
        <Auxiliery key={notification.key}>
          <li className={classes.Messages} onClick={() => this.markAsRead(notification.key)} key={notification.key} style={{backgroundColor: notification.alreadyRead ? '#d63031' : '#b81717'}}>
            <Link to={"/profile/" + notification.peerId}>
            <img className={classes.NotificationImage} src={notification.imageURL} alt=""/>
            <div className={classes.Message}>
                <div className={classes.MessageName}>{notification.name}</div>
                <div className={classes.MessageContent}>{messageIcon}
                {notification.content === '' ? (<Auxiliery><FontAwesomeIcon icon="camera"/>&nbsp;Photo</Auxiliery>)
                  : notification.content }</div>
                <div className={classes.MessageTimestamp}>{timeFromNow(notification.timestamp)}</div>         
            </div>  
            </Link>
          </li>
          <hr/>
        </Auxiliery>
      )})
    }
  
    return (
      <header className={classes.Header}>
        <h1 className={classes.Logo}><Link to="/"><img className={classes.Logo} src={require('../../assets/images/logo.png')} alt="Logo"/></Link></h1>
        <input type="checkbox" className={classes.navToggle} id="navToggle"></input>
        <nav>
            <ul>
                <li ><Link onClick={this.props.changeBackground} className={classes.Backgrounds} to="#">Backgrounds</Link></li>
                <li className={classes.BrowseBros}><Link to="/browse">Browse Bros&nbsp;<FontAwesomeIcon icon="beer" className={classes.faBeer}/></Link></li>
                <li className={cx(classes.Profile, classes.Notifications)} style={{position: 'relative'}}>
                  <Link className={classes.Inbox} to=""><FontAwesomeIcon icon="comment-alt"/>{notificationsCount}</Link>
                  <div className={cx(classes.NotificationsWidth, scrollerClass)}>
                    <ul className={classes.DropDown}>
                      {notificationsDropdown}
                    </ul>
                  </div>
                </li>
                <li className={cx(classes.Profile, classes.ProfileDrop)} style={{position: 'relative', width: 100}}><Link to=""><img className={classes.ProfileImage} src={this.props.imageURL} alt="Profile Pic" /></Link>
                  <ul className={cx(classes.DropDown, classes.ProfileDropdown)}>
                    <li><Link to="">Home</Link></li>                
                    <hr/>
                    <li><Link to="/profile">My Profile</Link></li>
                    <li onClick={this.props.logout}><Link to="">Log Out</Link></li>
                  </ul>
                </li>
            </ul>
        </nav>
        <label htmlFor="navToggle" className={classes.navToggleLabel}>
        <span></span>
        </label>
     </header>
     )
  }
}

export default Navbar;