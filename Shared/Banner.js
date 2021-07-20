import AsyncStorage from "@react-native-community/async-storage";
import React, { useState, useEffect, useCallback } from "react";
import { Image, StyleSheet, Dimensions, View, ScrollView } from "react-native";
import Swiper from "react-native-swiper/src";
import baseUrl from "../assets/common/baseUrl";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/core";

var { width } = Dimensions.get("window");

const Banner = () => {
  const [bannerData, setBannerData] = useState([]);
  const loadImage = (images) =>{
    console.log('loadImage')
    //let sources = ;
    //console.log(sources);
    setTimeout(() => {
      setBannerData(images.filter(function(img) {
        if (img.name.toLowerCase().indexOf('banner') > -1) {
          return true;
        }
        return false; // skip
      }).map(function(img) { return img.image; }))
    }, 10);
  }

  useFocusEffect(useCallback(() => {
    console.log('Banner,useEffect')
    axios
      .get(`${baseUrl}images`)
      .then((res) => loadImage(res.data) )
      .catch((error) => console.log('banner-> error while loading images'));

    /* setBannerData([
      "https://images.vexels.com/media/users/3/126443/preview2/ff9af1e1edfa2c4a46c43b0c2040ce52-macbook-pro-touch-bar-banner.jpg",
      "https://pbs.twimg.com/media/D7P_yLdX4AAvJWO.jpg",
      "https://www.yardproduct.com/blog/wp-content/uploads/2016/01/gardening-banner.jpg",
    ]); */

    return () => {
      //setBannerData([]);
    };
  }, [])
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.swiper}>
          {bannerData && bannerData.length > 0 && 
          <Swiper style={{ height: width / 1.5 }} showButtons={false} autoplay={true} autoplayTimeout={3}>
            {bannerData.map((item) => {
              return (
                <Image key={item} style={styles.imageBanner} resizeMode="contain" source={{ uri: item }}/>
              );
            })}
          </Swiper>}
          {/* <View style={{ height: 10 }}></View> */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gainsboro",
  },
  swiper: {
    width: width,
    alignItems: "center",
    marginTop: 10,
  },
  imageBanner: {
    height: width / 1.5,
    width: width - 40,
    borderRadius: 10,
    marginHorizontal: 20,
  },
});

export default Banner;
