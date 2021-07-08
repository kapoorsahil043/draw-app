import AsyncStorage from "@react-native-community/async-storage";
import { Icon } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, Image, SafeAreaView, View, Text, Pressable } from "react-native";
import * as constants from '../assets/common/constants';
import { connect } from "react-redux";

const Header = (props) => {

  const [userImage,setUserImage] = useState(constants.DEFAULT_USER_IMAGE_URL);
  
  const loadProfileImage = ()=>{
    AsyncStorage.getItem("usr")
    .then((usr) => {
      //console.log("usr",usr);
      if(usr){setUserImage(JSON.parse(usr).image)}
    })
    .catch((error) => [console.log(error)]);

    return userImage;
  }

  useEffect(()=>{
    console.log('Header,useEffect',props.userProfileReducer);
    loadProfileImage();
  })

  return (
    <SafeAreaView style={styles.header}>
      <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
      <Pressable style={{ }} onPress={props.profile}>
          <Image
            style={{ height: 50, width: 50, borderRadius: 100 }}
            source={{ uri: props.userProfileReducer.image ? props.userProfileReducer.image : userImage }}
          />
      </Pressable>
        <View>
          <Image
              source={require("../assets/Logo.png")}
              resizeMode="contain"
              style={{flex:1,height:30,width:30 }}
            />
        </View>
        <View>
          <Pressable style={{}} onPress={props.wallet}>
                <Icon name="wallet" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    //width: "100%",
    //flexDirection: "row",
    padding: 10,
    marginTop: 20,
    //backgroundColor:'red'
  },
});

const mapStateToProps = (state) => {
  const { userProfileReducer } = state;
  return {
    userProfileReducer: userProfileReducer,
  };
};

export default connect(mapStateToProps)(Header);
