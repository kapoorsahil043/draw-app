import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  Dimensions,
  Modal,
} from "react-native";
import { useSelector } from "react-redux";

import * as constants from "../assets/common/constants";


var { height, width } = Dimensions.get("window");


const GlobalSpinner = (props) => {
  const { status } = props;
  const spinnerStatus = useSelector(state => state.spinnerReducer);
  
  useEffect(()=>{
    console.log('GlobalSpinner',status,spinnerStatus)
  },[spinnerStatus])
  return (
    <>
      {spinnerStatus ? (
        <Modal
        animationType="fade"
        transparent={true}
        visible={spinnerStatus}
        >
        <View style={styles.container}>
          <View style={styles.spinner}>
            <ActivityIndicator size="large" color={constants.COLOR_RED} />
          </View>
        </View>
        </Modal>
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

export default GlobalSpinner;
