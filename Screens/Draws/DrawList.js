import React from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";

import DrawCard from "./DrawCard";

var { width } = Dimensions.get("window");

const DrawList = (props) => {
  const { item,join,hideJoinBtn } = props;
  return (
    <TouchableOpacity
      style={{ width: "50%" }}
      onPress={() => props.navigation.navigate("Details", { item: item })}>
      <View style={{ width: width / 2, backgroundColor: "gainsboro" }}>
        <DrawCard {...item} join={join} hideJoinBtn={hideJoinBtn}/>
      </View>
    </TouchableOpacity>
  );
};

export default DrawList;
