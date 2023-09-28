import React, { Component } from 'react';
import { Box, Text } from 'react-native-design-utility';
import { KeyboardAvoidingView, Alert, Animated, ActivityIndicator, Linking } from 'react-native';
import { inject } from "mobx-react"

import OnboardingLogo from '../commons/OnboardingLogo';
import LoginButton from '../commons/LoginButton';
import LoginInput from '../commons/LoginInput';
import { theme } from '../constants/theme';



import { LanguageContext, strings } from "../lang"


import NavigationService from "../api/NavigationService"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RESET_PASS_LINK } from '../constants';


const BoxAnimated = Animated.createAnimatedComponent(Box);

class LoginScreen extends Component {
    static contextType = LanguageContext;
    state = {
        opacity: new Animated.Value(0),
        position: new Animated.Value(0),
        email: "",//"liv_2@gmail.fr",
        password: "",//"@Aazerty12",
        loading: false
    };
    componentDidMount() {
        Animated.parallel([this.positionAnim(), this.opacityAnim()]).start();
    }

    opacityAnim = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 200,
            delay: 100,
            useNativeDriver: true,
        }).start();
    };

    positionAnim = () => {
        Animated.timing(this.state.position, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    onGooglePress = () => {
        const lang = this.context;
    };
    onLogInPress = async () => {
        this.setState({
            loading: true,
        })
        console.log(this.state.email, " ", this.state.password);
        await this.props.CurrentUser.login(this.state.email, this.state.password, null, null)
        this.setState({
            loading: false,
        })
        Animated.parallel([this.positionAnim(), this.opacityAnim()]).start();
        // NavigationService.navigate("Main")
    };

    onSignupPress() {
        NavigationService.navigate("Signup")
    }

    onEmailChange(value) {
        this.setState({ email: value })

    }
    onPassworChange(value) {
        this.setState({ password: value })
    }


    render() {
        if (this.state.loading) {
            return (<Box f={1} bg="white" center>
                <ActivityIndicator size="large" color={theme.color.gold} />

            </Box>)
        }
        const { opacity } = this.state;
        const logoTranslate = this.state.position.interpolate({
            inputRange: [0, 1],
            outputRange: [150, 0],
        });
        let lang = this.context;
        if (strings) { lang = strings }
        return (

            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={{
                    flex: 1,
                    backgroundColor: theme.color.white,
                }}
            >
                <Box f={.8} h="100%" center bg="white">
                    <BoxAnimated f={1}
                        style={{
                            transform: [
                                {
                                    translateY: logoTranslate,
                                },
                            ],
                        }}
                    >
                        <Box f={1} center>
                            <OnboardingLogo slogan={lang.slogan} />
                        </Box>
                    </BoxAnimated>
                    <BoxAnimated f={1.3} w="100%" style={{ opacity }}>
                        {this.props.CurrentUser.error &&
                            <Box center bg="white">
                                <Text size="md" color="red">{this.props.CurrentUser.error}</Text>
                            </Box>
                        }
                        <LoginInput title={lang.username}
                            placeholder="exemple@exemple.com"
                            keyboardType="email-address"
                            onChangeText={(value) => this.onEmailChange(value)}
                            value={this.state.email}
                        />
                        <LoginInput title={lang.password}
                            secureTextEntry={true}
                            placeholder={lang.password}
                            keyboardType="default"
                            onChangeText={(value) => this.onPassworChange(value)}
                            value={this.state.password}
                        />
                        <Box mb="md" align="end"
                            w="80%"
                            self="center">
                            <TouchableOpacity onPress={() => Linking.openURL(RESET_PASS_LINK)}>
                                <Text color={theme.color.gold} >{lang.resetPass}</Text>
                            </TouchableOpacity>
                        </Box>
                        <LoginButton onPress={this.onLogInPress} type="login">
                            {lang.login}
                        </LoginButton>
                        <LoginButton onPress={this.onSignupPress} type="signup">
                            {lang.signup}
                        </LoginButton>
                        {/*<LoginButton onPress={this.onGooglePress} type="google">
                            Continue with Google
                    </LoginButton>*/}
                    </BoxAnimated>
                </Box>
            </KeyboardAvoidingView>
        );
    }
}

export default inject("CurrentUser")(LoginScreen);
