import React, { useState, useContext } from 'react';
import {
    Button, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { AuthContext } from '../context';
import { SimpleErrorMessage } from '../components/SimpleErrorMessage';
import { Spinner } from '../components/Spinner';

export const Login = () => {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(null);

    const { authMethods } = useContext(AuthContext);
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);

    const handleSumbit = async () => {
        if (email && password) {
            setSpinnerIsVisible(true);
            const signInResult = await authMethods.signIn(email, password);

            if (!signInResult.result) {
                setError(signInResult.errorMessage);
                setSpinnerIsVisible(false);
            }
        }
    };

    return (
        <View
            style={styles.container}
        >
            <Spinner
                visible={spinnerIsVisible}
            />
            <SimpleErrorMessage
                error={error}
                onPress={() => { setError(null); }}
            />
            <Text
                style={styles.label}
            >
                Email
            </Text>
            <TextInput
                onChangeText={(val) => setEmail(val)}
                style={styles.input}
            />
            <Text
                style={styles.label}
            >
                Password
            </Text>
            <TextInput
                secureTextEntry
                onChangeText={(val) => setPassword(val)}
                style={styles.input}
            />
            <TouchableOpacity
                style={styles.submitButton}
            >
                <Button
                    onPress={handleSumbit}
                    color="white"
                    title="Sign-in"
                    accessibilityLabel="Learn more about this button"
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        padding: 5,
    },
    input: {
        borderWidth: 1,
        padding: 8,
        width: 200,
    },
    submitButton: {
        height: 40,
        width: 160,
        borderRadius: 10,
        backgroundColor: '#4CAF50',
        marginLeft: 50,
        marginRight: 50,
        marginTop: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.7,
    },
});
