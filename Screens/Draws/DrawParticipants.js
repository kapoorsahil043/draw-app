import React, {useCallback, useContext, useEffect, useState} from "react"
import { StyleSheet, View, Text, Image, AsyncStorage ,ScrollView} from 'react-native'
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import * as constants from "../../assets/common/constants";
import Icon from "react-native-vector-icons/FontAwesome";
import AuthGlobal from "../../Context/store/AuthGlobal";
import { useFocusEffect } from "@react-navigation/core";
import Spinner from "../../Shared/Spinner";

const DrawParticipants = (props) => {
  const [item,setItem] = useState(props.route.params.item);
  const [participants,setParticipants] = useState([]);
  const [token, setToken] = useState();
  const context = useContext(AuthGlobal);
  const [userId,setUserId] = useState(context.stateUser.user.userId);
  const [loading,setLoading] = useState(false);

  const loadData = async (_token) => {
    //console.log('!_token',(!_token))
      if(!_token){
        return;
      }
      setLoading(true);

      axios
      .get(`${baseURL}participants/draw/${item.id}`,{headers: {Authorization: `Bearer ${_token}`}})
      .then((resp) => {setParticipants(resp.data);setLoading(false);})
      .catch((error) => {
       // alert("Error to load participant");
       setLoading(false);
      })
  }
 
  useFocusEffect(useCallback(() => {
    console.log('DrawParticipants,useEffect')
    AsyncStorage.getItem("jwt")
      .then((jwt) => {
          setToken(jwt);
          loadData(jwt);
      })
      .catch((error) => console.log(error));
      
    return () => {
      setParticipants();
      setToken();
      setItem();
      setLoading();
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
                      <Text style={styles.textValue}>{cnt} {item.name}</Text>
                  </View>
                </View>
    </View>);
  };

  let cnt = 0;
  return (
      <>
      <Spinner status={loading}/>
      <ScrollView>
        {/* headers */}
        {/* body */}
        {participants && participants.map((item) => {
          ++cnt;
            return (
              item.id === userId ? rowFn(cnt,item,true) : rowFn(cnt,item,false)
            );
          })}
      </ScrollView> 
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