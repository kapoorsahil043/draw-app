import React, {useCallback, useEffect, useState, useContext} from "react"
import { StyleSheet, View, Text, Image, AsyncStorage } from 'react-native'
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";
import * as constants from "../../assets/common/constants";

const DrawWinners = (props) => {
  const [item,setItem] = useState(props.route.params.item);
  const [winners,setWinners] = useState([]);
  const context = useContext(AuthGlobal);
  const [userId,setUserId] = useState(context.stateUser.user.userId);
  const [selfWinnerObj,setSelfWinnerObj] = useState();
  const [token,setToken] = useState();
  
  const loadWinners = (jwt,winnerTimer) =>{
    console.log("loadWinners",item.totalSpots,item.name,(!jwt),winners.length,item.status)
      if(!jwt){
        clearInterval(winnerTimer);
        return;
      }
      if(winners && winners.length === item.totalSpots){
        clearInterval(winnerTimer);
        return;
      }
      if(item.status !== constants.statuses.started && item.status !== constants.statuses.completed){
        return;
      }

      axios
      .get(`${baseURL}winners/draw/${item.id}`,{headers: {Authorization: `Bearer ${jwt}`}})
      .then((resp) => {
        console.log('win success')
         setWinners(resp.data);
          if(resp.data.length === item.totalSpots){
            clearInterval(winnerTimer);
          }
        })
        .catch((error) => {
          console.log('win err')
          if(winners && winners.length === item.totalSpots){
            clearInterval(winnerTimer);
          }
        })
  }
 
  useEffect(() => {
    console.log('DrawWinners, usesEffect');

      const winnerTimer = setInterval(() => {
        AsyncStorage.getItem("jwt").then((jwt) => {loadWinners(jwt,winnerTimer);}).catch((error) => console.log(error));
      }, 5000);
      
    return () => {
      setWinners();
      setToken();
      clearInterval(winnerTimer);
    }
  },[]);

  const userFound = (_item) => {
    setSelfWinnerObj(_item);
    return null;
  }

  return (
      <View>
        {/* headers */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignContent: "space-around",
            padding: 10,
            backgroundColor: "#E8E8E8",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.textLabel}>#Rank</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.textLabel}>Name</Text>
          </View>
        </View>

        {/* body */}

        {
          winners && winners.map((_item) => {
            return (
              (_item.user._id === userId) ? rowFn(item,_item,true) :
              rowFn(item,_item)
            );
          })
        }
      </View>
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

const rowFn = (item,_item,isUserFound)=>{
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