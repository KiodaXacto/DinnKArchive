import React, { Component } from 'react';
import { Box, Text } from 'react-native-design-utility';
import CloseBtn from '../commons/CloseBtn';
import { strings } from '../lang';
import { theme } from '../constants/theme';
import { Fontisto, MaterialIcons, FontAwesome5, Entypo, FontAwesome } from '@expo/vector-icons';
import Button from '../commons/Button';
import { action } from 'mobx';
import { inject, observer } from 'mobx-react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
@inject("CurrentUser")
@observer
class ShowOrderScreen extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let lang = this.context;
        if (strings) { lang = strings }
        this.props.navigation.setOptions({
            title: lang.ShowOrderTitle,
            headerLeft: () => (<CloseBtn color={theme.color.goldDarker} left size={25} onPress={() => this.props.navigation.goBack(null)} />),
            //  headerRight: () => (<CloseBtn color={theme.color.goldDarker} name="trash" right size={30} onPress={this.deleteOrder.bind(this)} />),
        })
    }

    async deleteOrder() {
        const { order } = this.props.route.params;
        order.deleteOrder();
    }
    @action.bound
    async endOrder() {
        const { order } = this.props.route.params
        await order.end({ statut: "/api/statuts/4" });
        this.setState({});
    }

    async showProfile(id) {
        const { CurrentUser: user } = this.props;
        if (Number.parseInt(id) === Number.parseInt(user.id)) { return };
        try {
            await user.consulteUser(id);
            this.props.navigation.navigate("Profile", {
                screen: "EditUserInfo",
                params: {
                    isMe: false,
                }
            })

        } catch (error) {
            console.log(error);
        }
    }

    validate() {
        this.props.navigation.navigate('ValidatOrder', {
            order: this.props.route.params.order
        });
    }

    accept() {

    }

    decline() {

    }
    render() {
        const { order } = this.props.route.params
        console.log(order);
        const { CurrentUser: user } = this.props
        const lang = strings;
        return (
            <ScrollView style={styles.container}>
                <Box f={1} bg={theme.color.white} p="md" >
                    <Box dir="row" align="center" mb="md" mt="xl">
                        <Box f={0.2}><Fontisto name="origin" {...baseIconStyle} /></Box>

                        <Box f={1}>
                            <Text
                                size="md"
                                weight="bold"
                            >{order.origine}</Text>
                        </Box>
                    </Box>
                    <Box dir="row" align="center" mb="md">
                        <Box f={0.2}><Fontisto name="map-marker-alt" {...baseIconStyle} /></Box>

                        <Box f={1}>
                            <Text
                                size="md"
                                weight="bold"
                            >{order.destination}</Text>
                        </Box>
                    </Box>
                    {order.commentaire &&
                        <Box dir="row" align="center" mb="md" >
                            <Box f={0.2}><FontAwesome name="comments"  {...baseIconStyle} /></Box>

                            <Box f={1} bg={theme.color.greyLightest} p="xs">
                                <Text
                                    size="md"
                                    weight="bold"
                                >{order.commentaire}</Text>
                            </Box>
                        </Box>}
                    <Box dir="row" align="center" mb="md">
                        <Box f={0.2}><FontAwesome5 name="user-tie"  {...baseIconStyle} /></Box>

                        <Box f={1}>
                            <TouchableOpacity onPress={() => this.showProfile.bind(this)(order.client.id)}>
                                <Text size="md" weight="bold" >{`${order.client.prenom[0]}. ${order.client.nom}`}</Text>
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    {order.livreur && <Box dir="row" align="center" mb="md">
                        <Box f={0.2}><Fontisto name="opencart" {...baseIconStyle} /></Box>

                        <Box f={1}>
                            <TouchableOpacity onPress={() => this.showProfile.bind(this)(order.livreur.id)}>
                                <Text size="md" weight="bold" >{`${order.livreur.prenom[0]}. ${order.livreur.nom}`}</Text>
                            </TouchableOpacity>
                        </Box>
                    </Box>}
                    <Box dir="row" align="center" mb="md">
                        <Box f={0.2}><MaterialIcons name="update" {...baseIconStyle} /></Box>

                        <Box f={1}>
                            <Text
                                size="md"
                                weight="bold"
                            >{(new Date(order.createdAt)).toString().split("GMT")[0]}</Text>
                        </Box>
                    </Box>
                    <Box dir="row" align="center">
                        <Box f={0.2}>
                            {
                                order.statut.id === "/api/statuts/1" && <Entypo name="progress-empty" {...baseIconStyle} /> ||
                                order.statut.id === "/api/statuts/2" && <Entypo name="progress-one" {...baseIconStyle} /> ||
                                order.statut.id === "/api/statuts/3" && <Entypo name="progress-two" {...baseIconStyle} /> ||
                                order.statut.id === "/api/statuts/4" && <Entypo name="progress-full" {...baseIconStyle} />

                            }

                        </Box>

                        <Box f={1}>
                            <Text
                                size="md"
                                weight="bold"
                            >{order.statut.libelle}</Text>
                        </Box>
                    </Box>
                    {user.info.role.id === 3 && user.info.id === order.livreur.id && order.statut.id === "/api/statuts/3" &&
                        <Button onPress={this.saveOrder} onPress={this.endOrder.bind(this)}>
                            <Text color="white" >{lang.endORderBtn}</Text>
                        </Button>
                    }

                    {order.statut.id === "/api/statuts/1" && user.info.id === order.client?.id && <Button onPress={this.saveOrder} onPress={this.validate.bind(this)}>
                        <Text color="white" >{lang.validatOrder}</Text>
                    </Button>}
                    {/* TODO: code funcitons and conditions */}
                    {false &&
                        <>
                            <Button onPress={this.saveOrder} onPress={this.accept.bind(this)}
                                style={{
                                    backgroundColor: theme.color.green,
                                    borderColor: theme.color.greenDarker
                                }}
                            >
                                <Text color="white" >{lang.acceptOrder}</Text>
                            </Button>
                            <Box mt="xs"></Box>
                            <Button onPress={this.saveOrder} onPress={this.decline.bind(this)}
                                style={{
                                    backgroundColor: theme.color.red,
                                    borderColor: theme.color.redDark
                                }}
                            >
                                <Text color="white" >{lang.declineOrder}</Text>
                            </Button>
                        </>
                    }
                </Box >
            </ScrollView>
        );
    }
}

const baseIconStyle = {
    size: 30,
    color: theme.color.grey
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.color.white
    }
})

export default ShowOrderScreen;