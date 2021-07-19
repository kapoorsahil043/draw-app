import React, { useEffect, useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, Button, ScrollView, Alert, TextInput } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import { Container, Item, Picker } from "native-base";
import Toast from "react-native-toast-message";

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


const Testing = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState();
  const [selectedDrawId, setSelectedDrawId] = useState();
  const [draws, setDraws] = useState();
  const [loadUserCount, setLoadUserCount] = useState(10);
  

 useFocusEffect( 
   useCallback(() => {
    console.log('Testing,useEffect');
    props.hideHeader({hide:true});
    
    AsyncStorage.getItem("jwt")
    .then((res) => {
      setToken(res)
      loadActiveDraws(res);
    })
    .catch((error) => [console.log(error)]);

    return () => {
      setLoading(false);
      setUsers();
      setSelectedDrawId();
      setDraws();
    };
  },[]));

  const loadActiveDraws = (jwt)=>{
    setLoading(true)
    axios.get(`${baseURL}draws/status/1`,{headers: { Authorization: `Bearer ${jwt || token}` },})
    .then((resp) => [setLoading(false),setDraws(resp.data)])
  }

  const loadData = ()=>{
    setLoading(true);
    setLoadUserCount("");
    axios.get(`${baseURL}users/test/users/${loadUserCount}`,{headers: { Authorization: `Bearer ${token}` },})
    .then((resp) => [setLoading(false),setUsers(resp.data)])
    .catch((err) => {console.log(err),setLoading(false);});
  }

  const dataCleanUp = () =>{
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let req = {
      drawId:"drawId"
    };

    {
      axios
        .put(`${baseURL}draws/temp`, req, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({topOffset: 60,type: "success",text1: "Draw cleanup successfully!!",text2: "",});
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          Toast.show({   topOffset: 60,   type: "error",   text1: "Something went wrong",   text2: "Please try again", });
        });
        setLoading(false);
    }
  }

  const confirmAlert = (id,type) => {
    Alert.alert("Confirmation", `Do you want to ${type} ?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => {
        if(type == "cleanup"){
          dataCleanUp();
          return;
        }
      } },
    ]);
  };

  const addCashForTestUsers =()=>{
    console.log('addCashForTestUsers')
    setLoading(true);
    axios.post(`${baseURL}users/test/addcash`, {amount:100},{headers: { Authorization: `Bearer ${token}` },})
    .then((resp) => {
      setLoading(false);
      let msg = resp.data?.message ? resp.data.message : "Success";
      Toast.show({topOffset: 60,type: "success",text1: msg,text2: "",});
    })
    .catch((err) => {console.log(err),setLoading(false);
      let msg = error.response.data.message ? error.response.data.message : "Something went wrong";
      Toast.show({topOffset: 60,type: "error",text1: msg,text2: "",});
    });
  }


  const joinContestTestUsers =()=>{
    console.log('joinContestTestUsers')
    setLoading(true);
    axios.post(`${baseURL}users/test/joincontest`, {draw:selectedDrawId},{headers: { Authorization: `Bearer ${token}` },})
    .then((resp) => {setLoading(false);
      let msg = resp.data?.message ? resp.data.message : "Success";
      Toast.show({topOffset: 60,type: "success",text1: msg,text2: "",});
    })
    .catch((error) => {console.log(error),setLoading(false);
      let msg = error.response?.data?.message ? error.response.data.message : "Something went wrong";
      Toast.show({topOffset: 60,type: "error",text1: msg,text2: "",});
    });
  }
  

  return (
    <>
      <Spinner status={loading}></Spinner>
      <Container style={{ backgroundColor: "gainsboro" }}>
      <ScrollView>
      <CardBox styles={{padding:20}}>
              <TouchableOpacity onPress={() => confirmAlert(null,"cleanup")}>
                    <View style={{flexDirection:"row"}}>
                      <Text style={{fontSize:15,fontWeight:"600"}}>Click here to clean up data</Text>
                    </View>
                </TouchableOpacity>
      </CardBox>

        <CardBox styles={{padding:20}}>
          <View style={{}}>
              <TouchableOpacity onPress={() => addCashForTestUsers()}>
                <Text style={{fontSize:15,fontWeight:"600"}}>Click here to add cash for test users (100rs)</Text>
              </TouchableOpacity>
          </View>
        </CardBox>
        <CardBox styles={{backgroundColor: "white",padding: 20, marginTop: 5, borderRadius:5,width:"100%",flexDirection:"column"}}>
          <View>
            <Text style={constants.styleTextLabel}>Select Draw</Text>
          </View>
          <Item picker style={{width: "100%"}}>
            <Picker
              mode="dropdown"
              iosIcon={<Icon style={{ color: "grey" }} name="plus" />}
              placeholder="Select draw for testing"
              selectedValue={selectedDrawId}
              placeholderStyle={{ color: "#007aff" }}
              placeholderIconColor="#007aff"
              onValueChange={(e) => [setSelectedDrawId(e)]}
            >
              {draws &&
                draws.map((c) => {
                  return (
                    <Picker.Item key={c.id} label={c.name} value={c._id} />
                  );
                })}
            </Picker>
          </Item>        
        </CardBox>
        <CardBox styles={{padding:20,backgroundColor: selectedDrawId ? "white" : "lightgrey"}}>
          <View style={{}}>
              <TouchableOpacity onPress={() => joinContestTestUsers()} disabled={!selectedDrawId}>
                <Text style={{fontSize:15,fontWeight:"600"}}>Click here to join contest for test users</Text>
              </TouchableOpacity>
          </View>
        </CardBox>
       { <CardBox styles={{padding:20}}>
          <View style={{}}>
              <TextInput value={loadUserCount} onChangeText={(text) => setLoadUserCount(Number(text))} placeholder="Enter no. of user to view" keyboardType="numeric"
              style={{height:20,marginBottom:10}}
              />
          
              <TouchableOpacity onPress={() => loadData()}>
                <Text style={{fontSize:15,fontWeight:"600"}}>Click here to view test users ({users && users.length} users found)</Text>
              </TouchableOpacity>
          </View>
        </CardBox>}
          {
            users && users.map((user)=>{
              return (
                <CardBox styles={{padding:20}} key={user._id}>
                  <View style={{}}>
                    <Text style={{fontSize:15,fontWeight:"600",textTransform:"capitalize"}}>{user.name}</Text>
                    <Text style={{fontSize:12}}>Total Balance: {user.totalBalance}</Text>
                    <Text style={{fontSize:12}}>Total Winning Balance: {user.totalWinningBalance}</Text>
                    <Text style={{fontSize:12}}>Total Bonus Balance: {user.totalBonusBalance}</Text>
                  </View>
                </CardBox>
              )
            })
          }
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

export default connect(null, mapDispatchToProps)(Testing);
