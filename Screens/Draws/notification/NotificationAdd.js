import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, Button, Alert, ScrollView } from "react-native";
import FormContainer from "../../../Shared/Form/FormContainer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from "../../../Shared/Form/Input";
import Error from "../../../Shared/Error";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";
import { Container, Item, Picker, Radio } from "native-base";

// Context
import AuthGlobal from "../../../Context/store/AuthGlobal";
import { loginUser } from "../../../Context/actions/Auth.actions";
import Spinner from "../../../Shared/Spinner";

import * as constants from "../../../assets/common/constants";

import { connect } from "react-redux";
import * as actions from "../../../Redux/Actions/userProfileActions";
import * as headerActions from "../../../Redux/Actions/headerActions";
import CardBox from "../../../Shared/Form/CardBox";
import Label from "../../../Shared/Label";
import Fontisto from "react-native-vector-icons/Fontisto";

import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

import { logoutUser } from "../../../Context/actions/Auth.actions";


const NotificationAdd = (props) => {
  const context = useContext(AuthGlobal);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();

  const [message,setMessage] = useState();
  const [title,setTitle] = useState();
  
  useEffect(() => {
    console.log("NotificationAdd,useEffect",);
    props.hideHeader({hide:true});
    
    AsyncStorage.getItem("jwt")
    .then((jwt) => {
      setToken(jwt);
    })
    .catch((error) => console.log(error));

    return () => {
      setLoading()
      setTitle()
      setMessage()
      setToken()
    };
  },[]);


  const loginAlert = () => {
    Alert.alert("Login Required", "Proceed to Login ?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => [logoutUser(context.dispatch),props.navigation.navigate("SignIn")] },
    ]);
  };

  const handleSubmit = () => {
    console.log("handleSubmit");
    setLoading(true);

    if(!constants.isValidateValue(title)){
      alert("Please enter valid title")
      setLoading(false);
      return;
    }else if(!constants.isValidateValue(message)){
      alert("Please enter valid message")
      setLoading(false);
      return;
    }
    if(!token){
      setLoading(false);
      loginAlert();
      return;
    }

  let req = {title,message};

    axios.post(`${baseURL}alerts`, req, {headers: { Authorization: `Bearer ${token}` }})
    .then((resp) => {
      if(resp.status === 200 || resp.status === 201){
        [Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Alert created successfully!!",
          text2: "",
        }),
        props.navigation.navigate("Notification"),
        ]
      }else{
        [Toast.show({
          topOffset: 60,
          type: "info",
          text1: resp.data.message,
          text2: "",
        }),props.navigation.navigate("Notification")]
      }
      setLoading(false)
    })
    .catch((error) => {
      [Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please try again later!!",
        text2: "",
      }),setLoading(false)]
    }
    );
  };

  return (
    <>
      <Spinner status={loading}></Spinner>
      <Container style={{ backgroundColor: "gainsboro" }}>
        { 
        <ScrollView>
         <CardBox>
            <Label text="Title" type="form"/>
            <Input placeholder={"Enter title"} name={"title"} id={"title"} value={title} onChangeText={(text) => setTitle(text)}/>

            <Label text="Message" type="form"/>
            <Input multiline ={true} placeholder={"Enter message"} name={"message"} id={"message"} value={message} onChangeText={(text) => setMessage(text)} styles={{height:150}}/>

        </CardBox>
        <View style={{alignSelf:"center"}}>
          <EasyButton large primary onPress={() => handleSubmit()}>
            <Text style={styles.buttonText}>Add</Text>
          </EasyButton>
        </View>
        </ScrollView>
        }
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },
  text:{
    fontSize:18,marginBottom:10
  },
  buttonText: {
    color: "white",
  },
  checkbox: {
    height:20,
    width:20,
    borderColor:constants.COLOR_RED,
    marginTop:10
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserProfile: (image) => dispatch(actions.updateUserProfile(image)),
    clearUserProfile: () => dispatch(actions.clearUserProfile()),
    hideHeader: (value) => dispatch(headerActions.hideHeader(value)),
  };
};

export default connect(null, mapDispatchToProps)(NotificationAdd);
