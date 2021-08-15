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
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import { TouchableOpacity } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/core";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-community/async-storage";
import Toast from "react-native-toast-message";


const TransactionHistory = (props) => {
  const context = useContext(AuthGlobal);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const [transactions, setTransactions] = useState();

 useFocusEffect( 
   useCallback(() => {
    console.log('TransactionHistory,useEffect');
    props.hideHeader({hide:true});

    AsyncStorage.getItem("jwt")
    .then((res) => {
      setToken(res);
    })
    .catch((error) => [console.log(error)]);
    
    loadTransactions();

    return () => {
      setLoading(false);
    };
  },[]));

  const loadTransactions = ()=>{
    AsyncStorage.getItem("jwt")
    .then((res) => {
      setLoading(true);
      setToken(res);
      axios.get(`${baseURL}w/list`, {headers: { Authorization: `Bearer ${res}` },})
        .then((resp) => [setTransactions(resp.data),setLoading(false)])
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

  
  return (
    <>
      <Spinner status={loading}></Spinner>
      <Container style={{ backgroundColor: "gainsboro" }}>
          <ScrollView style={{ backgroundColor: "gainsboro" }}>
            {transactions && transactions.map((transc) => {
              return (
                <CardBox styles={{}} key={transc.id}>
                  <View onPress={() => {}}>
                      <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{flex:1,fontSize:14}}>{constants.transactionsStatuses[transc.transactionType].shortDesc}</Text>
                        <Text style={{fontSize:12,color:constants.transactionsStatuses[transc.transactionType].colorCode}}>{transc.amount}&nbsp;<Icon name="rupee" size={12}/></Text>
                        {/* <SimpleLineIcons name="arrow-right" size={15} style={{alignSelf:"center"}} color={constants.COLOR_RED} /> */}
                      </View>
                      <Text style={{flex:1,fontSize:12, color:"grey"}}>Transaction Id: {transc.transactionId}</Text>
                      <Text style={{flex:1,fontSize:12, color:"grey"}}>Transaction Date: {new Date(transc.createdOn).toLocaleString()}</Text>
                      {transc.drawId?.name && <Text style={{flex:1,fontSize:12, color:"grey"}}>Draw Name: {transc.drawId?.name}</Text>}
                  </View>
                </CardBox>
              )
            })}
           {!transactions || !transactions.length && <CardBox>
              <Text style={{textAlign:"center",color:"gray"}}>No transactions available!!</Text>
            </CardBox>}
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

export default connect(null, mapDispatchToProps)(TransactionHistory);
