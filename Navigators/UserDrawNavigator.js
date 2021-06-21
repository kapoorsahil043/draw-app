import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import DrawContainer from "../Screens/Draws/DrawContainer";
import DrawDetails from "../Screens/Draws/DrawDetails"
import MyDrawContainer from '../Screens/MyDraw/Live';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Upcoming from '../Screens/MyDraw/Upcoming';
import Live from '../Screens/MyDraw/Live';
import Completed from '../Screens/MyDraw/Completed';


const Stack = createStackNavigator();
const TabTop = createMaterialTopTabNavigator();

function MyStack() {
    return (
      <TabTop.Navigator>
        <TabTop.Screen name="Upcoming" component={Upcoming} />
        <TabTop.Screen name="Live" component={Live} />
        <TabTop.Screen name="Completed" component={Completed} />
      </TabTop.Navigator>
    );
}

export default function UserDrawNavigator() {
    return <MyStack />;
}