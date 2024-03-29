import React, {useCallback, useEffect, useState, useContext} from "react"
import { StyleSheet, View, Text, Image, AsyncStorage, ScrollView, FlatList,RefreshControl, TouchableOpacity } from 'react-native'
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";
import * as constants from "../../assets/common/constants";
import { useFocusEffect } from "@react-navigation/core";
import Spinner from "../../Shared/Spinner";
import appstyles from "../../assets/common/appstyles";
import delay from 'delay';
import { useDispatch, useSelector } from "react-redux";
import HighlightWinner from "../../Shared/HighlightWinner";

const DrawWinners = (props) => {
  const [item,setItem] = useState(props.route.params.item);
  const [winners,setWinners] = useState([]);
  const [newWinners,setNewWinners] = useState([]);
  const context = useContext(AuthGlobal);
  const [userId,setUserId] = useState(context.stateUser.user.userId);
  const [token,setToken] = useState();
  const [loading,setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const dispatch = useDispatch();

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
      dispatch({
        type: 'CLEAR_HIGHLIGHT_WINNER',
      });
    }
  },[]));

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

  const rowFn = (_item,isUserFound,props) => {
    let drawCount = _item.draw.drawCount;
    let rankIndex = -1;
    _item.draw.ranks.forEach((rank => {
      ++rankIndex;
      if(drawCount >=rank.rankStart && drawCount <= rank.rankEnd){
          return;
      }
  }));

    isUserFound = _item.user._id === userId ? {backgroundColor : constants.COLOR_ORANGE_LIGHT} : {};
    if(_item.user._id === userId){
        dispatch({
          type: 'UPDATE_HIGHLIGHT_WINNER',
          data: _item
        });
      return;
    }
    return (
      
      <TouchableOpacity onPress={()=>{rankIndex >-1 ? props.navigation.navigate('Description',{item:_item.draw.ranks[rankIndex]}) : {}}}>
        <View key={_item.rank} style={[appstyles.flatListRow,isUserFound]}>
            <View style={{ flex: 1}}>
              <View style={{flexDirection:"row"}}>
                <View style={{justifyContent:"center", padding:5}}>
                  <Text style={styles.textValue}><Text style={{color:constants.COLOR_GREY}}>#</Text>{_item.rank}</Text>
                </View>
                <View style={{}}>
                  <Image style={{height:40,width:40,borderRadius:100}} source={ _item?.draw?.ranks ? { uri: loadRankImage(_item)} : require("../../assets/box-960_720.png") } />
                </View>
              </View>
            </View>
            <View style={{ flex: 1,flexDirection:"row"}}>
              <View style={{}}>
                <Image style={{height:40,width:40,borderRadius:100}} source={_item.user.image ? {uri: _item.user.image} : require("../../assets/user-icon.png") }/>
              </View>
              <View style={{justifyContent:"center", padding:5}}>
                <Text style={styles.textValue}>{_item.user.name}</Text>
                {_item.remarks && _item.remarks.indexOf('Winn')>-1 && <Text style={{color:"green",fontSize:10}}>{_item.remarks}</Text>}
                {_item.remarks && _item.remarks.indexOf('Winn')< 0 && <Text style={{color:"grey",fontSize:10}}>{_item.remarks}</Text>}
              </View>
            </View>
          </View>
      </TouchableOpacity>
         
     )
  }
  
  const navigateToHandler = async (_item) => {
    props.navigation.navigate('Description',{item:_item.draw.ranks[0]})
  }  

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
        <>
        <View style={{flex: 1,flexDirection: "row",alignContent: "space-around",padding: 10,backgroundColor: constants.COLOR_WHITE_SMOKE,}}>
          <View style={{ flex: 1 }}>
            <Text style={styles.textLabel}>Rank</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.textLabel}>Name</Text>
          </View>
        </View>
        <View>
          <HighlightWinner navigateTo={navigateToHandler}/>
        </View>
        </>
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
              {rowFn(item,false,props)}
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
      color:"black",
      fontSize:12
    }
});

export default DrawWinners;