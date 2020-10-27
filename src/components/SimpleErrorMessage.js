import React from 'react';
import {
    Text, StyleSheet, View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const SimpleErrorMessage = ({ error, onPress }) => (
    error
        ? (
            <View
                style={styles.container}
            >
                <TouchableOpacity
                    onPress={onPress}
                >
                    <Text
                        style={styles.error}
                    >
                        {error}
                        &#10006;
                    </Text>
                </TouchableOpacity>
            </View>
        )
        : null
);

const styles = StyleSheet.create({
    error: {
        color: 'red',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
});
