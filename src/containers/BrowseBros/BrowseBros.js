import React, { Component } from 'react';
import Match from '../../components/Match/Match';
import cx from 'classnames';
import Filter from '../../components/Filter/Filter';
import Auxiliery from '../../hoc/Auxiliery'

import {databaseDictionary} from '../../APIs/EnumDictionary/database';

import classes from './BrowseBros.css';

import {Link} from 'react-router-dom';

import globalStyles from '../../App.css';


class BrowseBros extends Component {
    state = {
    usersRef: databaseDictionary.usersRef,
    matchInfo: null,
    filters: null,
    showFilters: false
    }

    componentDidMount() {
        // Get all cards of users on page load
        this.state.usersRef.once('value', snap => {
            const matchInfo = this.deleteRedundantCard(snap.val());
            this.setState({matchInfo: matchInfo});
        })
    }

    deleteRedundantCard = (response) => {
        const newMatches = response;
        delete newMatches[this.props.localId];
        delete newMatches['broBotKey'];
        for (let match in newMatches) {
            if (!newMatches[match].first_name) delete newMatches[match];
        }
        return newMatches;
    }

    filterMatches = (matches, locationFilter, locationArrFilter) => {
        const filters = this.state.filters;
        for (var match in matches) {
            if (match === 'broBotKey') {
                delete matches[match];
                continue;
            };
             //Remove matches outside of age range
            if (filters.ageFrom <= filters.ageTo) {
                if (matches[match].age < filters.ageFrom || matches[match].age > filters.ageTo){
                    
                    delete matches[match]; continue;
                } 
          }

                            //Remove matches by location
            if (filters.locationValidation) {

                let userLocation = matches[match].location;
                let locationArrUser = userLocation.split(', ');
                let deleteMatch = true;

                if (userLocation === locationFilter) deleteMatch = false; // exact location match
                if (locationArrFilter[locationArrFilter.length - 1] === locationArrUser[0]) 
                    deleteMatch = false; // searched city+country and user has country only
                if (locationArrFilter[0] === locationArrUser[locationArrUser.length - 1])
                    deleteMatch = false; // searched country only and user has city+country

                if (deleteMatch) {delete matches[match]; continue}
            
            }
        }
        return matches;
    }

    sortByLastOnline = (matches) => {
        const filters = this.state.filters;
        let matchesSorted = matches;
        let onlineMatches = [], offlineMatches = [];
        if (filters.lastOnline) {
            for (let match in matches) {
                matches[match].is_online === 'yes' ? onlineMatches.push(matches[match]) : offlineMatches.push(matches[match])
            }
            matchesSorted = onlineMatches.concat(offlineMatches);
        }
        return matchesSorted;
    }

    componentDidUpdate() {
        if (this.state.filters) {
            const filters = this.state.filters;
            this.state.usersRef.once('value', snap => {
                // this.setState({matchInfo: response.data});
                
                //----- Create filtered object from response.data----
                let matches = snap.val();
                matches = this.deleteRedundantCard(matches);
                
                let locationFilter, locationArrFilter;
                if (filters.locationValidation) {
                     locationFilter = filters.locationValidation;
                    locationArrFilter = locationFilter.split(', ');
                }

                let filteredMatches = this.filterMatches(matches, locationFilter, locationArrFilter);

                

                // Order by last online - for now only online/offline

                // let matchesSorted = filteredMatches;
                let matchesSorted = this.sortByLastOnline(filteredMatches);


                this.setState({
                    matchInfo: matchesSorted,
                    filters: null
                });
            
            });
        }

    }

    toggleFiltersBox = () => {
        const toggler = !this.state.showFilters;
        this.setState({showFilters: toggler})
    }
        
    fetchNextMatch = (filters) => {
    this.setState({filters: filters})

    }
    
    render() {
    let showMatches = null;
    if (this.state.matchInfo) {
        let matches = Object.keys(this.state.matchInfo);
        showMatches = matches.map((match, index) => (
                <div className="col-md-4 pb-4" key={match}>
                    <Link to={"/profile/" + match} className={classes.Match}>
                        <Match name={this.state.matchInfo[match].first_name + ' ' + this.state.matchInfo[match].last_name + ', '} 
                        age={this.state.matchInfo[match].age}
                        location={this.state.matchInfo[match].location}
                        status={this.state.matchInfo[match].status} 
                        online={this.state.matchInfo[match].is_online}
                        image={this.state.matchInfo[match].imageURL} />
                    </Link>
                </div>
        ))
    }
      
        return (
        <Auxiliery>
            <div className={classes.Sidebar}>
                <Filter applyFilters={this.fetchNextMatch}/>
            </div>
            
            <div className={cx("container", classes.Board, globalStyles['first-row-margin'])}>
                    <div className="row">
                    {showMatches}
                </div>
                
            </div>
        </Auxiliery>
        )
    }
}



export default BrowseBros;