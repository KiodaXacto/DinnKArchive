
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Platform } from "react-native"
let Notifications
//import { Notifications  } from "expo";

if (Platform.OS === "android") {
    const expo = require("expo");
    Notifications = expo.Notifications;
} else {
    //    import * as notif from 'expo-notifications';
    Notifications = require("expo-notifications")
}
export const registerForPushNotificationsAsync = async () => {

    let token = null
    if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = await Notifications.getExpoPushTokenAsync();

    }

    if (Platform.OS === 'android') {
        Notifications.createChannelAndroidAsync('default', {
            name: 'default',
            sound: true,
            priority: 'max',
            vibrate: [0, 250, 250, 250],
        });
    }
    console.log("expo notifications: ", token);
    return token;
};