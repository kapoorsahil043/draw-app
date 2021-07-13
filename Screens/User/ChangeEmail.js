import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
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

const ChangeEmail = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [token, setToken] = useState();

  useEffect(() => {
    console.log('ChangeEmail,useEffect')
    
  }, []);

  useEffect(() => {
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

  const getOtp = () =>{
    let req = {
      email:email
    }

    axios.post(`${baseURL}users/profile/changeEmail/verify`, req, {headers: { Authorization: `Bearer ${token}` }})
    .then((resp) => {
      setLoading(false)
      Toast.show({  topOffset: 60,  type: resp.data.success ? "success" : "error",  text1: resp.data.message,  text2: "",})
      if(resp.data.success){
          props.navigation.navigate("Verify Email OTP",{email: email });
      }
    }
  )
  .catch((err) => {[console.log(err),setLoading(false),Toast.show({  topOffset: 60,  type: "error",  text1: "Something wen wrong, please try again later!!",  text2: ""})]});

  }

  const handleSubmit = (data) => {
    console.log("handleSubmit",data);
    setError("")
    setLoading(true);

    if (email === "") {
      setError("Please enter valid email address");
      setLoading(false);
    } else {
      getOtp();
    }
  };

  return (
    <>
      <Spinner status={loading}></Spinner>
      <FormContainer title={""}>
        <Input
          placeholder={"Enter the new email address"}
          name={"email"}
          id={"email"}
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <View style={styles.buttonGroup}>
          {error ? <Error message={error} /> : null}
          
          <EasyButton large primary onPress={() => handleSubmit()}>
            <Text style={{ color: "white" }}>SEND OTP</Text>
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

export default ChangeEmail;
