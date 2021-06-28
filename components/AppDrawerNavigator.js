import * as React from 'react'
import {View, Text} from 'react-native'
import {createDrawerNavigator} from 'react-navigation-drawer'
import AppTabNavigator from './AppTabNavigator'
import CustomSidebarMenu from './CustomSidebarMenu'
import SettingsScreen from '../screens/SettingsScreen'
import MyDonationScreen from '../screens/MyDonationScreen'
import NotificationsScreen from '../screens/NotificationsScreen'

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: AppTabNavigator
    },
    MyDonations: {
        screen: MyDonationScreen
    },
    Notifications: {
        screen: NotificationsScreen
    },
    Settings: {
        screen: SettingsScreen
    },
    },
    {
        contentComponent: CustomSidebarMenu
    },
    {
        initialRouteName: 'Home'
    }
)