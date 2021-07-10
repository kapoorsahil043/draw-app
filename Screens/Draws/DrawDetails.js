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

const DrawDetails = (props) => {
  const context = useContext(AuthGlobal);
  const [item, setItem] = useState(props.route.params.item);
  const [toggleLabel,setToggleLabel] = useState("Start");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();

  const [drawCompletedLabel, setDrawCompletedLabel] = useState();


  const [timer, setTimer] = useState();
  const [statusText,setStatusText] = useState();
  const [statusStyle,setStatusStyle] = useState({color:"white",padding:5,});
  const [hideBtn,setHideBtn] = useState(false);

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
      setToggleLabel(res.data.status == constants.statuses.started ? "Restart": "Start")
      setItem(res.data);// draw
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
      alert(`Error to ${toggleLabel} draw`);
    });
  }

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

  const loadData = async () =>{
    console.log('loadData');
  }

  useEffect(() => {
    console.log("DrawDetails,use effect",item.status);
    
    props.hideHeader({hide:true});
    
    AsyncStorage.getItem("jwt")
    .then((res) => {
        setToken(res);
        loadData();
    })
    .catch((error) => console.log(error));
    
    if(item.status == constants.statuses.live){
      setStatusText("Live");
      setStatusStyle({...statusStyle,backgroundColor:"red"})
      setHideBtn(true);
    }else if(item.status == constants.statuses.active){
      setStatusText("Available");
      setStatusStyle({...statusStyle,backgroundColor:"green"})
    }else if(item.status == constants.statuses.started){
      setStatusText("Live");
      setStatusStyle({...statusStyle,backgroundColor:"red"})
      setHideBtn(true);
    }else if(item.status == constants.statuses.stopped){
      setStatusText("Paused");
      setStatusStyle({...statusStyle,backgroundColor:"red"})
      setHideBtn(true);
    }else if(item.status == constants.statuses.completed){
      setStatusText("Completed");
      setStatusStyle({...statusStyle,backgroundColor:"orange"})
      setHideBtn(true);
    }else if(item.status == constants.statuses.cancelled){
      setStatusText("Cancelled");
      setStatusStyle({...statusStyle,backgroundColor:constants.COLOR_RED})
      setHideBtn(true);
    }

    if (item && item.status == constants.statuses.active && item.totalSpots && item.totalSpots === item.joined){
        setStatusText("Draw Full");
        setStatusStyle({...statusStyle,backgroundColor:"orange"})
        setHideBtn(true);
    }
    //label
    setDrawCompletedLabel(formatSpotLeft(item));

    // timer
    const timee = setInterval(() => {
      //draw not avtive
      if(!item){
        clearInterval(timee);
        return;
      }

      if (item.status != constants.statuses.active){
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

    return () => {
      props.hideHeader({hide:false});
      setToken();
      setDrawCompletedLabel();
      setTimer();
      clearInterval(timee);
    };
  }, []);

  const formatSpotLeft = (item) =>{
    
    if(!item){
      return "";
    }
    if(item.status == constants.statuses.completed){
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

  return (
    <>
    <Spinner status={loading}></Spinner>
    <Container style={styles.container}>
     {item && <ScrollView style={{ padding: 5 }}>
       <View> 
         {item.status === constants.statuses.live && 
         <View style={{position:"absolute",flex:1,elevation:10,marginTop:'20%',backgroundColor:"#C0C0C0",justifyContent:"center",alignSelf:"center",shadowColor: "#000",shadowOffset: {    width: 0,  height: 2,},shadowOpacity: 0.25,shadowRadius: 3.84,}}>
           <View>
               <Text style={{fontSize:30,color:"black",padding:5}}>{ ((item.totalSpots -  item.drawCount) / item.totalSpots) * 100 }% Completed</Text>
           </View>
         </View>
         }
         <Image source={{uri: item.image ? item.image : constants.DEFAULT_IMAGE_URL,}} resizeMode="contain" style={styles.image}/>
       </View>
       {
         context.stateUser.user.isAdmin == true && 
        constants.STATUS_FOR_LIVE.indexOf(item.status) > -1 && 
        item.totalSpots === item.joined &&
        (<EasyButton
           primary
           medium
           onPress={() => toggleDraw()}
         >
           <Text style={{ color: "white", fontWeight: "bold" }}>{toggleLabel}</Text>
         </EasyButton>)
       }

       <View style={styles.contentContainer}>
         <H1 style={styles.contentHeader}>{item.name}</H1>
       </View>
       <View style={{ flexDirection: "row", padding: 10, backgroundColor: "white", marginTop: 5, borderRadius:5,alignContent:"center"}}>
         <View style={{ flexDirection: "column", flex: 1}}>
           <Text>Pool Price</Text>
           <Text style={styles.contentText}>
             <Icon name="rupee" size={15} />
             {item.totalAmtAvlForDistribution}
           </Text>
           <View style={{ flexDirection: "row"}}>
             <View>
               <Text style={{color:statusStyle.color,backgroundColor:statusStyle.backgroundColor,borderRadius:5,padding:5}}>
                   {statusText}
               </Text>
             </View>
           </View>
         </View>
         <View style={{ flexDirection: "column",alignItems:"flex-end" }}>
           <Text >Entry</Text>
           <Text style={styles.contentText}>
             <Icon name="rupee" size={15} />
             {item.entryPrice}
           </Text>
           {timer!==0 && item.status === constants.statuses.active && 
            <Text>{item.extendCount && item.extendCount > 0 && <TouchableOpacity onPress={()=>Toast.show({topOffset: 60,type: "info",text1: "Draw date extended!!",text2: ""})}><Text style={{fontSize:12,paddingRight:5,color:constants.COLOR_RED,fontWeight:"700"}}>E.</Text></TouchableOpacity>}{timer}</Text>
           }
         </View>
       </View>
       <View style={{ flexDirection: "row", padding: 10, backgroundColor: "white", marginTop: 5, borderRadius:5,alignContent:"center"}}>
         <View style={{ flexDirection: "row", flex: 1 }}>
           <Text>Win {item.winnersPct}%</Text>
         </View>
         <View style={{ flexDirection: "column" }}>
           <Text>{item.totalSpots}&nbsp;spots</Text>
           <Text style={{ color: "red",paddingTop:2 }}>
             {drawCompletedLabel}
           </Text>
         </View>
       </View>
       <View style={{ flexDirection: "row", padding:  1, backgroundColor: "white", marginTop: 5, borderRadius:5,alignContent:"center", marginBottom:20}}>
          <RankNavigator item={item}></RankNavigator>
       </View>
     </ScrollView>
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
    height: 280,
    borderRadius:10
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

const mapDispatchToProps = (dispatch) => {
  return {
      hideHeader: (value) => dispatch(actions.hideHeader(value)),
  }
}

export default connect(null,mapDispatchToProps)(DrawDetails);
