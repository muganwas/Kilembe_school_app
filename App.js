import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { emailregex, passRegex } from './otherJs/helpers';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import FBSDK, { AccessToken, LoginManager, GraphRequest, GraphRequestManager, LoginButton } from 'react-native-fbsdk';
import HomeScreen from './components/HomeScreen';
import Signup from './components/Signup';
import Login from './components/Login';
import Reset from './components/Reset';
import styles from './otherJs/styles'
var fname = '';
var femail = '';
var aT = '';
export default class App extends React.Component {
    constructor(){
        super();
        this.state={
            password: null,
            hpassval: null,
            passhidden: true,
            feedback: null,
            signup: false,
            reset: false
        }
    }
    componentWillMount(){
        AsyncStorage.getItem('signup').then((data)=>{
            this.setState({
                signup: JSON.parse(data)
            });
        });
        AsyncStorage.getItem('reset').then((data)=>{
            this.setState({
                reset: JSON.parse(data)
            });
        });
        AsyncStorage.getItem('@username').then((data)=>{
            console.log('username: ', data);
            if((data !== null && data !== undefined)){
                this.setState({
                    username: data,
                });
            }
            AsyncStorage.getItem('@email').then((data1)=>{
                if((data1 !== null && data1 !== undefined)){
                    this.setState({
                        email: data1,
                    });
                }
            });
        });
    }
    _showLogin=()=>{
        AsyncStorage.setItem('signup', 'false');
        AsyncStorage.setItem('reset', 'false');
        this.setState({
            signup: false,
            reset: false
        });
    }
    _showSignup=()=>{
        AsyncStorage.setItem('signup', 'true');
        AsyncStorage.setItem('reset', 'false');
        this.setState({
            signup: true,
            reset: false
        });
    }
    _showReset=()=>{
        AsyncStorage.setItem('reset', 'true');
        AsyncStorage.setItem('signup', 'false');
        this.setState({
            signup: false,
            reset: true
        });
    }
    _login = ()=>{
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
    _logout = ()=>{
        this.setState({
            username: null,
            email: null
        });
        AsyncStorage.multiRemove(['@email', '@username'], ()=>{
            console.log('User logged out!');
        });
    }
    _resetPassword = ()=>{

    }
    _googleSignin = ()=>{
        GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
            // play services are available. can now configure library
            //alert('all good');
            GoogleSignin.configure({
                scopes: [ 'https://www.googleapis.com/auth/userinfo.email' ],
                shouldFetchBasicProfile: true,
                webClientId: "576509237424-inui69nhpenpgea32mb45tto7vrse2d2.apps.googleusercontent.com",//from developers console
                //forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
              }).then((data) => {
                
                GoogleSignin.signIn()
                .then((user) => {
                //console.log(user.name);
                    this.setState({
                        username: user.name,
                        email: user.email
                    });
                    AsyncStorage.multiSet([['@username', user.name], ['@email', user.email]], ()=>{
                        console.log('Username and email, set!');
                    });
                })
                .catch((err) => {
                console.log('WRONG SIGNIN', err);
                })
                .done();             
              });
        }).catch((err) => {
          console.log("Play services error", err.code, err.message);
        })
    }
    
    _fbSignin = ()=> {
        LoginManager.logInWithReadPermissions(['email', 'public_profile', 'user_birthday']).then((result)=>{
              if (result.isCancelled) {
                alert('Login cancelled');
                console.log('Login cancelled');
              }else{
                //get user access token
                AccessToken.getCurrentAccessToken().then((data)=>{
                    aT = data.accessToken;  
                    //console.log(aT.toString());
                    const _responseInfoCallback= (error, result)=>{
                        if (error) {
                          alert('Error fetching data: ' + error.toString());
                        } else {
                            fname = result.name.toString();
                            femail = result.email.toString();
                            //console.log('Success fetching data: ' + fname + ' ' + femail);
                            if(fname !== '' && fname !== null){
                                this.setState({
                                    username: fname,
                                    email: femail
                                });
                                AsyncStorage.multiSet([['@username', fname], ['@email', femail]], ()=>{
                                    console.log('username and email, set!');
                                });
                            }                     
                        } 
                      }
                    const infoRequest = new GraphRequest(
                        '/me',
                        {
                            accessToken: aT,
                            parameters: {
                                fields: {
                                    string: 'email,name,first_name,last_name'
                                }
                            }
                        },
                        _responseInfoCallback
                    );
                    new GraphRequestManager().addRequest(infoRequest).start();
                });
              }
            },
            function(error) {
              alert('Login fail with error: ' + error);
            }
        );
    }
    render() {
        let username = this.state.username;
        let email = this.state.email;
        let signup = this.state.signup;
        let reset = this.state.reset;
        if(username !== null && username !== '' && username !== undefined){
            return (
                <View>
                    <HomeScreen logout={ this._logout } username={ this.state.username } email={ this.state.email } />
                </View>
            );
        }else if(username === null || username === '' || username === undefined) {
            if(signup === false && reset === false){
                return (
                    <View style = { styles.container }>
                        <View style = { styles.login }>
                            <Login username={ this.username } password={ this.password } showSignup={ this._showSignup } showReset={ this._showReset } login={ this._login} fbLogin={ this._fbSignin } googleLogin={ this._googleSignin }  />
                        </View>  
                    </View>
                );
            }else if(signup === true && reset === false){
                return(
                    <View style={ styles.container }>
                        <View style={ styles.login }>
                            <Signup reset={ this._showReset } login={ this._showLogin } />
                        </View>
                    </View>
                );
            }else if( reset === true && signup === false){
                return(
                    <View style={ styles.container }>
                        <View style={ styles.login }>
                            <Reset resetPass={ this._resetPassword } signup={ this._showSignup } login={ this._showLogin } />
                        </View>
                    </View>
                )
            }   
        }
    }
}