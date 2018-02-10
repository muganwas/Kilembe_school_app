import React from 'react';
import{ TouchableOpacity, Button, View, TextInput, Text, Image, AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import rebase from 're-base';
import styles from '../otherJs/styles';
import { emailregex } from '../otherJs/helpers';
let base = rebase.createClass(firebase.database());

export default class Profile extends React.Component {
    constructor(props){
        super(props)
        let userId = this.props.username;
        let uid = this.props.uid;
        this.state= {
            userId: userId,
            id: uid,
            disabled: true,
            editable: false
        }
    }
    componentWillMount(){
        let uid = this.state.id;
        let infoKeys = ['dname', 'email', 'uid'];
        let infoKeysLen = infoKeys.length;
        if(uid !== null && uid !== undefined){
            for(count=0; count<infoKeysLen; count++){

                base.syncState(`users/${ uid }/${ infoKeys[count]}`, {
                    context: this,
                    state: infoKeys[count]
                });
            }
        }
    }
    anable=()=>{
        this.setState({
            disabled: !this.state.disabled,
            editable: !this.state.editable
        })
    }
    save = ()=>{
        let dname = this.state.tempDname;
        let email = this.state.tempEmail;
        let uid = this.state.tempUid;
        if(dname !== null && dname !== undefined && dname !== ''){
            this.setState({
                dname: dname
            });
        }
        if(email !== null && email !== undefined && email !== ''){
            if(email.match(emailregex)){
                this.setState({
                    email: email
                });
            }else{
                alert('The email address you entered is not valid');
            }
        }
        if(uid !== null && uid !== undefined && uid !== ''){
            this.setState({
                uid: uid
            });
        }
        this.setState({
            disabled: true,
            editable: false
        })
    }
    dname=(e)=>{
        this.setState({
            tempDname: e
        });
    }
    email=(e)=>{
        this.setState({
            tempEmail: e
        });
    }
    uid=(e)=>{
        this.setState({
            tempUid: e
        });
    }
    render(){
        return(
            <View style={ styles.commentContainer } >
            <Text>Edit Profile</Text>
            <TouchableOpacity style={ styles.sButton } onPress={ this.anable }><Image style ={ styles.icon } source={ require("../images/icons/edit.png") }></Image></TouchableOpacity>
                <Text>Display Name: </Text>
                <TextInput onChangeText={ this.dname } defaultValue={ this.state.dname } editable={ this.state.editable } ></TextInput>
                <Text>Email Address: </Text>
                <TextInput onChangeText={ this.email } defaultValue={ this.state.email }  editable={ this.state.editable }></TextInput>
                <Text>User Id: </Text>
                <TextInput onChangeText={ this.uid } defaultValue={ this.state.uid }  editable={ this.state.editable }></TextInput>
                <Button title="Save Changes" onPress={ this.save }  disabled={ this.state.disabled }></Button>
            </View>
        );
    }
}