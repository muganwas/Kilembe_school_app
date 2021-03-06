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
import firebase from 'react-native-firebase';
import FireBase from 'react-native-firebase';
var fname = '';
var femail = '';
var aT = '';
var kati = [];
export default class App extends React.Component {
    constructor(){
        super();
        console.ignoredYellowBox = [
            'Setting a timer'
        ];
        AsyncStorage.multiSet([['signup', 'false'], ['reset', 'false']]);
        this.state={
            password: undefined,
            hpassval: undefined,
            passhidden: true,
            feedback: undefined,
            signup: false,
            reset: false
        }
    }
    componentWillMount(){
        AsyncStorage.multiGet(['signup', 'reset', '@username', '@email', '@userId']).then((data)=>{
            //console.log(data);
            let signup = JSON.parse(data[0][1]);
            let reset = JSON.parse(data[1][1]);
            let username = data[2][1];
            let email = data[3][1];
            let userId = data[4][1];
            this.setState({
                signup: signup,
                reset: reset,
                username: username,
                email: email,
                userId: userId
            });
        });
    }
    _showLogin=()=>{
        AsyncStorage.multiSet([['signup', 'false'], ['reset', 'false']], ()=>{
            this.setState({
                signup: false,
                reset: false,
                feedback: undefined,
                hpassval: undefined
            });
        });
    }
    _showSignup=()=>{
        AsyncStorage.multiSet([['signup', 'true'], ['reset', 'false']], ()=>{
            this.setState({
                signup: true,
                reset: false,
                feedback: undefined,
                hpassval: undefined
            });
        });
    }
    _showReset=()=>{
        AsyncStorage.multiSet([['signup', 'false'], ['reset', 'true']], ()=>{
            this.setState({
                signup: false,
                reset: true,
                feedback: undefined
            });
        }); 
    }
    _logout = ()=>{
        firebase.auth().signOut().then(()=>{
            AsyncStorage.multiRemove(['@email', '@userId', '@username'], ()=>{
                console.log('User logged out!');
                this.setState({
                    username: null,
                    email: null,
                    feedback: null
                });
            });
        });
    }
    _resetPassword = ()=>{
        let email = this.state.email;
        if(email.match(emailregex)){
            this.setState({
                feedback: undefined
            });
            firebase.auth().sendPasswordResetEmail(email).then(()=>{
                this.setState({
                    feedback: 'A password reset link was sent to ' + email
                });
            }, (error)=>{
                console.log(error.message);
                this.setState({
                    feedback: 'This email address could not be found in our datafirebase, please signup'
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
                password: undefined,
                hpassval: undefined
            });
        }
    }
    _login = ()=>{
        let uname = this.state.email;
        let pass = this.state.password;
        if( (uname !== null && uname !== undefined) && (pass !== null && pass !== undefined) ){
            if(uname.match(emailregex)){
                this.setState({
                    feedback:undefined
                })
                let unameCount = (uname.split('')).length;
                let passCount = (pass.split('')).length;
                let unameFb = "*Username shouldn't be less than 5 characters.";
                let passFb = "*Password should'nt be less than 8 characters.";
                if(unameCount < 5){
                    let feedback = unameFb;
                    if(passCount < 8){
                        feedback = feedback + "\n" + passFb;
                        this.setState({
                            feedback: feedback
                        });
                    }else{
                        this.setState({
                            feedback: feedback
                        });
                    }
                }else if(passCount < 8){
                    feedback = passFb;
                    this.setState({
                        feedback: feedback
                    });
                }else{
                    if(pass.match(passRegex)){
                        //firefirebase login code will go here
                        let Lemail = this.state.email;
                        let password = this.state.password;
                        firebase.auth().signInWithEmailAndPassword(Lemail, password).then((user)=>{
                            let currUser = firebase.auth().currentUser;
                            let uid = currUser.uid;
                            let email = currUser.email;
                            let Rname = email.split('@');
                            let eDomain = Rname[1].split('.');
                            let eProv = eDomain[0];
                            let name = Rname[0];
                            AsyncStorage.multiSet([['@username', name], ['@userId', uid], ['@email', email], ['@id', uid]], ()=>{
                                this.setState({
                                    uid: uid,
                                    feedback: undefined,
                                    username: name,
                                    email: email,
                                    password: undefined,
                                    hpassval: undefined
                                });
                                console.log("Congrats!!! \n" + "Password: " + this.state.password);
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
                password: undefined
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
                GoogleSignin.signIn().then((user) => {
                //console.log(user.name);
                    let idToken = user.idToken;
                    let accessToken = user.accessToken;
                    const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
                    firebase.auth().signInWithCredential(credential).then((data)=>{
                        let currUser = firebase.auth().currentUser;
                        let name = currUser.displayName;
                        let uid = currUser.uid;
                        let email = currUser.email;
                        AsyncStorage.multiSet([['@username', name], ['@userId', uid], ['@email', email], ['@id', uid]], ()=>{
                            this.setState({
                                feedback: undefined,
                                username: name,
                                email: email,
                                uid: uid,
                                password: undefined,
                                hpassval: undefined
                            });
                        });           
                    });
                }).catch((err) => {
                    console.log('WRONG SIGNIN', err);
                }).done();             
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
                    const credential = firebase.auth.FacebookAuthProvider.credential(aT);
                    firebase.auth().signInWithCredential(credential).then((data)=>{
                        let currUser = firebase.auth().currentUser;//the uid i wanted all along
                        let name = currUser.displayName;
                        let uid = currUser.uid;
                        let email = currUser.email;
                        AsyncStorage.multiSet([['@username', name], ['@userId', uid], ['@email', email], ['@id', uid]], ()=>{
                            this.setState({
                                feedback: undefined,
                                username: name,
                                email: email,
                                uid: uid,
                                password: undefined,
                                hpassval: undefined
                            });
                        });           
                    });
                });
            }
        },function(error) {
              console.log('Login fail with error: ' + error);
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
                    <HomeScreen logout={ this._logout } username={ this.state.username } uid={ this.state.uid } email={ this.state.email } id={ this.state.id } />
                </View>
            );
        }else if(username === null || username === '' || username === undefined) {
            if(signup === false && reset === false){
                return (
                    <View style = { styles.container }>
                        <View style = { styles.login }>
                            <Login email={ email } feedback={ feedback } username={ this.username } password={ this.password } hpassval={ hpassval } showSignup={ this._showSignup } showReset={ this._showReset } login={ this._login } fbLogin={ this._fbSignin } googleLogin={ this._googleSignin }  />
                        </View>  
                    </View>
                );
            }else if(signup === true && reset === false){
                return(
                    <View style={ styles.container }>
                        <View style={ styles.login }>
                            <Signup email={ email } reset={ this._showReset } login={ this._showLogin } />
                        </View>
                    </View>
                );
            }else if( reset === true && signup === false){
                return(
                    <View style={ styles.container }>
                        <View style={ styles.login }>
                            <Reset userEmail = { email } feedback = { feedback } email={ this.username } resetPass={ this._resetPassword } signup={ this._showSignup } login={ this._showLogin } />
                        </View>
                    </View>
                )
            }   
        }
    }
}