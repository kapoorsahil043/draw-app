import React, {useCallback, useEffect, useState, useContext} from "react"
import { StyleSheet, View, Text, Image, AsyncStorage, ScrollView, FlatList,RefreshControl } from 'react-native'
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";
import * as constants from "../../assets/common/constants";
import { useFocusEffect } from "@react-navigation/core";
import Spinner from "../../Shared/Spinner";
import appstyles from "../../assets/common/appstyles";
import delay from 'delay';

const DrawWinners = (props) => {
  const [item,setItem] = useState(props.route.params.item);
  const [winners,setWinners] = useState([]);
  const [newWinners,setNewWinners] = useState([]);
  const context = useContext(AuthGlobal);
  const [userId,setUserId] = useState(context.stateUser.user.userId);
  const [selfWinnerObj,setSelfWinnerObj] = useState();
  const [token,setToken] = useState();
  const [loading,setLoading] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const initWinners = async (jwt) => {
    console.log("initWinners")
      if(!jwt){
        return;
      }

      setLoading(true);
      
      axios.get(`${baseURL}winners/draw/${item.id}/1`,{headers: {Authorization: `Bearer ${jwt || token}`}})
      .then((resp) => {setWinners(resp.data);setNewWinners(resp.data);setLoading(false);setRefreshing(false);})
      .catch((error) => {console.log('DrawWinners err');setLoading(false);setRefreshing(false);})
  }

  const updateResults = async (newData) =>{
    console.log('updateResults')
    let cur = winners;
    for (let item of newData) {
      cur.push(item);
    }
    if(newData && newData.length){
      setWinners(cur);
    }
  }
  

  const loadWinners = async (jwt) => {
    console.log("loadWinners")
      if(!jwt){
        return;
      }
      
      await axios.get(`${baseURL}winners/draw/${item.id}/${winners[winners.length-1].createdOn}`,{headers: {Authorization: `Bearer ${jwt||token}`}})
      .then((resp) => {console.log('DrawWinners success');setNewWinners(resp.data);updateResults(resp.data);})
      .catch((error) => {console.log('DrawWinners err');setNewWinners([])})
  }
 
  useFocusEffect(useCallback(() => {
    console.log('DrawWinners, usesEffect');
      AsyncStorage.getItem("jwt").then((jwt) => {setToken(jwt);initWinners(jwt);}).catch((error) => {console.log(error);});
      
    return () => {
      setNewWinners([]);
      setWinners([]);
      setToken();
      setLoading();
      setRefreshing();
      //setItem();
    }
  },[]));

  const userFound = (_item) => {
    setSelfWinnerObj(_item);
    return null;
  }

  const loadMoreResults = async info => {
    console.log('loadMoreResults',info);
    // if already loading more, or all loaded, return
    if (loadingMore || allLoaded){return}
    
    if(!winners || !winners.length){return}
    if(winners && item && winners.length === item.totalSpots){return}
      
    // set loading more (also updates footer text)
    setLoadingMore(true);
    
    // get next results
    await loadWinners(token);

   // return;
    

    // mimic server-side API request and delay execution for 1 second
    await delay(1000);

    if (newWinners.length === 0) {
      // if no new items were fetched, set all loaded to true to prevent further requests
      setAllLoaded(true);
    } else {
      // process the newly fetched items
      //await loadWinners(null);
    }

    // load more complete, set loading more to false
    setLoadingMore(false);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    if(winners && item && winners.length === item.totalSpots){
      await delay(1000);
      setRefreshing(false);
      return ;
    }
    
    initWinners(token);
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
        <View style={{flex: 1,flexDirection: "row",alignContent: "space-around",padding: 10,backgroundColor: "#E8E8E8",}}>
          <View style={{ flex: 1 }}>
            <Text style={styles.textLabel}>#Rank</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.textLabel}>Name (Displaying {winners.length} winners)</Text>
          </View>
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
        data={winners}
        keyExtractor={(item) => "item_" + item.id}
        renderItem={({ item, index }) => {
          return (
            <React.Fragment key={index}>
              {rowFn(item,false)}
            </React.Fragment>
          )
        }}
      />
      </>
    );
}

const loadRankImage = (winnerItem) =>{
  if(!winnerItem || !winnerItem.draw || !winnerItem.draw.ranks){
    return constants.DEFAULT_IMAGE_URL;
  }
  let img = constants.DEFAULT_IMAGE_URL;
  winnerItem.draw.ranks.forEach((rank)=>{
    if(winnerItem.rank >=rank.rankStart && winnerItem.rank <= rank.rankEnd){
      img = rank.rankImage;
      return;
    }
  });
  return img;
}

const rowFn = (_item,isUserFound)=>{
  return (
       <View
          key={_item.rank}
          style={{
            flexDirection: "row",
            padding: 5,
            backgroundColor: isUserFound ? '#f0d8bf' : (_item.rank % 2 == 0 ?  '#E8E8E8': ''),
            height:70
          }}
        >
          <View style={{ flex: 1}}>
            <View style={{flex:1,flexDirection:"row"}}>
              <View style={{justifyContent:"center", padding:5}}>
                <Text style={styles.textValue}>#{_item.rank}</Text>
              </View>
              <View style={{}}>
                <Image style={{height:50,width:50,borderRadius:100}} source={ _item?.draw?.ranks ? { uri: loadRankImage(_item)} : require("../../assets/box-960_720.png") } />
              </View>
            </View>
          </View>
          <View style={{ flex: 1,flexDirection:"row"}}>
            <View style={{}}>
              <Image style={{height:50,width:50,borderRadius:100}} source={_item.user.image ? {uri: _item.user.image} : require("../../assets/user-icon.png") }/>
            </View>
            <View style={{justifyContent:"center", padding:5}}>
              <Text style={styles.textValue}>{_item.user.name}</Text>
              {_item.remarks && _item.remarks.indexOf('Winn')>-1 && <Text style={{color:"green",fontSize:10}}>{_item.remarks}</Text>}
              {_item.remarks && _item.remarks.indexOf('Winn')< 0 && <Text style={{color:"grey",fontSize:10}}>{_item.remarks}</Text>}
            </View>
          </View>
        </View>
   )
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
      color:"black",
      fontSize:12
    }
});

export default DrawWinners;