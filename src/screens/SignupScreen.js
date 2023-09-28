import React, { Component } from 'react';
import { Box, Text } from 'react-native-design-utility';
import { KeyboardAvoidingView, ActivityIndicator, ScrollView, TouchableHighlight, Alert } from 'react-native';
import { inject, observer } from "mobx-react"

import OnboardingLogo from '../commons/OnboardingLogo';
import LoginButton from '../commons/LoginButton';
import LoginInput from '../commons/LoginInput';
import { theme } from '../constants/theme';



import { strings } from "../lang"


import SignUpStore from '../models/SignUpStore';
import { store as globalData } from "../models"
import { action } from 'mobx';

import ImagePicker from '../components/ImagePicker';
import Modal from '../commons/Modal';


@observer
class SignupScreen extends Component {

    constructor(props) {
        super(props);
        this.choseRole = this.choseRole.bind(this);
        this.choseCarrierType = this.choseCarrierType.bind(this);
    }
    //rendrers for pickrs
    sexe = "";
    contry = "";
    carrierType = "";
    role = "";
    //initial state for reset
    initialState = {
        loading: false,
        showModal: false,
        role: false,
        contry: false,
        sexe: false,
        typeCoursier: false
    }
    //the state
    state = {
        loading: true,
        showModal: false,
        role: false,
        contry: false,
        sexe: false,
        typeCoursier: false,
        errors: {}
    }

    //stor for data parssing and requesting
    store = new SignUpStore();
    //global data
    sexes = [];
    contries = [];
    carrierTypes = [];
    roles = [];
    hideModal() {
        this.setState({
            showModal: false,
            role: false,
            contry: false,
            sexe: false,
            carrierType: false
        });
    }

    choseRole() {
        this.store.corporate = undefined;
        this.store.siren = undefined;
        this.store.siret = undefined;
        this.store.typeCoursier = undefined;
        this.carrierType = "";
        this.setState({
            showModal: true,
            role: true
        })
    }
    choseSexe() {
        this.setState({
            showModal: true,
            sexe: true
        })
    }
    choseContry() {
        this.setState({
            showModal: true,
            contry: true,
        })
    }
    choseCarrierType() {
        this.setState({
            showModal: true,
            carrierType: true,
        })
    }
    async componentDidMount() {
        const { GlobalData: data } = globalData;
        await data.setup();
        Object.keys(data).forEach(attr => {
            if (attr === "loaded") { return };
            this[attr] = data[attr].map(e => (
                <TouchableHighlight key={e._id} onPress={() => this.setPickerValue(e._id, attr, e.libelle)} style={{
                    width: 300,
                    borderBottomColor: theme.color.greyLightest,
                    borderBottomWidth: 1,
                    height: 40,
                    paddingTop: 4, paddingBottom: 4
                }}>
                    <Box center>
                        <Text>{e.libelle}</Text>
                    </Box>
                </TouchableHighlight>
            ))
        })


        this.setState({
            loading: false
        })
    }

    @action.bound
    setPickerValue(value, item, lib) {

        switch (item) {
            case "roles":
                this.store.role = value; this.role = lib; break;
            case "sexes":
                this.store.sexe = value; this.sexe = lib; break;
            case "contries":
                this.store.contry = value; this.contry = lib; break;
            case "carrierTypes":
                this.store.carrierType = value; this.carrierType = lib; break;
            default:
                console.log(value);
                console.log(item);
        }

        this.hideModal();

        console.log(this.store);
    }

    onNameChanged(name) {
        this.store.name = name;
        console.log(name);
        console.log(this.store.name);
    }

    onFamilyNameChanged(fname) {
        this.store.fname = fname;
    }

    onEmailChanged(email) {
        this.store.email = email;
    }

    onPassworChanged(password) {
        console.log(password);
        this.store.password = password;
        console.log(this.store.password);
    }

    onCorporateNameChanged(corporate) {
        this.store.corporate = corporate;
    }

    onSirenChanged(siren) {
        this.store.siren = siren
    }

    onSiretChanged(siret) {
        this.store.siret = siret;
    }


    onConfirmPassChanged(cpass) {
        this.store.cpass = cpass;

    }

    onTelChanged(tel) {
        this.store.tel = tel;
    }

    async signUp() { 
        try {
            await this.store.signIn();
            Alert.alert(strings.signUpSuccessTittle, strings.signUpSuccess);
            this.props.navigation.goBack(null);
        } catch (e) {
            console.log("tet singup", e)
            this.setState({
                errors: { ...e }
            })
        }
    }

    setImage(image) {
        this.store.image = image;
    }

    render() {
        const lang = strings ? strings : this.context;
        if (this.state.loading) {
            return (
                <Box f={1} bd="white" center>
                    <ActivityIndicator size="large" color={theme.color.goldDarker} />
                </Box>
            )
        }
        return (

            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={{
                    flex: 1,
                    backgroundColor: theme.color.white,
                    paddingVertical: 30,
                }}
            >
                <ScrollView>
                    <Box f={.8} h="100%" center bg="white">
                        <Box f={1}>
                            <Box f={1} center>
                                <OnboardingLogo />
                            </Box>
                        </Box>
                        <Box f={1.3} w="100%" >

                            <Box center>
                                <ImagePicker callback={this.setImage.bind(this)} editable />
                            </Box>
                            <LoginInput title={lang.role}
                                value={this.role}
                                placeholder={lang.role}
                                onPress={this.choseRole.bind(this)}
                                error={this.state.errors.role} />

                            {this.store.role === "/api/roles/2" &&
                                <LoginInput title={lang.corporateName}
                                    placeholder={lang.corporateName}
                                    keyboardType="default"
                                    value={this.store.corporate}
                                    onChangeText={this.onCorporateNameChanged.bind(this)}
                                    error={this.state.errors.corporate}
                                />}
                            {this.store.role === "/api/roles/3" &&
                                <LoginInput title={lang.siren}
                                    placeholder={lang.siren}
                                    value={this.store.siren}
                                    keyboardType="number-pad"
                                    onChangeText={this.onSirenChanged.bind(this)}
                                    error={this.state.errors.siren}
                                />}
                            {this.store.role === "/api/roles/3" &&
                                <LoginInput title={lang.siret}
                                    value={this.store.siret}
                                    placeholder={lang.siret}
                                    keyboardType="number-pad"
                                    onChangeText={this.onSiretChanged.bind(this)}
                                    error={this.state.errors.siret}
                                />}
                            {this.store.role === "/api/roles/3" &&
                                <LoginInput title={lang.carrierType}
                                    value={this.carrierType}
                                    placeholder={lang.carrierType}
                                    onPress={this.choseCarrierType.bind(this)}
                                    error={this.state.errors.carrierType}
                                />}
                            <LoginInput title={lang.name}
                                value={this.store.name}
                                placeholder={lang.name}
                                keyboardType="default"
                                onChangeText={this.onNameChanged.bind(this)}
                                error={this.state.errors.name}
                            />

                            <LoginInput title={lang.familyname}
                                value={this.store.fname}
                                placeholder={lang.familyname}
                                keyboardType="default"
                                onChangeText={this.onFamilyNameChanged.bind(this)}
                                error={this.state.errors.fname}
                            />

                            <LoginInput title={lang.username}
                                value={this.store.email}
                                placeholder="exemple@exemple.com"
                                keyboardType="email-address"
                                onChangeText={this.onEmailChanged.bind(this)}
                                error={this.state.errors.email}
                            />

                            <LoginInput title={lang.sexe}
                                value={this.sexe}
                                placeholder={lang.sexe}
                                onPress={this.choseSexe.bind(this)}
                                error={this.state.errors.sexe}
                                />

                            <LoginInput title={lang.tel}
                                value={this.store.tel}
                                placeholder={lang.tel}
                                keyboardType="phone-pad"
                                onChangeText={this.onTelChanged.bind(this)}
                                error={this.state.errors.tel}
                                />

                            <LoginInput title={lang.password}
                                mb="sm"
                                value={this.store.password}
                                secureTextEntry={true}
                                placeholder={lang.password}
                                keyboardType="default"
                                onChangeText={this.onPassworChanged.bind(this)}
                                error={this.state.errors.password}
                                />
                            <LoginInput title={lang.confirmPassword}
                                mb="sm"
                                value={this.store.cpass}
                                secureTextEntry={true}
                                placeholder={lang.confirmPassword}
                                keyboardType="default"
                                onChangeText={this.onConfirmPassChanged.bind(this)}
                                error={this.state.errors.cpass}
                                />

                            <LoginInput title={lang.contry}
                                value={this.contry}
                                placeholder={lang.contry}
                                onPress={this.choseContry.bind(this)}
                                error={this.state.errors.contry}
                            />
                            <Box mt="sm"></Box>
                            <LoginButton onPress={this.signUp.bind(this)} type="signup">
                                {lang.signup}
                            </LoginButton>
                        </Box>
                    </Box>
                </ScrollView>

                <Modal closeFunc={this.hideModal.bind(this)} show={this.state.showModal} >

                    {this.state.role && this.roles}
                    {this.state.carrierType && this.carrierTypes}
                    {this.state.sexe && this.sexes}
                    {this.state.contry && this.contries}
                </Modal>
            </KeyboardAvoidingView >

        );
    }
}

export default inject("CurrentUser")(SignupScreen);
