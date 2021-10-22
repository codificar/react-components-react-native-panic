import React from "react";
import axios from 'react-native-log-errors/src/services/api';
import {Alert, StyleSheet} from 'react-native';
import { PANIC_BUTTON_URL } from "../../../../App/Util/Constants";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import {panicIcon} from "./img/panicIcon.png";

    //props 
    //ledgerId::number
    //requestId::number
    //confirmAlertTitle :: String
    //confirmAlertMessage :: String
    //confirmAlertButtonText :: String
    //cancelAlertButtonText:: String
    //successAlertTitle :: String
    //successAlertMessage :: String
    //successAlertButtonText :: String
    

export class PanicButton extends React.Component {
    constructor (props) {
        super (props)
        this.api = axios;
		this.api.defaults.headers = {
			Accept: "application/json",
			"Content-Type": "application/json",
    }

        this.state = {
            willSendcode: false,
            isSendingCode: false,
            requestId: 0,
            ledgerId: 0,
            requestResponse: "",
        }
    }

    async willSendPanicRequest(){
        this.setState({
             requestId: this.props.requestId,
             ledgerId: this.props.ledgerId,
            });
            return this.panicAlertJSX();
    }

   async sendPanicRequest() { 

   const response = await this.api.post ({
        url: PANIC_BUTTON_URL,
        data: {
            ledgerId:this.state.ledgerId,
            requestId: this.state.requestId,
        }
    }).then(response => {
            this.setState({
                isSendingCode:false,
                willSendcode:false,
                requestResponse:response.data,
            }).then(console.log(response.data));
        }).finally(() => {
            if (this.state.requestResponse.success === "true" && this.state.requestResponse.id !== 0){
                return this.panicAlertSuccessJSX();
            }
        })
    }




    panicSendRequestJSX(){
        return (
            <TouchableOpacity 
            style={style.PanicButton} 
            onPress={() => this.willSendPanicRequest()}>
            <Image source={require('./img/panicIcon.png')} style={{ width: 22, height: 27, resizeMode: 'center' }} />
         </TouchableOpacity>
         )
    }

   panicAlertJSX(){
        return (
            Alert.alert(this.props.confirmAlertTitle, this.props.confirmAlertMessage, [
                {
                    text: this.props.confirmAlertButtonText,
                    onPress: () => this.sendPanicRequest(),
                }, 
                ,{
                    text: this.props.cancelAlertButtonText,
                    onPress: () => this.setState({isAlertOpen: false}),
                },
            ], { cancelable: true }))
    }

    panicAlertSuccessJSX(){
        return (
            Alert.alert(this.props.SuccessAlertTitle, this.props.SuccessAlertMessage, 
                [{
                    text: this.props.SuccessAlertButtonText,
                    onPress: () => this.setState({isAlertOpen: false}),
                }], { cancelable: true }))
    }



    render () {
            return (
            this.panicSendRequestJSX()
            )
        }
 }

const style = StyleSheet.create({
        PanicButton: {
            position: 'absolute',
            elevation: 3,
            zIndex: 0.1,
            bottom: 255,
            right: 15,
            borderRadius: 50,
            backgroundColor: "#fff",
            width: 45,
            height: 45,
            justifyContent: "center",
            alignItems: "center"
        },
}
)
