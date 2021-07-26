import React, { useState, useCallback, useContext } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import {
  Container,
  Header,
  Item,
  Input,
  Text,
  Button,
} from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import Icon from "react-native-vector-icons/FontAwesome";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import * as constants from '../../assets/common/constants';
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import { logoutUser } from "../../Context/actions/Auth.actions";
import AuthGlobal from "../../Context/store/AuthGlobal";
import Toast from "react-native-toast-message";
//redux
import { connect } from "react-redux";
import * as actions from '../../Redux/Actions/headerActions';
import DefaultMessage from "../../Shared/DefaultMessage";
import Spinner from "../../Shared/Spinner";
import CardBox from "../../Shared/Form/CardBox";

var { height } = Dimensions.get("window");

const DrawPage = (props) => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const context = useContext(AuthGlobal);

  useFocusEffect(
    useCallback(() => {
      console.log('DrawPage,useFocusEffect')
      // pull only active Draws
      props.hideHeader({hide:true});

      AsyncStorage.getItem("jwt")
      .then((jwt) => {
        setToken(jwt);
      })
      .catch((error) => console.log(error));

      return () => {
        setDraws([]);
        setLoading();
        setToken();
      };
    }, [])
  );


  const loadActiveDraws = (jwt)=>{
    const config = {
      headers: {
        Authorization: `Bearer ${jwt || token}`,
      },
    };

    axios
    .get(`${baseURL}draws`,config)
    .then((res) => {
      setDraws(res.data);
    })
    .catch((error) => {
      console.log("Api call error");
    });
  }

  const loginAlert = () => {
    Alert.alert("Login Required", "Proceed to Login ?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => [logoutUser(context.dispatch)] },
    ]);
  };

  const confirmAlert = (id,type) => {
    Alert.alert("Confirmation",`Do you want to ${type.toUpperCase()} this draw?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => {
        if(type == "cancel"){
          handleCancel(id);
          return;
        }
        if(type == "start"){
          handleStart(id);
          return;
        }
        if(type == "restart"){
          handleStart(id);
          return;
        }
        if(type == "settlement"){
          handleSettlement(id);
          return;
        }
      } },
    ]);
  };

  const handleSettlement = (drawId) => {
    console.log('handleSettlement',drawId)
    setLoading(true);
    const req = {
      draw: drawId
    };

    const config = {
      headers: {
          Authorization: `Bearer ${token}`,
      }
    };

    axios
    .put(`${baseURL}draws/settle`, req, config)
    .then((res) => {
      //setToggleLabel(res.data.status == constants.statuses.started ? "Restart": "Start")
      loadActiveDraws();
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
      alert(`Error to start draw`);
    });
  }

  const handleStart = (drawId) => {
    console.log('toggleDraw',drawId)
    setLoading(true);
    const req = {
      draw: drawId
    };

    const config = {
      headers: {
          Authorization: `Bearer ${token}`,
      }
    };

    axios
    .put(`${baseURL}draws/toggle`, req, config)
    .then((res) => {
      //setToggleLabel(res.data.status == constants.statuses.started ? "Restart": "Start")
      setLoading(false);
      loadActiveDraws();
    })
    .catch((error) => {
      setLoading(false);
      alert(`Error to start draw`);
    });
  }

  const handleCancel = (drawId) => {
    console.log("handleCancel", drawId);
    if(!token){
        loginAlert();
        return;
    }

    let req = {
      drawId:drawId
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    {
      axios
        .put(`${baseURL}draws/cancel`, req, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({topOffset: 60,type: "success",text1: "Draw cancelled successfully!!",text2: "",});
          }
          loadActiveDraws();
        })
        .catch((error) => {
          console.log(error);
          Toast.show({   topOffset: 60,   type: "error",   text1: "Something went wrong",   text2: "Please try again", });
        });
    }
  };

  return (
    <>
      <Spinner status={loading}></Spinner>
      <Container style={{backgroundColor: "gainsboro"}}>
        <ScrollView>
          <View>
            <CardBox styles={{padding:20}}>
              <TouchableOpacity onPress={() => props.navigation.navigate("Add",{item:null})}>
                    <View style={{flexDirection:"row"}}>
                      <Text style={{flex:1,fontSize:15}}>Create Draw</Text>
                      <SimpleLineIcons name="arrow-right" size={15} style={{alignSelf:"center"}} color={constants.COLOR_RED} />
                    </View>
                </TouchableOpacity>
            </CardBox>
            <CardBox styles={{padding:20}}>
              <TouchableOpacity onPress={() => props.navigation.navigate("Images",{item:null})}>
                    <View style={{flexDirection:"row"}}>
                      <Text style={{flex:1,fontSize:15}}>Upload Image</Text>
                      <SimpleLineIcons name="arrow-right" size={15} style={{alignSelf:"center"}} color={constants.COLOR_RED}/>
                    </View>
                </TouchableOpacity>
            </CardBox>

            <CardBox styles={{padding:20}}>
              <TouchableOpacity onPress={() => props.navigation.navigate("Testing")}>
                    <View style={{flexDirection:"row"}}>
                      <Text style={{flex:1,fontSize:15}}>Testing</Text>
                      <SimpleLineIcons name="arrow-right" size={15} style={{alignSelf:"center"}} color={constants.COLOR_RED}/>
                    </View>
              </TouchableOpacity>
            </CardBox>

            <CardBox styles={{padding:20}}>
              <TouchableOpacity onPress={() => props.navigation.navigate("Maintenance")}>
                    <View style={{flexDirection:"row"}}>
                      <Text style={{flex:1,fontSize:15}}>Maintenance</Text>
                      <SimpleLineIcons name="arrow-right" size={15} style={{alignSelf:"center"}} color={constants.COLOR_RED}/>
                    </View>
              </TouchableOpacity>
            </CardBox>

            <CardBox styles={{padding:20}}>
              <TouchableOpacity onPress={() => props.navigation.navigate("Notification")}>
                    <View style={{flexDirection:"row"}}>
                      <Text style={{flex:1,fontSize:15}}>Notification</Text>
                      <SimpleLineIcons name="arrow-right" size={15} style={{alignSelf:"center"}} color={constants.COLOR_RED}/>
                    </View>
              </TouchableOpacity>
            </CardBox>

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
  buttonText: {
    color: "white",
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
      hideHeader: (value) => dispatch(actions.hideHeader(value)),
  }
}

export default connect(null,mapDispatchToProps)(DrawPage);
