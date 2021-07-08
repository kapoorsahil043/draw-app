import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text } from 'react-native'
import * as constants from "../assets/common/constants";


const StatusBox = (props) => {
  const [statusText,setStatusText] = useState();
  const [statusStyle,setStatusStyle] = useState({borderColor: "black", color:"black",borderWidth: 0.5,  borderRadius: 5, alignSelf:"center",padding:5});
  const { item } = props;


  useEffect(()=>{
    console.log('StatusBox,useEffect',item.status);
    /* if(item.status === constants.statuses.live){
        setStatusText("Live");
        setStatusStyle({...statusStyle,borderColor:"red",color:"red"})
      }else if(item.status === constants.statuses.active){
        setStatusText("Available");
        setStatusStyle({...statusStyle,borderColor:"green",color:"green"})
      }else if(item.status === constants.statuses.started){
        setStatusText("Live");
        setStatusStyle({...statusStyle,borderColor:"red",color:"red"})
      }else if(item.status === constants.statuses.stopped){
        setStatusText("Paused");
        setStatusStyle({...statusStyle,borderColor:"red",color:"red"})
      }else if(item.status === constants.statuses.completed){
        setStatusText("Completed");
        setStatusStyle({...statusStyle,borderColor:"black",color:"black"})
      } */
  });

    return (
        <View style={styles.container}>
            <Text style={statusStyle}>
                {statusText}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    },
})

export default StatusBox;