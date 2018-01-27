import React from 'react';
import { WebView, View, Text } from 'react-native';
import styles from '../otherJs/styles';

export default class Video extends React.Component{
    constructor(props){
        super(props);
        let vidUrl = this.props.url;
        let courseTitle = this.props.courseTitle;
        this.state={
            currentVid: vidUrl,
            courseTitle: courseTitle
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            currentVid: nextProps.url,
            courseTitle: nextProps.courseTitle
        });
    }
    render(){
        let vidUrl = this.state.currentVid;
        let courseTitle = this.state.courseTitle;
        return(
            <View style={ styles.vidContainer } >
                <Text>{ courseTitle }</Text>
                <WebView
                    source={{ uri: vidUrl }}
                    style = { styles.video }
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                  />
            </View>  
        )
    }
}