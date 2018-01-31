import React from 'react';
import{ TouchableOpacity, WebView, View, Text, AsyncStorage, Dimensions } from 'react-native';
import styles from '../otherJs/styles';
import Header from './Header';
import Courses from './Courses';
import Video from './Video';
import Profile from './Profile';
import Feedback from './Feedback';
import firebase from 'react-native-firebase';

export default class HomeScreen extends React.Component {
    constructor(props){
        super(props);
        console.ignoredYellowBox = [
            'Setting a timer'
        ];
        this.state={
        }      
    }
    componentWillMount(){
        AsyncStorage.multiGet(['@username', '@email', '@userId', '@loc', '@currentVid']).then((data)=>{
            let userId = data[2][1];
            //console.log(uid);
            let loc = data[3][1]===null || undefined?"home":data[3][1];
            let currentVid = data[4][1];
            let rootRef = firebase.database().ref("/users/" + userId);
            rootRef.once('value').then((snapshot)=>{   
                let dname = snapshot.val().dname;
                let email = snapshot.val().email;
                this.setState({
                    dname: dname,
                    email: email,
                    uid: userId,
                    currentVid: currentVid,
                    loc: loc
                });
                
            });
        });
    }
    goTo = (loc)=> {
        if(loc === 'vid'){
            AsyncStorage.setItem('@loc', loc).then(()=>{
                AsyncStorage.multiGet(['@currentVid', '@courseTitle']).then((data)=>{
                    let currentVid = data[0][1];
                    let courseTitle = data[1][1];
                    this.setState({
                        loc: loc,
                        currentVid: currentVid,
                        courseTitle: courseTitle
                    });
                });
            });
        }else{
            AsyncStorage.setItem('@loc', loc).then(()=>{
                AsyncStorage.multiRemove(['@currentVid', '@courseTitle'], (error)=>{
                    if(error){
                        console.log(error.message);
                    }
                });
                this.setState({
                    loc: loc,
                    currentVid: null,
                    courseTitle: null
                });
            });
        }
    }
    getUrl=(info, loc, course)=>{
        AsyncStorage.multiSet([['@loc', loc], ['@currentVid', info], ['@courseTitle', course]]);
        this.setState({
            currentVid: info,
            loc: loc,
            courseTitle: course
        });
    }
    render(){
        let username = this.props.username; 
        let logout = this.props.logout;
        let email = this.props.email;
        let url = this.state.currentVid;
        let loc = this.state.loc;
        let courseTitle = this.state.courseTitle;
        if(loc === "home"){
            return(
                <View style={ styles.home }>
                    <Header goTo = { this.goTo } username={ username } logout = { logout } />
                    <Courses vidUrl={ this.getUrl } username={ username } email={ email } />
                    <Feedback username={ username } email= { email }/>
                </View>
            );
        }else if(loc === "vid"){
            return(    
                <View>
                    <Header goTo = {  this.goTo } username={ username } logout = { logout } />
                    <Video courseTitle={ courseTitle } url={ url } />
                </View>
            );
        }else if(loc === "profile"){
            return(
                <View>
                    <Header goTo = {  this.goTo } username={ username } logout = { logout } />
                    <Profile username={ username } />
                </View>
            )
        }else{
            return(
                <View>
                    <Header goTo = {  this.goTo } username={ username } logout = { logout } />
                </View>
            )
        }
        
    }
}