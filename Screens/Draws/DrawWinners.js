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
  
  const loadWinners = (_token) =>{
      if(!_token){
        return;
      }

      axios
      .get(`${baseURL}winners/draw/${item.id}`,{headers: {Authorization: `Bearer ${_token}`}})
      .then((resp) => {
         setWinners(resp.data);
            if(resp.data.status!==constants.statuses.completed){
              if(resp.data.status === constants.statuses.started){
                setTimeout(() => {
                  loadWinners(_token);  
                }, 2000);
              }
            }
          }
         )
         
      .catch((error) => {
          //alert("Error to load winners");
        })

        if(winners.length && (item.totalSpots == winners.length)){
        }
        if(item.totalSpots > 0 && item.drawCount == 0 ){
        }
  }
 
  useEffect(() => {
    console.log('DrawWinners, usesEffect');

    AsyncStorage.getItem("jwt")
      .then((jwt) => {
          setToken(jwt);
          loadWinners(jwt);
      })
      .catch((error) => console.log(error));
      
    return () => {
      setWinners();
      setToken();
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
    return constants.DEFAULT_USER_IMAGE_URL;
  }
  let img = constants.DEFAULT_USER_IMAGE_URL;
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
                <Image style={{height:50,width:50,borderRadius:100}} source={{ uri: loadRankImage(_item) }} />
              </View>
            </View>
          </View>
          <View style={{ flex: 1,flexDirection:"row"}}>
            <View style={{}}>
              <Image style={{height:50,width:50,borderRadius:100}} source={{ uri: _item.user.image ? _item.user.image : constants.DEFAULT_USER_IMAGE_URL}} />
            </View>
            <View style={{justifyContent:"center", padding:5}}>
              <Text style={styles.textValue}>{_item.user.name}</Text>
              <Text style={{color:"green",fontSize:10}}>{item.totalWinnerSpot >= _item.rank ? 'Winner!!':''}</Text>
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