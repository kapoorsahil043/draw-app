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

const ForgotPassword = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    console.log('ForgotPassword,useEffect')
    
  }, []);

  useEffect(() => {
    setLoading(false);

    return () => {
      setLoading(false);
      clearInterval(timer);
    }
  });

  const succussCallBack =()=>{
    console.log('succussCallBack')
    setLoading(false);  
    props.navigation.navigate("Verify OTP",{email: email });
  }

  const errorCallBack =(data)=>{
    console.log('errorCallBack',data)
    setTimeout(() => {
      setLoading(false);  
    }, 1000);
  }

  const [timerStarted,setTimerStarted] = useState(false);
  
  const timer = () =>{
    console.log('timer',timerStarted)
    if(counter > 30){
      setTimerStarted(false);
      setCounter(0);
      return;
    }

    setCounter(counter => counter+1);
    setTimeout(() => {
      timer();
    }, 1000);
  }

  const startTimer = () =>{
    console.log('startTimer')
    setTimerStarted(true);
    //timer();
  }
  
  const handleSubmit = (data) => {
    console.log("handleSubmit",data);
    setError("")
    setLoading(true);
    startTimer();
    const user = {
      email,
    };

    if (email === "") {
      setError("Please fill in your credentials");
    } else {
      verify(user, context.dispatch,succussCallBack,errorCallBack);
    }
  };

  return (
    <>
      <Spinner status={loading}></Spinner>
      <FormContainer title={""}>
        <Input
          placeholder={"Enter Email/ Mobile No."}
          name={"email"}
          id={"email"}
          value={email}
          onChangeText={(text) => setEmail(text.toLowerCase())}
        />
        <View style={styles.buttonGroup}>
          {error ? <Error message={error} /> : null}
          
          <EasyButton large primary onPress={() => handleSubmit()}>
            <Text style={{ color: "white" }}>Verify</Text>
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

export default ForgotPassword;
