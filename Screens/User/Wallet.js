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


const Wallet = (props) => {
  const context = useContext(AuthGlobal);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const [balances, setBalances] = useState();

 useFocusEffect( 
   useCallback(() => {
    console.log('Wallet,useEffect');
    props.hideHeader({hide:true});

    AsyncStorage.getItem("jwt")
    .then((res) => {
      setToken(res);
    })
    .catch((error) => [console.log(error)]);
    
    loadBalance();

    return () => {
      setLoading(false);
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

  
  return (
    <>
      <Spinner status={loading}></Spinner>
      <Container style={{ backgroundColor: "gainsboro" }}>
          {balances && <ScrollView style={{ backgroundColor: "gainsboro" }}>
            <CardBox>
                <View style={{flexDirection:"column",alignItems:"center",padding:20,borderBottomWidth:1,borderBottomColor:"lightgrey"}}>
                  <Label text="TOTAL BALANCE" type="form" styles={{}}/>
                  <Text style={styles.text}><Icon name="rupee" size={17}/>&nbsp;{balances.totalBalance}</Text>
                  <EasyButton large danger onPress={() => [props.navigation.navigate('Add Cash')]}>
                        <Text style={{color:"white",fontWeight:"500"}}>ADD CASH</Text>
                  </EasyButton>
                  <Label text={"Note: The winnings and bonus balance already included in the total balance"} type="form" styles={{flex:1,alignSelf:"center",fontSize:11,padding:5}}/>
                </View>
                <View style={{flexDirection:"column",alignItems:"center",borderBottomWidth:1,borderBottomColor:"lightgrey",padding:20}}>
                  <Label text="WINNING BALANCE" type="form" styles={{}}/>
                  <Text style={styles.text}><Icon name="rupee" size={17}/>&nbsp;{balances.totalWinningBalance}</Text>
                  <EasyButton large danger onPress={() => [props.navigation.navigate('Withdraw Winnings')]}>
                        <Text style={{color:"white",fontWeight:"500"}}>WITHDRAW</Text>
                  </EasyButton>
                  <Label text={balances ? balances.notesWithdraw : ""} type="form" styles={{flex:1,alignSelf:"center",fontSize:11,padding:5}}/>
                </View>
                <View style={{flexDirection:"row",borderBottomWidth:1,borderBottomColor:"lightgrey"}}>
                  <Label text="BONUS BALANCE" type="form" styles={{flex:1,alignSelf:"center"}}/>
                  <Text style={styles.text}><Icon name="rupee" size={17}/>&nbsp;{balances.totalBonusBalance}</Text>
                </View>
            </CardBox>

            <CardBox styles={{padding:20}}>
              <TouchableOpacity onPress={() => props.navigation.navigate("Transaction History")}>
                  <View style={{flexDirection:"row"}}>
                    <Text style={{flex:1,fontSize:15}}>Transaction History</Text>
                    <SimpleLineIcons name="arrow-right" size={15} style={{alignSelf:"center"}} color={constants.COLOR_RED} />
                  </View>
              </TouchableOpacity>
            </CardBox>
          </ScrollView>}
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

export default connect(null, mapDispatchToProps)(Wallet);
