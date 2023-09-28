//@refresh state

import React from 'react';
import { ActivityIndicator, AsyncStorage, LogBox } from 'react-native';
import { UtilityThemeProvider, Box } from 'react-native-design-utility';

import Navigation from './src/screens';
import { images, tabBarIcons, card } from './src/constants/images';
import { cacheImages } from './src/utils/cacheImages';
import { theme } from "./src/constants/theme";


import { Provider } from "mobx-react";

import { store } from "./src/models";

import { registerForPushNotificationsAsync } from "./src/utils/pushNotifPremission";
//firebase/firestore
//FireStore
import * as firebase from 'firebase'
import 'firebase/firestore';

import { NOTIF_TOKEN } from "./src/constants";

let Notifications
//import { Notifications  } from "expo";

if (Platform.OS === "android") {
  const expo = require("expo");
  Notifications = expo.Notifications;
} else {
  //    import * as notif from 'expo-notifications';
  Notifications = require("expo-notifications")
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  })
});

const firebaseConfig = {
  apiKey: "AIzaSyB6h-QuvloaoPrHX8twTwKXQvr0kOXCHFg",
  authDomain: "dinnkexpo.firebaseapp.com",
  databaseURL: "https://dinnkexpo.firebaseio.com",
  projectId: "dinnkexpo",
  storageBucket: "dinnkexpo.appspot.com",
  messagingSenderId: "110034215776",
  appId: "1:110034215776:web:0f632133d51d705ed2f405",
  measurementId: "G-8H1ZRG3NQH"
};

import { configure } from "mobx"
import { strings } from './src/lang';
import { notify } from './src/api/API';

configure({
  enforceActions: "never",
})

LogBox.ignoreAllLogs(true);

// Initialize Firebase
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}


export default class App extends React.Component {
  state = {
    isReady: false,
  };

  constructor(props) {
    super(props);
    this._handleNotification = this._handleNotification.bind(this);
    this._handleNotificationResponse = this._handleNotificationResponse.bind(this);
  }

  async componentDidMount() {

    this.cacheAssets();
    try {
      const token = await registerForPushNotificationsAsync();


      let tkn = typeof token == "string" ? token : token.data;
      //Test
      const notiData = {
        "to": tkn,
        "sound": "default",
        ...strings.helloNotification
      }

      const send = await notify
        .url("/send")
        .post(notiData)
        .json();
      if (send.data.status == "ok" || send.data.id) {
        const getReceipts = await notify
          .url("/getReceipts")
          .post({
            ids: [send.data.id]
          })
          .json()
        console.log("getReceipts: ", getReceipts);
      }
      let Notifications
      //import { Notifications  } from "expo";

      if (Platform.OS === "android") {
        const expo = require("expo");
        Notifications = expo.Notifications;
      } else {
        //    import * as notif from 'expo-notifications';
        Notifications = require("expo-notifications")
      }
      if (Notifications) {

        Notifications.addNotificationReceivedListener(this._handleNotification);
        Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
      }

      await AsyncStorage.setItem(NOTIF_TOKEN, tkn);
    } catch (error) {
      console.log(error);
    }
  }

  _handleNotification = notification => {
    console.log("handle notification");
  };

  _handleNotificationResponse = response => {
    console.log(response, "noureddine response");
  };

  cacheAssets = async () => {
    const imagesAssets = cacheImages(Object.values({
      ...Object.values(images),
      ...Object.values(tabBarIcons.active),
      ...Object.values(tabBarIcons.inactive),
      ...Object.values(card),
    }));

    await Promise.all([...imagesAssets]);

    this.setState({ isReady: true });
  };

  render() {
    if (!this.state.isReady) {
      return (
        <Box f={1} center bg="white">
          <ActivityIndicator size="large" />
        </Box>
      );
    }
    return (
      <Provider {...store}>
        <UtilityThemeProvider theme={theme}>
          <Navigation />
        </UtilityThemeProvider>
      </Provider>
    );
  }
}