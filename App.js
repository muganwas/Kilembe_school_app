import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity } from 'react-native';
import { emailregex, passRegex } from './otherJs/helpers';
//import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import FBSDK, { LoginManager } from 'react-native-fbsdk';
var kati = [];
export default class App extends React.Component {
    constructor(){
        super();
        this.state={
            username: null,
            password: null,
            hpassval: null,
            passhidden: true,
            feedback: null
        }
    }
    login = ()=>{
        
        let uname = this.state.username;
        let pass = this.state.password;
        if( (uname !== null && uname !== null) && (pass !== null && pass !== undefined) ){
            if(uname.match(emailregex)){
                this.setState({
                    feedback:null
                })
                let unameCount = (uname.split('')).length;
                let passCount = (pass.split('')).length;
                let unameFb = "*Username shouldn't be less than 5 characters.";
                let passFb = "*Password should'nt be less than 5 characters.";
                if(unameCount < 5){
                    let feedback = unameFb;
                    if(passCount < 5){
                        feedback = feedback + "\n" + passFb;
                        this.setState({
                            feedback: feedback
                        });
                    }else{
                        this.setState({
                            feedback: feedback
                        });
                    }
                }else if(passCount < 5){
                    feedback = passFb;
                    this.setState({
                        feedback: feedback
                    });
                }else{
                    if(pass.match(passRegex)){
                        //firebase login code will go here
                        console.log("Congrats!!! \n" + "Password: " + this.state.password);
                        this.setState({
                            feedback: null
                        });
                    }else{
                        this.setState({
                            feedback: "Your password must contain a letter and a number."
                        });
                    }  
                }
            }else{
                this.setState({
                    feedback: "The email address format is incorrect."
                });
            }   
        }else{
            this.setState({
                feedback: "Both username and password are required.",
                password: null
            });
        }    
    }
    /*_googleSignin = ()=>{
        GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
            // play services are available. can now configure library
            //alert('all good');
            GoogleSignin.configure({
                scopes: [ 'https://www.googleapis.com/auth/userinfo.email' ],
                shouldFetchBasicProfile: true,
                webClientId: "365926543341-rjit9be1m995msb01jq822tfnhcfkebp.apps.googleusercontent.com",//from developers console
                //forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
              }).then(() => {
                alert('fuck u everyone');
              });
        }).catch((err) => {
          console.log("Play services error", err.code, err.message);
        })
    }*/
    _fbSignin = ()=> {
        LoginManager.logInWithReadPermissions(['public_profile']).then(
            function(result) {
              if (result.isCancelled) {
                alert('Login cancelled');
              } else {
                alert('Login success with permissions: '
                  +result.grantedPermissions.toString());
              }
            },
            function(error) {
              alert('Login fail with error: ' + error);
            }
        );
    }
    username = (event)=>{
        this.setState({
            username: event
        })
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
    render() {
        return ( 
            <View style = { styles.container }>
                <View style = { styles.login }>
                    <Text style ={ styles.login_header }>Login</Text>
                    <Text style ={ styles.feedback }>{ this.state.feedback }</Text>
                    <View style = { styles.form }>
                        <TextInput style = { styles.textField } onChangeText={ this.username} placeholder="Email Address" id="username" />
                        <TextInput style = { styles.textField } value={ this.state.hpassval } onChangeText={ this.password } placeholder="Password" id="passord" />
                        <Button onPress={ this.login } title="Sign in"/>
                        <Text style={ styles.ran_info }>Or</Text>
                        <TouchableOpacity onPress={ this._fbSignin }><Text>Login with Facebook</Text>
                        </TouchableOpacity>
                    </View>
                </View>  
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ran_info: {
        textAlign: 'center',
        fontSize: 17,
        padding: 3
    },
    login: {
        width: '70%'
    },
    login_header: {
        fontSize: 20,
        marginBottom: 10
    },
    textField: {
        padding: 5
    },
    form: {
        borderWidth: 0.3,
        borderColor: '#d9d9d9',
        padding: 10
    },
    feedback: {
        padding: 5,
        fontSize: 16,
        color: '#8e8d8a'
    },
    googleButton: {
        width: '100%',
        height: 48
    }
});