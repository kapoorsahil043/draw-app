import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  AsyncStorage,
  StatusBar,
  Alert
} from "react-native";
import { Left, Right, Container, H1, H2 } from "native-base";
import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";
import { TouchableOpacity } from "react-native-gesture-handler";

import Icon from "react-native-vector-icons/FontAwesome";
import RankTable from "../../Shared/RankTable";
import * as constants from "../../assets/common/constants";
import RankNavigator from "../../Navigators/RankNavigator";
import AuthGlobal from "../../Context/store/AuthGlobal";
import Spinner from "../../Shared/Spinner";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

//redux
import { connect } from "react-redux";
import * as actions from '../../Redux/Actions/headerActions';
import CardBox from "../../Shared/Form/CardBox";
import Label from "../../Shared/Label";
import { Button } from "native-base";


const DrawDetails = (props) => {
  const context = useContext(AuthGlobal);
  const [item, setItem] = useState(props.route.params.item);
  const [toggleLabel,setToggleLabel] = useState("Start");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();

  const [timer, setTimer] = useState();
  const [statusText,setStatusText] = useState();
  const [statusStyle,setStatusStyle] = useState({color:"white",padding:5,});
  const [hideBtn,setHideBtn] = useState(false);

  //id, name, totalSpots, entryPrice, winnersPct, status, image

  const formatDay = (day,hrs) =>{
    return day + pluraliseDay(day);
  }

  const pluraliseDay = (day) =>{
    return (day < 1 ? " day" : " days")
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

  const loadData = async (jwt,loadDataTimeInterval) =>{
    console.log('DrawDetails,loadData..',item.status);
    if(item.status === constants.statuses.completed || item.status === constants.statuses.cancelled){
      clearInterval(loadDataTimeInterval);
      return;
    }
    //setLoading(true);
    axios.get(`${baseURL}draws/${props.route.params.item._id}`,{headers: { Authorization: `Bearer ${jwt || token}`}})
    .then((res) => {
      setItem(res.data);
      if(!res.data.status === constants.statuses.active && !res.data.status === constants.statuses.started){
        clearTimeout(loadDataTimeInterval);
      }
    })
    .catch((error) => {console.log("Api call error",error);
      if(item.status === constants.statuses.completed || item.status === constants.statuses.cancelled){
        clearTimeout(loadDataTimeInterval);
      }
    });
  }

  useEffect(() => {
    console.log("DrawDetails,use effect",item.status);
    
    props.hideHeader({hide:true});
    
    if(item.status == constants.statuses.live){
      setHideBtn(true);
    }else if(item.status == constants.statuses.active){
      
    }else if(item.status == constants.statuses.started){
      setHideBtn(true);
    }else if(item.status == constants.statuses.stopped){
      setHideBtn(true);
    }else if(item.status == constants.statuses.completed){
      setHideBtn(true);
    }else if(item.status == constants.statuses.cancelled){
      setHideBtn(true);
    }
    if (item && item.status == constants.statuses.active && item.totalSpots && item.totalSpots === item.joined){
        setHideBtn(true);
    }
    
    AsyncStorage.getItem("jwt").then((res) => {setToken(res);}).catch((error) => console.log(error));
    
    // timer
    const timee = setInterval(async () => {
      //draw not avtive
      if(!item){
        clearInterval(timee);
        return;
      }

      if (item.status !== constants.statuses.active){
        clearInterval(timee);
        return;  
      }

      const _dhm = dhm(new Date(item.drawDate) - new Date());
      if (_dhm[3] < 0) {
        setTimer(0);
        clearInterval(timee);
        return;
      }

      setTimer(
        //(_dhm[0]!==0 ? formatDay(_dhm[0],_dhm[1]) : "") + // only d
        (_dhm[0]!==0 ? _dhm[0]+"d " : "") + // only d
        (_dhm[0]!=0 && _dhm[1]!==0 ? _dhm[1] + "h" : "") + // only d and h
        (_dhm[0]==0 && _dhm[1]!==0 ? _dhm[1] + "h" : "") +
        (_dhm[0]==0 && _dhm[1]==0 && _dhm[2]!==0 ? _dhm[2]+ "m:":"") +
        (_dhm[0]==0 && _dhm[1]==0 && _dhm[3]+"s" ? _dhm[3]+"s":"") +
        " left"
        );
    }, 1000);

    const loadDataTimeInterval = setInterval(() => {
      loadData(null,loadDataTimeInterval);
    }, 5000);

    return () => {
      props.hideHeader({hide:false});
      setToken();
      setTimer();
      clearInterval(timee);
      clearInterval();
      //setItem();
      clearTimeout(loadDataTimeInterval);
    };
  }, []);

  const formatSpotLeft = (item) =>{
    
    if(!item){
      return "";
    }
    if(item.status == constants.statuses.completed || item.status === constants.statuses.cancelled){
      return "";
    }
    let diff = item.totalSpots - item.joined;
    if(diff < 1){
      return ""
    }else if(diff ==  1){
      return diff + " spot left"
    }else{
      return diff + " spots left";
    }
  }

  const loginAlert = () => {
    console.log("context.stateUser.user", context.stateUser.user);
    Alert.alert("Login Required", "Proceed to Login ?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => props.navigation.navigate("SignIn") },
    ]);
  };

  const joinHanlder = (drawId) => {
    console.log("join draw container", drawId);
    if (context.stateUser.user.userId == null) {
      loginAlert();
      return;
    }

    joinContest(drawId);
  };

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

    axios.post(`${baseURL}participants`, req, config)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          setLoading(false);
          Toast.show({topOffset: 60,type: "success",text1: "Contest joined successfully",text2: "",});
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error:", error.response.data);
        let msg = error.response.data.message ? error.response.data.message : "Something went wrong";
        Toast.show({topOffset: 60,type: "error",text1: msg,text2: "",});
        if(error.response?.data?.redirect){
          redirectAlert(error.response.data.error);
        }
      });
  };

  const StatusBox = ()=>{
    return (
      <View style={{ flexDirection: "row"}}>
                {item && 
                <View>
                  {(item.status === constants.statuses.active) && item.totalSpots === item.joined && <Text style={{color:statusStyle.color,backgroundColor:"orange",borderRadius:5,padding:5,fontSize:11}}>
                      Full
                  </Text>}
                  {(item.status === constants.statuses.live || item.status === constants.statuses.started) && <Text style={{color:statusStyle.color,backgroundColor:constants.COLOR_RED,borderRadius:5,padding:5,fontSize:11}}>
                      Live
                  </Text>}
                  {item.status === constants.statuses.active && item.totalSpots !== item.joined && 
                  <TouchableOpacity onPress={()=>{joinHanlder(item.id)}}>
                    <Text style={{color:statusStyle.color,backgroundColor:constants.COLOR_RED,borderRadius:5,fontSize:11,paddingLeft:20,paddingRight:20,padding:5,fontWeight:"bold"}}>
                        Join
                    </Text>
                  </TouchableOpacity>
                  }
                  {item.status === constants.statuses.stopped && <Text style={{color:statusStyle.color,backgroundColor:constants.COLOR_RED,borderRadius:5,padding:5,fontSize:11}}>
                      Paused
                  </Text>}
                  {item.status === constants.statuses.completed && <Text style={{color:statusStyle.color,backgroundColor:"orange",borderRadius:5,padding:5,fontSize:11}}>
                      Completed
                  </Text>}
                  {item.status === constants.statuses.cancelled && <Text style={{color:statusStyle.color,backgroundColor:constants.COLOR_RED,borderRadius:5,padding:5,fontSize:11}}>
                        Cancelled
                  </Text>}
                </View>}
              </View>
    )
  }

  const BottomBox = ()=>{
    return (
      <View style={[styles.bottomContainer,{ 
        backgroundColor:constants.COLOR_WHITE_SMOKE,
        borderBottomRightRadius:5,borderBottomLeftRadius:5,
        padding:5,
        marginRight:5,
        marginLeft:5,
        }]}>
        <Text style={{ flex:1,fontSize: 12,color:"grey" }}>Winning {item.winnersPct}%</Text>
        <Text style={{ flex:1,color: constants.COLOR_RED, fontSize: 12 }}>{formatSpotLeft(item)}</Text>
        <Text style={{ fontSize: 12, color:"grey" }}>{item.totalSpots}&nbsp;spots</Text>
      </View>
    )
  }

  const CompletionPctBox = () =>{
    return (
      item.status === constants.statuses.live || item.status === constants.statuses.started && 
      <View style={{flex:1,alignItems:"center",justifyContent:"center",}}>
        <Text style={{fontSize:12,color:"black",fontWeight:"bold",zIndex:10}}>{ parseFloat(((item.totalSpots -  item.drawCount) / item.totalSpots) * 100).toFixed(2) }%</Text>
        <View style={{position:"absolute"}}>
          <Image source={require("../../assets/animation1.gif")} style={{height: 70, width: 70 }}/>
        </View>
      </View>
    )
  }

  const TimerBox = ()=>{
    return (
      timer!==0 && item.status === constants.statuses.active &&  
        <View style={{flexDirection:"row"}}>
              <View>
                <TouchableOpacity onPress={()=>Toast.show({topOffset: 60,type: "info",text1: "Draw date extended!!",text2: ""})}><View style={{paddingRight:3}}>{item.extendCount && item.extendCount > 0 ? (<Text style={{fontSize:8,color:constants.COLOR_RED,borderColor:constants.COLOR_RED,borderWidth:1,borderRadius:100,textAlign:"center",paddingLeft:3,paddingRight:3}}>E</Text>) : ( null)}</View></TouchableOpacity>
              </View>
              <Text style={{fontSize:11,color:"black"}}>{timer}</Text>
        </View>
    )
  }

  return (
    <>
    <StatusBar animated={true} backgroundColor={constants.COLOR_RED_LIGHT} barStyle="light-content" showHideTransition="slide" hidden={false} />
    <Spinner status={loading}></Spinner>
    <Container style={styles.container}>
     {item && 
     <View>
        <CardBox styles={{alignItems:"center",justifyContent:"center"}}>
          <H2 style={styles.contentHeader}>{item.name}</H2>
        </CardBox>
       
        <View>
          <CardBox>
            <View style={{ flexDirection: "row", marginBottom: 20,justifyContent:"space-between"}}>
              <View style={{flex:1}}>
                <View style={{ flexDirection: "column"}}>
                  <Label text="Pool Price" type="form"/>
                  <Text style={styles.contentText}>
                    <Icon name="rupee" size={15} />{item.totalAmtAvlForDistribution}
                  </Text>
                  <StatusBox/>
                </View>
              </View>

              <View style={{flex: 1}}>
                <CompletionPctBox/>
              </View>

              <View style={{flex:1}}>
                <View style={{ flexDirection: "column",alignItems:"flex-end" }}>
                  <View>
                    <Label text="Entry" type="form"/>
                    <Text style={styles.contentText}>
                      <Icon name="rupee" size={15} />
                      {item.entryPrice}
                    </Text>
                  </View>
                  <TimerBox/>
                </View>
              </View>
              
              
            </View>
          </CardBox>
          <BottomBox/>
        </View>
      </View>}

     {item && 
     <CardBox styles={{ padding:  1, flex:1, }}>
        <RankNavigator item={item}></RankNavigator> 
     </CardBox>
     }
   </Container>
    </>
     );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:"gainsboro"
  },
  image: {
    width: "100%",
    height: "30%",
    borderRadius:10
  },
  contentContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  contentHeader: {
    fontWeight: "bold",
    //textTransform: "capitalize",
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

const mapDispatchToProps = (dispatch) => {
  return {
      hideHeader: (value) => dispatch(actions.hideHeader(value)),
  }
}

export default connect(null,mapDispatchToProps)(DrawDetails);
