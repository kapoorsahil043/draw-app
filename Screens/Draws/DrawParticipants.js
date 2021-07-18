import React, {useCallback, useContext, useEffect, useState} from "react"
import { StyleSheet, View, Text, Image, AsyncStorage } from 'react-native'
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import * as constants from "../../assets/common/constants";
import Icon from "react-native-vector-icons/FontAwesome";
import AuthGlobal from "../../Context/store/AuthGlobal";

const DrawParticipants = (props) => {
  const [item,setItem] = useState(props.route.params.item);
  const [participants,setParticipants] = useState([]);
  const [token, setToken] = useState();
  const context = useContext(AuthGlobal);
  const [userId,setUserId] = useState(context.stateUser.user.userId);

  const loadData = (_token) =>{
    //console.log('!_token',(!_token))
      if(!_token){
        return;
      }
      axios
      .get(`${baseURL}participants/draw/${item.id}`,{headers: {Authorization: `Bearer ${_token}`}})
      .then((resp) => {setParticipants(resp.data)})
      .catch((error) => {
       // alert("Error to load participant");
      })
  }
 
  useEffect(() => {
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
    }
  },[]);

  const rowFn = (cnt,item,userFound) =>{
    return (<View key={item.id} style={{   flexDirection: "row",   padding: 10,   
    backgroundColor: userFound ? '#f0d8bf' : (cnt % 2 == 0 ?  '#E8E8E8': ''),
    height:70 }}>
                <View style={{ flex: 1,flexDirection:"row" }}>
                  <View style={{justifyContent:"center",marginRight:20}}>
                    {item.image!=="" && <Image style={{height:50,width:50,borderRadius:100}} source={{ uri: item.image }} />}
                    {item.image==="" && <Image style={{height:50,width:50,borderRadius:100}} source={{ uri: constants.DEFAULT_USER_IMAGE_URL }} />}
                  </View>
                  <View style={{justifyContent:"center"}}>
                      <Text style={styles.textValue}>{cnt} {item.name}</Text>
                  </View>
                </View>
    </View>);
  };

  let cnt = 0;
  return (
      <View>
        {/* headers */}
        {/* body */}
        {participants && participants.map((item) => {
          ++cnt;
            return (
              item.id === userId ? rowFn(cnt,item,true) : rowFn(cnt,item,false)
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