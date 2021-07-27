import React, { useContext, useEffect } from "react";
import {
  StyleSheet,
  Image,
  SafeAreaView,
  View,
  Text,
  Pressable,
} from "react-native";


import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack'

import Icon from "react-native-vector-icons/FontAwesome";
import IconSimple from "react-native-vector-icons/SimpleLineIcons";

// Stacks
import HomeNavigator from "./HomeNavigator";
import Home2Navigator from "./Home2Navigator";
import DrawNavigator from "./DrawNavigator";
import CartNavigator from "./CartNavigator";
import UserNavigator from "./UserNavigator";
import AdminNavigator from "./AdminNavigator";

import CartIcon from "../Shared/CartIcon";
import AuthGlobal from "../Context/store/AuthGlobal";
import LoginNavigator from "./LoginNavigator";
import * as constants from '../assets/common/constants';
import Wallet from "../Screens/User/Wallet";
import DrawDetails from "../Screens/Draws/DrawDetails";
import DrawAdd from "../Screens/Draws/DrawAdd";
import DrawImagePage from "../Screens/Draws/DrawImagePage";
import DrawEdit from "../Screens/Draws/DrawEdit";
import DrawExtend from "../Screens/Draws/DrawExtend";
import Testing from "../Screens/User/Testing";
import AddressAdd from "../Screens/User/AddressAdd";
import AddressEdit from "../Screens/User/AddressEdit";
import Address from "../Screens/User/Address";
import ProfileImage from "../Screens/User/ProfileImage";
import ProfileChangePassword from "../Screens/User/ProfileChangePassword";
import ChangeEmail from "../Screens/User/ChangeEmail";
import Profile from "../Screens/User/Profile";
import ChangeEmailVerifyOtp from "../Screens/User/ChangeEmailVerifyOtp";
import WithdrawWinnings from "../Screens/User/WithdrawWinnings";
import AddCash from "../Screens/User/AddCash";
import TransactionHistory from "../Screens/User/TransactionHistory";
import AccountNavigator from "./AccountNavigator";
import AddressNavigator from "./AddressNavigator";
import ProfileNavigator from "./ProfileNavigator";
import MaintenancePage from "../Screens/Draws/MaintenancePage";
import MaintenanceNavigator from "./MaintenanceNavigator";
import MyDrawNavigator from "./MyDrawNavigator";
import NotificationNavigator from "./NotificationNavigator";
import MyAlert from "../Shared/MyAlert";
import Description from "../Shared/Description";
import DrawImageAdd from "../Screens/Draws/DrawImageAdd";


const Tab = createBottomTabNavigator();

function HomeTabs(){
  const context = useContext(AuthGlobal);

  return (<Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          keyboardHidesTabBar: true,
          //showLabel: true,
          inactiveTintColor: "black",
          activeTintColor:"white",
          activeBackgroundColor:constants.COLOR_RED,
          
        }}
      >
        {/* <Tab.Screen
          name="Home2"
          component={HomeNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="home" color={color} size={30} />
            ),
          }}
        /> */}

        <Tab.Screen
          name="Home"
          component={Home2Navigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="home" color={color} size={25} />
            ),
          }}
        />

        {context.stateUser.isAuthenticated && <Tab.Screen
          name="My Draw"
          component={MyDrawNavigator}
          options={{
            tabBarIcon: ({ color,focused }) => (
              <View>
                <Image
              source={focused ? require("../assets/youth_icon_hover.png") : require("../assets/youth_icon.png") }
              resizeMode="contain"
              style={{height: 25, width: 25 }}
            />
              </View>
            ),
          }}
        />}

        {context.stateUser.user.isAdmin == true && <Tab.Screen
          name="Draw"
          component={DrawNavigator}
          options={{
            tabBarIcon: ({ color,focused }) => (
              <View>
                  <Image
                  source={focused ? require("../assets/dashboard_icon_hover.png") : require("../assets/dashboard_icon.png")}
                  style={{height: 25, width: 25 }}
                  />
              </View>
            ),
            showLabel: false,
          }}
        />}

        {/* <Tab.Screen
          name="Cart"
          component={CartNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <View>
                <Icon name="shopping-cart" color={color} size={30} />
                <CartIcon />
              </View>
            ),
          }}
        />

        {context.stateUser.user.isAdmin == true ? (
          <Tab.Screen
            name="Admin"
            component={AdminNavigator}
            options={{
              tabBarIcon: ({ color }) => (
                <Icon name="cog" color={color} size={30} />
              ),
            }}
          />
        ) : null} */}

      { !context.stateUser.isAuthenticated && <Tab.Screen
          name="SignIn"
          component={LoginNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="user" color={color} size={25} />
            ),
          }}
        />}
      {context.stateUser.isAuthenticated && <Tab.Screen
          name="Me"
          component={UserNavigator}
          options={{
            tabBarIcon: ({ color,focused }) => (
              <View>
                <Image
              source={focused ? require("../assets/updateprofile_icon_hover.png") : require("../assets/updateprofile_icon.png") }
              resizeMode="contain"
              style={{height: 25, width: 25 }}
            />
              </View>
            ),
          }}
        />}
      </Tab.Navigator>
  )
}

const Stack = createStackNavigator();

const Main = () => {
  const succussCallBack =()=>{
    console.log('succussCallBack')
   // props.navigation.navigate("Me");  
  }

  const errorCallBack =()=>{
    console.log('errorCallBack')
    //setLoading(false);  
  }

  useEffect(()=>{
    console.log('Main,useEffect')
  })

  const activeHeaderStyle = () => {
    return {headerTintColor:"white",headerStyle: {backgroundColor: constants.COLOR_RED}}
  }

  return (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeTabs}  options={{headerShown: false,}} />
        <Stack.Screen name="Draw Details" component={DrawDetails} options={activeHeaderStyle} />
        <Stack.Screen name="Add Cash" component={AddCash} options={activeHeaderStyle}/>
        <Stack.Screen name="Alerts" component={MyAlert} options={activeHeaderStyle}/>
        <Stack.Screen name="Description" component={Description} options={activeHeaderStyle}/>

        <Stack.Screen name='Add'component={DrawAdd} options={activeHeaderStyle}/>
        <Stack.Screen name='Edit'component={DrawEdit} options={activeHeaderStyle}/>
        <Stack.Screen name='Extend'component={DrawExtend} options={activeHeaderStyle}/>
        <Stack.Screen name="Testing"component={Testing} options={activeHeaderStyle}/>

        <Stack.Screen name='Images'component={DrawImagePage} options={activeHeaderStyle}/>
        <Stack.Screen name='Add Image'component={DrawImageAdd} options={activeHeaderStyle}/>
        
        
        <Stack.Screen name='Maintenance'component={MaintenanceNavigator} options={{headerShown: false}}/>
        <Stack.Screen name='Notification'component={NotificationNavigator} options={{headerShown: false}}/>

        <Stack.Screen name="Profile Image"component={ProfileImage} options={activeHeaderStyle}/>

        <Stack.Screen name="Profile"component={ProfileNavigator} options={{headerShown: false}}/>
        <Stack.Screen name="Address"component={AddressNavigator} options={{headerShown: false}}/>
        <Stack.Screen name="Accounts"component={AccountNavigator} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}

export default Main;
