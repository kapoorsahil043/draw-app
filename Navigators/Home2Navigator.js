import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import DrawContainer from "../Screens/Draws/DrawContainer";
import DrawDetails from "../Screens/Draws/DrawDetails"

const Stack = createStackNavigator()

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Home'
                component={DrawContainer}
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

export default function Home2Navigator(navigation) {
    //console.log('navigation',navigation);
    /* if(navigation){
        navigation.navigation.setOptions({tabBarVisible: true})
        if(navigation.route && navigation.route.state.index && navigation.route.state.index && navigation.route.state.index==1){
            navigation.navigation.setOptions({tabBarVisible: false})
        }
    } */
    return <MyStack />;
}