import React, { Component } from "react";

import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    Alert
} from "react-native";

import { Box } from 'react-native-design-utility';
import { CardView } from "react-native-payment-card";
/**
 * constents
 */
import { theme } from "../constants/theme";
import { strings } from "../lang";

/**
 * validators
 */
import {
    number,
    names
} from "../utils/validators"
import { FontAwesome } from "@expo/vector-icons";
import { card } from "../constants/images";
import NavigationService from "../api/NavigationService";


class PaymentForm extends Component {
    initialState = {
        isLoading: false,
        cardHolder: "",//"Test user",
        cardNumber: "",//"4242 4242 4242 4242",
        expiryDate: "",//"12/22",
        cvc: "",//"123",
        brand: "",//"visa",
        hasError: false,
        error: null,
        disable: false,
    }
    constructor(props) {
        super(props);
        this.state = {
            ...this.initialState
        }
        this.cardHolderChange = this.cardHolderChange.bind(this);
        this.cardNumberChange = this.cardNumberChange.bind(this);
        this.expiryDateChange = this.expiryDateChange.bind(this);
        this.cvcChange = this.cvcChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    cardHolderChange(event) {
        if (event.nativeEvent.text === "") {
            this.setState({
                cardHolder: ""
            })

            return true;
        }
        let test = names(event.nativeEvent.text)
        if (!test) {
            this.setState({
                cardHolder: event.nativeEvent.text,
            })
        }
    }

    getCardNumber() {
        return this.state.cardNumber.split(" ").join("").trim();
    }

    getExpiry() {
        const expiry = this.state.expiryDate.split("/");
        return {
            mm: Number.parseInt(expiry[0]),
            yy: Number.parseInt(expiry[1]),
        };
    }
    cardNumberChange(event) {
        const text = event.nativeEvent.text.trim();
        if (text === "") {
            this.setState({
                cardNumber: ""
            })

            return true;
        }
        let cardNumber = text.split(" ").join("");
        let test = number(cardNumber);
        let res = this.state.cardNumber;
        if (!test) {
            res = text[0]
            for (let i = 1; i < cardNumber.length; i++) {
                res += i % 4 === 0 ? " " + cardNumber[i] : cardNumber[i];
            }
        }
        const isVisa = /^4[0-9]*?$/.test(cardNumber.trim());
        const isMC = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)$/.test(cardNumber.trim());
        const isAE = /^3[47]$/.test(cardNumber.trim());
        const isDC = /^3(?:0[0-5]|[68][0-9])$/.test(cardNumber.trim());
        const brand = isAE ? "american-express" : isVisa ? "visa" : isDC ? "diners-club" : isMC ? "master-card" : ""

        this.setState({
            cardNumber: res.trim(),
            brand: brand
        })
    }

    expiryDateChange(event) {
        const text = event.nativeEvent.text.trim();
        let expiryDate = text.split("/").join("");
        if (expiryDate === "") {
            this.setState({
                expiryDate: ""
            })

            return true;
        }


        let test = number(expiryDate);
        let res = this.state.expiryDate;
        if (!test) {
            res = text[0]
            for (let i = 1; i < expiryDate.length; i++) {
                res += i % 2 === 0 ? "/" + expiryDate[i] : expiryDate[i];
            }
            expiryDate = res.split("/");
            res = Number.parseInt(expiryDate[0]) > 12 || Number.parseInt(expiryDate[0]) < 0 ? this.state.expiryDate : res;
            res = expiryDate[1] && (Number.parseInt(expiryDate[0]) > 31 || Number.parseInt(expiryDate[0]) < 0) ? this.state.expiryDate : res;
        }
        let lastChar = text[text.length - 1];
        if (lastChar === "/") {
            if (this.state.expiryDate.length === 1) {
                res = "0" + this.state.expiryDate + "/";
            }
        }
        this.setState({
            expiryDate: res + "/" === text && res.length === 2 ? text : res,
        })
    }

    async submitForm() { 
        if (this.state.cardHolder === "" ||
            this.state.cardNumber === "" ||
            this.state.expiryDate === "" ||
            this.state.cvc === "") {
            Alert.alert(strings.payment.emptyField);
            return;
        }
        this.setState({
            disable: true,
            isLoading: true,
        })
        const exp = this.getExpiry.bind(this)();
        await this.props.submit({
            // name: this.state.cardHolder,
            // number: this.getCardNumber.bind(this)(),
            // expYear: exp.yy,
            // expMonth: exp.mm, 
            // cvc: this.state.cvc,
            name: this.state.cardHolder,
            number: this.getCardNumber.bind(this)(),
            exp_year: exp.yy,
            exp_month: exp.mm, 
            cvc: this.state.cvc,
        });
        this.setState({
            ...this.initialState
        }) 
    }

    cvcChange(event) {
        const text = event.nativeEvent.text.trim();
        let test = number(text);
        if (!test) {
            this.setState({
                cvc: text
            })
        } else {
            this.setState({
                cvc: this.state.cvc
            })
        }

    }

    setFocused(field) {
        this.setState({
            focused: field
        })
    }

    flip() {
        this.setState({
            focused: ""
        })
    }

    render() {
        const {
            cardHolder,
            cardNumber,
            expiryDate,
            cvc,
            brand,
            focused,
        } = this.state;
        const { submit } = this.props;
        return (
            this.state.isLoading ?
                <View style={styles.payment}>
                    <ActivityIndicator size="large" color={theme.color.blueDarkest} />
                </View>
                :
                <>
                    <Box bg="white" f={1} center w="100%">
                        <CardView
                            cardtype={"DinnK Payment Gateway"}

                            focused={focused}
                            brand={brand}
                            //      scale={1}
                            //        fontFamily={cardFontFamily}
                            imageFront={card.cardFront}
                            imageBack={card.cardBack}
                            //              customIcons={cardBrandIcons}


                            number={cardNumber}
                            expiry={expiryDate}
                            cvc={cvc}
                            name={cardHolder}
                        />
                    </Box>
                    <KeyboardAvoidingView
                        behavior={Platform.OS == "ios" ? "padding" : "height"}
                        style={[{ flex: 1 }, styles.payment]}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                        >
                            <View >
                                <View style={styles.space}>
                                    <Text style={[styles.label]}>{strings.payment.cardHolder}</Text>
                                    <TextInput style={[styles.input]} placeholder={strings.payment.cardHolder}
                                        autoCompleteType="off"
                                        autoCorrect={false}
                                        keyboardType="default"
                                        maxLength={200}
                                        value={this.state.cardHolder}
                                        onChange={this.cardHolderChange}
                                        onFocus={() => this.setFocused.bind(this)("name")}
                                    />
                                    <FontAwesome name="user" size={30} style={[styles.far]} />
                                </View>
                                <View style={[styles.space]}>
                                    <Text style={[styles.label]}>{strings.payment.cardNumber}</Text>
                                    <TextInput style={[styles.input]} placeholder={strings.payment.cardNumber}
                                        autoCompleteType="off"
                                        autoCorrect={false}
                                        keyboardType="number-pad"
                                        maxLength={19}
                                        value={this.state.cardNumber}
                                        onChange={this.cardNumberChange}
                                        onFocus={() => this.setFocused.bind(this)("number")}
                                    />
                                    <FontAwesome name="credit-card" size={30} style={[styles.far]} />
                                </View>
                                <View style={[styles.cardGrp, styles.space]}>
                                    <View style={styles.cardItem}>
                                        <Text style={[styles.label]}>{strings.payment.expiryDate}</Text>
                                        <TextInput style={[styles.input]} placeholder={strings.payment.expiryDateBis}
                                            autoCompleteType="off"
                                            autoCorrect={false}
                                            keyboardType="number-pad"
                                            maxLength={5}
                                            value={this.state.expiryDate}
                                            onChange={this.expiryDateChange}
                                            onFocus={() => this.setFocused.bind(this)("expiry")}
                                        />
                                        <FontAwesome name="calendar" size={30} style={[styles.far]} />
                                    </View>
                                    <View style={styles.cardItem}>
                                        <Text style={[styles.label]}>{strings.payment.CVC}</Text>
                                        <TextInput style={[styles.input]} placeholder={strings.payment.CVC}
                                            autoCompleteType="off"
                                            autoCorrect={false}
                                            keyboardType="number-pad"
                                            maxLength={3}
                                            value={this.state.cvc}
                                            onChange={this.cvcChange}
                                            onEndEditing={() => this.flip.bind(this)()}
                                            onFocus={() => this.setFocused.bind(this)("cvc")}
                                        />
                                        <FontAwesome name="lock" size={30} style={[styles.far]} />
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity style={styles.btn}
                                        onPress={this.submitForm}
                                        disabled={this.state.disable}
                                    >
                                        <Text style={styles.btnText}>{strings.payment.sub}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Box h={50} />
                        </ScrollView>
                    </KeyboardAvoidingView>
                </>
        )
    }
}


export default PaymentForm;

const styles = StyleSheet.create({
    payment: {
        backgroundColor: theme.color.white,
        borderRadius: 5,
        padding: 35,
        paddingTop: 15,
    },
    titleBox: {
        alignItems: "center",
    },
    title: {
        fontSize: 30,
        color: theme.color.blueDarkest,
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        color: theme.color.greyDarker,
        marginBottom: 6,
    },
    input: {
        fontSize: 20,
        paddingVertical: 13,
        paddingLeft: 25,
        textAlign: "center",
        borderWidth: 2,
        backgroundColor: theme.color.white,
        borderColor: theme.color.greyLight,
        borderRadius: 5,
        letterSpacing: 1,
        color: theme.color.greyDarker,
    },
    cardGrp: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    cardItem: {
        width: "48%",
    },
    space: {
        marginBottom: 20,
    },
    far: {
        position: "absolute",
        bottom: 12,
        left: 15,
        color: theme.color.redDarker,
    },
    btn: {
        marginTop: 20,
        padding: 12,
        backgroundColor: theme.color.blue,
        alignItems: "center",
        borderRadius: 5,
        marginBottom: 20,
    },
    btnText: {
        color: theme.color.greyLightest,
        fontSize: 15,
        fontWeight: "bold",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 15,
    },
    paymentLogo: {
        width: 100,
        height: 100,
        backgroundColor: theme.color.grey,
        borderRadius: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        alignItems: "center",
        justifyContent: "center",

    },
    p: {
        backgroundColor: theme.color.blue,
        width: 90,
        height: 90,
        borderRadius: 50,
        textAlign: "center",
        justifyContent: "center",
        lineHeight: 85,
        color: theme.color.gray,
        fontSize: 58,
    }

});