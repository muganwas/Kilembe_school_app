import React from 'react';
import { TouchableOpacity, WebView, View, Text, AsyncStorage } from 'react-native';
import styles from '../otherJs/styles';
import firebase from 'react-native-firebase';
import rebase from 're-base';
//import base from '../otherJs/base';
let base = rebase.createClass(firebase.database());

export default class Video extends React.Component{
    constructor(props){
        super(props);
        console.ignoredYellowBox = [
            'Setting a timer'
        ];
        let vidUrl = this.props.url;
        let courseTitle = this.props.courseTitle;
        this.state={
            currentVid: vidUrl,
            playlist: {}
        }
    }
    componentWillMount(){
        AsyncStorage.multiGet(['@courseTitle', '@userId']).then((data)=>{
            let userID = data[1][1];
            let courseTitle = data[0][1];
            let iniCourseTitle = this.state.courseTitle;
            if(iniCourseTitle === null || iniCourseTitle === undefined){
                this.setState({
                    courseTitle: courseTitle
                });
            }
            if(userID !== null && userID !== undefined){
                base.syncState(`users/${ userID }/playlist`, {
                        context: this,
                        state: 'playlist'
                });
            }            
        });
    }
    componentDidMount(){
        AsyncStorage.multiGet(['@courseTitle', '@userId', '@currentVid']).then((data)=>{
            let userID = data[1][1];
            let courseTitle = data[0][1];
            let currentVid = data[2][1];
            let iniCourseTitle = this.state.courseTitle;
            let playlist = {...this.state.playlist};
            playlist[courseTitle] = currentVid;
            this.setState({
                playlist: playlist
            });
            if(iniCourseTitle === null || iniCourseTitle === undefined){
                this.setState({
                    courseTitle: courseTitle,

                });
            }
        });
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            currentVid: nextProps.url,
            courseTitle: nextProps.courseTitle
        });
    }
    removeVid=(key)=>{
        let playlist = {...this.state.playlist};
        delete playlist[key];
        AsyncStorage.getItem('@userId').then((data)=>{
            console.log("user ",data)
            let rootRef = firebase.database().ref("/users/" + data);
            rootRef.update({
                playlist:playlist
            });
        });

    }
    displayPlayList=(key)=>{
        let playlist = this.state.playlist;
        let vid = playlist[key];
        let playlistLen = Object.keys(playlist).length;
        if(playlistLen > 0){
            return(
                <View style={ styles.playlist } key={ key }>
                    <TouchableOpacity 
                    style={ styles.playlistItem } 
                    onPress={ this.removeVid.bind(this, key) }
                    >
                    <Text style={ styles.playlistText }>{ key }</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }
    videoSource = ()=>{
        let playlist = this.state.playlist;
        let playlistLen = Object.keys(playlist).length;
        let iniVid = "https://www.youtube.com/embed/gfkTfcpWqAY";
        let inividArr = iniVid.split('/');
        if(playlistLen===0 && playlist !== undefined && playlist !== null){
            return iniVid;
        }else if(playlistLen>=1){
            let vidArr = Object.values(playlist);
            let vidArrLen = vidArr.length;
            //console.log(vidArrLen);
            let count = 0;
            let pLUrl = vidArr[0] + "?enablejsapi=1&playlist=";
            for(count; count<vidArrLen; count++){
                let currUrl = vidArr[count];
                let currUrlArr = currUrl.split('/');
                let vidId = currUrlArr[4];
                if(count== 0 && currUrl === vidArr[0]){
                    pLUrl +='';
                }
                else if(count<(vidArrLen-1)){
                    pLUrl += vidId + ",";
                }else{
                    pLUrl += vidId;
                } 
            }
            return pLUrl;
        }
    }
    render(){
        let vidUrl = this.videoSource;
        let courseTitle = this.state.courseTitle;
        return(
            <View style={ styles.vidContainer } >
                <Text>{ courseTitle }</Text>
                <WebView
                    source={{ uri: vidUrl() }}
                    style = { styles.video }
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                />
                <View style = { styles.playlistHead }><Text style = { styles.h1 }>Play List</Text><Text style={ styles.playlistInfo }>*Tap to delete from playlist</Text></View>
                { Object.keys(this.state.playlist).map(this.displayPlayList) }
            </View>  
        )
    }
}