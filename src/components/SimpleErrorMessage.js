import React from 'react';
import {
    Text, StyleSheet, View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const SimpleErrorMessage = ({ error, onPress }) => (
    <View
        style={styles.container}
    >
        {error
                && (
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
                )}
    </View>
);

const styles = StyleSheet.create({
    error: {
        color: 'red',
    },
    container: {
        margin: 10,
    },
});
