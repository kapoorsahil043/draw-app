import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import DrawContainer from "../Screens/Draws/DrawContainer";
import DrawDetails from "../Screens/Draws/DrawDetails"
import Upcoming from '../Screens/MyDraw/Upcoming';
import Live from '../Screens/MyDraw/Live';

const Stack = createStackNavigator()

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Live'
                component={Live}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name='Details'
                component={DrawDetails}
                options={{
                    headerShown: true,
                }}
            />
        </Stack.Navigator>
    )
}

export default function LiveNavigator(navigation) {
    return <MyStack />;
}