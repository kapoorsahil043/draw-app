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
import baseURL from "../../../assets/common/baseUrl";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";
import Icon from "react-native-vector-icons/FontAwesome";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import * as constants from '../../../assets/common/constants';
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import { logoutUser } from "../../../Context/actions/Auth.actions";
import AuthGlobal from "../../../Context/store/AuthGlobal";
import Toast from "react-native-toast-message";
//redux
import { connect } from "react-redux";
import * as actions from '../../../Redux/Actions/headerActions';
import DefaultMessage from "../../../Shared/DefaultMessage";
import Spinner from "../../../Shared/Spinner";
import CardBox from "../../../Shared/Form/CardBox";
import delay from 'delay';

var { height } = Dimensions.get("window");

const Notification = (props) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const context = useContext(AuthGlobal);
  const [message, setMessage] = useState("loading...");
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log('Notification,useFocusEffect')
      props.hideHeader({hide:true});
      setLoading(true);
    
      AsyncStorage.getItem("jwt")
      .then((jwt) => {
        setToken(jwt);
        loadActiveAlerts(jwt);
      })
      .catch((error) => {console.log(error);setLoading(false);
      });

      return () => {
        setAlerts([]);
        setLoading();
        setToken();
        setMessage();
        setRefreshing();
      };
    }, [])
  );


  const loadActiveAlerts = async (jwt)=>{
    setMessage("loading...");

    const config = {
      headers: {
        Authorization: `Bearer ${jwt || token}`,
      },
    };

    axios
    .get(`${baseURL}alerts`,config)
    .then((res) => {
      setAlerts(res.data);
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
    Alert.alert("Confirmation",`Do you want to ${type.toUpperCase()}?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => {
        if(type == "send alert"){
          handleSendAlert(id);
          return;
        }
        if(type == "delete alert"){
          handleDelete(id);
          return;
        }
      } },
    ]);
  };

  
  const handleSendAlert = (id) => {
    console.log('handleSendAlert',id)
    setLoading(true);
    const req = {
      alert: id
    };

    const config = {
      headers: {
          Authorization: `Bearer ${token}`,
      }
    };

    axios.put(`${baseURL}alerts`, req, config)
    .then((res) => {
      setLoading(false);
      Toast.show({topOffset: 60,type: "success",text1: res.data.message ? res.data.message : "Alert started successfully!!",text2: "",});
      loadActiveAlerts();
    })
    .catch((error) => {
      console.log(error.response.data)
      setLoading(false);
      Toast.show({topOffset: 60,type: "error",text1: error.response.data.message ? error.response.data.message : "Something went wrong",text2: "",});
    });
  }

  const handleDelete = (id) => {
    console.log("handleDelete", id);
    if(!token){
        loginAlert();
        return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    {
      axios.delete(`${baseURL}alerts/${id}`, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({topOffset: 60,type: "success",text1: res.data.message ? res.data.message : "Alert started successfully!!",text2: "",});
          }
          loadActiveAlerts();
        })
        .catch((error) => {
          console.log(error);
          Toast.show({topOffset: 60,type: "error",text1: error.response.data.message ? error.response.data.message : "Something went wrong",text2: "",});
        });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await delay(1000);
    loadActiveAlerts(token);
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
            <CardBox>
                    <Button
                    style={{backgroundColor:constants.COLOR_RED}}
                        onPress={() => props.navigation.navigate("Add Promo Notification")}
                    >
                        <Text style={{ color: "white", fontWeight: "bold",fontSize:12}}>Add Promo Alert</Text>
                    </Button>
            </CardBox>
            {alerts.length > 0 ? (
              <View style={{}}>
                <Text style={{padding:5,fontSize:11,color:constants.COLOR_GREY}}>Alerts count(s) ({alerts.length})</Text>
                {alerts.map((item) => {
                  return (
                      <CardBox key={item.id}>
                          <View style={{}}>
                            <Text style={{fontSize:17,fontWeight:"700"}}>{item.title}</Text>
                            <Text style={{fontSize:11,color:constants.COLOR_GREY}}>{new Date(item.createdOn).toLocaleString()}</Text>
                            <Text style={{fontSize:12}}>{item.message}</Text>
                          </View>
                          <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
                            <EasyButton medium primary onPress={() => confirmAlert(item.id,"send alert")}>
                                <Text style={styles.buttonText}>Start Promo</Text>
                            </EasyButton>
                            <EasyButton medium primary onPress={() => confirmAlert(item.id,"delete alert")}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </EasyButton>
                          </View>
                      </CardBox>
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
    fontSize:12
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
      hideHeader: (value) => dispatch(actions.hideHeader(value)),
  }
}

export default connect(null,mapDispatchToProps)(Notification);
