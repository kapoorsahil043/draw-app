import React, { useState,useCallback } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Spinner from "../../Shared/Spinner";

import { useFocusEffect } from "@react-navigation/core";
import AsyncStorage from "@react-native-community/async-storage";
import * as Device from 'expo-device';

import * as constants from "../../assets/common/constants";

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  const createTestUser = async (cnt) => {
    console.log('cnt',cnt);
    let user = {
      name: "testemail"+cnt,
      email: "testemail"+cnt+"@gmail.com",
      password: "a",
      phone: cnt,
      isAdmin: false,
    };

    let rr = await  axios
      .post(`${baseURL}users/register`, user)
      .then((res) => {
        console.log(res.status);
        if(cnt > 2300){
          return;
        }
        createTestUser(++cnt);
      })
      .catch((error) => {
       console.log("err",error.response.data)
      });
     
  }
  const register = async () => {
    //createTestUser(1222);
    //return;
    if (email === "" || name === "" || phone === "" || password === "") {
      setError("Please fill in the form correctly!!");
    }

    setLoading(true);
   
    let user = {
      name: name,
      email: email,
      password: constants.encrypt(password),
      phone: phone,
      pushId:'',
      osName: Device.osName,
      osVersion: Device.osVersion,
      modelName: Device.modelName,
      isRooted:''
    };
    
    try {await Device.isRootedExperimentalAsync().then((data)=> user.isRooted = data );  } catch (error) {}
    
    await AsyncStorage.getItem("push_id").then((data) => {user.pushId = data;}).catch((error) => [console.log(error)]);


    axios.post(`${baseURL}users/register`, user).then((res) => {
        if (res.status == 200) {
          Toast.show({topOffset: 60,type: "success",text1: "Registration Succeeded",text2: "Please login into your account",});
          setTimeout(() => {props.navigation.navigate("Login");}, 500);
        }
        setLoading(false);
      })
      .catch((error) => {Toast.show({topOffset: 60,type: "error",text1: "Something went wrong",text2: "Please try again",});setLoading(false);});
  };

  useFocusEffect(useCallback(()=>{
    
    return (()=>{
      setLoading();
      setEmail()
      setError()
      setName()
      setPassword()
      setPhone()
    });

  },[]));

  return (
    <KeyboardAwareScrollView viewIsInsideTabBar={true} extraHeight={100} enableOnAndroid={true}>
      <Spinner status={loading}></Spinner>
      <FormContainer title={"Register"}>
        <Input
          placeholder={"Email"}
          name={"email"}
          id={"email"}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <Input
          placeholder={"Name"}
          name={"name"}
          id={"name"}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder={"Phone Number"}
          name={"phone"}
          id={"phone"}
          keyboardType={"numeric"}
          onChangeText={(text) => setPhone(text)}
        />
        <Input
          placeholder={"Password"}
          name={"password"}
          id={"password"}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <View style={styles.buttonGroup}>
          {error ? <Error message={error} /> : null}
        </View>
        <View>
          <EasyButton large primary onPress={() => register()}>
            <Text style={{ color: "white" }}>Register</Text>
          </EasyButton>
        </View>
        <View>
          <EasyButton
            large
            secondary
            onPress={() => props.navigation.navigate("Login")}
          >
            <Text style={{ color: "white" }}>Back to Login</Text>
          </EasyButton>
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    margin: 10,
    alignItems: "center",
  },
});

export default Register;
