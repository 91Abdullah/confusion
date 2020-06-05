import React, {Component} from "react";
import {FlatList, View, Text, Alert} from "react-native";
import {ListItem} from "react-native-elements";
import {baseUrl} from "../shared/baseUrl";
import {Loading} from "./LoadingComponent";
import {connect} from "react-redux";
import Swipeout from "react-native-swipeout";
import {deleteFavorite} from "../redux/ActionCreators";
import * as Animatable from "react-native-animatable";

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        favorites: state.favorites
    }
}

const mapDispatchToProps = (dispatch) => ({
    deleteFavorite: (dishId) => dispatch(deleteFavorite(dishId))
})

class Favorite extends Component {

    static navigationOptions = {
        title: 'My Favorites'
    }

    render() {
        const {navigate} = this.props.navigation;
        const renderMenuItem = ({item, index}) => {

            const rightButton = [
                {
                    type: 'delete',
                    text: 'Delete',
                    onPress: () => {
                        Alert.alert(
                            "Delete Favorite?",
                            "Are you sure you wish to delete the favorite dish " + item.name + "?",
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => console.log(item.name + " not deleted."),
                                    style: "cancel"
                                },
                                {
                                    text: "OK",
                                    onPress: () => this.props.deleteFavorite(item.id)
                                }
                            ],
                            { cancelable: false }
                        );
                    }
                }
            ];

            return(
                <Animatable.View animation="fadeInRightBig" duration={2000}>
                    <Swipeout right={rightButton} autoClose={true}>
                        <ListItem
                            key={index}
                            title={item.name}
                            subtitle={item.description}
                            hideChevron={true}
                            onPress={() => navigate('Dishdetail', {dishId: item.id})}
                            leftAvatar={{source: {uri: baseUrl + item.image}}}
                        />
                    </Swipeout>
                </Animatable.View>
            )
        };

        if(this.props.dishes.isLoading) {
            return (<Loading />);
        } else if (this.props.dishes.errMess) {
            return(
                <View>
                    <Text>{this.props.dishes.errMess}</Text>
                </View>
            )
        } else {
            return (
                <FlatList
                    keyExtractor={item => item.id.toString()}
                    data={this.props.dishes.dishes.filter(dish => this.props.favorites.some(e1 => e1 === dish.id))}
                    renderItem={renderMenuItem}
                />
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorite);