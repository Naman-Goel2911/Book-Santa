import * as React from 'react'
import {Text, View, TouchableOpacity, FlatList, StyleSheet} from 'react-native'
import {ListItem, Icon} from 'react-native-elements'
import firebase from 'firebase'
import db from '../config'
import MyHeader from '../components/MyHeader'

export default class MyDonationScreen extends React.Component{
    static navigationOptions = { header: null }

    constructor()
    {
        super()
        this.state = {
            donorId: firebase.auth().currentUser.email,
            donorName: '',
            allDonations: []
        }
        this.requestRef = null
    }

    componentDidMount = () => {
        this.getAllDonations()
        this.getDonorDetails(this.state.donorId)
    }

    componentWillUnmount()
    {
        this.requestRef()
    }

    getAllDonations = () => {
        this.requestRef = db.collection('all_donations').where('donor_id', '==', this.state.donorId)
        .onSnapshot((snapshot)=> {
            var allDonations = []
            snapshot.docs.map((doc)=> {
                var donation = doc.data()
                donation['doc_id']= doc.id
                allDonations.push(donation)
            });
            this.setState({
                allDonations: allDonations
            })
        })
    }

    sendNotification = (bookDetail, requestStatus) => {
        var requestId = bookDetail.request_id
        var donorId = bookDetail.donor_id
        db.collection('notifications').where('request_id', '==', requestId)
        .where('donor_id', '==', donorId).get()
        .then((snapshot)=> {
            snapshot.forEach((doc)=> {
                var message = ''
                if(requestStatus === 'bookSent')
                {
                    message = this.state.donorName+' sent you the book'
                }
                else{
                    message = this.state.donorName+ ' has shown interest in donating he book'
                }
                db.collection('notifications').doc(doc.id).update({
                    message: message,
                    notification_status: 'unread',
                    date: firebase.firestore.FieldValue.serverTimestamp()
                })
            })  
        })
    }

    sendBook = (bookDetails) => {
        if(bookDetails.request_status === "bookSent")
        {
            var requestStatus = 'donorInterested'
            db.collection('all_donations').doc(bookDetails.doc_id).update({
                request_status: 'donorInterested'
            })
            this.sendNotification(bookDetails, requestStatus)
        }
        else{
            var requestStatus = 'bookSent'
            db.collection('all_donations').doc(bookDetails.doc_id).update({
                request_status: 'bookSent'
            })
            this.sendNotification(bookDetails, requestStatus)
        }
    }

    getDonorDetails = (donorId) =>{
        db.collection('users').where('email_id', '==', donorId).get()
        .then((snapshot)=> {
            snapshot.forEach((doc)=> {
                this.setState({
                    donorName: doc.data().first_name+ ' ' + doc.data().last_name
                })
            })
        })
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({item, i}) => {
        <ListItem 
        key = {i}
        title = {item.book_name}
        subtitle = {'Requested by: ' + item.requested_by+'n/status' + item.request_status}
        leftElement = {<Icon name = 'book' type = 'font-awesome' color = '#696969' />}
        titleStyle = {{color: 'black', fontWeight: 'bold'}}
        rightElement = {
            <TouchableOpacity 
            style = {[styles.button, {
                backgroundColor: item.request_status === 'bookSent'?'green': 'red'
            }]}
            onPress = {()=> {
                this.sendBook(item)
            }} 
            >
                <Text style = {{color: '#ffff'}}> {
                    item.request_status === 'bookSent'? 'Book Sent' : 'Send Book'
                } </Text>
            </TouchableOpacity>
        }
        bottomDivider
        />
    }

    render()
    {
        return(
            <View style = {{flex: 1}}>
                <MyHeader 
                title = 'My Donations'
                navigation = {this.props.navigation}
                />
                <View style = {{flex: 1}}>
                    {
                        this.state.allDonations.length === 0 
                        ?(
                            <View style = {styles.subtitle}>
                                <Text style = {{fontSize: 20}}>
                                    List of all book donations
                                </Text>
                            </View>
                        )
                        :(
                            <FlatList 
                            keyExtractor = {this.keyExtractor}
                            data = {this.state.allDonations}
                            renderItem = {this.renderItem}
                            />
                        )
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        width:200, 
        height:50, 
        justifyContent:'center', 
        alignItems : 'center', 
        borderRadius: 10, 
        backgroundColor: 'orange', 
        shadowColor: "#000", 
        shadowOffset: { 
            width: 0, 
            height: 8 
        }, 
        elevation : 16 
    },
    subtitle: {
        color: 'red', 
        fontSize: 20, 
        fontWeight: 'bold'
    }
})