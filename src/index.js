import React, {Component} from "react";
import i18n, { strings } from "../../Locales/i18n";
import axios from 'react-native-log-errors/src/services/api';
import {Alert, StyleSheet} from 'react-native';
import { PANIC_BUTTON_URL } from "../../../../App/Util/Constants";
import { Image } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import panicIcon from "./img/panicIcon.png";

//THE PANIC SETTINGS MUST BE CREATED IN THE BACKEND TO BE PASSED UPON THE FRONTEND

//the component that is used in the mobilidade/react-user is the ServiceInProgressScreen
//to use this component first you have to establish the route into the app constants, then you can pass it as an import into the component 
//then you must establish if the user/provider shall receive it or not, based in the props received in the constructor that builds the screen
//then the two props must be stored in constants then 
//this component receives two props, the first one is ledgerId and the second the requestId
class PanicButton extends React.Component {
    constructor (props) {
        super (props)
        this.api = axios;
		this.api.defaults.headers = {
			Accept: "application/json",
			"Content-Type": "application/json",
			locale: i18n.locale,
    }

        this.state = {
            isSendingCode: false,
            requestId: 0,
            ledgerId: 0,
            requestResponse: "",
        }
    }

    componentDidMount () {
        this.setState({
            requestId:props.requestId,
            ledgerId:props.ledgerId,
        })
    }

   sendPanicRequest() { 
    this.setState({isSendingCode=true});
   const response = this.api.post ({
        url: PANIC_BUTTON_URL,
        data: {
            ledgerId: this.state.ledgerId,
            requestId: this.state.requestId,
        }
    }).then(response => {
            this.setState({
                isSendingCode=false,
                requestResponse=response.data,
            }).then(console.log(response.data));
        })
    }

    //create a stylesheet to be used in the component
    //finish creating the api call and thus, restore the state to show a loading then send the request
    //show alert when clicked
     //if return is success and id is not 0, then show the success message
    render () {
        if (this.state.isSendingCode === false) {
            return (
            <TouchableOpacity style={style.container.PanicButton} onPress={()=>this.setState(isSendingCode=true)}>
                <Image source={panicIcon} style={{ width: 22, height: 27, resizeMode: 'center' }} />
            </TouchableOpacity>
            )
        } else if (this.state.isSendingCode === true) {
            return (
                Alert.alert(strings.panicButton.panicButtonAlert, strings.panicButton.panicButtonAlertMessage, [
                    {
                        text: strings.panicButton.panicButtonAlertButton,
                        onPress: () => this.sendPanicRequest(),
                    },
                ], { cancelable: true }))
        } else if (this.state.isSendingCode===false && this.state.requestResponse.data.success ===true 
            && this.state.requestResponse.data.id !== null) {
        return (
            Alert.alert(strings.panicButton.panicButtonSuccess, strings.panicButtonSuccessMessage)
        )} else {
            <TouchableOpacity style={style.container.PanicButton} onPress={()=>this.setState(isSendingCode=true)}>
                <Image source={panicIcon} style={{ width: 22, height: 27, resizeMode: 'center' }} />
             </TouchableOpacity>
        }
    }
}

const style = StyleSheet.create(
    container ={
        PanicButton: {
            position: 'absolute',
            elevation: 3,
            zIndex: 0.1,
            bottom: 300,
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

export default PanicButton;