import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Button,
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



const DrawDetails = (props) => {
  const [item, setItem] = useState(props.route.params.item);
  const [availability, setAvailability] = useState(null);
  const [availabilityText, setAvailabilityText] = useState("");

  //id, name, totalSpots, entryPrice, winnersPct, status, image

  useEffect(() => {
    console.log("DrawDetails,use effect");
    if (props.route.params.item.totalSpots == 0) {
      setAvailability(<TrafficLight unavailable></TrafficLight>);
      setAvailabilityText("Unvailable");
    } else if (props.route.params.item.totalSpots <= 5) {
      setAvailability(<TrafficLight limited></TrafficLight>);
      setAvailabilityText("Limited Stock");
    } else {
      setAvailability(<TrafficLight available></TrafficLight>);
      setAvailabilityText("Available");
    }

    return () => {
      setAvailability(null);
      setAvailabilityText("");
    };
  }, []);

  return (
    <Container style={styles.container}>
      <ScrollView style={{ padding: 5 }}>
        <View>
          <Image
            source={{
              uri: item.image
                ? item.image
                : constants.DEFAULT_IMAGE_URL,
            }}
            resizeMode="contain"
            style={styles.image}
          />
        </View>
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
            marginBottom:5
          }}
        >
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text style={{ color: "red" }}>
              {item.totalWinnerSpot}&nbsp;spots
            </Text>
          </View>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text>
              <Icon name="star" size={15} />
              {item.winnersPct}%
            </Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text>{item.totalWinnerSpot}&nbsp;spots</Text>
          </View>
        </View>

          <RankTable item={item}/>

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

export default connect(null, mapDispatchToProps)(DrawDetails);
