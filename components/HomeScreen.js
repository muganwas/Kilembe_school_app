import React from 'react';
import{ TouchableOpacity, View, Text } from 'react-native';
import styles from '../otherJs/styles';
import Header from './Header';
import Courses from './Courses';

export default class HomeScreen extends React.Component {
    constructor(props){
        super(props)
        let username = this.props.username;
        this.state= {
            username: username
        }
    }
    render(){
        let username = this.props.username;
        let logout = this.props.logout;
        let email = this.props.email;
        return(
            <View style={ styles.home }>
                <Header username={ username } logout = { logout } />
                <Courses username={ username } email={ email } /> 
            </View>
        );
    }
}