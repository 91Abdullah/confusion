import React, {Component} from "react";
import {Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert} from "react-native";
import {Card} from "react-native-elements";
import DatePicker from "react-native-datepicker";
import * as Animatable from "react-native-animatable";
import {Permissions} from "react-native-unimodules";
import {Notifications} from "expo";
import * as Calendar from "expo-calendar";

class Reservation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        }
    }

    static navigationOptions = {
        title: "Reservation Table"
    };

    toggleModal() {
        this.setState({
            showModal: !this.state.showModal
        })
    }

    handleReservation() {
        console.log(JSON.stringify(this.state));
        //this.toggleModal();
        Alert.alert(
            "Your Reservation OK?",
            `Number of Guests: ${this.state.guests}\nSmoking? ${this.state.smoking}\nDate and Time: ${this.state.date}`,[
                {
                    text: "Cancel",
                    onPress: () => this.resetForm(),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        this.presentLocalNotification(this.state.date)
                        this.resetForm();
                    }
                }
            ],
            {cancelable: false}
        )
        this.addReservationToCalender(this.state.date);
    }

    async obtainCalendarPermission() {
        const permission = await Permissions.askAsync(Permissions.CALENDAR);
        return permission.status;
    }

    async addReservationToCalender(date) {
        const permission = await this.obtainCalendarPermission();
        if(permission === "granted") {
            const endDate = new Date(Date.parse(date) + (2*60*60*1000));
            Calendar.createEventAsync("1", {title: "Con Fusion Table Reservation", startDate: new Date(date), endDate: endDate, timeZone: "Asia/Karachi", location: "121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong"})
                .then(status => console.log(status))
                .catch(error => console.log(error));
        }
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        });
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if(permission.status !== "granted") {
            permission = Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if(permission.status !== "granted") {
                Alert.alert("Permission not granted to show notifications");
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: "Your reservation",
            body: "Reservation for " + date + " requested",
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: "#512DA8"
            }
        });
    }

    render() {
        return(
            <ScrollView>
                <Animatable.View duration={2000} delay={1000} animation="zoomIn">
                    <Modal animationType={"slide"} transparent={false} visible={this.state.showModal}
                           onDismiss={() => this.toggleModal()} onRequestClose={() => this.toggleModal()}>
                        <View style={styles.modal}>
                            <Text style={styles.modalTitle}>Your Reservation</Text>
                            <Text style={styles.modalText}>Number of Guests: {this.state.guests}</Text>
                            <Text style={styles.modalText}>Smoking?: {this.state.smoking ? 'Yes' : 'No'}</Text>
                            <Text style={styles.modalText}>Date and Time: {this.state.date}</Text>
                            <Button onPress={() => {this.toggleModal(); this.resetForm()}} color="#512DA8" title="Close" />
                        </View>
                    </Modal>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker style={styles.formItem} selectedValue={this.state.guests} onValueChange={((itemValue, itemIndex) => this.setState({guests: itemValue}) )}>
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking / Non Smoking</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#512DA8" }}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(value => this.setState({smoking: value}))}
                            value={this.state.smoking}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date & TIme</Text>
                        <DatePicker
                            style={{flex: 2, marginRight: 20}}
                            date={this.state.date}
                            format=''
                            mode="datetime"
                            placeholder="Select Date & Time"
                            minDate="2019-01-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange={(date) => this.setState({date: date})}
                        />
                    </View>
                    <Button
                        onPress={() => this.handleReservation()}
                        title="Reserve"
                        color="#512DA8"
                        accessibilityLabel="Learn more about this purple button"
                    />
                </Animatable.View>
            </ScrollView>
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
    formButton: {
        width: "100%"
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

export default Reservation;