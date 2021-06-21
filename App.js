import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { LogBox, Pressable, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";

// Redux
import { Provider } from "react-redux";
import store from "./Redux/store";

// Context API
import Auth from "./Context/store/Auth";

// Navigatiors
import Main from "./Navigators/Main";

// Screens
import Header from "./Shared/Header";

import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

LogBox.ignoreAllLogs(true);

// this is for ForeGround Alert
Notifications.setNotificationHandler({
  handleNotification: () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
    };
  },
});

export default function App() {

  const checkPermissionsForiOS = () => {
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
      .then(() => {})
      .catch((err) => {
        return null;
      });
  };

  useEffect(() => {
    checkPermissionsForiOS();
    
    const backgroundSub = Notifications.addNotificationResponseReceivedListener(
      (notification) => {
        console.log("notification", notification);
      }
    );

    const foregroundSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("notification", notification);
      }
    );

    return () => {
      foregroundSub.remove;
      backgroundSub.remove;
    };
  });

  const navigationRef = React.useRef(null);

  const gotoWalletHandler = () =>{
    console.log('gotoWalletHandler');
    navigationRef.current?.navigate('Wallet');
  };

  const onReadyHandler = () => {
    console.log('onReadyHandler');
  }

  return (
    <Auth>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef} onReady={onReadyHandler}>
        <Header wallet={gotoWalletHandler}/>
          <Main />
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </NavigationContainer>
      </Provider>
    </Auth>
  );
}
