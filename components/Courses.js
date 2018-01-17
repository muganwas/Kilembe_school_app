import React from 'react';
import{ TouchableOpacity, View, Text } from 'react-native';
import styles from '../otherJs/styles';

export default class Courses extends React.Component {
    constructor(props){
        super(props)
        let username = this.props.username;
        this.state= {
            username: username
        }
    }
    componentWillMount(){
        
    }
    render(){
        let username = this.props.username;
        let email = this.props.email;
        return(
            <View style = { styles.section } >

            </View>  
        );
    }
}