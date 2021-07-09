import AsyncStorage from "@react-native-community/async-storage";
import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  SafeAreaView,
  View,
  Text,
  Pressable,
} from "react-native";
import * as constants from "../assets/common/constants";
import { connect } from "react-redux";
import AuthGlobal from "../Context/store/AuthGlobal";
import IconSimple from "react-native-vector-icons/SimpleLineIcons";

const Header = (props) => {
  const [userImage, setUserImage] = useState(constants.DEFAULT_USER_IMAGE_URL);
  const context = useContext(AuthGlobal);

  const loadProfileImage = () => {
    AsyncStorage.getItem("usr")
      .then((usr) => {
        //console.log("usr",usr);
        if (usr) {
          setUserImage(JSON.parse(usr).image);
        }
      })
      .catch((error) => [console.log(error)]);

    return userImage;
  };

  useEffect(() => {
    console.log("Header,useEffect");
    loadProfileImage();
  });

  return (
    <SafeAreaView style={styles.header}>
      <View style={{   flexDirection: "row",   justifyContent: "space-between",   alignItems: "center", padding:5 }}>
        <View style={{}}>
          {context.stateUser.isAuthenticated && <Pressable style={{}} onPress={props.profile} style={{ borderRadius: 100}}>
            <Image
              style={{ height: 30, width: 30, borderRadius: 100 }}
              source={{ uri: props.userProfileReducer.image || userImage }}
            />
          </Pressable>}
        </View>
        <View>
          <Image
            source={require("../assets/rewards_icon.png")}
            style={{height: 30, width: 30 }}
          />
        </View>
        <View>
          {context.stateUser.isAuthenticated && <Pressable style={{}} onPress={props.wallet}>
            <View>
              {/* <Image source={require("../assets/account_icon.png")} style={{height: 30, width: 30 }}/> */}
              <IconSimple name="wallet" size={25} />
            </View>
          </Pressable>}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    //width: "100%",
    //flexDirection: "row",
    padding: 5,
    marginTop: 25,
    //backgroundColor:constants.COLOR_RED
  },
});

const mapStateToProps = (state) => {
  const { userProfileReducer } = state;
  return {
    userProfileReducer: userProfileReducer,
  };
};

export default connect(mapStateToProps)(Header);
