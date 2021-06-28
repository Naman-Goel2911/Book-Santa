import * as React from 'react'
import {createStackNavigator} from 'react-navigation-stack'
import ReceiverDetailsScreen from '../screens/ReceiverDetailsScreen'
import BookDonateScreen from '../screens/BookDonateScreen'

export const AppStackNavigator = createStackNavigator({
    BookDonateList: {
        screen: BookDonateScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    ReceiverDetails: {
        screen: ReceiverDetailsScreen,
        navigationOptions: {
            headerShown: false
        }
    },
},
{initialRouteName: 'BookDonateList'}
)