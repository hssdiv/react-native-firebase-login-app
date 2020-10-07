import React from 'react';
import {
    Text, View, TouchableOpacity, StyleSheet,
} from 'react-native';

export const AddDogCard = ({ onClick }) => (
    <View
        style={styles.dogCard}
    >
        <TouchableOpacity
            onPress={onClick}
            style={{ flexGrow: 1, justifyContent: 'center' }}
        >
            <Text
                style={styles.dogAddText}
            >
                &#10010;
            </Text>
            <Text style={styles.dogAddText}>
                Add Dog
            </Text>

        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    dogCard: {
        borderRadius: 5,
        margin: 10,
        backgroundColor: 'rgb(100, 107, 110);',
        color: 'white',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.7,
        justifyContent: 'center',
        height: 400,
        flexBasis: 300,
    },
    dogAddText: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 24,

    },
});
