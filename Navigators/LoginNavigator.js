import React, { useContext } from "react"
import { createStackNavigator } from '@react-navigation/stack'

import Login from '../Screens/User/Login'
import Register from '../Screens/User/Register'
import UserProfile from '../Screens/User/UserProfile'
import Wallet from "../Screens/User/Wallet"
import ForgotPasswordNavigator from "./ForgotPasswordNavigator"
import AuthGlobal from "../Context/store/AuthGlobal"

const Stack = createStackNavigator();

function MyStack() {
    const context = useContext(AuthGlobal);

    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Login"
                component={Login}
                options={{
                    headerShown: false
                }}
            />
             <Stack.Screen 
                name="Register"
                component={Register}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name="Forgot Password"
                component={ForgotPasswordNavigator}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

export default function LoginNavigator() {
    return <MyStack />
}