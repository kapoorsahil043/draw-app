import { Icon } from "native-base";
import React from "react";
import { StyleSheet, Image, SafeAreaView, View, Text, Pressable } from "react-native";

const Header = (props) => {
  
  return (
    <SafeAreaView style={styles.header}>
      <View style={{flexDirection:"row"}}>
        <Image
          source={require("../assets/Logo.png")}
          resizeMode="contain"
          style={{ height: 30,flex:1 }}
        />
        <Pressable style={{}} onPress={props.wallet}>
            <Icon name="wallet" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    //width: "100%",
    //flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 20,
    //backgroundColor:'red'
  },
});

export default Header;
