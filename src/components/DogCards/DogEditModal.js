import React, { useState, useContext } from 'react';
import {
    Modal, StyleSheet, Text, TextInput, View, TouchableOpacity, Button,
} from 'react-native';
import { SimpleErrorMessage } from '..';
// import { DogCardContext, DogCardErrorContext } from '../../context';
import { DogCardContext } from '../../context';

export const DogEditModal = ({ dogData, visible }) => {
    const [breed, setBreed] = useState(dogData.breed);
    const [subBreed, setSubBreed] = useState(dogData.subBreed ? dogData.subBreed : '');

    const { dogCardModalMethods } = useContext(DogCardContext);
    // const { errorMessageMethods } = useContext(DogCardErrorContext);
    const [error, setError] = useState(null);

    const handleCancelButton = () => {
        // errorMessageMethods.hideError();
        dogCardModalMethods.closeEditModal();
    };

    const handleConfirmButton = () => {
        if (breed === '') {
            // errorMessageMethods.showError('You must type in breed');
            setError('You must type in breed');
        } else {
            // errorMessageMethods.hideError();
            setError(null);
            const updatedDog = { breed, subBreed };
            dogCardModalMethods.confirmEdit(updatedDog);
        }
    };

    return (
        <Modal
            visible={visible}
        >
            <View
                style={styles.container}
            >
                <Text
                    style={styles.title}
                >
                    Edit Dog
                </Text>
                <Text
                    style={styles.text}
                >
                    Change dog data
                </Text>
                <SimpleErrorMessage
                    error={error}
                    onPress={() => { setError(null); }}
                />
                <Text
                    style={styles.label}
                >
                    Breed:
                </Text>
                <TextInput
                    defaultValue={breed}
                    onChangeText={(val) => setBreed(val)}
                    style={styles.input}
                />
                <Text
                    style={styles.label}
                >
                    Sub-breed:
                </Text>
                <TextInput
                    defaultValue={subBreed}
                    onChangeText={(val) => setSubBreed(val)}
                    style={styles.input}
                />
                <TouchableOpacity
                    style={styles.ComfirmButton}
                >
                    <Button
                        onPress={handleConfirmButton}
                        color="white"
                        title="Confirm"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.cancelButton}
                >
                    <Button
                        onPress={handleCancelButton}
                        color="white"
                        title="Cancel"
                    />
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        padding: 5,
        fontSize: 24,
    },
    text: {
        padding: 5,
        fontSize: 16,
    },
    label: {
        padding: 5,
    },
    input: {
        borderWidth: 1,
        padding: 8,
        width: 200,
    },
    ComfirmButton: {
        height: 40,
        width: 160,
        borderRadius: 10,
        backgroundColor: 'green',
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
    cancelButton: {
        height: 40,
        width: 160,
        borderRadius: 10,
        backgroundColor: 'grey',
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
