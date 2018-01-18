import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { emailregex, passRegex } from './otherJs/helpers';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import FBSDK, { AccessToken, LoginManager, GraphRequest, GraphRequestManager, LoginButton } from 'react-native-fbsdk';
import HomeScreen from './components/HomeScreen';
import Signup from './components/Signup';
import Login from './components/Login';
import Reset from './components/Reset';
import styles from './otherJs/styles';
import base from './otherJs/base';
var fname = '';
var femail = '';
var aT = '';
var kati = [];
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
        AsyncStorage.multiGet(['signup', 'reset', '@username', '@email']).then((data)=>{
            //console.log(data);
            let signup = JSON.parse(data[0][1]);
            let reset = JSON.parse(data[1][1]);
            let username = JSON.parse(data[2][1]);
            let email = JSON.parse(data[3][1]);
            this.setState({
                signup: signup,
                reset: reset,
                username: username,
                email: email
            });
        });
    }
    _showLogin=()=>{
        AsyncStorage.multiSet([['signup', 'false'], ['reset', 'false']], ()=>{
            this.setState({
                signup: false,
                reset: false,
                feedback: null,
                hpassval: null
            });
        });
    }
    _showSignup=()=>{
        AsyncStorage.multiSet([['signup', 'true'], ['reset', 'false']], ()=>{
            this.setState({
                signup: true,
                reset: false,
                feedback: null,
                hpassval: null
            });
        });
    }
    _showReset=()=>{
        AsyncStorage.multiSet([['signup', 'false'], ['reset', 'true']], ()=>{
            this.setState({
                signup: false,
                reset: true,
                feedback: null
            });
        }); 
    }
    _logout = ()=>{
        AsyncStorage.multiRemove(['@email', '@username'], ()=>{
            console.log('User logged out!');
            this.setState({
                username: null,
                email: null,
                feedback: null
            });
        });
    }
    _resetPassword = ()=>{
        let email = this.state.email;
        if(email.match(emailregex)){
            this.setState({
                feedback: null
            });
            base.auth().sendPasswordResetEmail(email).then(()=>{
                this.setState({
                    feedback: 'A password reset link was sent to ' + email
                });
            }, (error)=>{
                console.log(error.message);
                this.setState({
                    feedback: 'This email address could not be found in our database, please signup'
                });
            });
        }else{
            this.setState({
                feedback: 'Please enter a valid email address.'
            });
        }  
    }
    username = (event)=>{
        this.setState({
            email: event
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
    _login = ()=>{
        let uname = this.state.email;
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
                        let email = this.state.email;
                        let password = this.state.password;
                        let Rname = email.split('@');
                        let eDomain = Rname[1].split('.');
                        let eProv = eDomain[0];
                        let name = Rname[0];
                        let userId = name + eProv;
                        base.auth().signInWithEmailAndPassword(email, password).then((data)=>{
                            AsyncStorage.multiSet([['@username', name], ['@email', email]], ()=>{
                                this.setState({
                                    feedback: null,
                                    username: name,
                                    password: null,
                                    hpassval: null
                                });
                            });
                        }).catch((error)=>{
                            this.setState({
                                feedback: error.message
                            })
                        });
                    }else{
                        this.setState({
                            feedback: "Your password must contain a letter and a number, and no special."
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
                                AsyncStorage.multiSet([['@username', fname], ['@email', femail]], ()=>{
                                    console.log('username and email, set!');
                                    this.setState({
                                        username: fname,
                                        email: femail
                                    });
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
        let feedback = this.state.feedback;
        let username = this.state.username;
        let email = this.state.email;
        let hpassval = this.state.hpassval;
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
                            <Login feedback={ feedback } username={ this.username } password={ this.password } hpassval={ hpassval } showSignup={ this._showSignup } showReset={ this._showReset } login={ this._login } fbLogin={ this._fbSignin } googleLogin={ this._googleSignin }  />
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
                            <Reset feedback = { feedback } email={ this.username } resetPass={ this._resetPassword } signup={ this._showSignup } login={ this._showLogin } />
                        </View>
                    </View>
                )
            }   
        }
    }
}