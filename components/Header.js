import React from 'react';
import{ TouchableOpacity, View, Text, Image, AsyncStorage } from 'react-native';
import styles from '../otherJs/styles';

export default class Header extends React.Component {
    constructor(props){
        super(props)
        let username = this.props.username;
        this.state= {
            username: username
        }
    }
    render(){
        let username = this.props.username;
        let goTo = this.props.goTo;
        return(
            <View style = { styles.header } >
                <TouchableOpacity style={ styles.Button } onPress={ goTo.bind(this, "home") }><Image style={ styles.icon } source={ require('../images/icons/home.png')}/></TouchableOpacity>
                <TouchableOpacity style={ styles.Button } onPress={ goTo.bind(this, "vid") }><Image style={ styles.icon } source={ require('../images/icons/playlist.png')}/></TouchableOpacity>
                <TouchableOpacity style={ styles.Button } onPress={ goTo.bind(this, "profile") }><Image style={ styles.icon } source={ require('../images/icons/settings.png')}/></TouchableOpacity>
                <TouchableOpacity style={ styles.Button } onPress={ this.props.logout }>
                <Image style={ styles.icon } source={ require('../images/icons/exit.png')}/>
                </TouchableOpacity>
            </View>
        );
    }
}