import React from 'react';
import{ TouchableOpacity, WebView, View, Text, AsyncStorage, Dimensions } from 'react-native';
import styles from '../otherJs/styles';
import Header from './Header';
import Courses from './Courses';
import Video from './Video';
import firebase from 'react-native-firebase';

export default class HomeScreen extends React.Component {
    constructor(props){
        super(props);
        this.state={

        }      
    }
    componentWillMount(){
        AsyncStorage.multiGet(['@username', '@email', '@userId', '@loc']).then((data)=>{
            let dname = data[0][1];
            let email = data[1][1];
            let uid = data[2][1];
            let loc = data[3][1]===null || undefined?"home":data[3][1];
            let rootRef = firebase.database().ref("/users/" + uid);
            rootRef.once('value').then((snapshot)=>{
                var username = snapshot.val().uid || 'Anonymous';                
                console.log(username);
              });
            this.setState({
                dname: dname,
                email: email,
                uid: uid,
                loc: loc
            });
        });
    }
    goTo = (loc)=> {
        this.setState({
            loc: loc,
            currentVid: null,
            courseTitle: null
        });
    }
    getUrl=(info, loc, course)=>{
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
        if( (url === undefined || url === null) && loc === "home"){
            return(
                <View style={ styles.home }>
                    <Header goTo = { this.goTo } username={ username } logout = { logout } />
                    <Courses vidUrl={ this.getUrl } username={ username } email={ email } />
                </View>
            );
        }else if(url !== undefined && loc === "vid"){
            return(    
                <View>
                    <Header goTo = {  this.goTo } username={ username } logout = { logout } />
                    <Video courseTitle={ courseTitle } url={ url } />
                </View>
            );
        }else{
            return(
                <View>
                </View>
            )
        }
        
    }
}