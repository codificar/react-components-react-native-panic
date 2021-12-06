import React from "react";
import axios, { Axios } from "axios";
//import axios from 'react-native-log-errors/src/services/api';
import { Alert, StyleSheet } from "react-native";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";

//THE PANIC SETTINGS MUST BE CREATED IN THE BACKEND TO BE PASSED UPON THE FRONTEND
//import i18n, { strings } from "../../Locales/i18n";

//the component that is used in the mobilidade/react-user is the ServiceInProgressScreen
//to use this component first you have to establish the route into the app constants, then you can pass it as an import into the component
//then you must establish if the user/provider shall receive it or not, based in the props received in the constructor that builds the screen
//then the two props must be stored in constants then
//this component receives two props, the first one is ledgerId and the second the requestId

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
  constructor(props) {
    super(props);

    this.state = {
      willSendcode: false,
      isSendingCode: false,
      requestId: 0,
      ledgerId: 0,
      requestResponse: "",
      success: false,
    };
  }

  panicSendRequestJSX() {
    return (
      <TouchableOpacity
        style={style.PanicButton}
        onPress={() => this.willSendPanicRequest()}
      >
        <Image
          source={require("./img/panicIcon.png")}
          style={{ width: 22, height: 27, resizeMode: "center" }}
        />
      </TouchableOpacity>
    );
  }

  panicAlertJSX() {
    return Alert.alert(
      this.props.confirmAlertTitle,
      this.props.confirmAlertMessage,
      [
        {
          text: this.props.confirmAlertButtonText,
          onPress: () => this.sendPanicRequest(),
        },
        ,
        {
          text: this.props.cancelAlertButtonText,
          onPress: () => this.setState({ isAlertOpen: false }),
        },
      ],
      { cancelable: true }
    );
  }

  panicAlertSuccessJSX() {
    return Alert.alert(
      this.props.successAlertTitle,
      this.props.successAlertMessage,
      [
        {
          text: this.props.successAlertButtonText,
          onPress: () => this.setState({ success: false }),
        },
      ],
      { cancelable: true }
    );
  }

  async willSendPanicRequest() {
    console.log("request_id", this.props.requestId);
    console.log("ledger_id", this.props.ledgerId);
    this.setState({
      ledgerId: this.props.ledgerId,
      requestId: this.props.requestId,
    });
    return this.panicAlertJSX();
  }

  async sendPanicRequest() {
    console.log("Sending panic request");
    const instance = axios.create({
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const apiCall = await axios
      .post(this.props.panicButtonUrl, {
        ledger_id: this.state.ledgerId,
        request_id: this.state.requestId,
      })
      .then((response) => {
        console.log("response", response.data);
        this.setState({
          requestResponse: JSON.stringify(response.data),
        });
        if (
          this.state.requestResponse.success === "true" &&
          this.state.requestResponse.id !== 0
        ) {
          this.setState({ success: true });
        }
      })
      .finally(() => {
        return this.panicAlertSuccessJSX();
      });
  }

  render() {
    if (this.state.success === true && this.state.requestResponse.id != null) {
      return this.panicAlertSuccessJSX();
    } else if (this.state.success === false) {
      return this.panicSendRequestJSX();
    }
  }
}

const style = StyleSheet.create({
  PanicButton: {
    // position: "absolute",
    // bottom: -38,
    right: 0,
    borderRadius: 50,
    backgroundColor: "#fff",
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
    zIndex: 0.1,
    marginTop: 4,
  },
});
