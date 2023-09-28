import { Entypo, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import React, { Component } from 'react';
import { Alert, KeyboardAvoidingView } from "react-native"
import { Box, Text } from 'react-native-design-utility';
import Button from '../commons/Button';
import CloseBtn from '../commons/CloseBtn';
import LoginInput from '../commons/LoginInput';
import Modal from '../commons/Modal';
import { theme } from '../constants/theme';
import { strings as lang } from '../lang';

class OrderValidationScreen extends Component {

    state = {
        coupon: "",
        couponIRI: "",
        couponIsValide: false,
        amount: 6,
        devise: "Euro",
        showCopon: false,
        percent: 0
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            title: lang.ValidatOrderTitle,
            headerLeft: () => (<CloseBtn color={theme.color.goldDarker} left size={25} onPress={() => this.props.navigation.goBack(null)} />),
        })
    }

    pay() {
        // await this.props.route.params.order.getUserFirestoreToken();
        //return;
        this.props.navigation.popToTop();
        this.props.navigation.navigate('Payment', {
            screen: 'Payment',
            params: {
                order: this.props.route.params.order,
                coupon: this.state.couponIsValide ?  this.state.couponIRI: undefined
            }
        });
    }

    async saveCoupon() {
        const { order } = this.props.route.params;
        try {
            const data = {code: this.state.coupon};
            const coupon = await order.checkCoupon(data);
            if (coupon) {
                console.log(coupon);
                this.setState({
                    percent: coupon.pourcentage,
                    couponIRI:coupon["@id"],
                })
                this.stateSetter("couponIsValide", true),
                    this.toggleModal();
            } else {
                console.log("coupon invalide");
                this.setState({
                    percent: 0,
                    couponIRI:"",
                })
                this.stateSetter("couponIsValide", false),
                Alert.alert("Opss!!", lang.errorCoupon);
            }
        } catch (error) {
            console.log("saveCoupon: ", error)
        }
    }
    render() {
        const { order } = this.props.route.params;

        return (
            <Box f={1} bg={theme.color.white} px="md" >
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
                <Box dir="row" align="center" mb="md">
                    <Box f={0.2}><MaterialIcons name="update" {...baseIconStyle} /></Box>

                    <Box f={1}>
                        <Text
                            size="md"
                            weight="bold"
                        >{(new Date(order.createdAt)).toString().split("GMT")[0]}</Text>
                    </Box>
                </Box>
                <Box dir="row" align="center" mb="md">
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
                <Box mb="sm" dir="row" align="center">
                    <Box f={0.2}>
                        <Fontisto name="money-symbol" {...baseIconStyle} />
                    </Box>

                    <Box f={1}>
                        <Text
                            size="md"
                            weight="bold"
                        >{`${this.state.amount} ${this.state.devise}`}</Text>
                    </Box>
                </Box>
                {this.state.coupon.trim() !== "" &&
                    <Box mb="sm" dir="row" align="center">
                        <Box f={0.2}>
                            <MaterialCommunityIcons name="ticket-percent" {...baseIconStyle} />
                        </Box>

                        <Box f={1} dir="row" >
                            <Text
                                size="md"
                                weight="bold"
                            >{this.state.coupon}</Text>
                            <Text
                                size="md"
                                weight="bold"
                                px="md"
                            >{`-${this.state.percent}%`}</Text>
                        </Box>
                    </Box>}
                <Box center>
                    <Button onPress={this.pay.bind(this)}>
                        <Text color="white" >{lang.payOrder}</Text>
                    </Button>
                    <Box mb="xs"></Box>
                    <Button style={{
                        backgroundColor: theme.color.greyLight,
                        borderColor: theme.color.greyDarkest,
                    }} onPress={this.saveOrder} onPress={this.toggleModal.bind(this)}>
                        <Text color="white" >{`${lang.useCoupon}`}</Text>
                    </Button>
                </Box>
                <Modal closeFunc={this.closeModal.bind(this)} show={this.state.showCopon}>
                    <Box center w={300}>
                        <LoginInput noBG onChangeText={(txt) => this.setCoupon(txt)} value={this.state.coupon} title={lang.coupon} placeholder={lang.coupon} mb="xs" />
                        <Box
                            w="80%"
                            self="center"
                            px="2xs"
                        >
                            <Button onPress={this.saveCoupon.bind(this)}>
                                <Text color="white" >{`${lang.save} test`}</Text>
                            </Button>
                        </Box>
                    </Box>
                </Modal>

            </Box>

        );
    }
    toggleModal() {
        this.setState({
            showCopon: !this.state.showCopon
        })
    }

    closeModal() {
        this.setState({
            showCopon: !this.state.showCopon,
            coupon: "",
            couponIRI: "",
            percent: 0,
            couponIsValide: false
        })
    }
    stateSetter(field, value) {
        const state = {}
        state[field] = value;
        this.setState({ ...state })
    }

    setCoupon(txt) {
        this.setState({
            coupon: txt,
            couponIRI: "",
            percent: 0,
            couponIsValide: false
        })
    }
}
const baseIconStyle = {
    size: 30,
    color: theme.color.grey
}

export default OrderValidationScreen;