import React, { useEffect, useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, Button, ScrollView, Alert, StatusBar } from "react-native";
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


const Address = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [token, setToken] = useState();

 useFocusEffect( 
   useCallback(() => {
    console.log('Address,useEffect');
    props.hideHeader({hide:true});

    loadData();

    return () => {
      setLoading(false);
      setAddresses();
    };
  },[]));

  const loadData = ()=>{
    AsyncStorage.getItem("jwt")
    .then((res) => {
      setLoading(true);
      setToken(res)
      axios.get(`${baseURL}addresses`, {headers: { Authorization: `Bearer ${res}` },})
        .then((address) => [setAddresses(address.data),setLoading(false)])
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
      { text: "OK", onPress: () => deleteHandler(id) },
    ]);
  };

  const deleteHandler =(id)=>{
    console.log('deleteHandler',id)
    setLoading(true);
    

    axios.delete(`${baseURL}addresses/${id}`, {headers: { Authorization: `Bearer ${token}` },})
    .then((address) => [setLoading(false),console.log(address.data),loadData()])
    .catch((err) => {console.log(err),setLoading(false);});
  }

  return (
    <>
    <StatusBar animated={true} backgroundColor={constants.COLOR_RED_LIGHT} barStyle="light-content" showHideTransition="slide" hidden={false} />
      <Spinner status={loading}></Spinner>
      <Container style={{ backgroundColor: "gainsboro" }}>
      <ScrollView>
        {addresses && addresses.map((address)=> {
         return ( 
         <CardBox key={address.id}>
          <View>
            <Text style={[styles.text,{fontWeight:"700",fontSize:16}]}>{address.name}&nbsp;{address.phone}&nbsp;
            {address.isSelected === constants.statuses.active && <Text style={[styles.text,{color:constants.COLOR_RED,fontSize:10,fontWeight:"200"}]}>Primary Address</Text>}
            {address.isSelected === constants.statuses.inactive && <Text style={[styles.text,{fontSize:10,color:"gray"}]}>Secondary Address</Text>}
            </Text>
            <Text style={styles.text}>{address.apartment} , {address.street}, {address.pincode}</Text>
            <Text style={styles.text}>{address.pincode}, {address.city}</Text>
            <Text style={styles.text}>{address.state}</Text>
            <Text style={styles.text}>{address.country}</Text>
          </View>
          <View style={{flexDirection:"row",justifyContent:"space-between"}}>
            <View style={{marginTop:10}}>
              <TouchableOpacity onPress={() => props.navigation.navigate("Edit Address",{address:address})}>
                <Text style={{fontSize:15,color:constants.COLOR_RED}}><Icon name="edit" size={15} color={constants.COLOR_RED}/> Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={{marginTop:10}}>
            <TouchableOpacity onPress={() => confirmAlert(address.id)}>
              <Text style={{fontSize:15,}}><AntDesign name="delete" size={15}/> Delete</Text>
            </TouchableOpacity>
          </View>
          </View>
        </CardBox>)
        })
        }
        <CardBox>
          <View style={{}}>
              <TouchableOpacity onPress={() => props.navigation.navigate("Add Address")}>
                <Text style={{fontSize:15,color:constants.COLOR_RED}}><Icon name="plus" size={15} color={constants.COLOR_RED}/> Address</Text>
              </TouchableOpacity>
          </View>
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
  text:{
    padding:1,
    fontWeight:"300"
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserProfile: (image) => dispatch(actions.updateUserProfile(image)),
    clearUserProfile: () => dispatch(actions.clearUserProfile()),
    hideHeader: (value) => dispatch(headerActions.hideHeader(value)),
  };
};

export default connect(null, mapDispatchToProps)(Address);
