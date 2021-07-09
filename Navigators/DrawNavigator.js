import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import DrawDetails from "../Screens/Draws/DrawDetails"
import DrawPage from '../Screens/Draws/DrawPage';
import DrawAdd from '../Screens/Draws/DrawAdd';
import DrawEdit from '../Screens/Draws/DrawEdit';
import DrawImageUpload from '../Screens/Draws/DrawImageUpload';
import DrawExtend from '../Screens/Draws/DrawExtend';

const Stack = createStackNavigator()

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Draw'
                component={DrawPage}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name='Draw Detail'
                component={DrawDetails}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name='Add'
                component={DrawAdd}
                options={{
                    headerShown: true,
                }}
            />
            <Stack.Screen 
                name='Images'
                component={DrawImageUpload}
                options={{
                    headerShown: true,
                }}
            />
            <Stack.Screen 
                name='Edit'
                component={DrawEdit}
                options={{
                    headerShown: true,
                }}
            />
             <Stack.Screen 
                name='Extend'
                component={DrawExtend}
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