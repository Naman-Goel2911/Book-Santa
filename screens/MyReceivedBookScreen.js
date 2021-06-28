import * as React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, FlatList} from 'react-native'
import MyHeader from '../components/MyHeader'
import {ListItem, Icon} from 'react-native-elements'
import firebase from 'firebase'
import db from '../config'

export default class MyReceivedBooksScreen extends React.Component{

    constructor()
    {
        super()
        this.state = {
            receivedBookList: [],
            userId: firebase.auth().currentUser.email
        }
        this.requestRef = null
    }

    componentDidMount = () => {
        this.getReceivedBooksList()
    }

    componentWillUnmount = () => {
        this.requestRef()
    }

    getReceivedBooksList = () => {
        this.requestRef = db.collection('receivedBooks').where('user_id', '==', this.state.userId)
        .where('book_status', '==', 'received')
        .onSnapshot((snapshot)=> {
            var receivedBooksList = snapshot.docs.map((doc)=> {
                doc.data()
            })
            this.setState({
                receivedBookList: receivedBookList
            })
        })
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({item, i} ) => {
        return(
            <ListItem 
            key = {i}
            title = {item.book_name}
            subtitle = {item.bookStatus}
            titleStyle = {{color: 'black', fontWeigth: 'bold'}}
            bottomDivider
            />
        ) 
    }

    render()
    {
        return(
            <View style = {{flex: 1}}>
                <MyHeader 
                title = "Received Books"
                navigation = {this.props.navigation}
                />
                <View style = {{flex: 1}}>
                    {
                        this.state.receivedBookList.length === 0
                        ?
                        (
                            <View style = {styles.subContainer}>
                                <Text style = {{fontSize: 20}}>List of all received books</Text>
                            </View>
                        )
                        : 
                        (
                            <FlatList 
                            keyExtractor = {this.keyExtractor}
                            data = {this.state.receivedBookList}
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
    subContainer:{ 
        flex:1, 
        fontSize: 20, 
        justifyContent:'center', 
        alignItems:'center' 
    }, 
    button:{ 
        width:100, 
        height:30, 
        justifyContent:'center', 
        alignItems:'center', 
        backgroundColor:"#ff5722", 
        shadowColor: "#000", 
        shadowOffset: { 
            width: 0, 
            height: 8 
        } 
    } 
})