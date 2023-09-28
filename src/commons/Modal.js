import React from 'react';
import { FlatList, Modal as M, RefreshControl, ScrollView } from "react-native"
import { Box } from 'react-native-design-utility';
import CloseBtn from './CloseBtn';
import { theme } from '../constants/theme';


const Modal = ({ children, closeFunc, show }) => (
    <M visible={show} transparent={true} animationType="slide" >
        <Box bg="rgba(255,255,255,.8)" f={1} pv="sm" center>
            <Box f={.1} mt="lg" self="start" ml="sm" bg="white" >
                <CloseBtn color={theme.color.gold} size={30} onPress={closeFunc} style={{ width: 30, height: 30 }} />
            </Box>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={closeFunc} 
                        tintColor="#fff"
                        titleColor="#fff"
                    />
                }
                data={[1]}
                renderItem={item => children}
                keyExtractor={(item) => item + ""}
                refreshing={false}
                onRefresh={closeFunc}
            />
        </Box>
    </M>
)

export default Modal;