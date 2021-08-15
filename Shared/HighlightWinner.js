import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity,Image } from 'react-native'
import { useDispatch, useSelector } from "react-redux";
import appstyles from "../assets/common/appstyles";
import * as constants from "../assets/common/constants";

const HighlightWinner = (props) => {
    const _item = useSelector(state => state.highlightWinnerReducer?.data);
    useEffect(()=>{
        return(()=>{
        })
    },[_item])

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
    {_item && <TouchableOpacity onPress={()=>{props.navigateTo(_item)}}>
        <View key={_item.rank} style={[appstyles.flatListRow,{backgroundColor : constants.COLOR_ORANGE_LIGHT}]}>
            <View style={{ flex: 1}}>
              <View style={{flexDirection:"row"}}>
                <View style={{justifyContent:"center", padding:5}}>
                  <Text style={styles.textValue}>#{_item.rank}</Text>
                </View>
                <View style={{}}>
                  <Image style={{height:40,width:40,borderRadius:100}} source={ _item?.draw?.ranks ? { uri: loadRankImage(_item)} : require("../assets/box-960_720.png") } />
                </View>
              </View>
            </View>
            <View style={{ flex: 1,flexDirection:"row"}}>
              <View style={{}}>
                <Image style={{height:40,width:40,borderRadius:100}} source={_item.user.image ? {uri: _item.user.image} : require("../assets/user-icon.png") }/>
              </View>
              <View style={{justifyContent:"center", padding:5}}>
                <Text style={styles.textValue}>{_item.user.name}</Text>
                {_item.remarks && _item.remarks.indexOf('Winn')>-1 && <Text style={{color:"green",fontSize:10}}>{_item.remarks}</Text>}
                {_item.remarks && _item.remarks.indexOf('Winn')< 0 && <Text style={{color:"grey",fontSize:10}}>{_item.remarks}</Text>}
              </View>
            </View>
          </View>
      </TouchableOpacity>}
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

export default HighlightWinner;