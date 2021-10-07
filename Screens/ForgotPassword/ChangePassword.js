import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

// Context
import AuthGlobal from "../../Context/store/AuthGlobal";
import { changePassword } from "../../Context/actions/Auth.actions";
import Spinner from "../../Shared/Spinner";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import * as constants from "../../assets/common/constants";

const ChangePassword = (props) => {
  const param = props.route.params;
  const context = useContext(AuthGlobal);
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
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
    }
  });

  const succussCallBack =()=>{
    console.log('succussCallBack')
    setLoading(false);  
    props.navigation.navigate("Login");
    
  }
  const errorCallBack =(data)=>{
    console.log('errorCallBack',data)
    setLoading(false);  
    
  }

  
  const handleSubmit = (data) => {
    console.log("handleSubmit",data);
    setError("")
    setLoading(true);

    const user = {
      email:param.email,
      password:constants.encrypt(password),
      repassword:constants.encrypt(repassword)
    };

    if (!password || !repassword || password === "" || repassword === "") {
      setError("Please fill in password field(s)");
      return;
    } 
    if( password !== repassword){
      setError("Passwords are not matching!!");
      return;
    }
    else {
      changePassword(user, context.dispatch,succussCallBack,errorCallBack);
    }
  };

  return (
    <>
      <Spinner status={loading}></Spinner>
      <FormContainer title={"Change Password"}>
        <Input
          placeholder={"Enter new password"}
          name={"password"}
          id={"password"}
          value={password}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
          <Input
          placeholder={"Re-Enter new password"}
          name={"repassword"}
          id={"repassword"}
          value={repassword}
          secureTextEntry={true}
          onChangeText={(text) => setRepassword(text)}
        />
        <View style={styles.buttonGroup}>
          {error ? <Error message={error} /> : null}
          
          <EasyButton large primary onPress={() => handleSubmit()}>
            <Text style={{ color: "white" }}>Submit</Text>
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

export default ChangePassword;
