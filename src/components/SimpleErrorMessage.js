import React from 'react'
import { Text, StyleSheet, View } from 'react-native'

export const SimpleErrorMessage = ({ message }) => {
    return (
        <View
            style={styles.container}
        >
            {message &&
                <Text
                    style={styles.message}
                >
                    {message + ' '}
                &#10006;
            </Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    message: {
        color: 'red',
    },
    container: {
        margin: 10
    }
})