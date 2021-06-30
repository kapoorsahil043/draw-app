import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  Switch,
  Button,
} from "react-native";
import { Item, Picker } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import Error from "../../Shared/Error";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-community/async-storage";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import DateTimePicker from '@react-native-community/datetimepicker';

const DrawForm = (props) => {
  const [brand, setBrand] = useState();

  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState();
  const [name, setName] = useState();
  const [totalSpots, setTotalSpots] = useState(0);
  const [entryPrice, setEntryPrice] = useState(0);
  const [winnersPct, setWinnersPct] = useState(0);
  const [companysPct, setCompanysPct] = useState(0);

  const [description, setDescription] = useState();

  const [category, setCategory] = useState();
  const [token, setToken] = useState();
  const [err, setError] = useState();

  const [item, setItem] = useState(null);

  const [ranks, setRanks] = useState([]);
  const [rank, setRank] = useState({ rankStart: 1, rankType: "price" });

  useEffect(() => {
    console.log("DrawForm, useEffect");

    AsyncStorage.getItem("jwt")
      .then((res) => {
        //console.log('token',res);
        setToken(res);
      })
      .catch((error) => console.log(error));

    // Image Picker
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();

    return () => {};
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setMainImage(result.uri);
      setImage(result.uri);
    }
  };

  const pickRankImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setRank({ ...rank, rankImage: result.uri });
    }
  };

  const createDraw = () => {
    if (
      !image ||
      name == "" ||
      entryPrice == "" ||
      totalSpots == ""
    ) {
      setError("Please fill in the form correctly");
      return;
    }
    if(!winnersPct || winnersPct == "" || isNaN(winnersPct) || Number(winnersPct) > 100 || Number(winnersPct) < 0){
      setError("Error in Winn%");
    }

    let formData = new FormData();

    const newImageUri = "file:///" + image.split("file:/").join("");

    formData.append("image", {
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split("/").pop(),
    });
    formData.append("name", name);
    formData.append("entryPrice", entryPrice);
    formData.append("totalSpots", totalSpots);
    formData.append("winnersPct", winnersPct);
    formData.append("companysPct", companysPct);
    formData.append("drawDate",drawDate+"");

    for (let index = 0; index < ranks.length; index++) {
      formData.append("ranks[]", JSON.stringify(ranks[index]));
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    if (item !== null) {
      axios
        .put(`${baseURL}products/${item.id}`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Product successfuly updated",
              text2: "",
            });
            setTimeout(() => {
              //props.navigation.navigate("Products");
            }, 500);
          }
        })
        .catch((error) => {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    } else {
      axios
        .post(`${baseURL}draws`, formData, config)
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "New Draw added",
              text2: "",
            });
            setTimeout(() => {
              //props.navigation.navigate("Draw");
            }, 500);
          }
        })
        .catch((error) => {
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    }
  };
  const resetRank = () => {
    console.log("reset..");
    setRank({ rankStart: 1, rankType: "price" });
    setRanks([]);
    setError("");
  };

  const addRank = () => {
    let totalWinners = totalSpots * (winnersPct / 100);
    if (
      !rank ||
      !rank.rankEnd ||
      isNaN(rank.rankEnd) ||
      Number(rank.rankEnd) > totalWinners ||
      Number(rank.rankEnd) < Number(rank.rankStart)
    ) {
      setError("Rank Error(s)");
      return;
    }
    let pricePool =
      totalSpots * entryPrice - (totalSpots * entryPrice * companysPct) / 100;
    if (
      !rank.rankPrice ||
      isNaN(rank.rankPrice) ||
      Number(rank.rankPrice) < 1 ||
      Number(rank.rankPrice) > pricePool
    ) {
      setError("Price Error(s)");
      return;
    }

    let _rank = Object.assign({}, rank);
    let _rankEnd = Number(_rank.rankEnd) + 1;

    let beforeAccumulatedAmt = ranks.reduce((total, rank) => {
      return (
        total +
        Number(rank.rankPrice) *
          (Number(rank.rankEnd) - Number(rank.rankStart) + 1)
      );
    }, 0);
    console.log("accumulatedAmt", beforeAccumulatedAmt);

    if (
      Number(rank.rankPrice) *
        (Number(rank.rankEnd) - Number(rank.rankStart) + 1) >
      pricePool - beforeAccumulatedAmt
    ) {
      setError("Price Pool Error(s)");
      return;
    }

    setRank({ ...rank, rankStart: _rankEnd, rankEnd: "" });
    setRanks((ranks) => [...ranks, rank]);
    setError("");
  };

  const calculateRankEnd = (text) => {
    console.log("calculateRankEnd", text);
  };

  const [drawDate, setDrawDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const onDateChange = (event, selectedDate) => {
    console.log('onDateChange',selectedDate)
    const currentDate = selectedDate || new Date();
    setDrawDate(currentDate);
    setShow(false);
  };

  const onTimeChange = (event, selectedDate) => {
    console.log('onTimeChange',selectedDate)
    const currentDate = selectedDate || new Date();
    setDrawDate(currentDate);
    setShowTime(false);
  };

  const showMode = (currentMode) => {
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
    setShow(true);
  };

  const showTimepicker = () => {
    showMode('time');
    setShowTime(true);
  };

  return (
    <>
      <FormContainer title="Create Draw">
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: mainImage }} />
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Icon style={{ color: "white" }} name="camera" />
          </TouchableOpacity>
        </View>
        <View style={styles.label}>
          <Text>Draw Name</Text>
        </View>
        <Input
          placeholder="Name"
          name="name"
          id="name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignContent: "space-between",
            width: "80%",
          }}
        >
          <View style={{ width: "50%" }}>
            <View style={styles.label}>
              <Text>Entry Price</Text>
            </View>
            <Input
              placeholder="Entry Pr.."
              name="price"
              id="price"
              value={entryPrice}
              keyboardType={"numeric"}
              onChangeText={(text) => setEntryPrice(text)}
            />
          </View>

          <View style={{ width: "50%" }}>
            <View style={styles.label}>
              <Text>Total Spots</Text>
            </View>
            <Input
              placeholder="Total Spot"
              name="totalSpots"
              id="totalSpots"
              value={totalSpots}
              keyboardType={"numeric"}
              onChangeText={(text) => setTotalSpots(text)}
            />
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignContent: "space-between",
            width: "80%",
          }}
        >
          <View style={{ width: "50%" }}>
            <View style={styles.label}>
              <Text>Win %</Text>
            </View>
            <Input
              placeholder="Win.. %"
              name="winnersPct"
              id="winnersPct"
              value={winnersPct}
              keyboardType={"numeric"}
              onChangeText={(text) => setWinnersPct(text)}
            />
          </View>

          <View style={{ width: "50%" }}>
            <View style={styles.label}>
              <Text>Company's %</Text>
            </View>
            <Input
              placeholder="Company's %"
              name="companysPct"
              id="companysPct"
              value={companysPct}
              keyboardType={"numeric"}
              onChangeText={(text) => setCompanysPct(text)}
            />
          </View>
        </View>
       
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignContent: "space-between",
            width: "80%",
          }}
        >
          <View style={{ width: "50%" }}>
            <View style={styles.label}>
              <Text style={{fontWeight:"700"}}>Draw Date</Text>
              <Text>{(drawDate + "").substr(0,15)}</Text>
            </View>
            {show && <DateTimePicker
              testID="datePicker"
              value={drawDate}
              mode="date"
              onChange={onDateChange}
              minimumDate={new Date()}
            />}
          </View>

          <View style={{ width: "50%" }}>
            <View style={styles.label}>
              <Text style={{fontWeight:"700"}}>Draw Time</Text>
              <Text>{(drawDate + "").substr(16)}</Text>
            </View>
            {showTime && <DateTimePicker
              testID="timePicker"
              value={drawDate}
              mode="time"
              onChange={onTimeChange}
            />}
          </View>
        </View>
        <View style={{flex:1, flexDirection:"row", alignContent:"space-around"}}>
          <Button onPress={showDatepicker} title="Show date!" />
          <Button onPress={showTimepicker} title="Show time!" />
        </View>
           
        <View
          style={{
            flexDirection: "row",
            alignContent: "space-between",
            alignItems: "center",
            width: "80%",
            backgroundColor: "lightgrey",
            padding: 10,
            margin: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>Total Amt</Text>
            <Text>{totalSpots * entryPrice}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text>Price Pool</Text>
            <Text>
              {totalSpots * entryPrice -
                (totalSpots * entryPrice * companysPct) / 100}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text>Total Winner</Text>
            <Text>{totalSpots * (winnersPct / 100)}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignContent: "space-between",
            alignItems: "center",
            width: "80%",
            backgroundColor: "lightgrey",
            padding: 10,
            margin: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>Sum of Price</Text>
            <Text>
              {ranks.reduce((total, rank) => {
                return (
                  total +
                  Number(rank.rankPrice) *
                    (Number(rank.rankEnd) - Number(rank.rankStart) + 1)
                );
              }, 0)}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text>Amt Left</Text>
            <Text>
              {totalSpots * entryPrice -
                (totalSpots * entryPrice * companysPct) / 100 -
                ranks.reduce((total, rank) => {
                  return (
                    total +
                    Number(rank.rankPrice) *
                      (Number(rank.rankEnd) - Number(rank.rankStart) + 1)
                  );
                }, 0)}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text>Avail Winner(s)</Text>
            <Text>
              {totalSpots * (winnersPct / 100) - (rank.rankStart - 1)}
            </Text>
          </View>
        </View>

        {err ? <Error message={err} /> : null}

        <View
          style={{
            backgroundColor: "lightgrey",
            width: "80%",
            padding: 10,
            margin: 10,
          }}
        >
          <View>
            <View style={{ flexDirection: "row", height: 30 }}>
              <Text>Rank Start - </Text>
              <Text>{rank.rankStart}</Text>
            </View>
            <View style={{ flexDirection: "row", height: 30 }}>
              <Text>Rank End - </Text>
              <TextInput
                style={{ borderBottomColor: "red", width: "70%", height: 20 }}
                value={rank.rankEnd}
                onChangeText={(text) => setRank({ ...rank, rankEnd: text })}
                placeholder="Rank End"
                keyboardType="numeric"
              ></TextInput>
            </View>
            <View style={{ flexDirection: "row", height: 30 }}>
              <Text>Rank Price - </Text>
              <TextInput
                style={{ borderBottomColor: "red", width: "70%", height: 20 }}
                value={rank.rankPrice}
                onChangeText={(text) => setRank({ ...rank, rankPrice: text })}
                placeholder="Rank Price"
                keyboardType="numeric"
              ></TextInput>
            </View>
            <Text>Price Type - {rank.rankType}</Text>
            <View style={styles.container}>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={rank.rankType == "cashback" ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() =>
                  setRank({
                    ...rank,
                    rankType:
                      rank.rankType == "cashback" ? "price" : "cashback",
                  })
                }
                value={rank.rankType == "cashback"}
              />
            </View>

            <View style={{ flexDirection: "row", height: 30 }}>
              <Text>Select Price Image - &nbsp;</Text>
              <TouchableOpacity onPress={pickRankImage}>
                <Icon style={{ color: "white" }} name="camera" />
              </TouchableOpacity>
              <Image
                style={{ height: 30, width: 30, borderRadius: 100 }}
                source={{ uri: rank.rankImage }}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 20,
              alignItems: "center",
              alignSelf: "center",
              flexDirection: "row",
            }}
          >
            <View>
              <EasyButton large primary onPress={() => addRank()}>
                <Text style={styles.buttonText}>Add Rank</Text>
              </EasyButton>
            </View>
            <View>
              <EasyButton large primary onPress={() => resetRank()}>
                <Text style={styles.buttonText}>Reset Rank</Text>
              </EasyButton>
            </View>
          </View>
        </View>

        <Text>Rank Details</Text>
        <View
          style={{
            backgroundColor: "lightgrey",
            width: "80%",
            padding: 10,
            margin: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignContent: "space-around",
              paddingBottom: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text>Rank</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text>Price</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text>Type</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text>Image</Text>
            </View>
          </View>
          {ranks.map((item) => {
            return (
              <View
                key={item.rankStart}
                style={{
                  flexDirection: "row",
                  alignContent: "space-between",
                  paddingBottom: 5,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text>
                    {item.rankStart == item.rankEnd
                      ? "#" + item.rankStart
                      : "#" + item.rankStart + " - " + item.rankEnd}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text>{item.rankPrice}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text>{item.rankType}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Image
                    style={{ height: 50, width: 50, borderRadius: 100 }}
                    source={{ uri: item.rankImage }}
                  />
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          <EasyButton large primary onPress={() => createDraw()}>
            <Text style={styles.buttonText}>Create</Text>
          </EasyButton>
        </View>
      </FormContainer>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    width: "80%",
    marginTop: 10,
  },
  buttonContainer: {
    width: "80%",
    marginBottom: 80,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderStyle: "solid",
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#E0E0E0",
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  imagePicker: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "grey",
    padding: 8,
    borderRadius: 100,
    elevation: 20,
  },
});

export default DrawForm;
