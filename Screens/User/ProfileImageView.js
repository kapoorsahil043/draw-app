import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
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
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

import Toast from "react-native-toast-message";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import mime from "mime";
import * as constants from '../../assets/common/constants';

import AuthGlobal from "../../Context/store/AuthGlobal";
import { connect } from "react-redux";
import * as actions from '../../Redux/Actions/userProfileActions';
import * as headerActions from '../../Redux/Actions/headerActions';

const ProfileImageView = (props) => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState();
  const [token, setToken] = useState();
  const [error, setError] = useState();

  
  useFocusEffect(
    useCallback(() => {
      console.log('ProfileImageView,useCallback');

      props.hideHeader({hide:true});

      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        props.navigation.navigate("SignIn");
      }
      
    
        return () => {
        //props.hideHeader({hide:false});
        };
    }, [context.stateUser.isAuthenticated])
  );

  return (
    <>
      <StatusBar animated={true} backgroundColor={constants.COLOR_BLACK} barStyle="light-content" showHideTransition="slide" hidden={false} />
      <Spinner status={loading}></Spinner>
       
      <Container style={styles.container}>
        <Image style={styles.imageContainer} source={{ uri: props.route.params.url}}/>
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
  flex: 1,
   backgroundColor: "black",
   alignItems: "center",
   justifyContent: "center",
    
  },
  imageContainer: {
    flex: 1,
    resizeMode: "contain",
    width: "100%",
    alignItems: "center",
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
      updateUserProfile: (image) => dispatch(actions.updateUserProfile(image)),
      clearUserProfile: () => dispatch(actions.clearUserProfile()),
      hideHeader: (value) => dispatch(headerActions.hideHeader(value)),
  }
}

export default connect(null,mapDispatchToProps)(ProfileImageView);
