import React, { useContext, useEffect, useState } from "react"
import { createStackNavigator } from '@react-navigation/stack'

import Login from '../Screens/User/Login'
import Register from '../Screens/User/Register'
import UserProfile from '../Screens/User/UserProfile'
import Wallet from "../Screens/User/Wallet"
import ForgotPasswordNavigator from "./ForgotPasswordNavigator"
import AuthGlobal from "../Context/store/AuthGlobal"

const Stack = createStackNavigator();

function MyStack() {
    useEffect(()=>{
        
    });

    return (
        <Stack.Navigator>
             <Stack.Screen 
                name="User Profile"
                component={UserProfile}
                options={{
                    headerShown: false
                }}
            />
              <Stack.Screen 
                name="Wallet"
                component={Wallet}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

export default function UserNavigator(navigation) {
    console.log('UserNavigator',navigation?.route?.params?.goto);
    //let goto = navigation.route.params.goto;
    return <MyStack/>
}