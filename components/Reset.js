import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, Button } from 'react-native';
import styles from '../otherJs/styles';
import emailregex from '../otherJs/helpers';

export default class Reset extends React.Component{
    constructor(props){
        super(props);
        this.state ={

        }
    }
    username = (event)=>{
        this.setState({
            username: event
        });
    }
    render(){
        let login = this.props.login;
        let signup = this.props.signup;
        let reset = this.props.resetPass;
        return(
            <View>
                <Text style ={ styles.login_header }>Reset Passowrd</Text>
                <Text style ={ styles.feedback }>{ this.state.feedback }</Text>
                <View style = { styles.form }>
                    <TextInput style = { styles.textField } onChangeText={ this.username } placeholder="Email Address" id="username" />
                    <Button onPress={ reset } title='Reset Password' />
                    <TouchableOpacity onPress={ login }><Text style={ styles.sign_up }>Login</Text></TouchableOpacity>
                    <TouchableOpacity onPress={ signup }><Text style={ styles.sign_up }>Don't have an account? Sign up</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
}