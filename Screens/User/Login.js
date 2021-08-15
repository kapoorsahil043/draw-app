import React, { useEffect, useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

// Context
import AuthGlobal from "../../Context/store/AuthGlobal";
import { loginUser } from "../../Context/actions/Auth.actions";

//redux
import { connect, useDispatch } from "react-redux";
import * as actions from '../../Redux/Actions/userProfileActions';

import Spinner from "../../Shared/Spinner";
import { TouchableOpacity } from "react-native-gesture-handler";

import * as Device from 'expo-device';
import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from "@react-navigation/core";


const Login = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useFocusEffect(useCallback(() => {

    console.log('Login,useEffect')
    return () => {
      setLoading();
      setEmail();
      setPassword();
    }
  },[]));

  const succussCallBack =(user)=>{
    console.log('succussCallBack')
    props.updateUserProfile(user.image);
    props.navigation.navigate("Home");
    setTimeout(() => {
      dispatch({type: 'HIDE_SPINNER'});  
    }, 2000);
    
  }
  const errorCallBack =()=>{
    console.log('errorCallBack')
    dispatch({type: 'HIDE_SPINNER'});
  }
  
  const handleSubmit = async () => {
    console.log("handleSubmit");
    dispatch({type: 'SHOW_SPINNER'});
    if (email === "" || password === "") {
      setError("Please fill in your credentials");
      dispatch({type: 'HIDE_SPINNER'});
      return;
    }
    
    const user = {
      email:email.toLowerCase(),password,pushId:'',
      osName: Device.osName,osVersion: Device.osVersion,modelName: Device.modelName,isRooted:''
    };

    try {await Device.isRootedExperimentalAsync().then((data)=> user.isRooted = data );  }  catch (error) {}

    await AsyncStorage.getItem("push_id").then((data) => {user.pushId = data;}).catch((error) => [console.log(error)]);
    
    loginUser(user, context.dispatch,succussCallBack,errorCallBack);
  };
  
  return (
    <KeyboardAwareScrollView viewIsInsideTabBar={true} extraHeight={100} enableOnAndroid={true}>
      <FormContainer title={"Login"}>
        <Input
          placeholder={"Enter Email"}
          name={"email"}
          id={"email"}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder={"Enter Password"}
          name={"password"}
          id={"password"}
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <View style={styles.buttonGroup}>
          {error ? <Error message={error} /> : null}
          <EasyButton large primary onPress={() => handleSubmit()}>
            <Text style={{ color: "white" }}>Login</Text>
          </EasyButton>
          <TouchableOpacity large primary onPress={() => props.navigation.navigate("Forgot Password")}>
            <Text style={{ color: "black" }}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
          <Text style={{}}>Don't have an account yet?</Text>
          <EasyButton
            large
            secondary
            onPress={() => props.navigation.navigate("Register")}
          >
            <Text style={{ color: "white" }}>Register</Text>
          </EasyButton>
        </View>
      </FormContainer>
    </KeyboardAwareScrollView>
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

const mapDispatchToProps = (dispatch) => {
  return {
      updateUserProfile: (image) => dispatch(actions.updateUserProfile(image)),
  }
}

export default connect(null,mapDispatchToProps)(Login);
