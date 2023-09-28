import React, { Component } from "react";

import {
    NavigationContainer
} from "@react-navigation/native";

/**
 * creators
 */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
/**
 * theme
 */

import { theme } from "../constants/theme";

/**
 * TabBar
 */
import TabBar from '../components/TabBar';

/**
 * navigation service
 */

import NavigationService from "../api/NavigationService"
/**
 * screens
 */
import ProfileScreen from "./ProfileScreen";
import LoginScreen from "./LoginScreen";
//import HomeScreen from "./HomeScreen";
import EditUserInfoScreen from "./EditUserInfoScreen";
import MyOrdersScreen from "./MyOrdersScreen";
import OrderScreen from "./OrderScreen";
import SplashScreen from "./SplashScreen";
import SettingsScreen from "./Settigns";
import AutoCompleteAddressScreen from "./AutoCompleteAddressScreen";
import ShowOrderScreen from "./ShowOrderScreen";
import { inject, observer } from "mobx-react";
import { observable } from "mobx";
import SignupScreen from "./SignupScreen";
import PaiementScreen from "./PaiementScreen";
import About from "./About";
import Share from "./Share";
import Help from "./Help";
import OrderValidationScreen from "./OrderValidationScreen";
import { strings } from "../lang";
import CloseBtn from "../commons/CloseBtn";


const Stack = createStackNavigator();
const Tabs = createBottomTabNavigator();

/*

*/

const primaryHeader = {
    headerStyle: {
        backgroundColor: theme.color.goldDark,
    },
    headerTintColor: theme.color.white,
    headerTitleStyle: {
        fontWeight: '400',
    },
};


const AuthNavigator = () => {
    return (
        <Stack.Navigator headerMode="node">
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
    )
}

const ShowOrderStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerTintColor: theme.color.goldDarker,
            headerBackTitle: null,
            headerTitleStyle: {
                color: theme.color.black
            }
        }}
    >
        <Stack.Screen name="ShowOrder" component={ShowOrderScreen} />
        <Stack.Screen name="ValidatOrder" component={OrderValidationScreen} />
    </Stack.Navigator>
)
const PaiementStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerTintColor: theme.color.goldDarker,
            headerBackTitle: null,
            headerTitleStyle: {
                color: theme.color.black
            }
        }}
    >
        <Stack.Screen name="Payment" component={PaiementScreen} />
    </Stack.Navigator>
)
const ProfileStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTintColor: theme.color.goldDarker,
                headerBackTitle: null,
                headerTitleStyle: {
                    color: theme.color.black
                }
            }}
        >
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="EditUserInfo" component={EditUserInfoScreen} />
        </Stack.Navigator>)
}
/*
const HomeStack = () => {
    return (
        <Stack.Navigator

            screenOptions={{
                ...primaryHeader
            }}

        >
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    )
}*/

const OrderStack = () => {
    return (
        <Stack.Navigator
            // screenOptions={{
            //     headerTintColor: theme.color.goldDarker,
            //     headerBackTitle: null,
            //     headerTitleStyle: {
            //         color: theme.color.black
            //     }
            // }}
            screenOptions={{
                ...primaryHeader
            }}
        >
            <Stack.Screen name="Order" component={OrderScreen} />
            <Stack.Screen name="AutoCompleteAddress" component={AutoCompleteAddressScreen} options={({ navigation }) => ({
                title: strings.searchAddress,
                headerLeft: () => (<CloseBtn color={theme.color.white} left size={25} onPress={() => navigation.goBack(null)} />),
            })} />

        </Stack.Navigator>
    )
}

const MyOrdersStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                ...primaryHeader
            }}
        >
            <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
        </Stack.Navigator>
    )
}

const TabNavigator = inject("CurrentUser")(({ CurrentUser }) => {
    return (
        <Tabs.Navigator
            tabBar={props => { return <TabBar {...props} /> }}
        >
            {/*<Tabs.Screen name="Home" component={HomeStack} />*/}
            <Tabs.Screen name="MyOrders" component={MyOrdersStack} />
            {CurrentUser.info.role.id === 2 && <Tabs.Screen name="Order" component={OrderStack} />}
        </Tabs.Navigator>
    )
})

const AboutStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
)
const ShareStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name="Share" component={Share} />
    </Stack.Navigator>
)
const HelpStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <Stack.Screen name="Help" component={Help} />
    </Stack.Navigator>
)
const MainNavigator = () => {
    return (
        <Stack.Navigator headerMode='none' mode="modal">
            <Stack.Screen name="Tab" component={TabNavigator} />
            <Stack.Screen name="Profile" component={ProfileStack} />
            <Stack.Screen name="ShowOrder" component={ShowOrderStack} />
            <Stack.Screen name="Payment" component={PaiementStack} />
            <Stack.Screen name="About" component={AboutStack} />
            <Stack.Screen name="Share" component={ShareStack} />
            <Stack.Screen name="Help" component={HelpStack} />
        </Stack.Navigator>
    )
}

const authCheck = observable({
    isLogedIn: false,
    isLoading: true,
});

const AppNavigator = inject("CurrentUser")(observer(({ CurrentUser }) => {

    authCheck.isLogedIn = CurrentUser.isLogedIn;
    authCheck.isLoading = CurrentUser.isLoading;
    return (
        <Stack.Navigator headerMode="none" initialRouteName="Splash">
            {authCheck.isLoading &&
                <Stack.Screen name="Splash" component={SplashScreen} />
            }
            {authCheck.isLogedIn === false ?
                <>
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                </>
                :
                <Stack.Screen name="Main" component={MainNavigator} />}
        </Stack.Navigator>
    )
}))

//Creating the navigation reference 
NavigationService.setTopLevelNavigator(React.createRef())
@inject("CurrentUser")
class Navigation extends Component {


    render() {

        return (
            <NavigationContainer ref={NavigationService._navigator}>
                <AppNavigator isLogedIn={this.props.CurrentUser.isLogedIn} />
            </NavigationContainer>
        )
        //   return <AppNavigator />;
    }
}

export default Navigation;