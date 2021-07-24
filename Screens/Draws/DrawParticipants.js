import React, {useCallback, useContext, useEffect, useState} from "react"
import { StyleSheet, View, Text, Image, AsyncStorage ,ScrollView, SafeAreaView, FlatList, RefreshControl} from 'react-native'
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import appstyles from "../../assets/common/appstyles";
import * as constants from "../../assets/common/constants";
import Icon from "react-native-vector-icons/FontAwesome";
import AuthGlobal from "../../Context/store/AuthGlobal";
import { useFocusEffect } from "@react-navigation/core";
import Spinner from "../../Shared/Spinner";
import delay from 'delay';

const DrawParticipants = (props) => {
  const [item,setItem] = useState(props.route.params.item);
  const [newParticipants,setNewParticipants] = useState([]);
  const [participants,setParticipants] = useState([]);
  const [token, setToken] = useState();
  const context = useContext(AuthGlobal);
  const [userId,setUserId] = useState(context.stateUser.user.userId);
  const [loading,setLoading] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const updateResults = async (newData) =>{
    console.log('updateResults')
    let cur = participants;
    for (let item of newData) {
      cur.push(item);
    }
    if(newData && newData.length){
      setParticipants(cur);
    }
  }

  const loadData = async (_token) => {
    console.log('loadData,!_token',(!_token))
      if(!_token){return;}

      await axios.get(`${baseURL}participants/draw/${item.id}/${participants[participants.length-1].createdOn}`,{headers: {Authorization: `Bearer ${_token}`}})
      .then((resp) => {setNewParticipants(resp.data);updateResults(resp.data);})
      .catch((error) => {})
  }

  const initData = async (_token) => {
    console.log('!_token',(!_token))
      if(!_token){
        return;
      }
      setLoading(true);
      await AsyncStorage.removeItem('saved_participants');
      axios.get(`${baseURL}participants/draw/${item.id}/1`,{headers: {Authorization: `Bearer ${_token || token}`}})
      .then((resp) => {setParticipants(resp.data);setNewParticipants(resp.data);setLoading(false);setRefreshing(false);})
      .catch((error) => {setLoading(false);setRefreshing(false);})
  }
 
  useFocusEffect(useCallback(() => {
    console.log('DrawParticipants,useEffect');

    AsyncStorage.getItem("jwt")
      .then((jwt) => {
          setToken(jwt);
          initData(jwt);
      })
      .catch((error) => console.log(error));
      
    return () => {
      setParticipants([]);
      setNewParticipants([]);
      setToken();
      //setItem();
      setLoading();
      setRefreshing();
    }
  },[]))

  const rowFn = (cnt,item,userFound) =>{
    return (<View key={item.id} style={{   flexDirection: "row",   padding: 10,   
    backgroundColor: userFound ? '#f0d8bf' : (cnt % 2 == 0 ?  '#E8E8E8': ''),
    height:70 }}>
                <View style={{ flex: 1,flexDirection:"row" }}>
                  <View style={{justifyContent:"center",marginRight:20}}>
                    <Image style={{height:50,width:50,borderRadius:100}} source={item.image!=="" ? { uri: item.image } : require("../../assets/user-icon.png")} />
                  </View>
                  <View style={{justifyContent:"center"}}>
                      <Text style={styles.textValue}>{item.name}</Text>
                  </View>
                </View>
    </View>);
  };

  const loadMoreResults = async info => {
    console.log('loadMoreResults','loadingMore',loadingMore,'allLoaded',allLoaded)
    // if already loading more, or all loaded, return
    if (loadingMore || allLoaded){return}
    if(participants && item && participants.length === item.totalSpots){return;}

    // set loading more (also updates footer text)
    setLoadingMore(true);

    
    // get next results
    await loadData(token);

   // return;
    

    // mimic server-side API request and delay execution for 1 second
    await delay(1000);

    if (newParticipants.length === 0) {
      // if no new items were fetched, set all loaded to true to prevent further requests
      setAllLoaded(true);
    } else {
      // process the newly fetched items
      //await loadData(null);
    }

    // load more complete, set loading more to false
    setLoadingMore(false);
  }

  const persistResults = async (newItems) => {

    // get current persisted list items
    const curItems = await AsyncStorage.getItem('saved_list');
    const newPar = await loadData();

    // format as a JSON object
    let json = curItems === null
      ? {}
      : JSON.parse(curItems);

    // add new items to json object
    for (let item of newItems) {
      json.push(item);
    }

    // persist updated item list
    await AsyncStorage.setItem('saved_list', JSON.stringify(json));

    // update Redux store
    dispatch({
      type: 'UPDATE_LIST_RESULTS',
      items: json
    });
  }

  const onRefresh = async () => {
    console.log('onRefresh')
    setRefreshing(true);
    if(participants && item && participants.length === item.totalSpots){
      await delay(1000);
      setRefreshing(false);
      return;
    }
    initData(token);
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
          <View style={appstyles.header}>
            <Text style={{}}>Displaying {participants.length} Participants</Text>
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
          loadMoreResults(info);
        }}
        onEndReachedThreshold={0.01}
        data={participants}
        keyExtractor={(item) => "item_" + item._id}
        renderItem={({ item, index }) => {
          return (
            <React.Fragment key={index}>
              {rowFn(index+1,item,false)}
            </React.Fragment>
          )
        }}
      />
      </>
         );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        margin: 10
    },
    text: {
        color: 'red'
    },
    textLabel:{
      color:"grey",fontSize:12
    },
    textValue:{
      fontSize:12,
      color:"black"
    }
})

export default DrawParticipants;