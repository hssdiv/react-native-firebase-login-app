import React, { useContext, useState } from 'react'
import { AuthContext, SpinnerContext } from '../context'
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SimpleErrorMessage } from '../components/SimpleErrorMessage'
import { SafeAreaView } from 'react-native-safe-area-context'

export const Registration = () => {
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [repeatedPassword, setRepeatedPassword] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)

    const { authMethods } = useContext(AuthContext)
    const { spinnerMethods } = useContext(SpinnerContext)

    const handleSumbit = async () => {
        if (email && password && repeatedPassword) {
            if (password === repeatedPassword) {
                spinnerMethods.showSpinner();
                const signInResult = await authMethods.signUp(email, password);
                spinnerMethods.hideSpinner();
                if (!signInResult.result) {
                    console.log(signInResult)
                    setErrorMsg(signInResult.errorMessage)
                } else {
                    //TODO go to Login
                }
            } else {
                setErrorMsg('passwords don\'t match')
            }
        }
    }

    const handleErrorClose = () => {
        setErrorMsg(null)
        console.log('click')
    }

    return (
        <View
            style={styles.container}>
            <TouchableOpacity
                onPress={handleErrorClose}
            >
                <SimpleErrorMessage
                    message={errorMsg}
                />
            </TouchableOpacity>

            <Text
                style={styles.label}
            >
                Email
            </Text>
            <TextInput
                onChangeText={val => setEmail(val)}
                style={styles.input}
            />
            <Text
                style={styles.label}
            >
                Password
            </Text>
            <TextInput
                secureTextEntry={true}
                onChangeText={val => setPassword(val)}
                style={styles.input}
            />
            <Text
                style={styles.label}
            >
                Repeat password
            </Text>
            <TextInput
                secureTextEntry={true}
                onChangeText={val => setRepeatedPassword(val)}
                style={styles.input}
            />
            <TouchableOpacity
                style={styles.submitButton}
            >
                <Button
                    onPress={handleSumbit}
                    color="white"
                    title="Sign-up"
                    accessibilityLabel="Learn more about this button"
                />
            </TouchableOpacity>
        </View>
    )
}

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
        backgroundColor: "#4CAF50",
        marginLeft: 50,
        marginRight: 50,
        marginTop: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.7
    }
});