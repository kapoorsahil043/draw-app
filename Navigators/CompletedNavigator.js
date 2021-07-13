import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import DrawContainer from "../Screens/Draws/DrawContainer";
import DrawDetails from "../Screens/Draws/DrawDetails"
import Upcoming from '../Screens/MyDraw/Upcoming';
import Completed from '../Screens/MyDraw/Completed';

const Stack = createStackNavigator()

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Completed'
                component={Completed}
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

export default function CompletedNavigator(navigation) {
    return <MyStack />;
}