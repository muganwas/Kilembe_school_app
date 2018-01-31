import React from 'react';
import{ TouchableOpacity, Button, View, TextInput, Text, Image, AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import rebase from 're-base';
import styles from '../otherJs/styles';
let base = rebase.createClass(firebase.database());

export default class Profile extends React.Component {
    constructor(props){
        super(props)
        let userId = this.props.username;
        this.state= {
            userId: userId
        }
    }
    componentWillMount(){
        let userID = this.state.userId;
        let infoKeys = ['dname', 'email', 'uid'];
        let infoKeysLen = infoKeys.length;
        if(userID !== null && userID !== undefined){
            for(count=0; count<infoKeysLen; count++){

                base.syncState(`users/${ userID }/${ infoKeys[count]}`, {
                    context: this,
                    state: infoKeys[count]
                });
            }
        }
    }
    save = ()=>{

    }
    dname=(e)=>{

    }
    email=(e)=>{

    }
    uid=(e)=>{

    }
    render(){
        return(
            <View style={ styles.commentContainer } >
            <Text>Profile</Text>
            <TouchableOpacity><Text>Edit Profile</Text></TouchableOpacity>
                <TextInput onChangeText={ this.dname } defaultValue={ this.state.dname } ></TextInput>
                <TextInput onChangeText={ this.email } defaultValue={ this.state.email }></TextInput>
                <TextInput onChangeText={ this.uid } defaultValue={ this.state.uid }></TextInput>
                <Button title="Save Changes" onPress={ this.save }></Button>
            </View>
        );
    }
}