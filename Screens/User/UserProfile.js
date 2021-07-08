import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Container } from "native-base";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import baseUrlResourceServer from "../../assets/common/baseUrlResourceServer";
import Spinner from "../../Shared/Spinner";

import { logoutUser } from "../../Context/actions/Auth.actions";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import mime from "mime";
import * as constants from '../../assets/common/constants';

import AuthGlobal from "../../Context/store/AuthGlobal";
import { connect } from "react-redux";
import * as actions from '../../Redux/Actions/userProfileActions';

const UserProfile = (props) => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState();
  const [token, setToken] = useState();
  const [error, setError] = useState();

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

  const saveProfile = async (user) =>{
    console.log('saveProfile');
    AsyncStorage.setItem("usr", JSON.stringify({image:user.image}));
    props.updateUserProfile({image:user.image});
  }
  
  useFocusEffect(
    useCallback(() => {
      //console.log('UserProfile,useCallback',props.route)
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        props.navigation.navigate("SignIn");
      }
      
      // Image Picker
    (async () => {
        if (Platform.OS !== "web") {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
          }
        }
      })();

      AsyncStorage.getItem("jwt")
        .then((res) => {
          setLoading(true);
          setToken(res);
          axios
            .get(`${baseURL}users/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => [saveProfile(user.data),setUserProfile(user.data),setLoading(false)])
            .catch((err) => {
              setLoading(false);
            });
        })
        .catch((error) => [console.log(error), setLoading(false)]);

        return () => {
        setUserProfile();
        setMainImage();
        setImage();
        setError();
        setLoading();
      };
    }, [context.stateUser.isAuthenticated])
  );

  const updateProfile = () => {
    console.log('updateProfile');
    setLoading(true);
    if (!image) {
      setLoading(false);
      setError("Please select image correclty!!");
      alert("Please select image correclty!!");
      return;
    }
    if(!token){
        setLoading(false);
        alert("Please login again!!");
        return;
    }

    setError("");
    let formData = new FormData();
    const newImageUri = "file:///" + image.split("file:/").join("");
    formData.append("image", {
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split("/").pop(),
    });
    //formData.append("name", name);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

      axios
        .post(`${baseUrlResourceServer}users/updateProfile`, formData, config)
        .then((res) => {
          setUserProfile(res.data);
          saveProfile(res.data);
          setMainImage();
          setLoading(false);
          
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Profile Updated Successfully!!",
              text2: "",
            });
          }
        })
        .catch((error) => {
          setLoading(false);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
  };

  const getImageSource = () =>{
    if(mainImage){
      return mainImage;
    }
    if(userProfile && userProfile.image){
      return userProfile.image;
    }

    return constants.DEFAULT_USER_IMAGE_URL;
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
              <Text style={{color:"white"}}>SIGN OUT</Text>
          </EasyButton>
       </View>
      }
      {userProfile && 
      <Container style={styles.container}>
        <ScrollView contentContainerStyle={styles.subContainer}>
          <View style={{ flex: 1 }}>
            <Image style={styles.imageContainer} source={{ uri: getImageSource()}} />
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              <Icon style={{ color: "white" }} name="camera" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 30 }}>
            {userProfile ? userProfile.name : ""}
          </Text>
          <View style={{ margin: 10,flex:1,flexDirection:"column",width:'90%',backgroundColor:"white",borderRadius:5 }}>
              <View>
                <Text style={{ margin: 10 }}>
                    Email: {userProfile ? userProfile.email : ""}
                </Text>
              </View>
              <View>
                <Text style={{ margin: 10 }}>
                    Phone: {userProfile ? userProfile.phone : ""}
                </Text>
              </View>
                <View style={{alignSelf:"center"}}>
                    <EasyButton large primary onPress={() => updateProfile()} disabled={!mainImage}>
                        <Text style={{color:"white"}}>Update Profile</Text>
                    </EasyButton>
                </View>
          </View>
          <View style={{ marginTop: 50,marginBottom:50 }}>
            <EasyButton large danger onPress={() => [
                AsyncStorage.removeItem("jwt"),
                logoutUser(context.dispatch),
                props.clearUserProfile()
              ]}>
                <Text style={{color:"white"}}>SIGN OUT</Text>
            </EasyButton>
            {/* <Button
              title={"Sign Out"}
              onPress={() => [
                AsyncStorage.removeItem("jwt"),
                logoutUser(context.dispatch),
              ]}
            /> */}
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
    alignItems: "center",
    marginTop: 20,
  },
  imageContainer: {
    width: 200,
    height: 200,
    //borderStyle: "solid",
    borderWidth: 5,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#E0E0E0",
    backgroundColor:"white"
    //elevation: 10,
  },
  imagePicker: {
    position: "absolute",
    right: 25,
    bottom: 10,
    backgroundColor: "grey",
    padding: 8,
    borderRadius: 100,
    //elevation: 10,
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
      updateUserProfile: (image) => dispatch(actions.updateUserProfile(image)),
      clearUserProfile: () => dispatch(actions.clearUserProfile()),
  }
}

export default connect(null,mapDispatchToProps)(UserProfile);
