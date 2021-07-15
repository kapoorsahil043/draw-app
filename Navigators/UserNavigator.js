import React, { useContext, useEffect, useState } from "react"
import { createStackNavigator } from '@react-navigation/stack'

import UserProfile from '../Screens/User/UserProfile'
import Wallet from "../Screens/User/Wallet"
import AuthGlobal from "../Context/store/AuthGlobal"
import Address from "../Screens/User/Address"
import AddressEdit from "../Screens/User/AddressEdit"
import Profile from "../Screens/User/Profile"
import ProfileImage from "../Screens/User/ProfileImage"
import AddressAdd from "../Screens/User/AddressAdd"
import ChangeEmail from "../Screens/User/ChangeEmail"
import ChangeEmailVerifyOtp from "../Screens/User/ChangeEmailVerifyOtp"
import ProfileChangePassword from "../Screens/User/ProfileChangePassword"
import AddCash from "../Screens/User/AddCash"
import WithdrawWinnings from "../Screens/User/WithdrawWinnings"
import TransactionHistory from "../Screens/User/TransactionHistory"

const Stack = createStackNavigator();

function MyStack(props) {
    const {item} = props;

    useEffect(()=>{
        
    });

    return (
        <Stack.Navigator>
             <Stack.Screen 
                name="Settings"
                component={UserProfile}
                options={{
                    headerShown: false
                }}
            />
              <Stack.Screen 
                name="Accounts"
                component={Wallet}
                options={{
                    headerShown: true
                }}
            />
             <Stack.Screen 
                name="Transaction History"
                component={TransactionHistory}
                options={{
                    headerShown: true
                }}
            />
             <Stack.Screen 
                name="Add Cash"
                component={AddCash}
                options={{
                    headerShown: true
                }}
            />
               <Stack.Screen 
                name="Withdraw Winnings"
                component={WithdrawWinnings}
                options={{
                    headerShown: true
                }}
            />

             <Stack.Screen 
                name="Address"
                component={Address}
                options={{
                    headerShown: true
                }}
            />
              <Stack.Screen 
                name="Edit Address"
                component={AddressEdit}
                options={{
                    headerShown: true
                }}
            />
               <Stack.Screen 
                name="Add Address"
                component={AddressAdd}
                options={{
                    headerShown: true
                }}
            />
             <Stack.Screen 
                name="Profile"
                component={Profile}
                options={{
                    headerShown: true
                }}
            />
             <Stack.Screen 
                name="Change Email"
                component={ChangeEmail}
                options={{
                    headerShown: true
                }}
            />
             <Stack.Screen 
                name="Verify Email OTP"
                component={ChangeEmailVerifyOtp}
                options={{
                    headerShown: true
                }}
            />

            <Stack.Screen 
                name="Change Password"
                component={ProfileChangePassword}
                options={{
                    headerShown: true
                }}
            />

             <Stack.Screen 
                name="Profile Image"
                component={ProfileImage}
                options={{
                    headerShown: true
                }}
            />
        </Stack.Navigator>
    )
}

export default function UserNavigator(props) {
    //console.log('props.item>>',props.route.state.routes);
    //let userProfile; 
    /* if(props?.route?.state?.routes){
        props.route.state.routes.array.forEach(element => {
            if(element.name == "Address"){
                address = element.params;
            }
        });
    } */
    //console.log('UserNavigator',navigation?.route?.params?.goto);
    //let goto = navigation.route.params.goto;
    return <MyStack item = {props}/>;
}