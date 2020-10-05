import React, { useContext } from 'react';
import {
    Modal, Text, View, Button, TouchableOpacity, StyleSheet,
} from 'react-native';
import { DogCardContext } from '../../context';

export const DogDeleteModal = ({
    visible, title, text, type,
}) => {
    const { dogCardModalMethods } = useContext(DogCardContext);

    const handleCancelButton = () => {
        dogCardModalMethods.closeDeleteModal();
    };

    const handleDeleteConfirmButton = () => {
        if (type === 'DOG_MODAL_DELETE') {
            dogCardModalMethods.confirmDelete();
        }
    };

    return (
        <Modal
            visible={visible}
            supportedOrientations={['portrait', 'landscape']}
        >
            <View
                style={styles.container}
            >
                <Text
                    style={styles.title}
                >
                    {title}
                </Text>
                <Text
                    style={styles.text}
                >
                    {text}
                </Text>
                <TouchableOpacity
                    style={styles.deleteButton}
                >
                    <Button
                        onPress={handleDeleteConfirmButton}
                        color="white"
                        title="Delete"
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
    input: {
        borderWidth: 1,
        padding: 8,
        width: 200,
    },
    deleteButton: {
        height: 40,
        width: 160,
        borderRadius: 10,
        backgroundColor: 'red',
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
