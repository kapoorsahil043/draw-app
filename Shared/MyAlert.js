import React, { useEffect, useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, Button, ScrollView, Alert, FlatList, RefreshControl,AsyncStorage, Pressable,
  TouchableOpacity
 } from "react-native";

// Context
import AuthGlobal from "../Context/store/AuthGlobal";
import { loginUser } from "../Context/actions/Auth.actions";
import Spinner from "../Shared/Spinner";

import * as constants from "../assets/common/constants";
import baseURL from "../assets/common/baseUrl";

import { connect, useSelector, useDispatch } from "react-redux";
import * as actions from "../Redux/Actions/userProfileActions";
import * as headerActions from "../Redux/Actions/headerActions";

import CardBox from "../Shared/Form/CardBox";
import Label from "../Shared/Label";
import Icon from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";


import { useFocusEffect } from "@react-navigation/core";
import axios from "axios";

import Toast from "react-native-toast-message";
import appstyles from "../assets/common/appstyles";

import delay from 'delay';


const MyAlert = (props) => {
  const context = useContext(AuthGlobal);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const [alerts, setAlerts] = useState([]);
  const [newAlerts, setNewAlerts] = useState([]);

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

      dispatch({
        type: 'UPDATE_ALERT_LIST',
        items: newData
      });
    }
  }
  
 ( 
   useEffect(() => {
    props.hideHeader({hide:true});

    AsyncStorage.getItem("jwt")
    .then(async (res) => {
      setToken(res);
      initAlerts(res);
    })
    .catch((error) => [console.log(error), setLoading(false)]);

    

    return () => {
      setLoading();
      setError();
      setNewAlerts([]);
      setAlerts([]);
      setRefreshing();
    };
  },[]));

  


  const initAlerts = async (jwt) => {
    console.log('initAlerts',alertLastRecordDate)
    if(!jwt){
      return
    }
    setLoading(true);

    let date = listItems && listItems.length ? listItems[listItems.length-1].createdOn : 1;

    if(alertLastRecordDate){
      date = alertLastRecordDate;
    }
    
    console.log('date',date);

    await axios.get(`${baseURL}alerts/page/${date}`, {headers: { Authorization: `Bearer ${jwt || token}` },})
        .then((resp) => [
          updateResults(resp.data),
          setNewAlerts(resp.data),
          setLoading(false),setRefreshing(false)])
        .catch((err) => {console.log(err),setLoading(false);setRefreshing(false);setNewAlerts([])});
  }

  const loadAlerts = async (token) => {
    console.log('loadAlerts')
    let date = 1;
    if(alertLastRecordDate && alertLastRecordDate?.date){
      date = alertLastRecordDate.date;
    }
    await axios.get(`${baseURL}alerts/page/${alertLastRecordDate.date}`, {headers: { Authorization: `Bearer ${token}` },})
        .then((resp) => [setNewAlerts(resp.data),updateResults(resp.data)])
        .catch((err) => {console.log(err);setNewAlerts([])});
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

  const loadMoreResults = async info => {
    //console.log('loadMoreResults','loadingMore',loadingMore,'allLoaded',allLoaded)
    // if already loading more, or all loaded, return
    if (loadingMore || allLoaded)
    {
      return;
    }
    
    // set loading more (also updates footer text)
    setLoadingMore(true);

    
    // get next results
    await loadAlerts(token);

   // return;
    

    // mimic server-side API request and delay execution for 1 second
    await delay(2000);

    if (newAlerts.length === 0 || !listItems ||  listItems.length === 0) {
      // if no new items were fetched, set all loaded to true to prevent further requests
      setAllLoaded(true);
    } else {
      // process the newly fetched items
      //await loadData(null);
    }

    // load more complete, set loading more to false
    setLoadingMore(false);
  }

  const onRefresh = async () => {
    console.log('onRefresh')
    setRefreshing(true);
    initAlerts(token);
  };
  
  return (
    <>
    <Spinner status={loading}/>
    <FlatList
      contentContainerStyle={appstyles.list}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      ListHeaderComponent={
        <View style={[appstyles.header,{flexDirection:"row",justifyContent:"space-between"}]}>
          <Text style={{}}>Displaying {listItems ? listItems.length : 0} Alert(s)</Text>
          <TouchableOpacity onPress={ ()=> dispatch({
            type: 'CLEAR_ALERT_LIST',
            items: []
          })}>
            <Text style={{color:"grey"}}>Clear all</Text>
          </TouchableOpacity>
        </View>
      }
      ListFooterComponent={
        <View style={appstyles.footer}>
          {loadingMore &&
            <Text style={appstyles.footerText}>loading...</Text>
          }
        </View>
      }
      scrollEventThrottle={250}
      onEndReached={info => {
        //loadMoreResults(info);
      }}
      onEndReachedThreshold={0.01}
      data={listItems}
      keyExtractor={(item) => "item_" + item._id}
      renderItem={({ item, index }) => {
        return (
          <React.Fragment key={index}>
            <CardBox>
              <View style={{flexDirection:"row"}}>
                <View style={{flex:1}}>
                  <Text style={{fontWeight:"bold",fontSize:17}}>
                    {item.title}
                  </Text>
                  <Text style={{fontWeight:"300",fontSize:10,paddingTop:2,letterSpacing:1}}>
                    {new Date(item.createdOn).toLocaleString()}
                  </Text>
                </View>
                <TouchableOpacity onPress={ ()=> dispatch({
                  type: 'REMOVE_ALERT_FROM_LIST',
                  id: item._id
                })} >
                  <AntDesign name="delete" size={12} color="grey"/>
                </TouchableOpacity>
              </View>
              <Text style={{marginTop:10,fontSize:15,lineHeight:20,fontWeight:"300",letterSpacing:2}}>
                {item.message}
              </Text>
            </CardBox>
          </React.Fragment>
        )
      }}
    />
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

export default connect(null, mapDispatchToProps)(MyAlert);
