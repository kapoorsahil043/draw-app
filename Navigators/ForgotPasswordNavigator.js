import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import DrawDetails from "../Screens/Draws/DrawDetails"
import DrawPage from '../Screens/Draws/DrawPage';
import DrawForm from '../Screens/Draws/DrawForm';
import DrawImageUpload from '../Screens/Draws/DrawImageUpload';
import ForgotPassword from '../Screens/ForgotPassword/ForgotPassword';
import VerifyOTP from '../Screens/ForgotPassword/VerifyOTP';
import ChangePassword from '../Screens/ForgotPassword/ChangePassword';

const Stack = createStackNavigator()

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Forgot Password'
                component={ForgotPassword}
                options={{
                    headerShown: true,
                }}
            />
            <Stack.Screen 
                name='Verify OTP'
                component={VerifyOTP}
                options={{
                    headerShown: true,
                }}
            />
            <Stack.Screen 
                name='Change Password'
                component={ChangePassword}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    )
}

export default function ForgotPasswordNavigator() {
    return <MyStack />;
}