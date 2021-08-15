import AsyncStorage from "@react-native-community/async-storage";
import React, { useContext, useEffect, useState, } from "react";
import {
  StyleSheet,
  Image,
  SafeAreaView,
  View,
  Text,
  Pressable,
  StatusBar,
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
    let oldData = await AsyncStorage.getItem("UPDATE_ALERT_LIST");
    let json = !oldData || JSON.parse(oldData).items.length === undefined ? [] : JSON.parse(oldData).items;

    if(newData && newData.length > 0){
      newData.forEach(element => {
        json.push(element)
      });
      dispatch({type: 'UPDATE_ALERT_DATE',date: newData[newData.length-1].createdOn});
    }
    dispatch({type: 'UPDATE_ALERT_LIST',items: json});
  }
  

  const initAlerts = async (jwt) => {
    if(!jwt){
      return
    }

    //await AsyncStorage.removeItem("UPDATE_ALERT_DATE");
    let latestDate = await AsyncStorage.getItem("UPDATE_ALERT_DATE");
    console.log('initAlerts,latestDate',latestDate,context.stateUser.user.userId)

    if(!latestDate){
      latestDate = 1;  
    }
    

    await axios.get(`${baseURL}alerts/page/${latestDate}`, {headers: { Authorization: `Bearer ${jwt || token}` },})
        .then((resp) => [updateResults(resp.data)])
        .catch((err) => {console.log(err)});
  }

  
  useEffect(() => {
    console.log("Header,useEffect");
    loadProfileImage();
    if(props.headerReducer && props.headerReducer.hide){
      setHideHeader(true);
    }else{
      setHideHeader(false);
    }
    
  },[props.headerReducer]);

  useEffect(() => {
    console.log("Header,useEffect,listItems");
    AsyncStorage.getItem("jwt")
    .then(async (res) => {
      initAlerts(res);
    })
    .catch((error) => [console.log(error)]);
    
  },[]);

  const BadgeBox = () =>{
    return (
      <>
      <Badge style={[{width: 21,height:21,top: -8,left: 10, position:"absolute",alignItems:"center"},!totalAlerts || totalAlerts < 1 ? styles.inactive : styles.active]}>
          <Text style={{ color: "white",fontSize:8 }}>{totalAlerts > 0 ? (totalAlerts > 9 ? "9+" : totalAlerts) : "" }</Text>
        </Badge>
        <IconSimple name="bell" size={20} color={constants.COLOR_RED}></IconSimple>
      </>
    )
  }
  return (
    <>
    <SafeAreaView>
    <StatusBar animated={true} backgroundColor={constants.COLOR_GREY} barStyle="light-content" showHideTransition="slide" hidden={false} />
    
      {!hideHeader && 
      <View style={{borderBottomColor:constants.COLOR_GREY,elevation:1}}>
        <View style={{position:"absolute",left:10,flexDirection:"row",paddingTop:10}}>
          <View style={{borderWidth:1,borderRadius:100,borderColor:"lightgrey"}}>
            {context.stateUser.isAuthenticated && 
            <Pressable style={{}} onPress={props.profile} style={{ borderRadius: 100}}>
              <Image style={{ height: 24, width: 24, borderRadius: 100 }} source={{ uri: props.userProfileReducer.image || userImage }}/>
            </Pressable>}
          </View>
        </View>
        
        <View style={{flexDirection:"row",justifyContent:"center",padding:12}}>
          <Image source={require("../assets/rewards_icon.png")}
            style={{height: 22, width: 22 }}
          />
        </View>

        {context.stateUser.isAuthenticated && 
          <View style={{position:"absolute",right:15,flexDirection:"row",paddingTop:12}}>
            <View style={{marginRight:30}}>
              <Pressable style={{}} onPress={props.alert}>
                <BadgeBox/>
              </Pressable>
            </View>
            <View>
              <Pressable style={{}} onPress={props.wallet}>
                <View>
                  <IconSimple name="wallet" size={20} color={constants.COLOR_RED}/>
                </View>
              </Pressable>
            </View>
        </View>}
      </View>}
    </SafeAreaView>
    </>
  );

};

const styles = StyleSheet.create({
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
