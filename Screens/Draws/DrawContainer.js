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

//redux
import { connect } from "react-redux";
import * as actions from '../../Redux/Actions/headerActions';
import DefaultMessage from "../../Shared/DefaultMessage";
import * as constants from "../../assets/common/constants";

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
  const [message, setMessage] = useState("loading...");

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
        console.log("Error:", error.response.data);
        let msg = error.response.data.message ? error.response.data.message : "Something went wrong";
        Toast.show({topOffset: 60,type: "error",text1: msg,text2: "",});
        if(error.response?.data?.redirect){
          redirectAlert(error.response.data.error);
        }

       /*  Notifications.scheduleNotificationAsync({
          content: {
            title: "Alert!!",
            body: msg,
          },
          trigger: {
            seconds: 20,
          },
        }); */

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

  const redirectAlert = (data) => {
    console.log("redirectAlert",data);
    Alert.alert(data.errDesc, "Want to Proceed ?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => {
        props.navigation.navigate(data.link)
      } },
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
  (
    useEffect(() => {
      console.log("DrawContainer,useCallback");
      //checkPermissionsForiOS();
      props.hideHeader({hide:false});
      AsyncStorage.getItem("jwt").then((res) => {setToken(res);}).catch((error) => [console.log(error)]);
      loadDraws();

      return () => {
        setLoading(false);
        setDraws([]);
        setMessage();
      };
    }, [])
  );

  const loadDraws = () =>{
    setLoading(true);
    setMessage("loading...")
    axios.get(`${baseURL}draws`)
    .then((res) => {setDraws(res.data);setLoading(false);setMessage("");})
    .catch((error) => {setLoading(false);setMessage("");console.log("Api call error");});
}

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
              <DefaultMessage message={message}/>
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

const mapDispatchToProps = (dispatch) => {
  return {
      hideHeader: (value) => dispatch(actions.hideHeader(value)),
  }
}

export default connect(null,mapDispatchToProps)(DrawContainer);