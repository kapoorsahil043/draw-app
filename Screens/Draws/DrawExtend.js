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
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import Error from "../../Shared/Error";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-community/async-storage";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as constants from '../../assets/common/constants';

const DrawExtend = (props) => {
  const [name, setName] = useState();
  const [token, setToken] = useState();
  const [err, setError] = useState();
  const [drawId,setDrawId] = useState(props.route.params.id);
  const [drawState,setDrawState] = useState();
  
  
  useEffect(() => {
    console.log("DrawExtend, useEffect",drawId);

      AsyncStorage.getItem("jwt")
      .then((jwt) => {
        setToken(jwt);
        axios
          .get(`${baseURL}draws/${drawId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          })
          .then((resp) => {
            setDrawState(resp.data);
            setName(resp.data.name);
          })
          .catch((error) => alert("Error to load draw"));
      })
      .catch((error) => console.log(error));
    

    return () => {
      setDrawState();
    };
  }, []);

  const handleSubmit = () => {
    let req = {
      drawDate: drawDate + "",
      drawId:drawId
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
    .put(`${baseURL}draws/extend`, req, config)
    .then((res) => {
    if (res.status == 200 || res.status == 201) {
      Toast.show({
        topOffset: 60,
        type: "success",
        text1: "Draw extended successfully!!",
        text2: "",
      });
      setTimeout(() => {
        //props.navigation.navigate("Draw");
      }, 500);
    }
    })
    .catch((error) => {
    console.log(error)
    Toast.show({
      topOffset: 60,
      type: "error",
      text1: "Something went wrong",
      text2: "Please try again",
    });
    });
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

  return (
    <Container style={{backgroundColor:"gainsboro"}}>
    {drawState && 
      <View style={{margin: 5}}>
        <FormContainer title="Extend Draw">
        <View style={{backgroundColor: "white",padding: 10, marginTop: 5, borderRadius:5,width:"100%",flexDirection:"column"}}>
          <View style={styles.label}>
            <Text>Draw Name</Text>
          </View>
          <View style={styles.label}>
            <Text>{drawState.name}</Text>
          </View>
        </View>
        <View style={{backgroundColor: "white",padding: 10, marginTop: 5, borderRadius:5,width:"100%",flexDirection:"row",justifyContent:"space-between"}}>
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
        <View style={{backgroundColor: "white",padding: 10, marginTop: 5, borderRadius:5,width:"100%",flexDirection:"row",justifyContent:"space-between"}}>
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
        
        {err ? <Error message={err} /> : null}

        <View style={styles.buttonContainer}>
          <EasyButton large primary onPress={() => handleSubmit()}>
            <Text style={styles.buttonText}>Update</Text>
          </EasyButton>
        </View>
      </FormContainer>
      </View>}
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

export default DrawExtend;
