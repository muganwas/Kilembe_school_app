import React from 'react';
import{ TouchableOpacity, View, Text } from 'react-native';
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
        return(
            <View style = { styles.header } >
                <Text style={ styles.homeText }>You're in { username }</Text>
                <TouchableOpacity style={ styles.logoutButton } onPress={ this.props.logout }>
                    <Text style={ styles.logoutButtonText }>Logout</Text>
                </TouchableOpacity>
            </View>  
        );
    }
}