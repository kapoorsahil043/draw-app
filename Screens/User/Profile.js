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


const Profile = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState();
  const [token, setToken] = useState();

 useFocusEffect( 
   useCallback(() => {
    console.log('Profile,useEffect');
    props.hideHeader({hide:true});

    loadData();

    return () => {
      setLoading(false);
      setUserProfile();
    };
  },[]));

  const loadData = ()=>{
    AsyncStorage.getItem("jwt")
    .then((res) => {
      setLoading(true);
      setToken(res);
      axios.get(`${baseURL}users/${context.stateUser.user.userId}`, {headers: { Authorization: `Bearer ${res}` },})
        .then((user) => [setUserProfile(user.data),setLoading(false),])
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
    

    axios.delete(`${baseURL}users/${id}`, {headers: { Authorization: `Bearer ${token}` },})
    .then((address) => [setLoading(false),console.log(userProfile.data),loadData()])
    .catch((err) => {console.log(err),setLoading(false);});
  }

  return (
    <>
      <Spinner status={loading}></Spinner>
      <Container style={{ backgroundColor: "gainsboro" }}>
     { userProfile &&  <ScrollView style={{ backgroundColor: "gainsboro" }}>
          <CardBox>
              <View style={{borderBottomWidth:1,borderBottomColor:"lightgrey"}}>
                <Label text="Name" type="form"/>
                <Text style={styles.text}>{userProfile.name}</Text>
              </View>

              <View style={{borderBottomWidth:1,borderBottomColor:"lightgrey",marginTop:10}}>
                <View>
                  <Label text="Email" type="form"/>
                  <View style={{flexDirection:"row"}}>
                    <Text style={styles.text}>{userProfile.email}</Text>
                    <TouchableOpacity onPress={()=>{props.navigation.navigate("Change Email")}}>
                      <Text style={{alignSelf:"center"}}>Change</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={{borderBottomWidth:1,borderBottomColor:"lightgrey",marginTop:10}}>
                <Label text="Password" type="form"/>
                <View style={{flexDirection:"row"}}>
                    <Text style={styles.text}>******</Text>
                    <TouchableOpacity onPress={()=>{props.navigation.navigate("Change Password")}}>
                      <Text style={{alignSelf:"center"}}>Change</Text>
                    </TouchableOpacity>
                  </View>
              </View>
              
          </CardBox>
        </ScrollView> }
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
    flex:1,
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserProfile: (image) => dispatch(actions.updateUserProfile(image)),
    clearUserProfile: () => dispatch(actions.clearUserProfile()),
    hideHeader: (value) => dispatch(headerActions.hideHeader(value)),
  };
};

export default connect(null, mapDispatchToProps)(Profile);
