import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import styles from '../otherJs/styles';
import { emailregex, passRegex } from '../otherJs/helpers';
var kati = [];
export default class Login extends React.Component {
    constructor(props){
        super(props)
        let username = this.props.username;
        this.state= {
            hpassval: null,
            passhidden: true,
            password: null,
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
    render(){
        let username = this.props.username;
        let password = this.props.password;
        let login = this.props.login;
        let fbLogin = this.props.fbLogin;
        let googleLogin = this.props.googleLogin;
        let showSignup = this.props.showSignup;
        let showReset = this.props.showReset;
        return(
            <View>
                <Text style ={ styles.login_header }>Kilembe Login</Text>
                <Text style ={ styles.feedback }>{ this.state.feedback }</Text>
                <View style = { styles.form }>
                    <TextInput style = { styles.textField } onChangeText={ this.username } placeholder="Email Address" id="username" />
                    <TextInput style = { styles.textField } value={ this.state.hpassval } onChangeText={ this.password } placeholder="Password" id="passord" />
                    <Button onPress={ login } title="Login"/>
                    <TouchableOpacity onPress={ showSignup }><Text style={ styles.sign_up }>Sign up</Text></TouchableOpacity>
                    <TouchableOpacity onPress={ showReset }><Text style={ styles.sign_up }>I forgot my password</Text></TouchableOpacity>
                    <Text style={ styles.ran_info }>Or</Text>
                    <View style={ styles.facebook }>
                        <TouchableOpacity onPress={ fbLogin }>
                        <Image style={ styles.facebook_image } source={ require('../images/facebook/facebook7-text.png')} />
                        </TouchableOpacity>
                    </View>
                    <GoogleSigninButton 
                    style={ styles.googleButton }
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={ googleLogin }
                    /> 
                </View>  
            </View>
        );
    }
}