import React from "react";
import axios from 'react-native-log-errors/src/services/api';
import {Alert, StyleSheet} from 'react-native';
import { PANIC_BUTTON_URL } from "../../../../App/Util/Constants";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import {panicIcon} from "./img/panicIcon.png";

//THE PANIC SETTINGS MUST BE CREATED IN THE BACKEND TO BE PASSED UPON THE FRONTEND
//import i18n, { strings } from "../../Locales/i18n";

//the component that is used in the mobilidade/react-user is the ServiceInProgressScreen
//to use this component first you have to establish the route into the app constants, then you can pass it as an import into the component 
//then you must establish if the user/provider shall receive it or not, based in the props received in the constructor that builds the screen
//then the two props must be stored in constants then 
//this component receives two props, the first one is ledgerId and the second the requestId
export class PanicButton extends React.Component {
    constructor (props) {
        super (props)
        this.api = axios;
		this.api.defaults.headers = {
			Accept: "application/json",
			"Content-Type": "application/json",
    }

        this.state = {
            isSendingCode: false,
            requestId: 0,
            ledgerId: 0,
            requestResponse: "",
        }
    }

    componentDidMount () {
    }

   sendPanicRequest() { 
    this.setState({
        isSendingCode:true,
         requestId: this.props.requestId,
         ledgerId: this.props.ledgerId,
        });
   const response = this.api.post ({
        url: PANIC_BUTTON_URL,
        data: {
            ledgerId: this.state.ledgerId,
            requestId: this.state.requestId,
        }
    }).then(response => {
            this.setState({
                isSendingCode:false,
                requestResponse:response.data,
            }).then(console.log(response.data));
        })
    }

    panicAlertJSXt(){
        return (
            Alert.alert('Panic Alert', "Panic alert Message", [
                {
                    text: 'will send code?',
                    onPress: () => this.sendPanicRequest(),
                },
            ], { cancelable: true }))
    }

panicSendRequestJSX(){
    return (
        <TouchableOpacity 
        style={style.PanicButton} 
        onPress={function () {
            this.setState({isSendingCode:true})
           this.sendPanicRequest}}>
        <Image source={require('./img/panicIcon.png')} style={{ width: 22, height: 27, resizeMode: 'center' }} />
     </TouchableOpacity>
     )
}

    //create a stylesheet to be used in the component
    //finish creating the api call and thus, restore the state to show a loading then send the request
    //show alert when clicked
     //if return is success and id is not 0, then show the success message
    render () {
        if (this.state.isSendingCode === false) {
            return (
            this.panicSendRequestJSX()
            )
        } else if (this.state.isSendingCode === true) {
            return (
                this.panicAlertJSX())
        } else if (this.state.isSendingCode===false && this.state.requestResponse.data.success ===true 
            && this.state.requestResponse.data.id !== null) {
        return (
            Alert.alert("Request Successful", "successMessage")
        )} else {
            return(
                this.panicSendRequestJSX()
            )
        }
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
