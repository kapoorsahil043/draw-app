import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Button,
  Pressable,
  AsyncStorage,
} from "react-native";
import { Left, Right, Container, H1 } from "native-base";
import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";

import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";
import Icon from "react-native-vector-icons/FontAwesome";
import RankTable from "../../Shared/RankTable";
import * as constants from "../../assets/common/constants";
import RankNavigator from "../../Navigators/RankNavigator";
import AuthGlobal from "../../Context/store/AuthGlobal";
import Spinner from "../../Shared/Spinner";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

const DrawDetails = (props) => {
  const context = useContext(AuthGlobal);
  const [item, setItem] = useState(props.route.params.item);
  const [btnLabel,setBtnLabel] = useState("Start");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();

  const [drawCompletedLabel, setDrawCompletedLabel] = useState();

  //id, name, totalSpots, entryPrice, winnersPct, status, image

  const toggleDraw =() => {
    console.log('toggleDraw',item.id)
    setLoading(true);
    const req = {
      draw: item.id
    };

    const config = {
      headers: {
          Authorization: `Bearer ${token}`,
      }
    };

    axios
    .put(`${baseURL}draws/toggle`, req, config)
    .then((res) => {
      setBtnLabel(res.data.status == constants.statuses.started ? "Stop": "Start")
      setItem(res.data);// draw
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
      alert(`Error to ${btnLabel} draw`);
    });
  }

  useEffect(() => {
    console.log("DrawDetails,use effect",item.status);
    AsyncStorage.getItem("jwt")
    .then((res) => {
        setToken(res);
    })
    .catch((error) => console.log(error));
    let spotDiff = item.totalSpots - item.joined;

    //label
    setDrawCompletedLabel(spotDiff == 0 ? `Draw Full` : `${spotDiff} ${spotDiff > 1 ? 'spots' : 'spot'} left`);

    return () => {
      setToken();
      setDrawCompletedLabel();
    };
  }, []);

  return (
    <Container style={styles.container}>
      <Spinner status={loading}></Spinner>
      <ScrollView style={{ padding: 5 }}>
        <View>
          <Image
            source={{
              uri: item.image ? item.image : constants.DEFAULT_IMAGE_URL,
            }}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
        {context.stateUser.user.isAdmin == true && 
         constants.STATUS_FOR_LIVE.indexOf(item.status) > -1 && (<EasyButton
            primary
            medium
            onPress={() => toggleDraw()}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>{btnLabel}</Text>
          </EasyButton>)}
        <View style={styles.contentContainer}>
          <H1 style={styles.contentHeader}>{item.name}</H1>
        </View>
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            backgroundColor: "#F5F5F5",
            marginBottom: 5,
          }}
        >
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text>Pool Price</Text>
            <Text style={styles.contentText}>
              <Icon name="rupee" size={15} />
              {item.totalAmtAvlForDistribution}
            </Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text>Entry</Text>
            <Text style={styles.contentText}>
              <Icon name="rupee" size={15} />
              {item.entryPrice}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#F5F5F5",
            padding: 10,
            marginBottom: 5,
          }}
        >
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text style={{ color: "red" }}>
              {drawCompletedLabel}
            </Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text>{item.totalSpots}&nbsp;spots</Text>
          </View>
        </View>
        <RankNavigator item={item}></RankNavigator>
        {/* <RankTable item={item} /> */}
      </ScrollView>
    </Container>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (product) =>
      dispatch(actions.addToCart({ quantity: 1, product })),
  };
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
  },
  imageContainer: {
    backgroundColor: "white",
    padding: 0,
    margin: 0,
  },
  image: {
    width: "100%",
    height: 250,
  },
  contentContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  contentHeader: {
    fontWeight: "bold",
    marginBottom: 20,
    textTransform: "capitalize",
  },
  contentText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  bottomContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "white",
  },
  price: {
    fontSize: 24,
    margin: 20,
    color: "red",
  },
  availabilityContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  availability: {
    flexDirection: "row",
    marginBottom: 10,
  },
});

export default DrawDetails;
