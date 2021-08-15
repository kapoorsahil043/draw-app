import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, Button, StatusBar } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

// Context
import AuthGlobal from "../../Context/store/AuthGlobal";
import { verify } from "../../Context/actions/Auth.actions";
import Spinner from "../../Shared/Spinner";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import Toast from "react-native-toast-message";
import * as constants from "../../assets/common/constants";

const ChangeEmailVerifyOtp = (props) => {
  const param = props.route.params;
  const context = useContext(AuthGlobal);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [token, setToken] = useState();
  const [otp, setOtp] = useState();

  useEffect(() => {
    console.log('ChangeEmail,useEffect')
    
  }, []);

  useEffect(() => {
    setLoading(false);
    AsyncStorage.getItem("jwt")
    .then((res) => {
      setToken(res);
    })
    .catch((error) => [console.log('token,error',error)]);

    return () => {
      //setLoading();
      //setToken();
    }
  });

  const verifyOtp = () =>{
    let req = {
      email:param.email,
      otp:otp
    }

    axios.post(`${baseURL}users/profile/changeEmail/verifyOtp`, req, {headers: { Authorization: `Bearer ${token}` }})
    .then((resp) => {
      setLoading(false);
      Toast.show({  topOffset: 60,  type: resp.data.success ? "success" : "error",  text1: resp.data.message,  text2: "",})
      if(resp.data.success){
        props.navigation.navigate("Profile");
      }
      }
    )
    .catch((err) => {[console.log(err),setLoading(false),Toast.show({  topOffset: 60,  type: "error",  text1: "Something wen wrong, please try again later!!",  text2: ""})]});

  }

  const handleSubmit = (data) => {
    console.log("handleSubmit",data);
    setError("")
    setLoading(true);
    
    if (otp === "") {
      setError("Please enter valid OTP");
      setLoading(false);
    } else {
      verifyOtp();
    }
  };

  return (
    <>
      <StatusBar animated={true} backgroundColor={constants.COLOR_RED_LIGHT} barStyle="light-content" showHideTransition="slide" hidden={false} />
      <Spinner status={loading}></Spinner>
      <FormContainer title={""}>
        <Input
          placeholder={"Enter your OTP"}
          name={"otp"}
          id={"otp"}
          id={"otp"}
          value={otp}
          keyboardType={"numeric"}
          onChangeText={(text) => setOtp(text)}
        />
        <View style={styles.buttonGroup}>
          {error ? <Error message={error} /> : null}
          
          <EasyButton large primary onPress={() => handleSubmit()}>
            <Text style={{ color: "white" }}>VERIFY OTP</Text>
          </EasyButton>
        </View>
      </FormContainer>
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
});

export default ChangeEmailVerifyOtp;
