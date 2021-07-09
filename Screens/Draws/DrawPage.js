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
import * as constants from '../../assets/common/constants';
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-community/async-storage";
import { logoutUser } from "../../Context/actions/Auth.actions";
import AuthGlobal from "../../Context/store/AuthGlobal";
import Toast from "react-native-toast-message";

var { height } = Dimensions.get("window");

const DrawPage = (props) => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const context = useContext(AuthGlobal);

  useFocusEffect(
    useCallback(() => {
      // pull only active Draws

      AsyncStorage.getItem("jwt")
      .then((jwt) => {
        setToken(jwt);
      })
      .catch((error) => console.log(error));

      axios
          .get(`${baseURL}draws/status/1`)
          .then((res) => {
            setDraws(res.data);
            setLoading(false);
          })
          .catch((error) => {
            console.log("Api call error");
            setLoading(false);
          });

      return () => {
        setDraws([]);
        setLoading();
        setToken();
      };
    }, [])
  );


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
        })
        .catch((error) => {
          console.log(error);
          Toast.show({   topOffset: 60,   type: "error",   text1: "Something went wrong",   text2: "Please try again", });
        });
    }

  };

  return (
    <>
      <Container style={{backgroundColor: "gainsboro"}}>
        <ScrollView>
          <View>
            <View style={{backgroundColor:"white",margin:5,borderRadius:5,padding:15,marginTop:10}}>
              <TouchableOpacity onPress={() => props.navigation.navigate("Add",{item:null})}>
                  <View style={{flexDirection:"row"}}>
                    <Text style={{flex:1,fontSize:20}}>Create Draw</Text>
                    <Icon name="arrow-right" size={20} style={{alignSelf:"center"}} color={constants.COLOR_RED} />
                  </View>
              </TouchableOpacity>
            </View>
            
            <View style={{backgroundColor:"white",margin:5,borderRadius:5,padding:15}}>
              <TouchableOpacity onPress={() => props.navigation.navigate("Images",{item:null})}>
                <View style={{flexDirection:"row"}}>
                  <Text style={{flex:1,fontSize:20}}>Upload Image</Text>
                  <Icon name="arrow-right" size={20} style={{alignSelf:"center"}} color={constants.COLOR_RED}/>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text style={{padding:5}}>Active Draw(s)</Text>
            {draws.length > 0 ? (
              <View style={styles.listContainer}>
                {draws.map((item) => {
                  return (
                      <View key={item.id} style={{flexDirection:"column",backgroundColor:"white",margin:5,borderRadius:5,padding:10}}>
                        <View>
                          <Text style={{fontSize:20,fontWeight:"700",textTransform:"capitalize"}}>{item.name}</Text>
                          <Text style={{fontSize:12,color:"grey"}}>Draw Date: {new Date (item.drawDate).toLocaleString()}</Text>
                        </View>
                        <View style={{flexDirection:"row",alignSelf:"center",padding:5}}>
                          <EasyButton primary medium onPress={() => props.navigation.navigate("Edit",{id:item.id})}>
                            <Text style={{ color: "white"}}>Edit</Text>
                          </EasyButton>
                          <EasyButton primary medium onPress={() => props.navigation.navigate("Extend",{id:item.id})}>
                            <Text style={{ color: "white"}}>Extend</Text>
                          </EasyButton>
                          <EasyButton primary medium onPress={() => handleCancel(item.id)}>
                            <Text style={{ color: "white"}}>Cancel</Text>
                          </EasyButton>
                        </View>
                        
                      </View>
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


export default DrawPage;
