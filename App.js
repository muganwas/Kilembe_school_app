import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import { emailregex, passRegex } from './otherJs/helpers';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import FBSDK, { AccessToken, LoginManager, GraphRequest, GraphRequestManager, LoginButton } from 'react-native-fbsdk';
import HomeScreen from './components/HomeScreen';
import styles from './components/styles'
var kati = [];
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
            feedback: null
        }
    }
    componentWillUnmount(){
        
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
    _logout = ()=>{
        this.setState({
            username: null,
            email: null
        });
    }
    _googleSignin = ()=>{
        GoogleSignin.hasPlayServices({ autoResolve: true }).then(() => {
            // play services are available. can now configure library
            //alert('all good');
            GoogleSignin.configure({
                scopes: [ 'https://www.googleapis.com/auth/userinfo.email' ],
                shouldFetchBasicProfile: true,
                webClientId: "10397586510-h1ldn1mju44ljno5qo5qumnrnq3402pb.apps.googleusercontent.com",//from developers console
                //forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login
              }).then((data) => {
                
                GoogleSignin.signIn()
                .then((user) => {
                //console.log(user.name);
                    this.setState({
                        username: user.name,
                        email: user.email
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
        let username = this.state.username;
        let email = this.state.email;
        if(username !== null && username !== ''){
            return (
                <View>
                    <HomeScreen logout={ this._logout } username={ this.state.username } email={ this.state.email } />
                </View>
            );
        }else{
            return (
                <View style = { styles.container }>
                    <View style = { styles.login }>
                        <Text style ={ styles.login_header }>Kilembe Login</Text>
                        <Text style ={ styles.feedback }>{ this.state.feedback }</Text>
                        <View style = { styles.form }>
                            <TextInput style = { styles.textField } onChangeText={ this.username} placeholder="Email Address" id="username" />
                            <TextInput style = { styles.textField } value={ this.state.hpassval } onChangeText={ this.password } placeholder="Password" id="passord" />
                            <Button onPress={ this.login } title="Login"/>
                            <Text style={ styles.ran_info }>Or</Text>
                            <View style={ styles.facebook }>
                                <TouchableOpacity onPress={ this._fbSignin }>
                                <Image style={ styles.facebook_image } source={ require('./images/facebook/facebook7-text.png')} />
                                </TouchableOpacity>
                            </View>
                            <GoogleSigninButton 
                            style={ styles.googleButton }
                            size={GoogleSigninButton.Size.Wide}
                            color={GoogleSigninButton.Color.Dark}
                            onPress={ this._googleSignin }
                            /> 
                        </View>
                    </View>  
                </View>
            );  
        }
    }
}