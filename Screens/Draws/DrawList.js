import React, { useContext } from "react";
import { TouchableOpacity, View, Dimensions } from "react-native";

import DrawCard from "./DrawCard";
import AuthGlobal from "../../Context/store/AuthGlobal";

var { width } = Dimensions.get("window");

const DrawList = (props) => {
  const { item,join,hideJoinBtn,loginAlert } = props;
  const context = useContext(AuthGlobal);
  
  const handleClick = (item) =>{
    console.log('test');
    if(!context.stateUser.user.userId || context.stateUser.user.userId==null){
      console.log('testss',);
      loginAlert();
      return;
    }
    props.navigation.navigate("Details", { item: item });
  }

  return (
    <TouchableOpacity
      style={{ width: "50%" }}
      onPress={() => handleClick(item)}>
      <View style={{ width: width / 2, backgroundColor: "gainsboro" }}>
        <DrawCard {...item} join={join} hideJoinBtn={hideJoinBtn}/>
      </View>
    </TouchableOpacity>
  );
};

export default DrawList;
