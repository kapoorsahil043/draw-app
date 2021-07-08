import React, {useCallback, useEffect, useState} from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import RankTable from '../Shared/RankTable';
import DrawWinners from '../Screens/Draws/DrawWinners';
import DrawParticipants from '../Screens/Draws/DrawParticipants';
import * as constants from "../assets/common/constants";

const Stack = createStackNavigator();
const TabTop = createMaterialTopTabNavigator();

function MyStack(props) {
  const {item} = props;
  //console.log('props.item',item);
  

    return (
      <TabTop.Navigator>
        <TabTop.Screen name="Price Table" component={RankTable} initialParams={item}/>
        <TabTop.Screen name="Participants" component={DrawParticipants} initialParams={item}/>
        {<TabTop.Screen name="Winners" component={DrawWinners} initialParams={item}/>}
      </TabTop.Navigator>
    );
}

export default function RankNavigator(props) {
    //console.log('props.item',item);
    return <MyStack item = {props}/>;
}