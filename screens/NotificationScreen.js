import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity} from 'react-native';
import {Card, Header, Icon} from 'react-native-elements'
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';
import { SnapshotViewIOS } from 'react-native';
import SwipeableFlatlist from '../components/SwipeableFlatlist';


export default class NotificationScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            userid:firebase.auth().currentUser.email,
            allNotifications:[]
        };
        this.Notification = null
    }

    getNotifications=()=>{
        this.requestref = db.collection("all_notifications")
        .where("notification_status","==","unread")
        .where("targeted_user_id","==",this.state.userid)
        .onSnapshot((snapshot)=>{
            var allNotifications = []
            snapshot.docs.map((doc)=>{
                var notification = doc.data()
                notification["doc_id"]=doc.id
                allNotifications.push(notification)
            });
            this.setState({
                allNotifications:allNotifications
            })
        })
    }

    componentDidMount(){
        this.getNotifications()
    }

    keyExtractor = (item,index)=>index.toString()

    renderItem = ({item,index})=>{
        return(
            <ListItem
            key = {index}
            leftElement = {<Icon name="book" type="font-awesome" color='#696969'/>}
            title={item.book_name}
            titleStyle={{color:'black',fontWeight:'bold'}}
            subtitle={item.message}
            bottomDivider
            />
        )
    }
    render(){
        return(
            <View>
                <MyHeader navigation={this.props.navigation} title="My Notifications"/>
                    <View style={{flex:1}}>
           {
             this.state.allNotifications.length === 0?(
                        <View >
                            <Text style={{ fontSize: 20}}> List of all Notifications </Text>
                        </View>
             )
             :(
                            <SwipeableFlatlist allNotifications={this.state.allNotifications}
                            />
             )
           }
                    </View>
            </View>
        )
    }
}