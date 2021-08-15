import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch
} from "react-native";
import { Container } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Spinner from "../../Shared/Spinner";

import { logoutUser } from "../../Context/actions/Auth.actions";
import * as ImagePicker from "expo-image-picker";

import Icon from "react-native-vector-icons/FontAwesome";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Fontisto from "react-native-vector-icons/Fontisto";

import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import mime from "mime";
import * as constants from '../../assets/common/constants';

import AuthGlobal from "../../Context/store/AuthGlobal";
import { connect } from "react-redux";
import * as actions from '../../Redux/Actions/userProfileActions';
import * as headerActions from '../../Redux/Actions/headerActions';
import CardBox from "../../Shared/Form/CardBox";

const UserProfile = (props) => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState();
  const [token, setToken] = useState();
  const [error, setError] = useState();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    axios.put(`${baseURL}users/push/toggle`, {push:"toggle"}, {headers: { Authorization: `Bearer ${token}` }})
    .then((res) => [setIsEnabled(previousState => !previousState),setLoading(false)])
    .catch((err) => {
      console.log(err),
      setLoading(false);
    });
  };


  const saveProfile = async (user) =>{
    console.log('UserProfile,saveProfile');
    setIsEnabled(user.isPushMessageOn === constants.statuses.active ? true : false);
    AsyncStorage.setItem("usr", JSON.stringify({image:user.image}));
    props.updateUserProfile({image:user.image});
  }
  
  useFocusEffect(
    useCallback(() => {
      console.log('UserProfile,useCallback');

      props.hideHeader({hide:true});

      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        props.navigation.navigate("SignIn");
      }

      AsyncStorage.getItem("jwt")
        .then((res) => {
          setLoading(true);
          setToken(res);
            axios.get(`${baseURL}users/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => [saveProfile(user.data),setUserProfile(user.data),setLoading(false)])
            .catch((err) => {
              console.log(err),
              setLoading(false);
            });
        })
        .catch((error) => [console.log(error), setLoading(false)]);

        return () => {
        //props.hideHeader({hide:false});
        setUserProfile();
        setMainImage();
        setImage();
        setError();
        setLoading();
      };
    }, [context.stateUser.isAuthenticated])
  );

  const getImageSource = () =>{
    if(mainImage){
      return mainImage;
    }
    if(userProfile && userProfile.image){
      return userProfile.image;
    }

    return constants.DEFAULT_USER_IMAGE_URL;
  }

  const navigateTo = ()=>{
    console.log("navigateTo");
    props.navigation.navigate("Profile Image");
  }

  return (
    <>
      <Spinner status={loading}></Spinner>
       {!userProfile && !loading &&
         <View style={{ marginTop: 50,marginBottom:50, justifyContent:"center",flexDirection:"row" }}>
          <EasyButton large danger onPress={() => [
              AsyncStorage.removeItem("jwt"),
              logoutUser(context.dispatch),
              props.clearUserProfile()
            ]}>
              <Text style={{color:"white",fontWeight:"500"}}>SIGN OUT</Text>
          </EasyButton>
        </View>
      }
      {userProfile && 
      <Container style={styles.container}>
        <ScrollView contentContainerStyle={styles.subContainer}>
          <View>
            <CardBox styles={{flexDirection:"row"}}>
              <TouchableOpacity onPress={()=>navigateTo()}>
                <View style={{flex:1}}>
                    <Image style={styles.imageContainer} source={{ uri: getImageSource()}} />  
                </View>
                <View style={styles.imagePicker}>
                    <Icon style={{ color: "white" }} name="refresh" size={10}/>
                </View>
              </TouchableOpacity>
              <Text style={{alignSelf:"center",padding:20,fontSize:17,fontWeight:"500"}}>
                {userProfile ? userProfile.name : ""}
              </Text>
            </CardBox>
            
            <CardBox styles={{padding:20}}>
              <TouchableOpacity onPress={() => props.navigation.navigate("Profile")}>
                  <View style={{flexDirection:"row"}}>
                    <Text style={{flex:1,fontSize:15}}>Profile</Text>
                    <SimpleLineIcons name="arrow-right" size={15} style={{alignSelf:"center"}} color={constants.COLOR_RED} />
                  </View>
              </TouchableOpacity>
            </CardBox>
            <CardBox styles={{padding:20}}>
              <TouchableOpacity onPress={() => props.navigation.navigate("Address",{userProfile:userProfile})}>
                  <View style={{flexDirection:"row"}}>
                    <Text style={{flex:1,fontSize:15}}>Address</Text>
                    <SimpleLineIcons name="arrow-right" size={15} style={{alignSelf:"center"}} color={constants.COLOR_RED} />
                  </View>
              </TouchableOpacity>
            </CardBox>
            <CardBox styles={{padding:20}}>
              <TouchableOpacity onPress={() => props.navigation.navigate("Accounts")}>
                  <View style={{flexDirection:"row"}}>
                    <Text style={{flex:1,fontSize:15}}>Accounts</Text>
                    <SimpleLineIcons name="arrow-right" size={15} style={{alignSelf:"center"}} color={constants.COLOR_RED} />
                  </View>
              </TouchableOpacity>
            </CardBox>

            <CardBox styles={{padding:20}}>
              <View style={{flexDirection:"row",alignItems:"center"}}>
                <Text style={{flex:1,fontSize:15}}>{isEnabled ? "Disable" : "Enable"} push notification</Text>
                <Switch
                  trackColor={{ false: '#767577', true: constants.COLOR_RED_LIGHT }}
                  thumbColor={isEnabled ? constants.COLOR_RED : 'lightgrey'}
                  //ios_backgroundColor={constants.COLOR_RED}
                  onValueChange={toggleSwitch}
                  value={isEnabled}
              />
              </View>
            </CardBox>
            
            <View style={{ marginTop: 20,marginBottom:50,alignItems:"center" }}>
              <EasyButton large danger onPress={() => [
                  AsyncStorage.removeItem("jwt"),
                  logoutUser(context.dispatch),
                  props.clearUserProfile()
                ]}>
                  <Text style={{color:"white",fontWeight:"500"}}>SIGN OUT</Text>
              </EasyButton>
              {/* <Button
                title={"Sign Out"}
                onPress={() => [
                  AsyncStorage.removeItem("jwt"),
                  logoutUser(context.dispatch),
                ]}
              /> */}
          </View>
          </View>
        </ScrollView>
      </Container>}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "center"
    backgroundColor: "gainsboro",   
    flexDirection:"row",
  },
  subContainer: {
    //marginTop: 20,
  },
  imageContainer: {
    width: 80,
    height: 80,
    //borderStyle: "solid",
    borderWidth: 2,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#E0E0E0",
    backgroundColor:"white",
    //elevation: 10,
  },
  imagePicker: {
    position: "absolute",
    left: 59,
    bottom: 5,
    backgroundColor: "grey",
    padding: 2,
    borderRadius: 100,
    //elevation: 10,
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
      updateUserProfile: (image) => dispatch(actions.updateUserProfile(image)),
      clearUserProfile: () => dispatch(actions.clearUserProfile()),
      hideHeader: (value) => dispatch(headerActions.hideHeader(value)),
  }
}

export default connect(null,mapDispatchToProps)(UserProfile);
