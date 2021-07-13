import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

// Context
import AuthGlobal from "../../Context/store/AuthGlobal";
import { loginUser } from "../../Context/actions/Auth.actions";
import Spinner from "../../Shared/Spinner";

const Wallet = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!context.stateUser.isAuthenticated) {
      //props.navigation.navigate("User Profile");
    }
  }, [context.stateUser.isAuthenticated]);

  useEffect(() => {
    setLoading(false);

    return () => {
      setLoading(false);
    }
  });
  const succussCallBack =()=>{
    console.log('succussCallBack')
    setTimeout(() => {
      setLoading(false);  
    }, 1000);
    
  }
  const errorCallBack =()=>{
    console.log('errorCallBack')
    setTimeout(() => {
      setLoading(false);  
    }, 1000);
  }
  const handleSubmit = () => {
    console.log("handleSubmit");
    setLoading(true);
    const user = {
      email,
      password,
    };

    if (email === "" || password === "") {
      setError("Please fill in your credentials");
    } else {
      loginUser(user, context.dispatch,succussCallBack,errorCallBack);
    }
  };

  return (
    <>
      <Spinner status={loading}></Spinner>
      <View>
        <Text>
          Wallet
        </Text>
      </View>
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

export default Wallet;
