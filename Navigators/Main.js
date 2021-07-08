import React, { useContext, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

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

import { checkUserStatus } from "../Context/actions/Auth.actions";
import AsyncStorage from "@react-native-community/async-storage";


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

  const userStatus = ()=>{
    console.log('userStatus',context.dispatch)
    //checkUserStatus(context.dispatch);
    AsyncStorage.getItem("jwt")
    .then((jwt) => {
      //const decoded = jwt_decode(jwt)
      //console.log('decoded',decoded);
      //dispatch(setCurrentUser(decoded, {userId:decoded.userId}))
      //succussCallBack();
    })
    .catch((error) => [console.log(error)]);
  }

  useEffect(()=>{
    console.log('Main,useEffect',new Date())
    userStatus();
  })

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        keyboardHidesTabBar: true,
        showLabel: true,
        activeTintColor: "#e91e63",
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
            <Icon name="home" color={color} size={30} />
          ),
        }}
      />

      {context.stateUser.isAuthenticated && <Tab.Screen
        name="My Draw"
        component={UserDrawNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="list" color={color} size={30} />
          ),
        }}
      />}

      {context.stateUser.user.isAdmin == true && <Tab.Screen
        name="Draw"
        component={DrawNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="plus" color={color} size={30} />
          ),
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
            <Icon name="user" color={color} size={30} />
          ),
        }}
      />}
     {context.stateUser.isAuthenticated && <Tab.Screen
        name="Me"
        component={UserNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" color={color} size={30} />
          ),
        }}
      />}
    </Tab.Navigator>
  );
};

export default Main;
