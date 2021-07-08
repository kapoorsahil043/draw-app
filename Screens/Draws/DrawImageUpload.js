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
  Dimensions
} from "react-native";
import { Item, Picker } from "native-base";
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

var { width } = Dimensions.get("window");
const DrawImageUpload = (props) => {
  const [image, setImage] = useState();
  const [mainImage, setMainImage] = useState();
  const [name, setName] = useState();
  const [token, setToken] = useState();
  const [err, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    console.log("DrawImageUpload, useEffect");

    AsyncStorage.getItem("jwt")
      .then((jwt) => {
        //console.log('token',res);
        setToken(jwt);
        axios
        .get(`${baseUrl}images`)
        .then((res) => [setImages(res.data),console.log(res.data)])
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
   
    
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

      axios
        .post(`${baseUrlResourceServer}images`, formData, config)
        .then((res) => {
          setLoading(false);
          setImages([...images,res.data])
          setName();
          if (res.status == 200 || res.status == 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "New Image added",
              text2: "",
            });
            setTimeout(() => {
              //props.navigation.navigate("Draw");
            }, 500);
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

  const Item = (props) => {
    return (
        <View style={[styles.item]}>
             <Image
              style={{height:60,width:60,borderRadius:100,borderWidth:.1}}
              source={{
                uri: props.item.image ? props.item.image : constants.DEFAULT_IMAGE_URL,
              }}
          />
            <Text>{props.item.name}</Text>
            <EasyButton
                danger
                medium
                onPress={() => props.delete(props.item._id)}
            >
                <Text style={{ color: "white"}}>Delete</Text>
            </EasyButton>
        </View>
    )
}

const deleteImages = (id) => {
  setLoading(true);
  const config = {
      headers: {
          Authorization: `Bearer ${token}`,
      }
  };

  axios
  .delete(`${baseUrl}images/${id}`, config)
  .then((res) => {
      const newImages = images.filter((item) => item.id !== id);
      setImages(newImages);
      setLoading(false);
  })
  .catch((error) => {setLoading(false);alert("Error to load images")});
}

  return (
    <>
      <Spinner status={loading}></Spinner>
      <View style={{ position: "relative", height: "100%",backgroundColor: "gainsboro"}}>
        <View style={{ marginBottom: 80 }}>
          <FlatList  data={images} renderItem={({ item, index }) => ( <Item item={item} index={index} delete={deleteImages} />)} keyExtractor={(item) => item.id}/>
        </View>
        <View style={styles.bottomBar}>
          <View style={{flex:1}}>
              <Image style={styles.imageContainer} source={{ uri: mainImage }} />
              <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                <Icon style={{ color: "white" }} name="camera" />
              </TouchableOpacity>
          </View>
          <View style={{flex:2}}>
            <Input placeholder="Image Name" name="name" id="name" value={name} onChangeText={(text) => setName(text)} />
          </View>
          <View style={{}}>
            <EasyButton large primary onPress={() => uploadImage()}>
              <Text style={styles.buttonText}>Upload</Text>
            </EasyButton>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
      backgroundColor: "white",
      width: width,
      height: 80,
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
    width: 60,
    height: 60,
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
    right: 10,
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

export default DrawImageUpload;
