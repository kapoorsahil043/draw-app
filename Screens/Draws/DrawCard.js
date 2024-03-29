import React, { useEffect,useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  TouchableOpacity
} from "react-native";
import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";
import Icon from "react-native-vector-icons/FontAwesome";
import * as constants from "../../assets/common/constants";
import * as Localization from "expo-localization";
import delay from 'delay';

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
    extendCount,
    joined,
    drawDate
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
  const [statusStyle,setStatusStyle] = useState({color:"white",alignSelf:"center",padding:5,fontWeight:"600",fontSize:11});
  const [hideBtn,setHideBtn] = useState(false);

  useEffect(() => {
    //console.log('DrawCard,useEffect')
    
    if (status == constants.statuses.active && props.totalSpots == props.joined){
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

      //draw not avtive
      if (status != constants.statuses.active){
        clearInterval(timee);
        return;
      }

      const _dhm = dhm(new Date(drawDate) - new Date());
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
  const FirstPrice = () =>{
    return (
      <View style={{flexDirection:"row",alignItems:"center",padding:5}}>
        <View style={{borderWidth:1,borderRadius:100,borderColor:constants.COLOR_GREY,flexDirection:"row",padding:1}}>
          <Text style={{fontSize:8,color:constants.COLOR_GREY}}>
            1
          </Text>
          <Text style={{fontSize:6,color:constants.COLOR_GREY,top:-1}}>
            st
          </Text>
        </View>
        <Text style={{fontSize:10,color:constants.COLOR_GREY}}>&nbsp;{props.ranks[0].rankType}</Text>
      </View>
    )
  }

  const TimerBox = ()=>{
    return (
      status === constants.statuses.active && timer != "0" && 
            (
                <View style={{flexDirection:"row"}}>
                  <View style={{paddingRight:3}}>{extendCount && extendCount > 0 ? (<Text style={{fontSize:8,color:constants.COLOR_RED,borderColor:constants.COLOR_RED,borderWidth:1,borderRadius:100,textAlign:"center",paddingLeft:3,paddingRight:3}}>E</Text>) : ( null)}</View>
                  <Text style={{fontSize:10,color:"black"}}>{timer}</Text>
                </View>
              )
    )
  }

  const StatusBox =()=>{
    return (
      <View style={{flexDirection:"row",flex:1}}>
            {status && 
             <View>
               {(status === constants.statuses.active) && totalSpots === joined && <Text style={{color:statusStyle.color,backgroundColor:"orange",borderRadius:5,padding:5,fontSize:statusStyle.fontSize}}>
                   Full
               </Text>}
               {(status === constants.statuses.live || status === constants.statuses.started) && <Text style={{color:statusStyle.color,backgroundColor:constants.COLOR_RED,borderRadius:5,padding:5,fontSize:statusStyle.fontSize}}>
                   Live
               </Text>}
               {status === constants.statuses.active && totalSpots !== joined && 
               <TouchableOpacity onPress={()=>{join(props.id)}}>
                <Text style={{color:statusStyle.color,backgroundColor:constants.COLOR_RED,borderRadius:5,fontSize:11,paddingLeft:15,paddingRight:15,padding:5,fontWeight:"bold"}}>
                  <Icon style={{ color: "white" }} name="rupee" />{" "}
                  {props.entryPrice}
                </Text>
              </TouchableOpacity>
               }
               {status === constants.statuses.stopped && <Text style={{color:statusStyle.color,backgroundColor:constants.COLOR_RED,borderRadius:5,padding:5,fontSize:statusStyle.fontSize}}>
                   Paused
               </Text>}
               {status === constants.statuses.completed && <Text style={{color:statusStyle.color,backgroundColor:"orange",borderRadius:5,padding:5,fontSize:statusStyle.fontSize}}>
                   Completed
               </Text>}
               {status === constants.statuses.cancelled && <Text style={{color:statusStyle.color,backgroundColor:constants.COLOR_RED,borderRadius:5,padding:5,fontSize:statusStyle.fontSize}}>
                    Cancelled
               </Text>}
             </View>}
            </View>
    )
  }

  const NameBox = () =>{
    return (
      <View style={{ flexDirection: "row", borderRadius: 2}}>
        <Text style={styles.title}>
          {props.name && props.name.length > 20
            ? props.name.substring(0, 20 - 3) + "..."
            : props.name}
        </Text>
      </View>
    )
  }

  return (
    <View style={[styles.container]}>
      <Image style={styles.image} resizeMode="contain" source={{uri: props.image ? props.image : constants.DEFAULT_IMAGE_URL,}}/>
      <View style={styles.card} />
      <View style={{alignItems: "center",}}>
        <View style={{flexDirection:"row",paddingBottom:10}}>
            <StatusBox/>
            <TimerBox/>
        </View>

        <NameBox/>
        <FirstPrice/>

        <View style={{flexDirection: "row"}}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Text style={{fontSize:12,color:constants.COLOR_GREY}}>Winning {props.winnersPct}%</Text>
          </View>
          <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
            <Text style={{fontSize:12,color:constants.COLOR_GREY}}>{props.totalSpots} spots</Text>
          </View>
        </View>
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
    height: width / 1.8,
    padding: 5,
    borderRadius: 8,
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
    fontSize: 14,
    //textAlign: "center",
    //textTransform: "capitalize",
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
