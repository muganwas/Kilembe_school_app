import React from 'react';
import{ TouchableOpacity, Button, View, TextInput, Text, Image, AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import styles from '../otherJs/styles';

export default class Feedback extends React.Component {
    constructor(props){
        super(props)
        let username = this.props.username;
        let email = this.props.email;
        this.state= {
            username: username,
            email: email,
            appFeedback: null,
            characters: 500
        }
    }
    processFeedBack=(e)=>{
        let fbLen = e.length;
        let newCharcount = (500)-(fbLen);
        console.log(newCharcount);
        this.setState({
            feedback: e,
            characters: newCharcount
        });
    }
    submitComment=()=>{
        let comment = this.state.feedback;
        let user = this.state.username;
        if(comment !== undefined && comment !== null && comment !== ''){
            let commentLen = comment.length;
            if(commentLen < 50){
                this.setState({
                    appFeedback: 'Minimum 50 characters'
                });
            }else if(commentLen >= 50){
                let rootRef = firebase.database().ref("/feedback");
                let userRef = rootRef.child(user);
                userRef.push(comment, ()=>{
                    this.setState({
                        appFeedback: 'You successfully submited your comment, thank you.',
                        feedback: null,
                        characters: 500
                    })
                })
            }
        }else{
            alert('Please fill in a comment');
            this.setState({
                appFeedback: null,
                characters: 500
            });
        }
    }
    render(){
        let submit = this.props.submit;
        let characters = this.state.characters;
        let appFeedback = this.state.appFeedback;
        let feedback = this.state.feedback;
        return(
            <View style={ styles.commentContainer } >
                <Text>Please leave us a comment</Text>
                <Text style={ styles.feedback }>{ appFeedback }</Text>
                <TextInput onChangeText={ this.processFeedBack } value={ feedback } style={ styles.commentBox } multiline={ true } ></TextInput>
                <Button onPress={ this.submitComment } title="Submit Comment"></Button>
                <Text>{ characters }</Text>  
            </View>
        );
    }
}