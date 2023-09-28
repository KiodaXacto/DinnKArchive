import * as React from 'react';
import { Button, Image, Platform, Alert } from 'react-native';
import * as  expoImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Box } from 'react-native-design-utility';
import { images } from "../constants/images";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { image } from '../models/types';
import { strings } from '../lang';

export default class ImagePicker extends React.Component {
    state = {
        image: this.props.image,
        base64: null,
        type: null,
    };

    render() {
        let { image } = this.state;
        const { imgStyle, btnStyle, editable } = this.props

        return (
            <TouchableOpacity onPress={editable?this._pickImage:undefined} style={[{ width: 220, height: 220, padding: 10 }, btnStyle]}>
                <Box circle={50} avatar shadow={1}>
                    <Image source={image ? { uri: image } : images.profile} style={[{ width: 200, height: 200, borderRadius: 100 }, imgStyle]} />
                </Box>
            </TouchableOpacity>
        );
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    _pickImage = async () => {
        const { callback } = this.props
        try {
            let result = await expoImagePicker.launchImageLibraryAsync({

                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true,

            });
            
            !result.cancelled && Alert.alert(
                strings.areYouSure,
                `${result.uri.split("/").pop()}`,
                [
                    {
                        text: "Ok",
                        onPress: () =>this.accept.bind(this)(result, callback)
                    },
                    {
                        text: "Cancel",
                        onPress: () => (null),
                        style: "cancel"
                    },
                ],
                { cancelable: false }
            );
            
        } catch (E) {
            console.log(E);
        }
    };

    accept(result, callback){
        let image = undefined;
        if (!result.cancelled) {
            this.setState({
                image: result.uri,
                base64: result.base64,
                type: "image/jpeg"
            });
            image = {
                ...result,
                uri: result.uri,
                type: "image/jpeg",
                name: result.uri.split("/").pop()
            }


            delete image.image

        } else {
            this.setState({
                image: null,
                base64: null,
                type: null
            })
        }

        if (callback && typeof callback === "function") {
            callback(image);
        }

    }
}