import React from 'react'

import { createStackNavigator } from "@react-navigation/stack"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import UpcomingNavigator from './UpcomingNavigator';
import LiveNavigator from './LiveNavigator';
import CompletedNavigator from './CompletedNavigator';


const Stack = createStackNavigator();
const TabTop = createMaterialTopTabNavigator();

function MyStack() {
    return (
      <TabTop.Navigator>
        <TabTop.Screen name="Upcoming" component={UpcomingNavigator} />
        <TabTop.Screen name="Live" component={LiveNavigator} />
        <TabTop.Screen name="Completed" component={CompletedNavigator} />
      </TabTop.Navigator>
    );
}

export default function UserDrawNavigator() {
    return <MyStack />;
}