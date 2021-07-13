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
import UserDrawNavigator from "./UserDrawNavigator";
import LoginNavigator from "./LoginNavigator";
import * as constants from '../assets/common/constants';


const Tab = createBottomTabNavigator();

const Main = () => {
  const context = useContext(AuthGlobal);

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

  return (
    <Tab.Navigator
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
        component={UserDrawNavigator}
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
  );
};

export default Main;
