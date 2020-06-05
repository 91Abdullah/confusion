import React, {Component} from "react";
import {Text, View, ScrollView, FlatList, Button, Modal, PanResponder, StyleSheet, Alert, Share} from "react-native";
import {Card, Icon, Input, Rating} from "react-native-elements";
import {DISHES} from "../shared/dishes";
import {COMMENTS} from "../shared/comments";
import {baseUrl} from "../shared/baseUrl";
import {connect} from "react-redux";
import {postFavorite, postComment} from "../redux/ActionCreators";
import DatePicker from "react-native-datepicker";
import * as Animatable from "react-native-animatable";

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (comment) => dispatch(postComment(comment))
})

class Dishdetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rating: 1,
            author: '',
            comment: '',
            showModal: false
        }
    }

    static navigationOptions = {
        title: 'Dish Details'
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState({
            showModal: !this.state.showModal
        });
    }

    handleComment() {
        console.log(JSON.stringify(this.state));
        this.props.postComment({
            comment: this.state.comment,
            dishId: this.props.navigation.getParam('dishId', ''),
            author: this.state.author,
            rating: this.state.rating,
            date: (new Date()).toISOString(),
            id: this.props.comments.comments.length
        })
        this.toggleModal();
        this.resetForm();
    }

    resetForm() {
        this.setState({
            rating: 1,
            author: '',
            comment: ''
        });
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return(
            <ScrollView>
                <RenderDish favorite={this.props.favorites.some(e1 => e1 === dishId)} dish={this.props.dishes.dishes[+dishId]} onFavPress={() => this.markFavorite(dishId)} onCommentPress={() => this.toggleModal()} />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType={"slide"} transparent={false} visible={this.state.showModal}
                       onDismiss={() => this.toggleModal()} onRequestClose={() => this.toggleModal()}>
                    <View style={styles.formRow}>
                        <Rating type="star" showRating minValue={1} ratingCount={5} onFinishRating={(value) => this.setState({rating: value})} />
                    </View>
                    <View>
                        <Input placeholder="Author" leftIcon={{type: "font-awesome", name: "user-o"}} onChangeText={(value) => this.setState({author: value})} />
                    </View>
                    <View>
                        <Input placeholder="Comment" leftIcon={{type: "font-awesome", name: "comment-o"}} onChangeText={(value) => this.setState({comment: value})} />
                    </View>
                    <View style={{marginBottom:20, padding:10}}>
                        <Button
                            onPress={() => this.handleComment()}
                            title="Submit"
                            color="#512DA8"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={{marginBottom:20, padding:10}}>
                        <Button
                            onPress={() => {
                                this.resetForm();
                                this.toggleModal();
                            }}
                            title="Cancel"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                </Modal>
            </ScrollView>
        )
    }

}

function RenderComments(props) {
    const comments = props.comments;
    const renderCommentItem = ({item, index}) => {
        return(
            <View style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <View style={{alignItems:"flex-start", marginTop:10, marginBottom: 10}}>
                    <Rating readonly startingValue={item.rating} imageSize={10} />
                </View>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date}</Text>
            </View>
        )
    }

    return(
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title="Comments">
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    )
}

function RenderDish(props) {
    const dish = props.dish;

    handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({moveX, moveY, dx, dy}) => {
        return dx < -200;
    }

    const recognizeComment = ({moveX, moveY, dx, dy}) => {
        return dx < 200;
    }

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ": " + message + " " + url,
            url: url
        }, {
            dialogTitle: "Share " + title
        })
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => true,
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if(recognizeDrag(gestureState)) {
                Alert.alert(
                    "Add Favorite",
                    "Are you sure you wish to add " + dish.name + " to favorite?",
                    [
                        {text: "Cancel", onPress: () => console.log("Cancel pressed"), style: "cancel"},
                        {text: "OK", onPress: () => {
                                props.favorite ? console.log("Already favorite") : props.onFavPress()
                            }}
                    ],
                    {cancelable: true}
                );
            } else if(recognizeComment(gestureState)) {
                props.onCommentPress();
            }
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000)
                .then(endState => console.log(endState.finished ? "finished" : "cancelled"))
        }
    })

    if(dish != null) {
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000} {...panResponder.panHandlers} ref={this.handleViewRef}>
                <Card featuredTitle={dish.name} image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin:10}}>
                        {dish.description}
                    </Text>
                    <View style={{flexDirection:'row', margin: "auto"}}>
                        <Icon name={props.favorite ? 'heart' : 'heart-o'}
                              type="font-awesome"
                              color="#F50"
                              raised
                              reverse
                              onPress={() => props.onFavPress()}
                        />
                        <Icon name="pencil"
                              type="font-awesome"
                              color="#512DA8"
                              raised
                              reverse
                              onPress={() => props.onCommentPress()}
                        />
                        <Icon name="share"
                              type="font-awesome"
                              color="#51D2A8"
                              raised
                              reverse
                              onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)}
                        />
                    </View>
                </Card>
            </Animatable.View>
        )
    } else {
        return(
            <View />
        )
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);