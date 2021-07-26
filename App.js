import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import { LogBox, Pressable, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";

// Redux
import { Provider } from "react-redux"; // makes the Redux store available to the rest of your app
import store from "./Redux/store";

// Context API
import Auth from "./Context/store/Auth";

// Navigatiors
import Main from "./Navigators/Main";

// Screens
import Header from "./Shared/Header";

import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import Constants from 'expo-constants';

import AsyncStorage from "@react-native-community/async-storage";

//context
import AuthGlobal from "./Context/store/AuthGlobal";

LogBox.ignoreAllLogs(true);

// this is for ForeGround Alert
Notifications.setNotificationHandler({
  handleNotification: () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

export default function App() {
  const context = useContext(AuthGlobal);
  const [expoPushToken, setExpoPushToken] = useState('');

  const checkPermissionsForiOS = async () => {
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          return Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        return statusObj;
      })
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          throw new Error("Permission not granted");
          return;
        }
      })
      .then(() => {
        return Notifications.getExpoPushTokenAsync();
      })
      .then((res)=>{
        console.log(res.data);
        AsyncStorage.setItem("push_id",token);
      })
      .catch((err) => {
        return null;
      });
  };

  async function registerForPushNotificationsAsync() {
    let token;
    if (true) {
      //if(Constants.isDevice)
  
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        //alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      //alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }  

  useEffect(() => {
    console.log('App,useEffect');
    //registerForPushNotificationsAsync().then(token => {setExpoPushToken(token); AsyncStorage.setItem("push_id",token);console.log('push_token',token)});
    checkPermissionsForiOS();
    
    const backgroundSub = Notifications.addNotificationResponseReceivedListener(
      (notification) => {
        //console.log("notification", notification);
      }
    );

    const foregroundSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        //console.log("notification", notification);
      }
    );

    return () => {
      foregroundSub.remove;
      backgroundSub.remove;
      setExpoPushToken();
    };
  });

  const navigationRef = React.useRef(null);


// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

  const gotoWalletHandler = async () =>{
    navigationRef.current?.navigate('Accounts');
    //await sendPushNotification(expoPushToken);
  };

  const gotoAlertHandler = async () =>{
    navigationRef.current?.navigate('Alerts');
    //await sendPushNotification(expoPushToken);
  };

  

  const gotoProfileHandler = () =>{
    console.log('gotoProfileHandler');
    navigationRef.current?.navigate('Me');
  };

  const onReadyHandler = () => {
    console.log('onReadyHandler');
  }

  return (
    <Auth>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef} onReady={onReadyHandler}>
          <Header wallet={gotoWalletHandler} profile={gotoProfileHandler} alert={gotoAlertHandler}/>
          <Main />
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </Provider>
    </Auth>
  );
}
