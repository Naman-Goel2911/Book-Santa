import * as React from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native'
import db from '../config'
import {SearchBar, ListItem} from 'react-native-elements'
//import {SafeAreaProvider} from 'react-native-safe-area-context'
import MyHeader from '../components/MyHeader'

export default class BookDonateScreen extends React.Component{

    constructor(){
        super()
        this.state = {
            search: '',
            requestedBookList: [],
        }
        this.requestRef = null
    }

    getRequestedBooksList = () => {
        this.requestRef = db.collection('bookRequests')
        .onSnapshot((snapshot)=>{
            var requestedBookList = snapshot.docs.map(document=> document.data())
            console.log(requestedBookList)
            this.setState({
                requestedBookList: requestedBookList
            })
        })
    }

    componentDidMount = () => {
        this.getRequestedBooksList()
    }

    componentWillUnmount = () => {
        this.requestRef()
    }

    keyExtractor = (item, index) => index.toString()
    

    renderItem = ({item, i}) => {
        return (
            <ListItem 
            key = {i}
            title = {item.book_name}
            subtitle = {item.reason_to_request}
            titleStyle = {{color: 'black', fontWeight: 'bold'}}
            leftElement = {<Image 
                style = {{height: 50,
                width: 50
            }}
            source = {{uri: item.image_link}}
            />}
            rightElement = {
                <TouchableOpacity 
                style = {styles.button} 
                onPress = {()=> {
                    this.props.navigation.navigate('ReceiverDetails', {details: item})
                }}>
                    <Text style = {{color: "black"}}>View</Text>
                </TouchableOpacity>
            }
            bottomDivider
            />
        )
    }

    render()
    {
        return(
            <View style = {{flex: 1}}>
                
                    <MyHeader title = 'Donate Books' navigation = {this.props.navigation} />
                    <View style = {{flex: 1}}>
                        {
                            this.state.requestedBookList.length===0
                            ?(
                                <View style = {styles.subContainer}>
                                    <Text style = {{fontSize: 20}}>List of all requested books</Text>
                                </View>
                            )
                            :(
                                <FlatList
                                keyExtractor = {this.keyExtractor}
                                data = {this.state.requestedBookList}
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
    searchBar: {
        borderWidth: 2,
        height: 30,
        width: 300,
        paddingLeft: 10,
    },
    searchButton: {
        borderWidth: 1,
        height: 30,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange'
    },
    subContainer:{ flex:1, fontSize: 20, justifyContent:'center', alignItems:'center' }, 
    button:{ width:100, height:30, justifyContent:'center', alignItems:'center', backgroundColor:"#ff5722", shadowColor: "#000", shadowOffset: { width: 0, height: 8 } } })
