import React from 'react';
import{ TouchableOpacity, View, Text, AsyncStorage } from 'react-native';
import styles from '../otherJs/styles';
import firebase from 'react-native-firebase';

export default class Courses extends React.Component {
    constructor(props){
        super(props);
        console.ignoredYellowBox = [
            'Setting a timer'
        ];
        let username = this.props.username;
        this.state= {
            username: username
        }
    }
    loadVideo = (vid, loc, course)=>{  
        (this.props.vidUrl)(vid, loc, course);//I didn't think this would work! the first brackets represent the function and the second one the params      
    }
    componentWillMount(){
        let rootRef = firebase.database().ref("/courses");
            rootRef.once('value').then((snapshot)=>{
                var courses = snapshot.val();
                this.setState({
                    courses: courses
                });
            });
    }
    availableCourses = (key)=>{
        let courseDits = this.state.courses;
        let courseTitle = courseDits[key]["Course_Title"];
        let vid = courseDits[key]["Video"];
        let loc = "vid";
        return(
            <TouchableOpacity id={ vid } onPress={ this.loadVideo.bind(this, vid, loc, courseTitle) } key={key}>
                <Text style={ styles.course }>{ courseTitle }</Text>
            </TouchableOpacity>
        )
    }
    render(){
        let username = this.props.username;
        let email = this.props.email;
        let crse = this.state.courses;
        if(crse !== undefined){
            return(
                <View style = { styles.section } >
                    <Text style={ styles.h1 }>Available Courses</Text>
                    <View style={ styles.courses }>
                        { Object.keys(crse).map(this.availableCourses) 
                        }
                    </View>
                </View>  
            );
        }else{
            return(
                <View>
                    <Text>Loading...</Text>
                </View>
            )
        }
        
    }
}