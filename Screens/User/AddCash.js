import React, { useEffect, useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, Button, ScrollView, Alert } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import { Container, Item, Picker } from "native-base";

// Context
import AuthGlobal from "../../Context/store/AuthGlobal";
import { loginUser } from "../../Context/actions/Auth.actions";
import Spinner from "../../Shared/Spinner";

import * as constants from "../../assets/common/constants";

import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/userProfileActions";
import * as headerActions from "../../Redux/Actions/headerActions";
import CardBox from "../../Shared/Form/CardBox";
import Label from "../../Shared/Label";
import Icon from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";

import { TouchableOpacity } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/core";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-toast-message";


const AddCash = (props) => {
  const context = useContext(AuthGlobal);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const [balances, setBalances] = useState();

 useFocusEffect( 
   useCallback(() => {
    console.log('AddCash,useEffect');
    props.hideHeader({hide:true});

    AsyncStorage.getItem("jwt")
    .then((res) => {
      setToken(res);
    })
    .catch((error) => [console.log(error)]);
    
    loadBalance();

    return () => {
      setLoading(false);
      setError();
    };
  },[]));

  const loadBalance = ()=>{
    AsyncStorage.getItem("jwt")
    .then((res) => {
      setLoading(true);
      setToken(res);
      axios.get(`${baseURL}w/balance`, {headers: { Authorization: `Bearer ${res}` },})
        .then((resp) => [setBalances(resp.data),setLoading(false)])
        .catch((err) => {console.log(err),setLoading(false);});
    })
    .catch((error) => [console.log(error), setLoading(false)]);
  }

  const confirmAlert = (id) => {
    Alert.alert("Confirmation", "Do you want to delete address?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => {} },
    ]);
  };

  const addAmount = () =>{
    setLoading(true);
    setError("");

    if(!amount || isNaN(amount)){
      setError("Please enter valid amount!!");
      setLoading(false)
      return;
    }
    
    if(amount < 50){
      setError("Mininum 50 rupees are Allowed!!");
      setLoading(false)
      return;
    }
    
    let req = {amount:Number(amount),transactionId:new Date().getMilliseconds()}

    axios.post(`${baseURL}w/m/add`,req, {headers: { Authorization: `Bearer ${token}` },})
    .then((resp) => {
      setLoading(false)
      Toast.show({  topOffset: 60,  type: resp.data.success ? "success" : "error",  text1: resp.data.message,  text2: "",})
      if(resp.data.success){
        setAmount();
        loadBalance();
      }
    })
    .catch((err) => {console.log(err),setLoading(false);Toast.show({  topOffset: 60,  type: "error",  text1: "Something went wrong, please try again later!!",  text2: "",})});
  }

  return (
    <>
      <Spinner status={loading}></Spinner>
      <Container style={{ backgroundColor: "gainsboro" }}>
          <ScrollView style={{ backgroundColor: "gainsboro" }}>
          {balances && <CardBox>
                <View style={{flexDirection:"row"}}>
                  <Label text="Current Balance" type="form" styles={{flex:1,alignSelf:"center"}}/>
                  <Text style={styles.text}><Icon name="rupee" size={17}/>&nbsp;{balances.totalBalance}</Text>
                </View>
            </CardBox>}
            <CardBox styles={{flexDiection:"row",alignItems:"center"}}>
              <Input
                  placeholder={"Enter amount to be loaded in wallet"}
                  name={"amount"}
                  id={"amount"}
                  value={amount}
                  keyboardType={"numeric"}
                  onChangeText={(text) => setAmount(text)}
                />
                {error ? <Error message={error} /> : null}
                
                <EasyButton large danger onPress={() => [addAmount()]}>
                    <Text style={{color:"white",fontWeight:"500"}}>ADD CASH</Text>
                </EasyButton>
                <Label text={balances ? balances.notesAddCash : ""} type="form" styles={{flex:1,alignSelf:"center",fontSize:11,padding:5}}/>
              </CardBox>    
          </ScrollView>
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
  text: {
    padding: 5,
    fontSize:17,
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserProfile: (image) => dispatch(actions.updateUserProfile(image)),
    clearUserProfile: () => dispatch(actions.clearUserProfile()),
    hideHeader: (value) => dispatch(headerActions.hideHeader(value)),
  };
};

export default connect(null, mapDispatchToProps)(AddCash);
