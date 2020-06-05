import {createStackNavigator} from "react-navigation";
import Menu from "./MenuComponent";
import {Icon} from "react-native-elements";
import Dishdetail from "./DishdetailComponent";
import React from "react";
import Home from "./HomeComponent";
import About from "./AboutComponent";
import Reservation from "./ReservationComponent";
import Contact from "./ContactComponent";

export const MenuNavigator = createStackNavigator({
    Menu: {
        screen: Menu,
        navigationOptions: ({navigation}) => ({
            headerLeft: <Icon name="menu" size={24} color="white" onPress={() => navigation.toggleDrawer()} />
        })
    },
    Dishdetail: { screen: () => (<Dishdetail />) }
}, {
    initialRouteName: 'Menu',
    navigationOptions: {
        headerStyle: {
            backgroundColor: "#512DA8"
        },
        headerTintColor: '#fff',
        headerTintStyle: {
            color: '#fff'
        }
    }
});

export const HomeNavigator = createStackNavigator({
    Home: { screen: () => (<Home />) },
}, {
    navigationOptions: ({ navigation }) => ({
        headerLeft: <Icon name="menu" size={24} color="white" onPress={() => navigation.toggleDrawer()} />,
        headerStyle: {
            backgroundColor: "#512DA8"
        },
        headerTitleStyle: {
            color: "#fff"
        },
        headerTintColor: "#fff"
    })
});

export const AboutNavigator = createStackNavigator({
    Home: { screen: () => (<About />) },
}, {
    navigationOptions: ({ navigation }) => ({
        headerLeft: <Icon name="menu" size={24} color="white" onPress={() => navigation.toggleDrawer()} />,
        headerStyle: {
            backgroundColor: "#512DA8"
        },
        headerTitleStyle: {
            color: "#fff"
        },
        headerTintColor: "#fff"
    })
});

export const ReservationNavigator = createStackNavigator({
    Reservation: {screen: Reservation}
}, {
    navigationOptions: ({ navigation }) => ({
        headerLeft: <Icon name="menu" size={24} color="white" iconStyle={{color: "white"}} onPress={() => navigation.toggleDrawer()} />,
        headerStyle: {
            backgroundColor: "#512DA8"
        },
        headerTitleStyle: {
            color: "#fff"
        },
        headerTintColor: "#fff"
    })
})

export const ContactNavigator = createStackNavigator({
    Home: { screen: () => (<Contact />) },
}, {
    navigationOptions: ({ navigation }) => ({
        headerLeft: <Icon name="menu" size={24} color="white" onPress={() => navigation.toggleDrawer()} />,
        headerStyle: {
            backgroundColor: "#512DA8"
        },
        headerTitleStyle: {
            color: "#fff"
        },
        headerTintColor: "#fff"
    })
});