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
  FlatList,
  Dimensions,
  ScrollView
} from "react-native";
import { Container, Item, Picker } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import Error from "../../Shared/Error";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-community/async-storage";
import baseUrlResourceServer from "../../assets/common/baseUrlResourceServer";
import baseUrl from "../../assets/common/baseUrl";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import DateTimePicker from '@react-native-community/datetimepicker';
import Spinner from "../../Shared/Spinner";
import * as constants from "../../assets/common/constants";

//redux
import { connect } from "react-redux";
import * as actions from '../../Redux/Actions/headerActions';
import CardBox from "../../Shared/Form/CardBox";


var { width } = Dimensions.get("window");
const DrawImageAdd = (props) => {
  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [token, setToken] = useState();
  const [err, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [bottomBarHeight, setBbottomBarHeight] = useState(80);
  

  useEffect(() => {
    console.log("DrawImagePage, useEffect");
    
    props.hideHeader({hide:true});

    AsyncStorage.getItem("jwt")
      .then((jwt) => {
        //console.log('token',res);
        setToken(jwt);
        axios
        .get(`${baseUrl}images`)
        .then((res) => [setImages(res.data)])
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
      setDescription();
      setName();
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

  const uploadImage = () => {
    setLoading(true);
    if (
      !image ||
      !name ||
      name == ""
    ) {
      setLoading(false);
      setError("Please fill in the form correctly");
      alert("Please fill in the form correctly");
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
    formData.append("name", name);
    formData.append("description", description);
   
    
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    axios.post(`${baseUrlResourceServer}images`, formData, config)
      .then((res) => {
        setLoading(false);
        setImages([...images,res.data])
        setName();
        setDescription();
        if (res.status == 200 || res.status == 201) {
          Toast.show({topOffset: 60,type: "success",text1: "New Image added",text2: "",});
        }
      })
      .catch((error) => {
        setLoading(false);
        Toast.show({topOffset: 60,type: "error",text1: "Something went wrong",text2: "Please try again",});
      });
  };

  return (
    <>
      <Spinner status={loading}></Spinner>
      <ScrollView>
        <CardBox styles={{}}>
          <View style={{alignItems:"center"}}>
              <Image style={styles.imageContainer} source={{ uri: mainImage }} />
              <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                <Icon style={{ color: "white" }} name="camera" />
              </TouchableOpacity>
          </View>
          <View style={{alignItems:"center"}}>
            <Input placeholder="Enter image Name" name="name" id="name" value={name} onChangeText={(text) => setName(text)} />
          </View>
          <View style={{alignItems:"center"}}>
            <Input placeholder="Enter description" name="description" id="description" value={description} multiline={true} styles={{height:150}}
            onChangeText={(text) => setDescription(text)} />
          </View>
          <View style={{alignItems:"center"}}>
            <EasyButton large primary onPress={() => uploadImage()}>
              <Text style={styles.buttonText}>Upload</Text>
            </EasyButton>
          </View>
        </CardBox>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
      backgroundColor: "white",
      width: width,
      padding: 5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      position: "absolute",
      bottom: 0,
      left: 0
  },
  input: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1
  },
  item: {
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      //elevation: 1,
      padding: 5,
      margin: 5,
      backgroundColor: "white",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 5
  },
  imageContainer: {
    width: 150,
    height: 150,
    //borderStyle: "solid",
    borderWidth: 5,
    padding: 0,
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "#E0E0E0",
    //elevation: 10,
  },
  imagePicker: {
    position: "absolute",
    right: 150,
    bottom: 1,
    backgroundColor: "grey",
    padding: 4,
    borderRadius: 100,
    //elevation: 10,
  },
  buttonText: {
    color: "white"
},
});

const mapDispatchToProps = (dispatch) => {
  return {
      hideHeader: (value) => dispatch(actions.hideHeader(value)),
  }
}

export default connect(null,mapDispatchToProps)(DrawImageAdd);