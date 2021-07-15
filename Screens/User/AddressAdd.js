import React, { useEffect, useContext, useState } from "react";
import { View, Text, StyleSheet, Button, Alert, ScrollView } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import { Container, Item, Picker, Radio } from "native-base";

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
import Fontisto from "react-native-vector-icons/Fontisto";

import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

import { logoutUser } from "../../Context/actions/Auth.actions";


const AddressAdd = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();

  const [apartment,setApartment] = useState();
  const [street,setStreet] = useState();
  const [pincode,setPincode] = useState();
  const [city,setCity] = useState();
  const [state,setState] = useState();
  const [country,setCountry] = useState("India");
  const [contact,setContact] = useState();
  const [recipientName,setRecipientName] = useState();
  const [isSelected, setSelection] = useState(constants.statuses.inactive); // inactive
  
  useEffect(() => {
    console.log("AddressAdd,useEffect",);
    props.hideHeader({hide:true});
    setLoading(false);
    
    AsyncStorage.getItem("jwt")
    .then((jwt) => {
      setToken(jwt);
    })
    .catch((error) => console.log(error));

    return () => {
      setLoading(false)
      setPincode();
      setApartment()
      setStreet()
      setCity()
      setState()
      setCountry()
      setRecipientName()
      setContact()
      setSelection()
      setToken()
    };
  },[]);

  const loginAlert = () => {
    Alert.alert("Login Required", "Proceed to Login ?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => [logoutUser(context.dispatch),props.navigation.navigate("SignIn")] },
    ]);
  };

  const handleSubmit = () => {
    console.log("handleSubmit");
    setLoading(true);

    if(!constants.isValidateValue(recipientName)){
      alert("Please enter valid Recipient Name")
      setLoading(false);
      return;
    }else if(!constants.isValidateValue(contact)){
      alert("Please enter valid Contact No.")
      setLoading(false);
      return;
    }else if(!constants.isValidateValue(apartment)){
      alert("Please enter valid Apartment")
      setLoading(false);
      return;
    }else if(!constants.isValidateValue(street)){
      alert("Please enter valid Street")
      setLoading(false);
      return;
    }else if(!constants.isValidateValue(city)){
      alert("Please enter valid City")
      setLoading(false);
      return;
    }else if(!constants.isValidateValue(pincode) || isNaN(pincode)){
      alert("Please enter valid Pincode")
      setLoading(false);
      return;
    }else if(!constants.isValidateValue(state)){
      setLoading(false);
      alert("Please enter valid State")
      return;
    }

    if(!token){
      setLoading(false);
      loginAlert();
      return;
    }

  let req = {recipientName,contact,apartment,street,pincode,city,state,country,isSelected};

    axios.post(`${baseURL}addresses`, req, {headers: { Authorization: `Bearer ${token}` }})
    .then((resp) => {
      if(resp.status === 200 || resp.status === 201){
        [Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Address added successfully!!",
          text2: "",
        }),
        props.navigation.navigate("Address"),
        ]
      }else{
        [Toast.show({
          topOffset: 60,
          type: "info",
          text1: resp.data.message,
          text2: "",
        }),props.navigation.navigate("Address")]
      }
      setLoading(false)
    })
    .catch((error) => {
      [Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please try again later!!",
        text2: "",
      }),setLoading(false)]
    }
    );
  };

  return (
    <KeyboardAwareScrollView viewIsInsideTabBar={true} extraHeight={200} enableOnAndroid={true} style={{backgroundColor:"gainsboro"}}>
      <Spinner status={loading}></Spinner>
      <Container style={{ backgroundColor: "gainsboro" }}>
        { 
        <ScrollView>
         <CardBox>
            <Label text="Recipient Name" type="form"/>
            <Input placeholder={"Enter Recipient Name"} name={"recipientName"} id={"recipientName"} value={recipientName} onChangeText={(text) => setRecipientName(text)}/>

            <Label text="Contact No." type="form"/>
            <Input placeholder={"Contact"} name={"contact"} id={"contact"} value={contact} keyboardType={"numeric"} onChangeText={(text) => setContact(text)}/>

            <Label text="Flat/ House no., Building, Apartment, Company" type="form"/>
            <Input placeholder={"Apartment"} name={"apartment"} id={"apartment"} value={apartment} onChangeText={(text) => setApartment(text)}/>
            
            <Label text="Area, Colony, Street, Sector, Village" type="form"/>
            <Input placeholder={"Street"} name={"street"} id={"street"} value={street} onChangeText={(text) => setStreet(text)}/>
            
            <Label text="Pincode" type="form"/>
            <Input placeholder={"Pincode"} name={"pincode"} id={"pincode"} value={pincode} keyboardType={"numeric"} onChangeText={(text) => setPincode(text)}/>
            
            <Label text="City" type="form"/>
            <Input placeholder={"City"} name={"city"} id={"city"} value={city} onChangeText={(text) => setCity(text)}/>

            <Label text="State" type="form"/>
            <Input placeholder={"State"} name={"state"} id={"state"} value={state} onChangeText={(text) => setState(text)}/>

            <Label text="Address Type" type="form"/>
            <View style={{padding:10,flexDirection:"row"}}>
              <TouchableOpacity onPress={() => setSelection(isSelected === constants.statuses.active ? constants.statuses.inactive : constants.statuses.active)}>
                {isSelected === constants.statuses.active && <Fontisto name="checkbox-active" size={15} color={constants.COLOR_RED}/>}
                {isSelected === constants.statuses.inactive && <Fontisto name="checkbox-passive" size={15}/>}
              </TouchableOpacity>
              <Text style={{paddingLeft:10}}>{isSelected === constants.statuses.active ? "Primary" : "Secondary"}</Text>
            </View>

{/*             <Label text="Country" type="form"/>
            <Text>{country}</Text> */}

        </CardBox>
        <View style={{alignContent:"center"}}>
          <EasyButton large primary onPress={() => handleSubmit()}>
            <Text style={styles.buttonText}>Save</Text>
          </EasyButton>
        </View>
        </ScrollView>
        }
      </Container>
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
  text:{
    fontSize:18,marginBottom:10
  },
  buttonText: {
    color: "white",
  },
  checkbox: {
    height:20,
    width:20,
    borderColor:constants.COLOR_RED,
    marginTop:10
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserProfile: (image) => dispatch(actions.updateUserProfile(image)),
    clearUserProfile: () => dispatch(actions.clearUserProfile()),
    hideHeader: (value) => dispatch(headerActions.hideHeader(value)),
  };
};

export default connect(null, mapDispatchToProps)(AddressAdd);
