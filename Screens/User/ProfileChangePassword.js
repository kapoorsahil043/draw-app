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

const ProfileChangePassword = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [token, setToken] = useState();

  useEffect(() => {
    console.log('ProfileChangePassword,useEffect')
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

  const callChangePassword = () =>{
    let req = {
      password,
      newPassword,
      reEnterPassword
    }

    axios.put(`${baseURL}users/profile/changePassword`, req, {headers: { Authorization: `Bearer ${token}` }})
    .then((resp) => {
      setLoading(false)
      Toast.show({  topOffset: 60,  type: resp.data.success ? "success" : "error",  text1: resp.data.message,  text2: "",})
      if(resp.data.success){
          props.navigation.navigate("Profile");
      }
    }
  )
  .catch((err) => {[console.log(err),setLoading(false),Toast.show({  topOffset: 60,  type: "error",  text1: "Something went wrong, please try again later!!",  text2: "",})]});

  }

  const handleSubmit = () => {
    console.log("handleSubmit");
    setError("")
    setLoading(true);

    if (password === "") {
      setError("Please enter valid old password");
      setLoading(false);
    }else if (newPassword === "") {
      setError("Please enter valid new password");
      setLoading(false);
    }else if (reEnterPassword === "") {
      setError("Please enter valid confirm password");
      setLoading(false);
    }else if (reEnterPassword !== newPassword) {
      setError("New and Confirm password mismatch!!");
      setLoading(false);
    }else {
      callChangePassword();
    }
  };

  return (
    <>
      <Spinner status={loading}></Spinner>
      <FormContainer title={""}>
        <Input placeholder={"Enter the old password"} name={"password"} id={"password"} secureTextEntry={true} value={password} onChangeText={(text) => setPassword(text)}/>
        <Input placeholder={"Enter the new password"} name={"newPassword"} id={"newPassword"} secureTextEntry={true} value={newPassword} onChangeText={(text) => setNewPassword(text)}/>
        <Input placeholder={"Enter the confirm password"} name={"reEnterPassword"} id={"reEnterPassword"} secureTextEntry={true} value={reEnterPassword} onChangeText={(text) => setReEnterPassword(text)}/>

        <View style={styles.buttonGroup}>
          {error ? <Error message={error} /> : null}
          
          <TouchableOpacity onPress={() => handleSubmit()}>
            <View style={{backgroundColor:"red",padding:15,margin:10,borderRadius:3}}>
              <Text style={{ color: "white", fontWeight:"500",textAlign:"center" }}>CHANGE PASSWORD</Text>
            </View>
          </TouchableOpacity>
        </View>
      </FormContainer>
    </>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },
});

export default ProfileChangePassword;
