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
  RefreshControl,
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
import delay from 'delay';

var { height } = Dimensions.get("window");

const MaintenancePage = (props) => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const context = useContext(AuthGlobal);
  const [message, setMessage] = useState("loading...");
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log('DrawPage,useFocusEffect')
      // pull only active Draws
      props.hideHeader({hide:true});
      setLoading(true);
    
      AsyncStorage.getItem("jwt")
      .then((jwt) => {
        setToken(jwt);
        loadActiveDraws(jwt);
      })
      .catch((error) => {console.log(error);setLoading(false);
      });

      return () => {
        setDraws([]);
        setLoading();
        setToken();
        setMessage();
        setRefreshing();
      };
    }, [])
  );


  const loadActiveDraws = async (jwt)=>{
    setMessage("loading...");

    const config = {
      headers: {
        Authorization: `Bearer ${jwt || token}`,
      },
    };

    axios
    .get(`${baseURL}draws`,config)
    .then((res) => {
      setDraws(res.data);
      setLoading(false);
      setMessage("");
      setRefreshing(false);
    })
    .catch((error) => {
      console.log("Api call error");
      setLoading(false);
      setMessage("");
      setRefreshing(false);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await delay(1000);
    loadActiveDraws(token);
  };

  return (
    <>
      <Spinner status={loading}></Spinner>
      <Container style={{backgroundColor: "gainsboro"}}>
        <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      >
          <View>
            {draws.length > 0 ? (
              <View style={styles.listContainer}>
                <Text style={{padding:5}}>Draw count(s) ({draws.length})</Text>
                {draws.map((item) => {
                  return (
                      <View key={item.id} style={{flexDirection:"column",backgroundColor:"white",margin:5,borderRadius:5,padding:10}}>
                        <View>
                          
                          <View style={{borderBottomWidth:1,borderColor:"lightgrey"}}>
                            <Text style={{fontSize:20,fontWeight:"700",textTransform:"capitalize"}}>{item.name} <Text style={{color:constants.statusesColor[item.status]}}>({constants.statusesDesc[item.status]}{item.joined ===item.totalSpots ? " / Full":"" })</Text></Text>
                            <Text style={{fontSize:13,padding:1}}>Draw date: {new Date (item.drawDate).toLocaleString()}</Text>
                          </View>
                          
                          
                          <View style={{borderBottomWidth:1,borderColor:"lightgrey"}}>
                            <Text style={{fontSize:13,padding:1}}>Total spots: {item.totalSpots}</Text>
                            <Text style={{fontSize:13,padding:1}}>Total winner spots: {item.totalWinnerSpot} (Winning: {item.winnersPct}%)</Text>
                            <Text style={{fontSize:13,padding:1}}>Total user joined: {item.joined}</Text>
                          </View>
                          <View style={{borderBottomWidth:1,borderColor:"lightgrey"}}>
                              <Text style={{fontSize:13,padding:1}}>Draw start status: {constants.statusesDesc[item.drawStartedStatus]}</Text>
                              <Text style={{fontSize:13,padding:1}}>Draw completion%: {Math.round((item.totalSpots - item.drawCount)/item.totalSpots * 100)}%</Text>
                          </View>
                          <Text style={{fontSize:13,padding:1}}>Cashback settlement status: {constants.statusesDesc[item.priceSettleStatus]}</Text>
                          <Text style={{fontSize:13,padding:1}}>Cashback user count: {item.priceSettleCount}</Text>
                          <View style={{borderBottomWidth:1,borderColor:"lightgrey"}}>
                            <Text style={{fontSize:13,padding:1}}>Cashback user %: {(item.priceSettleCount/ item.totalWinnerSpot)*100 }%</Text>
                          </View>
                        </View>
                        <View style={{flexDirection:"row",alignSelf:"flex-end",padding:5}}>
                          {item.status === constants.statuses.active && item.joined !== item.totalSpots && <EasyButton primary small onPress={() => props.navigation.navigate("Edit",{id:item.id})}>
                            <Text style={{ color: "white"}}>Edit</Text>
                          </EasyButton>}
                          {item.status === constants.statuses.active && item.joined !== item.totalSpots && <EasyButton primary small onPress={() => props.navigation.navigate("Extend",{id:item.id})}>
                            <Text style={{ color: "white"}}>Extend</Text>
                          </EasyButton>}
                          {item.status === constants.statuses.active && item.joined !== item.totalSpots && <EasyButton primary small onPress={() => confirmAlert(item.id,"cancel")}>
                            <Text style={{ color: "white"}}>Cancel</Text>
                          </EasyButton>}
                          {item.status === constants.statuses.live && <EasyButton primary small onPress={() => confirmAlert(item.id,"start")}>
                            <Text style={{ color: "white"}}>Start</Text>
                          </EasyButton>}
                          {item.status === constants.statuses.started && <EasyButton primary small onPress={() => confirmAlert(item.id,"restart")}>
                            <Text style={{ color: "white"}}>Restart</Text>
                          </EasyButton>}
                          {item.status === constants.statuses.completed && 
                          item.priceSettleStatus === constants.statuses.inactive && 
                          <EasyButton primary small onPress={() => confirmAlert(item.id,"settlement")}>
                                <Text style={{ color: "white"}}>Settle Cashback</Text>
                          </EasyButton>
                          }
                        </View>
                        
                      </View>
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

export default connect(null,mapDispatchToProps)(MaintenancePage);
