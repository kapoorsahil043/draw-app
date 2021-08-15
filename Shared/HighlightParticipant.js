import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity,Image } from 'react-native'
import { useDispatch, useSelector } from "react-redux";
import appstyles from "../assets/common/appstyles";
import * as constants from "../assets/common/constants";

const HighlightParticipant = (props) => {
    const item = useSelector(state => state.highlightParticipantReducer?.data);
    useEffect(()=>{
        return(()=>{
        })
    },[item])

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

    return (
    <>
    {item && <View key={item.id} style={[appstyles.flatListRow,{backgroundColor : constants.COLOR_ORANGE_LIGHT}]}>
                <View style={{ flex: 1,flexDirection:"row" }}>
                  <View style={{justifyContent:"center",marginRight:20}}>
                    <Image style={{height:40,width:40,borderRadius:100}} source={item.image!=="" ? { uri: item.image } : require("../assets/user-icon.png")} />
                  </View>
                  <View style={{justifyContent:"center"}}>
                      <Text style={[styles.textValue,{textTransform: "capitalize"}]}>{item.name}</Text>
                  </View>
                </View>
      </View>}
      </>
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

export default HighlightParticipant;