import * as React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {DrawerItems} from 'react-navigation-drawer'
import {Avatar} from 'react-native-elements'
import firebase from 'firebase'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import axios from 'axios'
import db from '../config'

export default class CustomSidebarMenu extends React.Component{

    constructor()
    {
        super()
        this.state = {
            image: '#',
            name: '',
            userId: firebase.auth().currentUser.email,
            docId: ''
        }
    }

    componentDidMount = () => {
        this.fetchImage(this.state.userId)
        this.getUserProfile()
    }

    selectPicture = async () => {
        //using image picker to select the image from the phone gallery
        const {cancelled, uri} = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1
        })
        if(!cancelled)
        {
            /*this.setState({
                image: uri
            })*/
            this.uploadImage(uri, this.state.userId)
        }
    }

    uploadImage = async (uri, imageName) => {
        //to upload the image to the cloud storage
        var response = await fetch(uri)
        var blob = await response.blob()
        var ref = firebase.storage().ref().child('user_profiles/'+imageName)
        return ref.put(blob).then((response)=> {
            this.fetchImage(imageName)
        })
    }

    getUserProfile =() =>{ 
        db.collection('users').where('email_id', '==', this.state.userId)
        .onSnapshot((querySnapshot)=> {
            querySnapshot.forEach((doc)=> {
                this.setState({
                    name: doc.data().first_name + ' ' + doc.data().last_name,
                    docId: doc.id,
                    image: doc.data().image
                })
            })
        })
    }

    fetchImage = (imageName) => {
        //to get the image from the cloud storage
        var storageRef = firebase.storage().ref().child('user_profiles/'+imageName)
        //get the download url
        storageRef.getDownloadURL().then((url)=> {
            this.setState({
                image: url
            })
            .catch((error)=> {
                this.setState({
                    image: "#"
                })
            })
        })
    }

    render()
    {
        return(
            <View style = {styles.container}>
                <View style = {{flex: 0.5, alignItems: 'center', backgroundColor: 'orange'}}>
                    <Avatar
                    rounded
                    source = {{uri: this.state.image}}
                    size = 'medium'
                    onPress = {()=> {
                        this.selectPicture()
                    }}
                    containerStyle = {styles.imageContainer}
                    showEditButton
                    />
                    <Text style = {{fontWeight: '100', fontSize: 20, paddingTop: 10}}>
                        {this.state.name}
                    </Text>
                </View>
                <View style = {styles.drawerItemsContainer}>
                    <DrawerItems
                    {...this.props}
                    />
                </View>
                <View style = {styles.logOutContainer}>
                    <TouchableOpacity
                    style = {styles.logOutButton}
                    onPress = {()=> {
                        this.props.navigation.navigate('WelcomeScreen')
                        firebase.auth().signOut()
                    }}
                    >
                        <Text>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : { 
        flex:1 
    }, 
    drawerItemsContainer:{ 
        flex:0.8 
    }, 
    logOutContainer : { 
        flex:0.2, 
        justifyContent:'flex-end', 
        paddingBottom:30 
    }, 
    logOutButton : { 
        height:30, 
        width:'100%', 
        justifyContent:'center', 
        padding:10 
    }, 
    logOutText:{ 
        fontSize: 30, 
        fontWeight:'bold' 
    },
    imageContainer: { flex: 0.75, width: "40%", height: "20%", marginLeft: 20, marginTop: 30, borderRadius: 40, 
    },
})