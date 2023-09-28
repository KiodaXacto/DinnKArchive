import React, { Component } from 'react';
import { Box, Text } from 'react-native-design-utility';
import { StatusBar, ActivityIndicator, FlatList, RefreshControl } from 'react-native';

import { inject, observer } from "mobx-react"
import { observable, action } from 'mobx';
import { theme } from '../constants/theme';
import OrderListItem from '../components/OrderListItem';
import ProfileBtn from '../commons/ProfileBtn';
import { strings } from '../lang';

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
@observer
class MyOrdersScreen extends Component {

    constructor(props) {
        super(props);
        const lang = strings;
        props.navigation.setOptions({
            title: lang.myOrders,
            headerLeft: () => (<ProfileBtn />)
        })
        this.state = {
            isLoading: false
        }
        this._handleNotification = this._handleNotification.bind(this);
        this._handleNotificationResponse = this._handleNotificationResponse.bind(this);
    }

    async componentDidMount() {
        await this.fetchOrders();
        if(!this.state.isLoading){
            Notifications.addNotificationReceivedListener(this._handleNotification);
            Notifications.addNotificationResponseReceivedListener(this._handleNotificationResponse);
        }
    }

    @action.bound
    async fetchOrders() {
        try {
            this.setState({
                isLoading: true,
            })
            //await this.props.CurrentUser.info.getUserOrders();
            const { CurrentUser } = this.props;
            console.log("testing loader");
            await CurrentUser.loadOrders();
            this.setState({
                isLoading: false,
            })
        } catch (error) {
            console.log(error)
        }
    }

    _handleNotification = notification => {
        console.log("handle notification", notification);
    };

    _handleNotificationResponse = response => {
        this.fetchOrders();
        console.log("fetching orders")
    };

    renderIfEmpty = () => {
        return (
            <Box f={1} bg="white" center>
                <Text size="xl" center color="goldDarker">No Orders</Text>
            </Box>
        )
    }

    handlRefresh() {
        this.setState({
            isLoading: true,
        });
        this.fetchOrders();
        this.setState({
            isLoading: false
        })

    }

    render() {
        const { CurrentUser: user } = this.props;
        if (!user.info) { return <></> }
        if (!user.orders) { return <></> }
        //if (this.state.isLoading) { return this.renderIfEmpty() }

        return (
            <FlatList
                style={{
                    padding: 10,
                    backgroundColor: theme.color.white
                }}
                //     data={user.info.orders.slice().reverse()}
                data={user.orders.orders.slice()}
                renderItem={item => (<OrderListItem order={item.item} />)}
                keyExtractor={(item) => item["id"]}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={() => this.handlRefresh.bind(this)()}
                        tintColor={theme.color.goldLight}
                    />
                }
                ListFooterComponent={this.renderFooter.bind(this)}
                onEndReachedThreshold={0.1}
                onEndReached={this.handleLoadMore.bind(this)}

            />
        );
    }
    renderFooter() {
        const { CurrentUser: user } = this.props;
        return (
            user.orders.hasMore &&
            < Box f={1} center p="md" >
                <ActivityIndicator size="large" color={theme.color.goldLight} />
            </Box >
        )
    }
    async handleLoadMore() {
        console.log("loading next");
        const { CurrentUser: user } = this.props;
        await user.orders.getNext()
    }
}

export default inject("CurrentUser")(MyOrdersScreen);