import React, { useEffect,useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  Button,
} from "react-native";
import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";
import Icon from "react-native-vector-icons/FontAwesome";
import * as constants from "../../assets/common/constants";
import * as Localization from "expo-localization";

var { width } = Dimensions.get("window");

const DrawCard = (props) => {
  const {
    id,
    name,
    totalSpots,
    entryPrice,
    winnersPct,
    status,
    image,
    join,
    hideJoinBtn,
    createdOn,
  } = props;

  const formatTimeByOffset = (dateString, offset) => {
    // Params:
    // How the backend sends me a timestamp
    // dateString: on the form yyyy-mm-dd hh:mm:ss
    // offset: the amount of hours to add.
    // If we pass anything falsy return empty string
    if (!dateString) return "";
    if (dateString.length === 0) return "";
    // Step a: Parse the backend date string
    // Get Parameters needed to create a new date object
    const year = dateString.slice(0, 4);
    const month = dateString.slice(5, 7);
    const day = dateString.slice(8, 10);
    const hour = dateString.slice(11, 13);
    const minute = dateString.slice(14, 16);
    const second = dateString.slice(17, 19);
    // Step: bMake a JS date object with the data
    const dateObject = new Date(
      `${year}-${month}-${day}T${hour}:${minute}:${second}`
    );
    // Step c: Get the current hours from the object
    const currentHours = dateObject.getHours();
    // Step d: Add the offset to the date object
    dateObject.setHours(currentHours + offset);
    // Step e: stringify the date object, replace the T with a space and slice off the seconds.
    const newDateString = dateObject
      .toISOString()
      .replace("T", " ")
      .slice(0, 16);
    // Step f: Return the new formatted date string with the added offset
    return `${newDateString}`;
  };

  const convertUTCToLocalTime = (datee) => {
    let date = new Date(datee);
    const milliseconds = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
    const localTime = new Date(milliseconds);
    localTime.getDate(); // local date
    localTime.getHours(); // local hour
  };

  /* const [utcTimeOffset, setUtcTimeOffset] = useState(
    new Date().getTimezoneOffset() / 60
  ); */

  const [statusText,setStatusText] = useState();
  const [statusStyle,setStatusStyle] = useState({color:"white",alignSelf:"center",padding:5,fontWeight:"600"});
  const [hideBtn,setHideBtn] = useState(false);

  useEffect(() => {
    if(status == constants.statuses.live){
      setStatusText("Live");
      setStatusStyle({...statusStyle,backgroundColor:"red"})
      setHideBtn(true);
    }else if(status == constants.statuses.active){
      setStatusText("Available");
      setStatusStyle({...statusStyle,backgroundColor:"green"})
    }else if(status == constants.statuses.started){
      setStatusText("Live");
      setStatusStyle({...statusStyle,backgroundColor:"red"})
      setHideBtn(true);
    }else if(status == constants.statuses.stopped){
      setStatusText("Paused");
      setStatusStyle({...statusStyle,backgroundColor:"red"})
      setHideBtn(true);
    }else if(status == constants.statuses.completed){
      setStatusText("Completed");
      setStatusStyle({...statusStyle,backgroundColor:"orange"})
      setHideBtn(true);
    }
    if (status == constants.statuses.active && props.totalSpots == props.joined){
      setStatusText("Draw Full");
      setStatusStyle({...statusStyle,backgroundColor:"orange"})
      setHideBtn(true);
    }
    if(timer == "0" || timer === 0){
      setHideBtn(true);
    }
    //console.log("utcTimeOffset, ", utcTimeOffset);

    //console.log("formatTimeByOffset, ", formatTimeByOffset(createdOn, -8));
    //console.log("timezone, ", Localization.timezone);
    //console.log("locale, ", Localization.locale);
    //console.log("toLocaleString, ", new Date().toLocaleString("en-US"));
    //console.log('convertUTCToLocalTime',convertUTCToLocalTime(createdOn))
    //console.log("--------");

  }, []);

  const [timer, setTimer] = useState();
  useEffect(() => {
    const timee = setInterval(() => {
      //console.log("setInterval,", dhm(new Date(props.drawDate) - new Date()));

      //draw not avtive
      if (props.status != constants.statuses.active){
        clearInterval(timee);
        return;
      }

      const _dhm = dhm(new Date(props.drawDate) - new Date());
      if (_dhm[3] < 0) {
        setTimer(0);
        clearInterval(timee);
        return;
      }

      setTimer(
        //(_dhm[0]!==0 ? formatDay(_dhm[0],_dhm[1]) : "") + // only d
        (_dhm[0]!==0 ? _dhm[0]+"d " : "") + // only d
        (_dhm[0]!=0 && _dhm[1]!==0 ? _dhm[1] + "h" : "") + // only d and h
        (_dhm[0]==0 && _dhm[1]!==0 ? _dhm[1] + "h" : "") + // only h
        (_dhm[0]==0 && _dhm[1]==0 && _dhm[2]!==0 ? _dhm[2]+ "m:":"") +
        (_dhm[0]==0 && _dhm[1]==0 && _dhm[3]+"s" ? _dhm[3]+"s":"") +
        " left"
        );
    }, 1000);
    return () => {
      setTimer();
      clearInterval(timee);
    };
  }, []);

  const formatDay = (day,hrs) =>{
    return day + pluraliseDay(day);
  }

  const pluraliseDay = (day) =>{
    return (day < 1 ? "d" : "d")
  }
  
  const dhm = (ms) => {
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor(daysms / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor(hoursms / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    let sec = Math.floor(minutesms / 1000);
    return [days, hours, minutes, sec];
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{
          uri: props.image ? props.image : constants.DEFAULT_IMAGE_URL,
        }}
      />
      <View style={styles.card} />
      <View style={{   justifyContent: "center",   alignItems: "center",   width: "100%", }}>
        <View style={{flexDirection:"row"}}>
            <View style={{flex:1,flexDirection:"row"}}>
              <View style={{borderRadius: 10, backgroundColor:statusStyle.backgroundColor,alignContent:"center",padding:5,alignSelf:"center"}}>
                <Text style={{color:statusStyle.color,fontWeight:statusStyle.fontWeight}}>
                    {statusText}
                </Text>
              </View>
            </View>
            {status === constants.statuses.active && timer != "0" && (
                <View style={{flexDirection:"row"}}>
                  {<Text style={{fontSize:12,paddingRight:5,color:constants.COLOR_RED,fontWeight:"700"}}>E.</Text>}
                  <Text>{timer}</Text>
                </View>
              )}
        </View>
        <View style={{ flexDirection: "row", padding: 1, borderRadius: 1}}>
          <Text style={styles.title}>
            {props.name && props.name.length > 15
              ? props.name.substring(0, 15 - 3) + "..."
              : props.name}
          </Text>
        </View>
        

        <View
          style={{
            flexDirection: "row",
            padding: 1,
            borderRadius: 1,
          }}
        ></View>

        <View
          style={{
            flexDirection: "row",
            padding: 1,
            borderRadius: 1,
          }}
        >
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Text>Win {props.winnersPct}%</Text>
          </View>
          <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
            <Text>{props.totalSpots} spots</Text>
          </View>
        </View>

        {!hideBtn && <View>
          <EasyButton
            disabled={hideBtn}
            primary
            medium
            onPress={() => {
              join(props.id);
              /* ,
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: `${props.name} edit`,
              text2: "Go to your cart to complete order",
            }); */
            }}
          >
            <Text style={{ color: "white" }}>
                <Text>
                  <Icon style={{ color: "white" }} name="rupee" />{" "}
                  {props.entryPrice}
                </Text>
            </Text>
          </EasyButton>
        </View>}
      </View>
    </View>
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
    width: width / 2 - 20,
    height: width / 1.7 + 15,
    padding: 5,
    borderRadius: 10,
    marginTop: 55,
    marginBottom: 5,
    marginLeft: 10,
    alignItems: "center",
    elevation: 8,
    backgroundColor: "white",
  },
  image: {
    width: width / 2 - 20 - 10,
    height: width / 2 - 20 - 30,
    backgroundColor: "transparent",
    position: "absolute",
    top: -45,
  },
  card: {
    marginBottom: 12,
    height: width / 2 - 20 - 90,
    backgroundColor: "transparent",
    width: width / 2 - 20 - 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    //textAlign: "center",
    textTransform: "capitalize",
    backgroundColor: constants.COLOR_WHITE_SMOKE,
    //width: "100%",
    padding: 5,
    flex: 1,
  },
  price: {
    fontSize: 20,
    color: "orange",
    marginTop: 10,
  },
  label: {
    fontSize: 10,
    paddingTop: 10,
  },
});

export default DrawCard;
