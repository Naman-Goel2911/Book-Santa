import * as React from 'react'
import {Text, View, StyleSheet, FlatList} from 'react-native'
import {Icon, ListItem} from 'react-native-elements'
import firebase from 'firebase'
import db from '../config'
import MyHeader from '../components/MyHeader'
import SwipableFlatList from '../components/SwipableFlatList'

export default class NotificationsScreen extends React.Component{
    
    constructor(props)
    {
        super(props)
        this.state = {
            userId: firebase.auth().currentUser.email,
            allNotifications: []
        }
        this.notificationRef = null;
    }

    componentDidMount = () => {
        this.getNotifications()
    }

    componentWillUnmount = () => {
        this.notificationRef()
    }

    getNotifications = () => {
        this.notificationRef = db.collection('notifications').where('notification_status', '==', 'unread')
        .where('targeted_user_id', '==', this.state.userId)
        .onSnapshot((snapshot)=> {
            var allNotifications = []
            snapshot.docs.map((doc)=> {
                var notifications = doc.data()
                notifications["doc_id"] = doc.id
                allNotifications.push(notifications)
            })
            this.setState({
                allNotifications: allNotifications
            })
        })
    }

    keyExtractor = (item, index)=>index.toString()

    renderItem = ({item, index}) => {
        return(
            <ListItem 
            key = {index}
            leftElement = {<Icon name = 'book' type = 'font-awesome' color = 'white' />}
            title = {item.book_name}
            titleStyle = {{color: 'black', fontWeight: 'bold'}}
            subtitle = {item.message}
            bottomDivider
            />
        )
    }

    render()
    {
        return(
            <View style = {{flex: 1}}>
                <View style = {{flex: 0.1}}>
                    <MyHeader
                    title = {'Notifications'} navigation = {this.props.navigation}
                    />
                </View>
                <View style = {{flex: 0.9}}>
                    {
                        this.state.allNotifications.length === 0
                        ?
                        (
                            <View>
                                <Text>You have no notifications</Text>
                            </View>
                        )
                        :
                        (
                            <SwipableFlatList 
                            allNotifications = {this.state.allNotifications}
                            />
                        )
                    }
                </View>
            </View>
        )
    }
}