import React, { Component } from 'react';
import { Box, Text } from 'react-native-design-utility';
import { StatusBar, Image, ActivityIndicator, Alert, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { inject, observer } from "mobx-react";
import { BASE_URL } from "../constants"

import { strings } from "../lang"
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { theme } from '../constants/theme';
import ListColumn from '../commons/ListColumn';

import { images } from "../constants/images"
import ImagePicker from '../components/ImagePicker';

import Modal from "../commons/Modal"

import LoginInput from "../commons/LoginInput"
import LoginButton from "../commons/LoginButton"

import {
    names,
    email,
    required,
    password,
    confirmPassword,
    phoneNumber,
} from "../utils/validators";
import CloseBtn from '../commons/CloseBtn';

const VALIDATORS = {
    prenom: (value) => {
        const error = {}
        error.message = required(value);
        error.message = error.message ? error.message : names(value);
        if (error.message) { throw error }
    },
    nom: (value) => {
        const error = {}
        error.message = required(value);
        error.message = error.message ? error.message : names(value);
        if (error.message) { throw error }
    },
    login: (value) => {
        const error = {}
        error.message = required(value);
        error.message = error.message ? error.message : email(value);
        if (error.message) { throw error }
    },
    numeroTel: (value) => {
        const error = {}
        error.message = required(value);
        error.message = error.message ? error.message : phoneNumber(value);
        if (error.message) { throw error }
    },
    sexe: (value) => {
        const error = {}
        error.message = required(value);
        if (error.message) { throw error }
    },
    plainPassword: (value, cvalue) => {
        const error = {}
        console.log(value);
        error.message = required(value);
        error.message = error.message ? error.message : password(value);
        error.message = error.message ? error.message : confirmPassword(value, cvalue);
        if (error.message) { throw error }
    }
}


@inject("CurrentUser")
@inject("GlobalData")
@observer
class EditUserInfoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showModal: false,
            value: "",
            title: "",
            type: 0,
            hasErro: false,
            error: "",
            field: "",
            oldPass: "",
            cnPass: ""
        }
        const lang = strings;
        props.navigation.setOptions({
            title: lang.Settings,
            headerLeft: () => (<CloseBtn color={theme.color.goldDarker} left size={25} onPress={() => props.navigation.goBack(null)} />),
        })

    }
    sexes = [];

    saveFunc = async (cvalue = false) => {
        this.setState({
            loading: true,
        })
        const data = {}
        data[this.state.field] = this.state.value.trim()
        try {
            VALIDATORS[this.state.field](data[this.state.field], this.state.cnPass);
            if (cvalue === true) {
                await this.props.CurrentUser.info.checkLogin(this.state.oldPass)
            }
            await this.props.CurrentUser.info.update(data);
            this.toggleModale();
            this.setState({
                loading: false,
                value: ""
            })
        } catch (error) {
            this.setState({
                hasErro: true,
                loading: false,
                error: error.message
            })
        }

    };

    componentDidMount() {
        const lang = strings;
        const { navigation, route } = this.props;
        let title = lang.ProfileLinks.EditUserInfo;
        if (route?.params) {
            if (route.params.isMe !== undefined) {
                title = lang.consulteProfile;
            }
        }
        navigation.setOptions({
            title: title
        })
    }
    async updateImage(image) {
        console.log("updating the image", image?.name);
        await this.props.CurrentUser.info.updateImage(image);
    }

    async getValueFromModal(value) {
        console.log(value);
        await this.setState({
            value: value
        })
        console.log(this.state.value)
    }

    passeValueToModal() {
        return this.state.value;
    }

    updateName() {
        const { info } = this.props.CurrentUser
        this.setState({
            value: info.prenom,
            title: strings.name,
            type: 1,
            field: "prenom"
        })
        this.toggleModale();

    }
    updateFamilyName() {
        console.log("updating the family name");
        const { info } = this.props.CurrentUser
        this.setState({
            value: info.nom,
            title: strings.familyname,
            type: 1,
            field: "nom"
        })
        this.toggleModale();
    }

    async updateSexe() {
        console.log("updating the sexe");
        const { GlobalData: data } = this.props
        this.setState({
            loading: true,
            type: 2,
            field: "sexe"
        })
        this.toggleModale();
        await data.setup();
        console.log(data.sexes)
        this.setState({
            loading: false
        })

    }

    updateUsername() {
        console.log("updating the email");
        const { info } = this.props.CurrentUser
        this.setState({
            value: info.login,
            title: strings.email,
            type: 1,
            field: "login"
        })
        this.toggleModale();
    }

    updatePhoneNumber() {
        console.log("updating the phone number");
        const { info } = this.props.CurrentUser
        this.setState({
            value: info.numeroTel,
            title: strings.tel,
            type: 1,
            field: "numeroTel"
        })
        this.toggleModale();
    }

    changePassword() {
        console.log("changing the password");
        this.setState({
            type: 3,
            field: "plainPassword",
        })
        this.toggleModale();
    }

    stateSetter(key, value) {
        const obj = {}
        obj[key] = value,
            this.setState({
                ...obj
            })
    }

    saveSexe(sexe) {
        this.setState({
            value: sexe
        })

        this.saveFunc();
    }

    _goToTel(){
        let { CurrentUser: user, route } = this.props;
        if (route?.params) {
            if (route.params.isMe !== undefined) { 
                user = { info: user.userToConsulte };
            }
        }
        Linking.openURL(`tel:${user.info.numeroTel}`); 
    }

    _goToMail() {
        let { CurrentUser: user, route } = this.props;
        if (route?.params) {
            if (route.params.isMe !== undefined) { 
                user = { info: user.userToConsulte };
            }
        } 
        Linking.openURL(`mailto:${user.info.login.toLowerCase()}`);
    }


    render() {
        const lang = strings;
        let { CurrentUser: user, route } = this.props;

        let isMe = true;
        if (route?.params) {
            if (route.params.isMe !== undefined) {
                isMe = route.params.isMe;
                user = { info: user.userToConsulte };
            }
        }
        return (
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: theme.color.white,
                }}>
                <ListColumn>
                    <ListColumn.Left>
                        <Box dir="row" px="xs"> 
                            <Text weight="bold" color="gold" > ~{user.info.role.libelle.charAt(0).toUpperCase() + user.info.role.libelle.slice(1).toLowerCase()}~</Text>
                        </Box>
                        {user.info.role._id === "/api/roles/3" && <>
                            <Box dir="row" px="xs">
                                <Text color="goldDarker">{lang.siren}: </Text>
                                <Text weight="bold" color="greyDark">{user.info.siren}</Text>
                            </Box>
                            <Box dir="row" px="xs">
                                <Text color="goldDarker">{lang.siret}: </Text>
                                <Text weight="bold" color="greyDark">{user.info.siret}</Text>
                            </Box>
                        </>}
                        {user.info.role._id === "/api/roles/2" && <>
                            <Box dir="row" px="xs">
                                <Text color="goldDarker">{lang.corporateNameSH}: </Text>
                                <Text weight="bold" color="greyDark">{user.info.raisonSociale}</Text>
                            </Box>
                        </>}
                        <Box dir="row" px="xs">
                            <Text color="goldDarker">{lang.contry}: </Text>
                            <Text weight="bold" color="greyDark">{user.info.pays.libelle}</Text>
                        </Box>
                    </ListColumn.Left>
                    <ListColumn.Right>
                        <Box circle={70} avatar >
                            <ImagePicker editable={isMe} callback={this.updateImage.bind(this)} image={user.info.image ? `${BASE_URL}${user.info.image.contentUrl}` : null}
                                btnStyle={{ width: 70, height: 70, }}
                                imgStyle={{ width: 50, height: 50 }}
                            />
                            {/**{ width: 220, height: 220, padding: 10 } */}
                        </Box>
                    </ListColumn.Right>
                </ListColumn>

                <ListColumn isMe={isMe} callback={this.updateName.bind(this)}>
                    <ListColumn.Left>
                        <Box px="sm" py="xs">
                            <Text color="goldDarker">{lang.name}:</Text>
                        </Box>
                    </ListColumn.Left>
                    <ListColumn.Right left={true} f={1}>
                        <Box px="sm">
                            <Text weight="bold">{user.info.prenom}</Text>
                        </Box>
                    </ListColumn.Right>
                </ListColumn>

                <ListColumn isMe={isMe} callback={this.updateFamilyName.bind(this)}>
                    <ListColumn.Left>
                        <Box px="sm" py="xs">
                            <Text color="goldDarker">{lang.familyname}:</Text>
                        </Box>
                    </ListColumn.Left>
                    <ListColumn.Right left={true} f={1}>
                        <Box px="sm">
                            <Text weight="bold">{user.info.nom}</Text>
                        </Box>
                    </ListColumn.Right>
                </ListColumn>

                <ListColumn isMe={isMe} callback={this.updateSexe.bind(this)}>
                    <ListColumn.Left>
                        <Box px="sm" py="xs">
                            <Text color="goldDarker">{lang.sexe}:</Text>
                        </Box>
                    </ListColumn.Left>
                    <ListColumn.Right left={true} f={1}>
                        <Box px="sm">
                            <Text weight="bold">{user.info.sexe.libelle.toLowerCase()}</Text>
                        </Box>
                    </ListColumn.Right>
                </ListColumn>

                <ListColumn isMe callback={isMe? this.updateUsername.bind(this): this._goToMail.bind(this)}>
                    <ListColumn.Left>
                        <Box px="sm" py="xs">
                            <Text color="goldDarker">{lang.username}:</Text>
                        </Box>
                    </ListColumn.Left>
                    <ListColumn.Right left={true} f={1}>
                        <Box px="sm">
                            <Text weight="bold">{user.info.login.toLowerCase()}</Text>
                        </Box>
                    </ListColumn.Right>
                </ListColumn>

                <ListColumn isMe callback={isMe? this.updatePhoneNumber.bind(this): this._goToTel.bind(this)}>
                    <ListColumn.Left>
                        <Box px="sm" py="xs">
                            <Text color="goldDarker">{lang.tel}:</Text>
                        </Box>
                    </ListColumn.Left>
                    <ListColumn.Right left={true} f={1}>
                        <Box px="sm">
                            <Text weight="bold">{user.info.numeroTel}</Text>
                        </Box>
                    </ListColumn.Right>
                </ListColumn>
                {isMe && <ListColumn isMe={isMe} callback={this.changePassword.bind(this)}>
                    <ListColumn.Left>
                        <Box px="sm" py="xs">
                            <Text color="goldDarker">{lang.password}:</Text>
                        </Box>
                    </ListColumn.Left>
                    <ListColumn.Right left={true} f={1}>
                        <Box px="sm">
                            <Box dir="row">
                                <Box pr="xs"><FontAwesome name="circle" size={12} color="black" /></Box>
                                <Box pr="xs"><FontAwesome name="circle" size={12} color="black" /></Box>
                                <Box pr="xs"><FontAwesome name="circle" size={12} color="black" /></Box>
                                <Box pr="xs"><FontAwesome name="circle" size={12} color="black" /></Box>
                                <Box pr="xs"><FontAwesome name="circle" size={12} color="black" /></Box>
                                <Box pr="xs"><FontAwesome name="circle" size={12} color="black" /></Box>
                                <Box pr="xs"><FontAwesome name="circle" size={12} color="black" /></Box>
                            </Box>
                        </Box>
                    </ListColumn.Right>
                </ListColumn>}

                <Modal show={this.state.showModal} closeFunc={this.toggleModale.bind(this)}>
                    {this.state.loading && <Box f={1} center self="center" align="center"><ActivityIndicator size="large" color={theme.color.gold} /></Box>}
                    {this.state.hasErro &&
                        <Box center w={300} f={.2}>
                            <Text color="red" weight="bold" size="sx">{this.state.error}</Text>
                        </Box>}
                    {this.state.type === 1 &&
                        <Box center w={300} self="center">
                            <LoginInput onChangeText={this.getValueFromModal.bind(this)} value={this.state.value} title={this.state.title} placeholder={this.state.title} mb="sm" />
                            <LoginButton children={lang.save} type="save" onPress={this.saveFunc ? this.saveFunc.bind(this) : () => { console.log("no saving function found") }} />
                        </Box>}
                    {this.state.type === 2 && this.props.GlobalData.sexes.map(e => (
                        <TouchableHighlight key={e._id} onPress={() => {
                            Alert.alert(
                                lang.areYouSure,
                                `Sexe: ${e.libelle.toLowerCase()}`,
                                [
                                    {
                                        text: lang.save,
                                        onPress: () => this.saveSexe.bind(this)(e._id)
                                    },
                                    {
                                        text: "Cancel",
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                    },
                                ],
                                { cancelable: false }
                            );

                        }} style={{
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
                    ))}

                    {this.state.type === 3 &&
                        <Box center w={300} self="center">
                            <LoginInput noBG secureTextEntry={true} onChangeText={(txt) => this.stateSetter.bind(this)("oldPass", txt)} title={lang.oldPassword} placeholder={lang.oldPassword} mb="xs" />
                            <LoginInput noBG secureTextEntry={true} onChangeText={(txt) => this.stateSetter.bind(this)("value", txt)} title={lang.newPassword} placeholder={lang.newPassword} mb="xs" />
                            <LoginInput noBG secureTextEntry={true} onChangeText={(txt) => this.stateSetter.bind(this)("cnPass", txt)} title={lang.confirmNewPassword} placeholder={lang.confirmNewPassword} mb="md" />
                            <LoginButton noBG children={lang.save} type="save" onPress={this.saveFunc ? () => this.saveFunc.bind(this)(true) : () => { console.log("no saving function found") }} />
                        </Box>
                    }
                </Modal>
            </ScrollView>
        );
    } onChangeText

    toggleModale() {
        const resetVal = {};
        if (this.state.showModal) {
            resetVal.value = "";
        }
        this.setState({
            showModal: !this.state.showModal,
            hasErro: false,
            error: "",
            ...resetVal
        })
    }
}

export default EditUserInfoScreen;