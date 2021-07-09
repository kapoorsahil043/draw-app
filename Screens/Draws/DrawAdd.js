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
import { Container, Item, Picker } from "native-base";
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
import DateTimePicker from "@react-native-community/datetimepicker";
import * as constants from '../../assets/common/constants';

const DrawAdd = (props) => {
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
  const [rank, setRank] = useState({ rankStart: 1, rankImage:"",rankType:"",imageId:"" });
  const [drawImage, setDrawImage] = useState();
  const [images, setImages] = useState([]);
  let cnt = 0;
  
  useEffect(() => {
    console.log("DrawAdd, useEffect");

    AsyncStorage.getItem("jwt")
      .then((jwt) => {
        //console.log('token',res);
        setToken(jwt);
        axios
          .get(`${baseURL}images`, {
            headers: { Authorization: `Bearer ${jwt}` },
          })
          .then((resp) => {
            setImages(resp.data);
          })
          .catch((error) => alert("Error to load images"));
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

    return () => {
      setImages();
    };
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
    if (!drawImage || name == "" || entryPrice == "" || totalSpots == "") {
      setError("Please fill in the form correctly");
      return;
    }
    if (
      !winnersPct ||
      winnersPct == "" ||
      isNaN(winnersPct) ||
      Number(winnersPct) > 100 ||
      Number(winnersPct) < 0
    ) {
      setError("Error in Winn%");
    }

    let req = {
      drawImage: drawImage,
      name: name,
      entryPrice: entryPrice,
      totalSpots: totalSpots,
      winnersPct: winnersPct,
      companysPct: companysPct,
      drawDate: drawDate + "",
      ranks: ranks,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    {
      axios
        .post(`${baseURL}draws`, req, config)
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
    setRank({ rankStart: 1 });
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
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const onDateChange = (event, selectedDate) => {
    console.log("onDateChange", selectedDate);
    const currentDate = selectedDate || new Date();
    setDrawDate(currentDate);
    setShow(false);
  };

  const onTimeChange = (event, selectedDate) => {
    console.log("onTimeChange", selectedDate);
    const currentDate = selectedDate || new Date();
    setDrawDate(currentDate);
    setShowTime(false);
  };

  const showMode = (currentMode) => {
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
    setShow(true);
  };

  const showTimepicker = () => {
    showMode("time");
    setShowTime(true);
  };

  const rankImageFn =(e) =>{
    let tmp;
    images.forEach((img)=>{
      if(img.id==e){
        tmp =  img;
        return;
      };
    });
    setRank({...rank,rankImage:tmp.image,rankType:tmp.name,imageId:tmp.id});
  }

  return (
    <Container style={{backgroundColor:"gainsboro"}}>
      <View style={{margin:5}}>
      <FormContainer title="Create Draw">
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: drawImage }} />
          {/* <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Icon style={{ color: "white" }} name="camera" />
          </TouchableOpacity> */}
        </View>
        <View style={{backgroundColor: "white",padding: 10, marginTop: 5, borderRadius:10,width:"100%",flexDirection:"column"}}>
          <View style={styles.label}>
            <Text>Select Image</Text>
          </View>
          <Item picker style={{width: "100%"}}>
            <Picker
              mode="dropdown"
              iosIcon={<Icon style={{ color: "grey" }} name="camera" />}
              style={{ width: undefined }}
              placeholder="Select your image"
              selectedValue={drawImage}
              placeholderStyle={{ color: "#007aff" }}
              placeholderIconColor="#007aff"
              onValueChange={(e) => [setDrawImage(e)]}
            >
              {images &&
                images.map((c) => {
                  return (
                    <Picker.Item key={c.id} label={c.name} value={c.image} />
                  );
                })}
            </Picker>
          </Item>        
        </View>
        <View style={{backgroundColor: "white",padding: 10, marginTop: 5, borderRadius:10,width:"100%",flexDirection:"column"}}>
          <View style={styles.label}>
            <Text>Draw Name</Text>
          </View>
          <Input placeholder="Name" name="name" id="name" 
          value={name} onChangeText={(text) => setName(text)}/>
        </View>
        <View style={{backgroundColor: "white",padding: 10, marginTop: 5, borderRadius:10,width:"100%",flexDirection:"row"}}>
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
        <View style={{backgroundColor: "white",padding: 10, marginTop: 5, borderRadius:10,width:"100%",flexDirection:"row"}}>
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
        <View style={{backgroundColor: "white",padding: 10, marginTop: 5, borderRadius:10,width:"100%",flexDirection:"row",justifyContent:"space-between"}}>
          <View style={{ width: "50%" }}>
            <View style={styles.label}>
              <Text style={{ fontWeight: "700" }}>Draw Date</Text>
              <Text>{(drawDate + "").substr(0, 15)}</Text>
            </View>
            {show && (
              <DateTimePicker
                testID="datePicker"
                value={drawDate}
                mode="date"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={{ width: "50%" }}>
            <View style={styles.label}>
              <Text style={{ fontWeight: "700" }}>Draw Time</Text>
              <Text>{(drawDate + "").substr(16)}</Text>
            </View>
            {showTime && (
              <DateTimePicker
                testID="timePicker"
                value={drawDate}
                mode="time"
                onChange={onTimeChange}
              />
            )}
          </View>
        </View>
        <View style={{backgroundColor: "white",padding: 10, marginTop: 5, borderRadius:10,width:"100%",flexDirection:"row",justifyContent:"space-between"}}>
          <View>
            <EasyButton large primary onPress={() => showDatepicker()}>
                  <Text style={styles.buttonText}>Show date!</Text>
            </EasyButton>
          </View>
          <View>
            <EasyButton large primary onPress={() => showTimepicker()}>
                  <Text style={styles.buttonText}>Show time!</Text>
            </EasyButton>
          </View>
        </View>
        <View style={{backgroundColor: "white",padding: 10, marginTop: 5, borderRadius:10,width:"100%",flexDirection:"row"}}>
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
        <View style={{backgroundColor: "white",padding: 10, marginTop: 5, borderRadius:10,width:"100%",flexDirection:"row"}}>
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

        <View style={{backgroundColor: "white",padding: 10, margin: 5, borderRadius:10,width:"100%"}}>
          <View>
            <View style={{ flexDirection: "row", height: 40 }}>
              <Text>Rank Start - </Text>
              <Text>{rank.rankStart}</Text>
            </View>
            <View style={{ flexDirection: "row", height: 40 }}>
              <Text>Rank End - </Text>
              <TextInput
                style={{ borderBottomColor: "red", width: "70%", height: 20 }}
                value={rank.rankEnd}
                onChangeText={(text) => setRank({ ...rank, rankEnd: text })}
                placeholder="Rank End"
                keyboardType="numeric"
              ></TextInput>
            </View>
            <View style={{ flexDirection: "row", height: 40 }}>
              <Text>Rank Price - </Text>
              <TextInput
                style={{ borderBottomColor: "red", width: "70%", height: 20 }}
                value={rank.rankPrice}
                onChangeText={(text) => setRank({ ...rank, rankPrice: text })}
                placeholder="Rank Price"
                keyboardType="numeric"
              ></TextInput>
            </View>
            <Text>Price Name - {rank.rankType}</Text>
            <View style={{ height: "auto" }}>
              <View>
              <Image
                    style={{ height: 50, width: 50, borderRadius: 100 }}
                    source={{ uri: rank.rankImage }}/>
              </View>

              <View style={styles.label}>
                <Text>Select Image</Text>
              </View>
              <Item picker>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon style={{ color: "grey" }} name="camera" />}
                  style={{ width: undefined }}
                  placeholder="Select your image"
                  selectedValue={rank.imageId}
                  placeholderStyle={{ color: "#007aff" }}
                  placeholderIconColor="#007aff"
                  onValueChange={(e) =>
                    rankImageFn(e)
                  }
                >
                  {images &&
                    images.map((c) => {
                      return (
                        <Picker.Item
                          key={c.id}
                          label={c.name}
                          value={c.id}
                        />
                      );
                    })}
                </Picker>
              </Item>
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
        <View style={{   backgroundColor: "white",   width: "100%",   margin: 10,   borderRadius:10 }}>
          <View style={{backgroundColor:constants.COLOR_WHITE_SMOKE,borderTopRightRadius:10,borderTopLeftRadius:10,padding:10}}><Text style={{textAlign:"center"}}>Rank Details</Text></View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              padding: 5,
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
                  padding: 5,
                  backgroundColor: ++cnt % 2 == 0 ?  constants.COLOR_WHITE_SMOKE: '',
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
      </View>
     </Container>
  );
};

const styles = StyleSheet.create({
  label: {
    width: "100%",
    marginTop: 10,
  },
  buttonContainer: {
    width: "100%",
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
    borderWidth: 8,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#E0E0E0",
    elevation: 10,
    margin:5
    
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

export default DrawAdd;
