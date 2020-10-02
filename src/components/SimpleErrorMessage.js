import React, { useState, useContext, useEffect } from 'react';
import {
    Text, StyleSheet, View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DogCardErrorContext } from '../context';

export const SimpleErrorMessage = ({ error, onPress }) => {
    // const [error, setError] = useState(null);

    /* useEffect(() => {
        if (errorMessageStatus && errorMessageStatus.errorMessage) {
            setError(errorMessageStatus.errorMessage);
        } else {
            setError(null);
        }
    }, [props, errorMessageStatus]); */

    const handleCloseButton = () => {
        // errorMessageMethods.hideError();
        // setError(null);
    };

    // const { errorMessageStatus, errorMessageMethods } = useContext(DogCardErrorContext);

    return (
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
};

const styles = StyleSheet.create({
    error: {
        color: 'red',
    },
    container: {
        margin: 10,
    },
});
