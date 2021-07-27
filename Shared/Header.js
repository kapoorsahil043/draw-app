import AsyncStorage from "@react-native-community/async-storage";
import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  SafeAreaView,
  View,
  Text,
  Pressable,
} from "react-native";
import * as constants from "../assets/common/constants";
import { connect, useDispatch, useSelector } from "react-redux";
import AuthGlobal from "../Context/store/AuthGlobal";
import IconSimple from "react-native-vector-icons/SimpleLineIcons";
import { Badge } from "native-base";

import axios from "axios";
import baseURL from "../assets/common/baseUrl";

const Header = (props) => {
  const [userImage, setUserImage] = useState(constants.DEFAULT_USER_IMAGE_URL);
  const context = useContext(AuthGlobal);
  const [hideHeader,setHideHeader] = useState(false);

  const dispatch = useDispatch();
  const listItems = useSelector(state => state.alertReducer.items);
  const totalAlerts = Array.isArray(listItems) ? listItems.length : 0;

  const alertLastRecordDate = useSelector(state => state.alertLatestDateReducer.date);
  

  const loadProfileImage = async () => {
    AsyncStorage.getItem("usr")
      .then((usr) => {
        //console.log("usr",usr);
        if (usr) {
          setUserImage(JSON.parse(usr).image);
        }
      })
      .catch((error) => [console.log(error)]);

    return userImage;
  };

  const updateResults = async (newData) =>{
    /* let cur = alerts;
    for (let item of newData) {
      cur.push(item);
    } */

    
    if(newData && newData.length){
      dispatch({type: 'UPDATE_ALERT_DATE',date: newData[newData.length-1].createdOn});

      dispatch({
        type: 'UPDATE_ALERT_LIST',
        items: newData
      });
    }
  }
  

  const initAlerts = async (jwt) => {
    //console.log('initAlerts',alertLastRecordDate)
    if(!jwt){
      return
    }
    
    let date = listItems && listItems.length ? listItems[listItems.length-1].createdOn : 1;

    if(alertLastRecordDate){
      date = alertLastRecordDate;
    }

    await axios.get(`${baseURL}alerts/page/${date}`, {headers: { Authorization: `Bearer ${jwt || token}` },})
        .then((resp) => [
          updateResults(resp.data)])
        .catch((err) => {console.log(err);setRefreshing(false);setNewAlerts([])});
  }

  useEffect(() => {
    //console.log("Header,useEffect");
    loadProfileImage();
    AsyncStorage.getItem("jwt")
    .then(async (res) => {
      initAlerts(res);
    })
    .catch((error) => [console.log(error)]);
  });

  useEffect(() => {
    //console.log("Header,useEffect,2");
    if(props.headerReducer && props.headerReducer.hide){
      setHideHeader(true);
    }else{
      setHideHeader(false);
    }
    
  },[props.headerReducer]);

  return (
    <>
    <SafeAreaView style={styles.header}>
      {!hideHeader && 
      <View style={{   flexDirection: "row",   justifyContent: "space-between",   alignItems: "center", padding: 6,paddingLeft:15,paddingRight:15 }}>
        <View style={{borderWidth:1,borderRadius:100,borderColor:"lightgrey"}}>
          {context.stateUser.isAuthenticated && <Pressable style={{}} onPress={props.profile} style={{ borderRadius: 100}}>
            <Image
              style={{ height: 30, width: 30, borderRadius: 100 }}
              source={{ uri: props.userProfileReducer.image || userImage }}
            />
          </Pressable>}
        </View>
        <View>
          <Image
            source={require("../assets/rewards_icon.png")}
            style={{height: 30, width: 30 }}
          />
        </View>
        {context.stateUser.isAuthenticated && 
          <View style={{flexDirection:"row",justifyContent:"space-between"}}>
            <View style={{position:"absolute",right:55}}>
              <Pressable style={{}} onPress={props.alert}>
              <Badge
                        style={
                          [styles.center, 
                            {width: 20,height:20,top:-8,left:10,position:"absolute"},
                            !totalAlerts || totalAlerts < 1 ? styles.inactive : styles.active
                        ]}
                    >
                        <Text style={{ color: "white",fontWeight:"bold" }}>{totalAlerts > 0 ? totalAlerts : "" }</Text>
                    </Badge>

                <IconSimple name="bell" size={25} color={constants.COLOR_RED}>
                </IconSimple>
                
              </Pressable>
            </View>
            <Pressable style={{}} onPress={props.wallet}>
              <View>
                <IconSimple name="wallet" size={25} color={constants.COLOR_RED}/>
              </View>
            </Pressable>
        </View>}
      </View>}
    </SafeAreaView>
    </>
  );

};

const styles = StyleSheet.create({
  header: {
    //width: "100%",
    //flexDirection: "row",
    marginTop: 25,
    //backgroundColor:constants.COLOR_RED
  },
  active: {
    backgroundColor: constants.COLOR_RED
  },
  inactive: {
      backgroundColor: "white"
  }
});

const mapStateToProps = (state) => {
  const { userProfileReducer,headerReducer } = state;
  return {
    userProfileReducer: userProfileReducer,
    headerReducer: headerReducer,
  };
};

export default connect(mapStateToProps)(Header);
