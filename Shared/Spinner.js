import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
var { height, width } = Dimensions.get("window");

const Spinner = (props) => {
  const { status } = props;
  return (
    <>
      {status ? (
        <View style={styles.container}>
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color="red" />
          </View>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    zIndex: 1,
    width: "100%",
    height: "100%",
    alignItems: 'center', 
    justifyContent: 'center'
  },
  spinner: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 50,
    height: 50,
  },
});

export default Spinner;
