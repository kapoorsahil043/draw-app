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
import CardBox from "../../Shared/Form/CardBox";

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
      console.log('res.data',res.data.joined)
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
        setStatusText("Full");
        setStatusStyle({...statusStyle,backgroundColor:"orange"})
        setHideBtn(true);
    }
    
    AsyncStorage.getItem("jwt")
    .then((res) => {
        setToken(res);
    })
    .catch((error) => console.log(error));
    
    // timer
    const timee = setInterval(() => {
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
    }, 3000);

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

  return (
    <>
    <Spinner status={loading}></Spinner>
    <Container style={styles.container}>
     {item && 
     <ScrollView style={{ padding: 5 }}>
       {/* image box */}
       <View> 
         {item.status === constants.statuses.live || item.status === constants.statuses.started && 
         <View style={{position:"absolute",flex:1,elevation:20,marginTop:'20%',backgroundColor:"lightgrey",justifyContent:"center",alignSelf:"center",shadowColor: "#000",shadowOffset: {    width: 0,  height: 2,},shadowOpacity: 0.25,shadowRadius: 3.84,}}>
           <View>
               <Text style={{fontSize:25,color:"black",padding:5}}>{ Math.round(((item.totalSpots -  item.drawCount) / item.totalSpots) * 100) }% Completed</Text>
           </View>
         </View>
         }
         <Image source={{uri: item.image ? item.image : constants.DEFAULT_IMAGE_URL,}} resizeMode="contain" style={styles.image}/>
       </View>
       
       {/* draw name */}
       <View style={styles.contentContainer}>
         <H1 style={styles.contentHeader}>{item.name}</H1>
       </View>
       
       {/* details box */}
       <View>
          <View style={{ flexDirection: "row", padding: 10, backgroundColor: "white", marginBottom: 20, borderRadius:5,alignContent:"center"}}>
         <View style={{ flexDirection: "column", flex: 1}}>
           <Text>Pool Price</Text>
           <Text style={styles.contentText}>
             <Icon name="rupee" size={15} />
             {item.totalAmtAvlForDistribution}
           </Text>
           <View style={{ flexDirection: "row"}}>
             {item && 
             <View>
               {(item.status === constants.statuses.active) && item.totalSpots === item.joined && <Text style={{color:statusStyle.color,backgroundColor:"orange",borderRadius:5,padding:5}}>
                   Full
               </Text>}
               {(item.status === constants.statuses.live || item.status === constants.statuses.started) && <Text style={{color:statusStyle.color,backgroundColor:constants.COLOR_RED,borderRadius:5,padding:5}}>
                   Live
               </Text>}
               {item.status === constants.statuses.active && <Text style={{color:statusStyle.color,backgroundColor:"green",borderRadius:5,padding:5}}>
                   Available
               </Text>}
               {item.status === constants.statuses.stopped && <Text style={{color:statusStyle.color,backgroundColor:constants.COLOR_RED,borderRadius:5,padding:5}}>
                   Paused
               </Text>}
               {item.status === constants.statuses.completed && <Text style={{color:statusStyle.color,backgroundColor:"orange",borderRadius:5,padding:5}}>
                   Completed
               </Text>}
               {item.status === constants.statuses.cancelled && <Text style={{color:statusStyle.color,backgroundColor:constants.COLOR_RED,borderRadius:5,padding:5}}>
                    Cancelled
               </Text>}
             </View>}
           </View>
         </View>
         <View style={{ flexDirection: "column",alignItems:"flex-end" }}>
           <Text >Entry</Text>
           <Text style={styles.contentText}>
             <Icon name="rupee" size={15} />
             {item.entryPrice}
           </Text>
           {timer!==0 && item.status === constants.statuses.active && 
            <View style={{flexDirection:"row"}}>
                  <TouchableOpacity onPress={()=>Toast.show({topOffset: 60,type: "info",text1: "Draw date extended!!",text2: ""})}><View style={{paddingRight:3}}>{item.extendCount && item.extendCount > 0 ? (<Text style={{fontSize:8,color:constants.COLOR_RED,borderColor:constants.COLOR_RED,borderWidth:1,borderRadius:100,textAlign:"center",paddingLeft:3,paddingRight:3}}>E</Text>) : ( null)}</View></TouchableOpacity>
                  <Text style={{fontSize:12,color:"black"}}>{timer}</Text>
            </View>
           }
         </View>
       </View>
       
          <View style={[styles.bottomContainer,{ width: "100%", justifyContent: "space-between",backgroundColor:constants.COLOR_WHITE_SMOKE,borderBottomRightRadius:5,borderBottomLeftRadius:5,padding:6 },]}>
          <View>
            <Text style={{ fontSize: 12,color:"grey" }}>Winning {item.winnersPct}%</Text>
          </View>
          <View>
            <Text style={{ color: constants.COLOR_RED, fontSize: 12 }}>
              {formatSpotLeft(item)}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color:"grey" }}>
              {item.totalSpots}&nbsp;spots
            </Text>
          </View>
        </View>

       </View>
       
       {/* rank nav */}
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
