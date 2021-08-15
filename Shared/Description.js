import React, { useEffect, useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, Button, ScrollView, Alert, FlatList, RefreshControl,AsyncStorage, Pressable,
  Image
 } from "react-native";

// Context
import AuthGlobal from "../Context/store/AuthGlobal";
import { loginUser } from "../Context/actions/Auth.actions";
import Spinner from "./Spinner";

import * as constants from "../assets/common/constants";
import baseURL from "../assets/common/baseUrl";

import { connect, useSelector, useDispatch } from "react-redux";
import * as actions from "../Redux/Actions/userProfileActions";
import * as headerActions from "../Redux/Actions/headerActions";

import CardBox from "./Form/CardBox";
import Label from "./Label";
import Icon from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";


import { useFocusEffect } from "@react-navigation/core";
import axios from "axios";

import Toast from "react-native-toast-message";
import appstyles from "../assets/common/appstyles";

import delay from 'delay';
import { Container, H1 } from "native-base";
import DefaultMessage from "./DefaultMessage";


const Description = (props) => {
  const context = useContext(AuthGlobal);
  const [item] = useState(props.route.params?.item);
  const [imageData,setImageData] = useState();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("loading...");
  
  const [token, setToken] = useState();
  
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const listItems = useSelector(state => state.alertReducer.items);
  const alertLastRecordDate = useSelector(state => state.alertLatestDateReducer.date);
  
  const updateResults = async (newData) =>{
    /* let cur = alerts;
    for (let item of newData) {
      cur.push(item);
    } */

    
    if(newData && newData.length){
      dispatch({type: 'UPDATE_ALERT_DATE',date: newData[newData.length-1].createdOn});

      newData.map((i)=>{
        i.read = true;
      })

      dispatch({
        type: 'UPDATE_ALERT_LIST',
        items: newData
      });
    }
  }
  
  const loadImageDetails = async (jwt) => {
    console.log('loadImageDetails')
    setLoading(true)
    await axios.get(`${baseURL}images/${item.rankImageId}`,{headers: { Authorization: `Bearer ${jwt || token}`}})
    .then((res) => {setImageData(res.data);console.log(res.data),setLoading(false)})
    .catch((error) => {console.log("Api call error",error);setLoading(false);setMessage("No description available at the moment!!")});
  }

 useFocusEffect( 
   useCallback(() => {
     console.log('Description',item.rankImageId,item)
      props.hideHeader({hide:true});

    AsyncStorage.getItem("jwt")
    .then(async (res) => {
      setToken(res);
      if(item.rankImageId){loadImageDetails(res)}else{
        setMessage("No description available at the moment!!")
      }
    })
    .catch((error) => [console.log(error),setMessage("No description available at the moment!!")]);

    return () => {
      setLoading();
      setError();
      setMessage();
      setImageData();
    };
  },[]));

  


  
  return (
    <>
      <Spinner status={loading}/>
        <ScrollView>
          {imageData && 
          <>
            <CardBox styles={{flexDirection:"column",flex:1,height:280}}>
              <Image source={{uri: imageData.image ? imageData.image : constants.DEFAULT_IMAGE_URL}} resizeMode="contain" style={styles.image}/>
            </CardBox>
            <CardBox styles={{flexDirection:"column",flex:1}}>
              <H1 style={{}}>{imageData.name}</H1>
            </CardBox>
            <CardBox styles={{flexDirection:"column",flex:1}}>
              <Text style={{fontSize:15}}>{imageData.description}</Text>
            </CardBox>
          </>
          }
          {!imageData && <DefaultMessage message={message}/>}
          
        </ScrollView>
      
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
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserProfile: (image) => dispatch(actions.updateUserProfile(image)),
    clearUserProfile: () => dispatch(actions.clearUserProfile()),
    hideHeader: (value) => dispatch(headerActions.hideHeader(value)),
  };
};

export default connect(null, mapDispatchToProps)(Description);
