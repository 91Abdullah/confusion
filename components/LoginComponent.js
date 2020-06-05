import React, {Component} from "react";
import * as SecureStore from "expo-secure-store";
import {View, StyleSheet, ScrollView, Image} from "react-native";
import {Input, CheckBox, Button, Icon} from "react-native-elements";
import {Permissions} from "react-native-unimodules";
import {createBottomTabNavigator} from "react-navigation";
import {baseUrl} from "../shared/baseUrl";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

class LoginTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            remember: false
        }
    }

    componentDidMount() {
        SecureStore.getItemAsync('userinfo')
            .then((userdata) => {
                let userinfo = JSON.parse(userdata);
                if(userinfo) {
                    this.setState({username: userinfo.username});
                    this.setState({password: userinfo.password});
                    this.setState({remember: true});
                }
            })
    }

    static navigationOptions = {
        title: "Login",
        tabBarIcon: ({tintColor}) => (
            <Icon
                name="sign-in"
                type="font-awesome"
                size={24}
                iconStyle={{color: tintColor}}
            />
        )
    };

    handleLogin() {
        console.log(JSON.stringify(this.state));
        if(this.state.remember) {
            SecureStore.setItemAsync('userinfo', JSON.stringify({username: this.state.username, password: this.state.password, remember: this.state.remember}))
                .catch((error) => console.log('Could not save user info', error))
        } else {
            SecureStore.deleteItemAsync('userinfo')
                .catch((error) => console.log('Could not delete user info', error))
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Input placeholder="Username"
                    leftIcon={{type: "font-awesome", name: "user-o"}}
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}
                    containerStyle={styles.formInput}
                />
                <Input placeholder="Password"
                    leftIcon={{type: "font-awesome", name: "key"}}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    containerStyle={styles.formInput}
                />
                <CheckBox
                    center
                    checked={this.state.remember}
                    onPress={() => this.setState({remember: !this.state.remember})}
                    containerStyle={styles.formCheckbox}
                />
                <View style={styles.formButton}>
                    <Button
                        onPress={() => this.handleLogin()}
                        title="Login"
                        color="#512DA8"
                        icon={<Icon name="sign-in" type="font-awesome" size={24} color="white" />}
                        buttonStyle={{backgroundColor: "#512DA8"}}
                    />
                </View>
                <View style={styles.formButton}>
                    <Button
                        onPress={() => this.props.navigation.navigate("Register")}
                        title="Register"
                        icon={<Icon name="user-plus" type="font-awesome" size={24} color="blue" />}
                        clear
                        tintStyle={{color: "blue"}}
                    />
                </View>
            </View>
        );
    }
}

class RegisterTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false,
            imageUrl: baseUrl + "image/logo.png"
        }
    }

    getImageFromCamera = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if(cameraPermission.status === "granted" && cameraRollPermission.status === "granted") {
            let capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });
            if(!capturedImage.cancelled) {
                console.log(capturedImage);
                await this.processImage(capturedImage.uri);
            }
        }
    }

    getImageFromGallery = async () => {
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if(cameraRollPermission.status === "granted") {
            let image = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });
            if(!image.cancelled) {
                console.log(image);
                await this.processImage(image.uri);
            }
        }
    }

    processImage = async (imageUri) => {
        let processImage = await ImageManipulator.manipulateAsync(imageUri, [{resize: {width: 400}}], {format: "png"});
        console.log(processImage);
        this.setState({imageUrl: processImage.uri});
    }

    static navigationOptions = {
        title: "Register",
        tabBarIcon: ({tintColor, focused}) => (
            <Icon
                name="user-plus"
                type="font-awesome"
                size={24}
                iconStyle={{color: tintColor}}
            />
        )
    }

    handleRegister() {
        console.log(JSON.stringify(this.state));
        if(this.state.remember) {
            SecureStore.setItemAsync("userinfo", JSON.stringify({username: this.state.username, password: this.state.password}))
                .catch(error => console.log(error));
        }
    }

    render() {
        return(
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{uri:this.state.imageUrl}}
                            loadingIndicatorSource={require("./images/logo.png")}
                            style={styles.image}
                        />
                        <Button
                            title="Camera"
                            onPress={this.getImageFromCamera}
                        />
                        <View style={{marginLeft: 10}}>
                            <Button
                                title="Gallery"
                                onPress={this.getImageFromGallery}
                            />
                        </View>
                    </View>
                    <Input
                        placeholder="Username"
                        leftIcon={{type: "font-awesome", name: "user-o"}}
                        onChangeText={(value) => this.setState({username: value})}
                        value={this.state.username}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Password"
                        leftIcon={{type: "font-awesome", name: "key"}}
                        onChangeText={(value) => this.setState({password: value})}
                        value={this.state.password}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="First Name"
                        leftIcon={{type: "font-awesome", name: "user-o"}}
                        onChangeText={(value) => this.setState({firstname: value})}
                        value={this.state.firstname}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Last Name"
                        leftIcon={{type: "font-awesome", name: "user-o"}}
                        onChangeText={(value) => this.setState({lastname: value})}
                        value={this.state.lastname}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="E-Mail"
                        leftIcon={{type: "font-awesome", name: "envelope-o"}}
                        onChangeText={(value) => this.setState({email: value})}
                        value={this.state.email}
                        containerStyle={styles.formInput}
                    />
                    <CheckBox
                        title="Remember Me"
                        center={true}
                        checked={this.state.remember}
                        onPress={() => this.setState({remember: !this.state.remember})}
                    />
                    <View style={styles.formButton}>
                        <Button
                            title="Register"
                            onPress={() => this.handleRegister()}
                            icon={{name: "user-plus", type: "font-awesome", color: "white", size: 24}}
                            buttonStyle={{backgroundColor: "#512DA8"}}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    formInput: {
        marginTop: 20,
        marginBottom: 20
    },
    formCheckbox: {
        backgroundColor: null
    },
    formButton: {

    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    image: {
        margin: 10,
        width: 80,
        height: 60
    }
});

const Login = createBottomTabNavigator({
    Login: LoginTab,
    Register: RegisterTab
}, {
    tabBarOptions: {
        activeBackgroundColor: "#9575CD",
        inactiveBackgroundColor: "#D1C4E9",
        activeTintColor: "#FFF",
        inactiveTintColor: "gray"
    }
});

export default Login;