import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { emailregex, passRegex } from '../otherJs/helpers';
import styles from '../otherJs/styles';
import base from '../otherJs/base';
let usersRef = base.database().ref('users');
var kati = [];
var kati1 = [];
var aT = '';
export default class Signup extends React.Component {
    constructor(props){
        super(props)
        let username = this.props.username;
        this.state= {
            username: username,
            hpassval: null,
            hpassval1: null,
            passhidden: true,
            password: null,
            password1: null,
            feedback: null
        }
    }
    username = (event)=>{
        this.setState({
            username: event
        });
    }
    password = (data)=>{
        let ev = data.split('');
        let dataCount = ev.length;
        if(data !== null && data !== undefined && data !== ''){
            let event = data;
            let eventArr = event.split('');
            let lastEl = eventArr.pop();
            if(lastEl !== '*'){
                kati.push(lastEl);
                
            }else if(lastEl === '*'){
                kati.pop();
            }
            let hiddenPass = data==undefined?"": data.replace(/./gi, '*');  
            this.setState({
                password: (kati.join('')),
                hpassval: hiddenPass            
            });
        }else{
            kati.length = 0;
            this.setState({
                password: null,
                hpassval: null
            });
        }
    }
    password1 = (data)=>{
        let ev = data.split('');
        let dataCount = ev.length;
        if(data !== null && data !== undefined && data !== ''){
            let event = data;
            let eventArr = event.split('');
            let lastEl = eventArr.pop();
            if(lastEl !== '*'){
                kati1.push(lastEl);
                
            }else if(lastEl === '*'){
                kati1.pop();
            }
            let hiddenPass = data==undefined?"": data.replace(/./gi, '*');  
            this.setState({
                password1: (kati1.join('')),
                hpassval1: hiddenPass            
            });
        }else{
            kati1.length = 0;
            this.setState({
                password1: null,
                hpassval1: null
            });
        }
    }
    _signup=()=>{
        let email = this.state.username;
        let password = this.state.password;
        let conPassword = this.state.password1;
        if((email !== undefined && email !== null && email !== '' ) && (password !== undefined && password !== null && password !== '')){
            if(email.match(emailregex)){
                if(password.match(passRegex)){
                    if(password === conPassword){
                        base.auth().createUserWithEmailAndPassword(email, password).then(() => {
                            this.setState({
                                feedback: "You Successfully Registered"
                            });
                        }, (error) => {
                            this.setState({
                                feedback: error.message,
                            });
                        });
                    }else{
                        this.setState({
                            feedback: 'Make sure your passwords match.'
                        })
                    }
                }else{
                    this.setState({
                        feedback: 'Your password must have at least one number and one letter, no symbols or panctuation marks.'
                    });
                }
            }else{
                this.setState({
                    feedback: 'Please input a valid email.'
                })
            }
        }else{
            this.setState({
                feedback: 'Please fill in all fields.'
            })
        }
    }
        
    render(){
        let reset = this.props.reset;
        let login = this.props.login;
        return(
            <View>
                <Text style ={ styles.login_header }>Kilembe Signup</Text>
                <Text style ={ styles.feedback }>{ this.state.feedback }</Text>
                <View style = { styles.form }>
                    <TextInput style = { styles.textField } onChangeText={ this.username } placeholder="Email Address" id="username" />
                    <TextInput style = { styles.textField } value={ this.state.hpassval } onChangeText={ this.password } placeholder="Password" id="passord" />
                    <TextInput style = { styles.textField } value={ this.state.hpassval1 } onChangeText={ this.password1 } placeholder="Confirm Password" id="passord1" />
                    <Button onPress={ this._signup } title="Sign up"/>
                    <TouchableOpacity onPress={ login }><Text style={ styles.sign_up }>Login</Text></TouchableOpacity>
                    <TouchableOpacity onPress={ reset }><Text style={ styles.sign_up }>I forgot my password</Text></TouchableOpacity> 
                </View>  
            </View>
        );
    }
}