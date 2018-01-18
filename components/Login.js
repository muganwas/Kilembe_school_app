import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import styles from '../otherJs/styles';
import { emailregex, passRegex } from '../otherJs/helpers';

export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state= {
        }
    }
    render(){
        let feedback = this.props.feedback;
        let username = this.props.username;
        let password = this.props.password;
        let hpassval = this.props.hpassval;
        let login = this.props.login;
        let fbLogin = this.props.fbLogin;
        let googleLogin = this.props.googleLogin;
        let showSignup = this.props.showSignup;
        let showReset = this.props.showReset;
        return(
            <View>
                <Text style ={ styles.login_header }>Kilembe Login</Text>
                <Text style ={ styles.feedback }>{ feedback }</Text>
                <View style = { styles.form }>
                    <TextInput style = { styles.textField } onChangeText={ username } placeholder="Email Address" id="username" />
                    <TextInput style = { styles.textField } value={ hpassval } onChangeText={ password } placeholder="Password" id="passord" />
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