import React, { useState, useCallback, useContext } from "react";
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

var { height } = Dimensions.get("window");

const Live = (props) => {
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
      .post(`${baseURL}participants/list`, req, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          setLoading(false);
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
      { text: "OK", onPress: () => props.navigation.navigate("User") },
    ]);
  };
  const join = (drawId) => {
    console.log("join draw container", drawId);
    if (context.stateUser.user.userId == null) {
      loginAlert();
      return;
    }

    joinContest(drawId);
  };

  useFocusEffect(
    useCallback(() => {
      setFocus(false);
      setActive(-1);
      setTimeout(() => {
        AsyncStorage.getItem("jwt")
          .then((res) => {
            console.log("token", token);
            setToken(res);
          })
          .catch((error) => console.log(error));
      }, 0);
      // Draws
      setTimeout(() => {
        axios
          .get(`${baseURL}draws`)
          .then((res) => {
            setDraws(res.data);
            setInitialState(res.data);
            setLoading(false);
          })
          .catch((error) => {
            console.log("Api call error");
          });
      }, 10);

      return () => {
        setDraws([]);
        setFocus();
        setActive();
        setInitialState();
        setToken();
        setLoading(false);
      };
    }, [])
  );

  // Product Methods
  const searchProduct = (text) => {
    setProductsFiltered(
      products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  // Categories
  const changeCtg = (ctg) => {
    {
      ctg === "all"
        ? [setProductsCtg(initialState), setActive(true)]
        : [
            setProductsCtg(
              products.filter((i) => i.category._id === ctg),
              setActive(true)
            ),
          ];
    }
  };

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
      <Spinner status={loading}></Spinner>
      <Container>
        <ScrollView>
          <View>
            <View style={[styles.center, { height: height / 2 }]}>
              <Text>No draws available at the moment!!</Text>
            </View>
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
    backgroundColor: "gainsboro",
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

export default Live;
