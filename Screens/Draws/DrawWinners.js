import React, {useCallback, useEffect, useState} from "react"
import { StyleSheet, View, Text, Image, AsyncStorage } from 'react-native'
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { useFocusEffect } from "@react-navigation/native"

const DrawWinners = (props) => {
  const [item,setItem] = useState(props.route.params.item);
  const [winners,setWinners] = useState([]);
  const [token, setToken] = useState();

  const loadWinners = (timer) =>{
    AsyncStorage.getItem("jwt")
        .then((res) => {
          axios
          .get(`${baseURL}winners/draw/${item.id}`,{headers: {Authorization: `Bearer ${res}`}})
          .then((resp) => {setWinners(resp.data); console.log('winner count -> '+winners.length)})
          .catch((error) => {
            clearInterval(timer);
            alert("Error to load winners");
            })
        })
        .catch((error) => {console.log(error);clearInterval(timer);});
        if(winners.length && (item.totalWinnerSpot == winners.length)){
            clearInterval(timer);
        }
  }
 
  (useEffect(() => {
    console.log('DrawWinners,useFocusEffect')
    const timer =  setInterval(() => {
      AsyncStorage.getItem("jwt")
      .then((res) => {
          setToken(res);
          loadWinners(timer);
      })
      .catch((error) => console.log(error));
    }, 2000);
      
    return () => {
      setWinners();
      clearInterval(timer);
      setToken();
    }
  },[]));

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
            <Text>Rank</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>Name</Text>
          </View>
        </View>

        {/* body */}
        {winners && winners.map((item) => {
            return (
              <View
                key={item.rank}
                style={{
                  flexDirection: "row",
                  padding: 10,
                  backgroundColor: item.rank % 2 == 0 ?  '#E8E8E8': '',
                  height:60
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text>#{item.rank}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text>{item.user.name}</Text>
                </View>
              </View>
            );
          })}
      </View>
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
    }
})

export default DrawWinners;