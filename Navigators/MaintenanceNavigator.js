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
import * as constants from '../assets/common/constants';
import DrawAdd from "../Screens/Draws/DrawAdd"
import DrawImageUpload from "../Screens/Draws/DrawImageUpload"
import DrawEdit from "../Screens/Draws/DrawEdit"
import DrawExtend from "../Screens/Draws/DrawExtend"
import Testing from "../Screens/User/Testing"
import MaintenancePage from "../Screens/Draws/MaintenancePage"
import DrawPage from "../Screens/Draws/DrawPage"

const Stack = createStackNavigator();

function MyStack(props) {
    const {item} = props;

    useEffect(()=>{
        
    });

    const activeHeaderStyle = () => {
        return {headerTintColor:"white",headerStyle: {backgroundColor: constants.COLOR_RED}}
    }

    return (
        <Stack.Navigator>
            <Stack.Screen name='Draw'component={DrawPage} options={activeHeaderStyle}/>
            <Stack.Screen name='Maintenance'component={MaintenancePage} options={activeHeaderStyle}/>
        </Stack.Navigator>
    )
}

export default function MaintenanceNavigator(props) {
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