import React, { Component } from 'react';
import { Box, Text } from 'react-native-design-utility';
import { StatusBar, StyleSheet, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';

import Button from "../commons/Button";
import Input from "../commons/Input";
import { LanguageContext, strings } from "../lang"

import { observer, inject } from 'mobx-react';
import { observable, action } from 'mobx';


import { theme } from "../constants/theme";

import { buildAddress } from "../utils/buildAddress";
import { alphaNumeric } from '../utils/validators';
import ProfileBtn from '../commons/ProfileBtn';
import Modal from '../commons/Modal';
import { images } from '../constants/images';

@observer
class OrderScreen extends Component {
    static contextType = LanguageContext;
    constructor(props) {

        super(props);
        const { navigation } = this.props;
        const lang = strings;
        navigation.setOptions({
            title: lang.orderScreenTitle,
            headerLeft: () => (<ProfileBtn />)
        })

        this.state = {
            showErr: false,
            errorMsg: "No errors"
        }

    }

    @observable
    origine = '';

    @observable
    destination = '';

    @observable
    comment = '';

    @observable
    address = {
        origine: "string",
        destination: "string",
        oLatitude: 0,
        oLongitude: 0,
        dLatitude: 0,
        dLongitude: 0,
        client: "string"
    };
    @observable
    isSaving = false;
    @action.bound
    searchAddressDestination(value) {
        this.props.navigation.goBack(null);
        const address = buildAddress(value);
        let to = "";
        if (address.street) {
            to = address.street + ",";
        }

        if (address.postalCode) {
            to += " " + address.postalCode;
        }

        if (address.city) {
            to += " " + address.city;
        }

        if (address.country) {
            to += ", " + address.country;
        }

        this.destination = to;
        this.address.destination = to;
    }

    @action.bound
    searchAddressOrigine(value) {
        this.props.navigation.goBack(null);
        const address = buildAddress(value);
        let from = "";
        if (address.street) {
            from = address.street + ",";
        }

        if (address.postalCode) {
            from += " " + address.postalCode;
        }

        if (address.city) {
            from += " " + address.city;
        }

        if (address.country) {
            from += ", " + address.country;
        }

        this.origine = from;
        this.address.origine = from;
    }
    fromPress = () => {
        this.props.navigation.navigate("AutoCompleteAddress", {
            searchAddress: this.searchAddressOrigine,
        });
    }

    toPress = () => {
        this.props.navigation.navigate("AutoCompleteAddress", {
            searchAddress: this.searchAddressDestination,
        });

    }

    handlCommentChange(value) {
        const test = alphaNumeric(value.split(" ").join("").split("\n").join(""));
        if (test) {
            const lang = strings;
            Alert.alert(lang.Comment, test);
            return;
        }
        this.comment = value;
    }

    @action.bound
    async saveOrder() {
        this.isSaving = true;
        try {
            this.address.client = `/api/utilisateurs/${this.props.CurrentUser.info.id}`
            //TODO:inject comment
            const address = { ...this.address }
            address.commentaire = this.comment.trim() != "" ? this.comment.trim() : undefined;
            //            const order = await this.props.CurrentUser.info.createOrder(address);
            const order = await this.props.CurrentUser.orders.createOrder(address);
            this.isSaving = false;
            this.origine = "";
            this.destination = "";
            this.comment = "";
            console.log(order);
            this.props.navigation.navigate("Main", {
                screen: "ShowOrder",
                params: {
                    screen: "ShowOrder",
                    params: { order: order }
                }
            })
        } catch (error) {
            let msg = JSON.parse(error.message);
            console.log("msg", msg);
            if(msg["hydra:description"]){
                this.setState({
                    showErr: true,
                    errorMsg: msg["hydra:description"]
                })
            }
            this.isSaving = false;
        }
    }

    
    closeModal() {
        this.setState({
            showErr: false
        })
    }

    render() {
        let lang = this.context;
        if (strings) { lang = strings }
        if (this.isSaving) {
            return (
                <Box f={1} bg="white" center>
                    <ActivityIndicator color={theme.color.goldLight} size="large" />
                </Box>
            )
        }
        return (
            <Box f={1} bg="white" p="sm" center>
                <StatusBar barStyle="light-content" />
                <ScrollView style={styles.container} contentContainerStyle={{ flex: .8, justifyContent: "center" }} >
                    <Box mb="sm">
                        <Input placeholder={lang.from} containerStyle={styles.containerStyle} editable={false} onPress={this.fromPress} value={this.origine} />
                        <Input placeholder={lang.to} containerStyle={styles.containerStyle} editable={false} onPress={this.toPress} value={this.destination} />
                        <Input placeholder={lang.Comment} containerStyle={styles.containerStyle} value={this.comment} onChangeText={this.handlCommentChange.bind(this)} multiline numberOfLines={4} />
                    </Box>
                    <Button disabled={this.origine === '' || this.destination === ''} disabledStyle={styles.disabledStyle} onPress={this.saveOrder}>
                        <Text color="white" >{lang.orderBtn}</Text>
                    </Button>
                </ScrollView>
                <Modal closeFunc={this.closeModal.bind(this)} show={this.state.showErr}>

                    <Box center w={300}>
                        <Box
                            w="80%"
                            center
                            px="2xs"
                        > 
                            <Image source={images.late} style={{width:200, height:200}} />
                            <Box mt="md">
                                <Text size="xl" color="goldDarker" center>{this.state.errorMsg}</Text>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
            </Box>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        padding: 10,
    },
    containerStyle: {
        width: "100%",
    },
    disabledStyle: {
        backgroundColor: theme.color.goldDarker
    }
})

export default inject("CurrentUser")(OrderScreen);