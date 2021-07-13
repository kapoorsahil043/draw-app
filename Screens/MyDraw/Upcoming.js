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
} from "react-native";
import { Container, Header, Icon, Item, Input, Text } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-community/async-storage";
import AuthGlobal from "../../Context/store/AuthGlobal";
import Spinner from "../../Shared/Spinner";
import DrawList from "../Draws/DrawList";
import * as constants from "../../assets/common/constants";

//redux
import { connect } from "react-redux";
import * as actions from '../../Redux/Actions/headerActions';
import DefaultMessage from "../../Shared/DefaultMessage";


var { height } = Dimensions.get("window");

const Upcoming = (props) => {
  const context = useContext(AuthGlobal);
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [token, setToken] = useState();


  const joinHandler = (drawId) => {
    console.log("join draw container", drawId);
  };

  const callMethod = () => {
    //console.log("Upcoming, callMethod");
    setLoading(true);
    setTimeout(() => {
      AsyncStorage.getItem("jwt")
        .then((jwt) => {
          axios
          .get(`${baseURL}participants/draws`, {headers: {Authorization: `Bearer ${jwt}`}})
          .then((res) => {
            console.log("res.data",res.data.length);
            setToken(jwt);
            setDraws(res.data);
            setLoading(false);
          })
          .catch((error) => {setLoading(false);console.log("Participants Api call error");});
        })
        .catch((error) => console.log(error));
    }, 0);
  };

  useFocusEffect(
    useCallback(() => {
      console.log("Upcoming, useCallBack");

      props.hideHeader({hide:false});
      callMethod();

      return () => {
        setDraws([]);
        setLoading(false);
      };
    }, [])
  );

  return (
    <>
      {/* <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => modalHandler(true)}>
        <Text style={styles.textStyle}>Show Modal</Text>
    </Pressable> */}
      <Spinner status={loading}></Spinner>
      <Container style={{backgroundColor: "gainsboro"}}>
        <ScrollView>
              {draws.length > 0 ? (
                <View style={styles.listContainer}>
                  {draws.map((item) => {
                    if(!item || item.status !== constants.statuses.active){return}
                    return (
                      <DrawList
                        navigation={props.navigation}
                        key={item.id ? item.id : item._id}
                        item={item}
                        join={joinHandler}
                      />
                    );
                  })}
                </View>
              ) : (
                <DefaultMessage/>
              )}
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

export default connect(null,mapDispatchToProps)(Upcoming);