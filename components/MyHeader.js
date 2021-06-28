import * as React from 'react';
import {View} from 'react-native'
import {Header, Icon, Badge} from 'react-native-elements';
import db from '../config'

export default class  MyHeader extends React.Component {

    constructor(props)
    {
        super(props)
        this.state = {
            value: '',
        }
    }

    componentDidMount = () => {
        this.getNumberOfUnreadNotifications()
    }

    getNumberOfUnreadNotifications = () => {
        db.collection('notifications').where('notification_status', '==', 'unread')
        .onSnapshot((snapshot)=> {
            var unreadNotifications = snapshot.docs.map((doc)=> {
                doc.data()
            })

            this.setState({
                value: unreadNotifications.length
            })
        })
    }

    BellIconWithBadge = () => {
        return(
            <View>
                <Icon name = 'bell' type = 'font-awesome' color = 'red' size = {25} onPress = {()=> 
                this.props.navigation.navigate('Notifications')
                } 
                />
                <Badge 
                value = {this.state.value}
                containerStyle = {{position: 'absolute', top: -4, right: -4}}
                />
            </View>
        )
    }

    render()
    {
        return(
            <Header
            leftComponent = {<Icon name = 'bars' type = 'font-awesome' color = 'red' onPress = {()=> 
                this.props.navigation.toggleDrawer()
            } />}
            centerComponent = {{text: this.props.title, style: {color: 'red', fontSize: 20, fontWeight: 'bold'}}}
            rightComponent = {<this.BellIconWithBadge{...this.props} />}
            backgroundColor = 'yellow'
            />
        )
    }
}