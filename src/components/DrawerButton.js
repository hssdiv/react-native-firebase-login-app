import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const DrawerButton = ({ navigation }) => (
    <TouchableOpacity
        onPress={() => navigation.toggleDrawer()}
    >
        <View
            style={{ marginStart: 10 }}
        >
            <Text
                style={{ color: 'black', fontSize: 16 }}
            >
                &#9776;
            </Text>
        </View>
    </TouchableOpacity>

);
