import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import DrawDetails from "../Screens/Draws/DrawDetails"
import DrawPage from '../Screens/Draws/DrawPage';
import DrawAdd from '../Screens/Draws/DrawAdd';
import DrawEdit from '../Screens/Draws/DrawEdit';
import DrawExtend from '../Screens/Draws/DrawExtend';
import Testing from '../Screens/User/Testing';
import MaintenanceNavigator from './MaintenanceNavigator';

const Stack = createStackNavigator()

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Draw'
                component={MaintenanceNavigator}
                options={{
                    headerShown: false,
                }}
            />
           
        </Stack.Navigator>
    )
}

export default function DrawNavigator() {
    return <MyStack />;
}