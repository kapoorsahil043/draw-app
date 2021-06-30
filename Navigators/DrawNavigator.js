import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import DrawDetails from "../Screens/Draws/DrawDetails"
import DrawPage from '../Screens/Draws/DrawPage';
import DrawForm from '../Screens/Draws/DrawForm';

const Stack = createStackNavigator()

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Draw'
                component={DrawPage}
                options={{
                    headerShown: true,
                }}
            />
            <Stack.Screen 
                name='Draw Detail'
                component={DrawDetails}
                options={{
                    headerShown: true,
                }}
            />
            <Stack.Screen 
                name='Add'
                component={DrawForm}
                options={{
                    headerShown: true,
                }}
            />
        </Stack.Navigator>
    )
}

export default function DrawNavigator() {
    return <MyStack />;
}