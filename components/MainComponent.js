import React, { Component } from 'react';
import {DISHES} from "../shared/dishes";
import Menu from "./MenuComponent";
import {View, Platform, Text, ScrollView, Image, StyleSheet, ToastAndroid} from "react-native";
import Dishdetail from "./DishdetailComponent";
import Home from "./HomeComponent";
import Contact from "./ContactComponent";
import {Icon} from "react-native-elements";
import { createStackNavigator, createDrawerNavigator, DrawerItems, SafeAreaView } from "react-navigation";
import About from "./AboutComponent";
import {connect} from "react-redux";
import {fetchComments, fetchDishes, fetchLeaders, fetchPromos} from "../redux/ActionCreators";
import Reservation from "./ReservationComponent";
import Favorite from "./FavoriteComponent";
import Login from "./LoginComponent";
import NetInfo from "@react-native-community/netinfo";

const CustomDrawerContentComponent = (props) => (
    <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{top: 'always', horizontal: 'never'}}>
            <View style={styles.drawerHeader}>
                <View style={{flex:1}}>
                    <Image style={styles.drawerImage} source={require('./images/logo.png')} />
                </View>
                <View style={{flex:2}}>
                    <Text style={styles.drawerHeaderText}>Ristorante Con Fusion</Text>
                </View>
            </View>
            <DrawerItems {...props} />
        </SafeAreaView>
    </ScrollView>
);

const MenuNavigator = createStackNavigator({
    Menu: {
        screen: Menu,
        navigationOptions: ({navigation}) => ({
            headerLeft: <Icon name="menu" size={24} color="white" onPress={() => navigation.toggleDrawer()} />
        })
    },
    Dishdetail: { screen: Dishdetail }
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



const LoginNavigator = createStackNavigator({
    Login: Login
}, {
    navigationOptions: ({navigation}) => ({
        headerStyle: {
            backgroundColor: "#512DA8",
        },
        headerTitleStyle: {
            color: "#fff"
        },
        headerTintColor: "#fff",
        headerLeft: <Icon name="menu" size={24}
                          iconStyle={{ color: 'white' }}
                          onPress={ () => navigation.toggleDrawer() } />
    })
})

const FavoriteNavigator = createStackNavigator({
    Favorites: {screen: Favorite}
}, {
    navigationOptions: ({navigation}) => ({
        headerStyle: {
            backgroundColor: "#512DA8",
        },
        headerTitleStyle: {
            color: "#fff"
        },
        headerTintColor: "#fff",
        headerLeft: <Icon name="menu" size={24}
                          iconStyle={{ color: 'white' }}
                          onPress={ () => navigation.toggleDrawer() } />
    })
})

const HomeNavigator = createStackNavigator({
    Home: { screen: Home },
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

const AboutNavigator = createStackNavigator({
    About: { screen: About },
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

const ReservationNavigator = createStackNavigator({
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

const ContactNavigator = createStackNavigator({
    Contact: { screen: Contact },
}, {
    navigationOptions: ({navigation}) => ({
        headerLeft: <Icon name="menu" size={24} color="white" onPress={() => navigation.toggleDrawer()}/>,
        headerStyle: {
            backgroundColor: "#512DA8"
        },
        headerTitleStyle: {
            color: "#fff"
        },
        headerTintColor: "#fff"
    })
});


const MainNavigator = createDrawerNavigator({
    Home: {
        screen: HomeNavigator,
        navigationOptions: {
            title: 'Home',
            drawerLabel: 'Home',
            drawerIcon: ({tintColor, focused}) => (
                <Icon name="home" type="font-awesome" size={24} color={tintColor} />
            )
        }
    },
    About: {
        screen: AboutNavigator,
        navigationOptions: {
            title: 'About Us',
            drawerLabel: 'About Us',
            drawerIcon: ({tintColor, focused}) => (
                <Icon name="info-circle" type="font-awesome" size={24} color={tintColor} />
            )
        }
    },
    Menu: {
        screen: MenuNavigator,
        navigationOptions: {
            title: 'Menu',
            drawerLabel: 'Menu',
            drawerIcon: ({tintColor, focused}) => (
                <Icon name="list" type="font-awesome" size={24} color={tintColor} />
            )
        }
    },
    Contact: {
        screen: ContactNavigator,
        navigationOptions: {
            title: 'Contact Us',
            drawerLabel: 'Contact Us',
            drawerIcon: ({tintColor, focused}) => (
                <Icon name="address-card" type="font-awesome" size={24} color={tintColor} />
            )
        }
    },
    Reservation: {
        screen: ReservationNavigator,
        navigationOptions: {
            title: 'Reserve Table',
            drawerLabel: 'Reserve Table',
            drawerIcon: ({tintColor, focused}) => (
                <Icon name="cutlery" type="font-awesome" size={24} iconStyle={{color: tintColor}} />
            )
        }
    },
    Favorites: {
        screen: FavoriteNavigator,
        navigationOptions: {
            title: 'My Favorites',
            drawerLabel: 'My Favorites',
            drawerIcon: ({tintColor, focused}) => (
                <Icon name="heart" type="font-awesome" size={24} iconStyle={{color: tintColor}} />
            )
        }
    },
    Login: {
        screen: LoginNavigator,
        navigationOptions: {
            title: "Login",
            drawerLabel: "Login",
            drawerIcon: ({tintColor, focused}) => (
                <Icon name="sign-in" type="font-awesome" size={24} iconStyle={{color: tintColor}} />
            )
        }
    }
}, {initialRouteName: "Home", drawerBackgroundColor: '#D1C4E9', contentComponent: CustomDrawerContentComponent})

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    drawerHeader: {
        backgroundColor: "#512DA8",
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row'
    },
    drawerHeaderText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },
    drawerImage: {
        margin: 10,
        width: 80,
        height: 60
    }
})

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders
    }
}

const mapDispatchToProps = dispatch => ({
    fetchDishes: () => dispatch(fetchDishes()),
    fetchComments: () => dispatch(fetchComments()),
    fetchPromos: () => dispatch(fetchPromos()),
    fetchLeaders: () => dispatch(fetchLeaders()),
})

class Main extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();

        NetInfo.fetch()
            .then(connectionInfo => {
                ToastAndroid.show("Initial Network Connectivity Type: " + connectionInfo.type + ", effectiveType: " + connectionInfo.effectiveType, ToastAndroid.LONG)
            });

        this.unsubscribe = NetInfo.addEventListener(this.handleConnectivityChange);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    handleConnectivityChange = (connectionInfo) => {
        switch (connectionInfo.type) {
            case "none":
                ToastAndroid.show("You are now offline", ToastAndroid.LONG);
                break;
            case "wifi":
                ToastAndroid.show("You are now connected to WiFi!", ToastAndroid.LONG);
                break;
            case "cellular":
                ToastAndroid.show("You are now connected to Cellular!", ToastAndroid.LONG);
                break;
            case "unknown":
                ToastAndroid.show("You now have unknown connection", ToastAndroid.LONG);
                break;
            default:
                break;
        }
    }

    render() {
        return(
            <View style={{flex:1, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight}}>
                {/*<Menu dishes={this.state.dishes} onPress={(dishId) => this.onDishSelect(dishId)} />
                <Dishdetail dish={this.state.dishes.filter((dish) => dish.id === this.state.selectedDish)[0]} />*/}
                <MainNavigator />
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);