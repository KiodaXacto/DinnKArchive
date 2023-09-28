import React, { Component } from 'react';
import { SPK } from '../api/API';
import { strings } from '../lang';
import { Alert, LogBox, KeyboardAvoidingView } from 'react-native';
import { theme } from '../constants/theme';
import PaymentForm from '../components/PaymentForm';
import CloseBtn from '../commons/CloseBtn';


//YellowBox.ignoreWarnings(["Warning:"]);
class PaiementScreen extends Component {
    stripe = null
    initialState = {
        hasError: false,
        error: "",
        // mandatory
        number: "",//'4242424242424242',
        expMonth: "",//11,
        expYear: "",//22,
        cvc: "",//'223',
        // optional
        name: "",//'Test User',
        //paiment parms
        amount: 6,
        devise: "/api/devises/1"
    }
    state = {
        ...this.initialState
    }

    componentWillUnmount() {
        this.setState({
            ...this.initialState
        })
    }
    async componentDidMount() {
        const { order } = this.props.route.params;
        if (order.livreur) { this.props.navigation.goBack(null); };
        const lang = strings
        this.props.navigation.setOptions({
            title: lang.payment.title,
            headerLeft: () => (<CloseBtn color={theme.color.goldDarker} left size={25} onPress={() => this.props.navigation.goBack(null)} />),
        })
        try {
            const { public_key } = await SPK.get().json();
            this.stripe = require('stripe-client')(public_key);
        } catch (error) {
            this.setState({
                hasError: true,
                error: strings.erroSPK
            })
            this.props.navigation.goBack(null);
        }
    }
    async submit(card) {
        try {
            const token = await this.stripe.createToken({ card: card });
            //            console.log(token.id);
            const { order, coupon } = this.props.route.params;
            const data = {
                stripeToken: token.id,
                montant: this.state.amount,
                devise: this.state.devise,
                discount: coupon
            }
            // console.log("coupon: ", coupon);
            // console.log("data: ", data);

            await order.pay(data);
            this.props.navigation.goBack(null);
        } catch (error) {
            if (error.response?.status === 500) {
                const er = JSON.parse(error.message);
                console.log(er);
                Alert.alert("Opss!!", er["hydra:description"]);
                this.props.navigation.goBack(null);
            } else if (error.response?.status === 400) {
                Alert.alert("Opss!!", error.message);

            } else {

                Alert.alert("Opss!!", strings.payment.error);
            }
        }
    }


    render() {
        if (this.state.hasError) {
            Alert.alert("Ooops !!", this.state.error);
            return <></>
        }
        return (
            <KeyboardAvoidingView style={{
                width: "100%",
                height: "100%",
                backgroundColor: theme.color.white
            }} >
                <PaymentForm submit={this.submit.bind(this)} />
            </KeyboardAvoidingView>
        );
    }
}

export default PaiementScreen;