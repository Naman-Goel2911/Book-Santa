import * as React from 'react'
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native'
import firebase from 'firebase'
import db from '../config'
import {Header, Icon, Card} from 'react-native-elements'

export default class ReceiverDetailsScreen extends React.Component{
    constructor(props)
    {
        super(props)
        this.state = {
            userId: firebase.auth().currentUser.email,
            receiverId: this.props.navigation.getParam('details')["user_id"],
            requestId: this.props.navigation.getParam('details')['request_id'],
            bookName: this.props.navigation.getParam('details')["book_name"],
            reason_For_Requesting: this.props.navigation.getParam('details')['reason_to_request'],
            receiverName: '',
            receiverContact: '',
            receiverAddress: '',
            receiverRequestDocId: '',
            userName: ''
        }
    }

    componentDidMount()
    {
        this.getReceiverDetails()
    }

    getReceiverDetails = () => {
        db.collection('users').where('email_id', '==', this.state.receiverId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=> {
                this.setState({
                    receiverName: doc.data().first_name,
                    receiverContact: doc.data().contact,
                    receiverAddress: doc.data().address,
                })
            })
        })
        db.collection('bookRequests').where('request_id', '==', this.state.requestId).get()
        .then((snapshot)=> {
            snapshot.forEach((doc)=> {
                this.setState({
                    receiverRequestDocId: doc.id,
                })
            })
        })
    }

    updateBookStatus = () => {
        db.collection('all_donations').add({
            book_name: this.state.bookName,
            request_id: this.state.requestId,
            requested_by: this.state.receiverName,
            donor_id: this.state.userId,
            request_status: 'donorInterested'
        })
    }

    addNotifications = () => {
        var message = this.state.userName+' has shown interest in donating the book'
        db.collection('notifications').add({
            targeted_user_id: this.state.receiverId,
            donor_id: this.state.userId,
            request_id: this.state.requestId,
            book_name: this.state.bookName,
            date: firebase.firestore.FieldValue.serverTimestamp(),
            notification_status: 'unread',
            message: message
        })
    }

    render()
    {
        return(
            <View style = {styles.container}>
                <View style = {{flex: 0.1}}>
                    <Header 
                    leftComponent = {<Icon name = 'arrow-left' type = 'feather' color = 'black' onPress = {()=> {
                        this.props.navigation.goBack()
                    }} 
                    centerComponent = {{text: 'Donate Book', style: {color: 'black', fontSize: 20, fontWeight: 'bold'}}}
                    />}
                    backgroundColor = 'yellow'
                    />
                </View>
                <View style = {{flex: 0.3}}>
                    <Card
                    title = {'Book Information'}
                    titleStyle = {{fontSize: 20}}
                    >
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>
                                Name: {this.state.bookName}
                            </Text>
                        </Card>
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>
                                Reason: {this.state.reason_For_Requesting}
                            </Text>
                        </Card>
                    </Card>
                </View>
                <View style = {{flex: 0.3}}>
                <Card
                    title = {'Receiver Information'}
                    titleStyle = {{fontSize: 20}}
                    >
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>
                                Name: {this.state.receiverName}
                            </Text>
                        </Card>
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>
                                Contact: {this.state.receiverContact}
                            </Text>
                        </Card>
                        <Card>
                            <Text style = {{fontWeight: 'bold'}}>
                                Address: {this.state.receiverAddress}
                            </Text>
                        </Card>
                    </Card>
                </View>
                <View style = {styles.buttonContainer}>
                    {
                        this.state.receiverId !== this.state.userId
                        ?(
                            <TouchableOpacity
                            style = {styles.button}
                            onPress = {()=> {
                                this.updateBookStatus()
                                this.addNotifications()
                                this.props.navigation.navigate('MyDonations')
                            }}
                            >
                                <Text>I want to donate</Text>
                            </TouchableOpacity>
                        )
                        : null
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({ 
    container: { flex:1, }, 
    buttonContainer : { flex:0.3, justifyContent:'center', alignItems:'center' }, 
    button:{ width:200, height:50, justifyContent:'center', alignItems : 'center', borderRadius: 10, backgroundColor: 'orange', shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, elevation : 16 } 
})