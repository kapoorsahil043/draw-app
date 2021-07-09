import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
  Alert,
  TouchableOpacity
} from "react-native";
import { Container, Header, Icon, Item, Input, Text } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Banner from "../../Shared/Banner";
import DrawList from "./DrawList";
import ModalScreen from "./ModalScreen";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-community/async-storage";
import AuthGlobal from "../../Context/store/AuthGlobal";
import Spinner from "../../Shared/Spinner";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

var { height } = Dimensions.get("window");

const DrawContainer = (props) => {
  const context = useContext(AuthGlobal);
  const [draws, setDraws] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [active, setActive] = useState();
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState();

  const joinContest = (drawId) => {
    setLoading(true);
    const req = {
      draw: drawId,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(`${baseURL}participants`, req, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          setLoading(false);

          Notifications.scheduleNotificationAsync({
            content: {
              title: "Contest Joined",
              body: "You've joined contest succussfully",
            },
            trigger: {
              seconds: 5,
            },
          });

          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Contest Joined",
            text2: "",
          });
          setTimeout(() => {
            //props.navigation.navigate("Draw");
          }, 0);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error:", error.response.data.message);
        let msg = error.response.data.message
          ? error.response.data.message
          : "Something went wrong";
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: msg,
          text2: "Please try new one",
        });

        Notifications.scheduleNotificationAsync({
          content: {
            title: "Alert!!",
            body: msg,
          },
          trigger: {
            seconds: 5,
          },
        });

      });
  };

  const loginAlert = () => {
    console.log("context.stateUser.user", context.stateUser.user);
    Alert.alert("Login Required", "Proceed to Login ?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => props.navigation.navigate("SignIn") },
    ]);
  };

  const joinHanlder = (drawId) => {
    console.log("join draw container", drawId);
    if (context.stateUser.user.userId == null) {
      loginAlert();
      return;
    }

    joinContest(drawId);
  };

  const hideJoinButtonCheck = (item) => {
    console.log(
      "item.totalWinnerSpot - item.joined",
      item.totalWinnerSpot,
      item.joined
    );
    return item.totalWinnerSpot - item.joined == 0 ? true : false;
  };
/* 
  const checkPermissionsForiOS = () =>{
    Permissions.getAsync(Permissions.NOTIFICATIONS)
    .then((statusObj)=>{
      if(statusObj.status!=='granted'){
        return Permissions.askAsync(Permissions.NOTIFICATIONS);
      }
      return statusObj;
    })
    .then((statusObj)=>{
      if(statusObj.status!=='granted'){
        throw new Error('Permission not granted');
        return;
      }
    })
    .then(()=>{})
    .catch((err)=>{
      return null;
    })
  }

  useEffect(()=>{

    const backgroundSub =  Notifications.addNotificationResponseReceivedListener(notification =>{
      console.log('notification',notification);
    })

    const foregroundSub =  Notifications.addNotificationReceivedListener(notification =>{
      console.log('notification',notification);
    })

    return ()=>{
      foregroundSub.remove;
      backgroundSub.remove;
    }
  })
 */
  useFocusEffect(
    useCallback(() => {

      //checkPermissionsForiOS();
      
      setFocus(false);
      setActive(-1);
      setTimeout(() => {
        AsyncStorage.getItem("jwt")
          .then((res) => {
            console.log("token", token != undefined);
            setToken(res);
          })
          .catch((error) => console.log(error));
      }, 0);
      // Draws
      setTimeout(() => {
        setLoading(true);
        axios
          .get(`${baseURL}draws`)
          .then((res) => {
            setDraws(res.data);
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            console.log("Api call error");
          });
      }, 10);

      return () => {
        setLoading(false);
        setDraws([]);
      };
    }, [])
  );

  const modalHandler = (value) => {
    console.log("modalHandler", value);
    setModalVisible(value);
  };

  return (
    <>
      {/* <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => modalHandler(true)}>
        <Text style={styles.textStyle}>Show Modal</Text>
    </Pressable> */}
      <ModalScreen
        modalVisible={modalVisible}
        modalHandler={modalHandler}
      ></ModalScreen>
      <Spinner status={loading}></Spinner>
      <Container style={{backgroundColor: "gainsboro",}}>
        <ScrollView>
          <View>
            <View>
              <Banner />
            </View>
            
            {draws.length > 0 ? (
              <View style={styles.listContainer}>
                {draws.map((item) => {
                  return (
                    <DrawList
                      navigation={props.navigation}
                      key={item.id}
                      item={item}
                      join={joinHanlder}
                      loginAlert={loginAlert}
                    />
                  );
                })}
              </View>
            ) : (
              <View style={[styles.center, { height: height / 2 }]}>
                <Text>No draws available at the moment!!</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  listContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    paddingBottom: 20,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
    margin: 10,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
});

export default DrawContainer;
