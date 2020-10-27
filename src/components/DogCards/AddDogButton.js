import React, { useContext } from 'react';
import {
    TouchableOpacity, StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DogsContext } from '../../context';
import { requestNotificationPermission } from '../../ui';

export const AddDogButton = () => {
    const { dogsContextMethods } = useContext(DogsContext);

    const handleAddDogPress = () => {
        requestNotificationPermission();
        dogsContextMethods.showAddDogModal();
    };

    return (
        <TouchableOpacity
            onPress={handleAddDogPress}
            style={styles.floatingActionButton}
        >
            <Icon
                name="plus"
                color="white"
                size={40}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    floatingActionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: 70,
        height: 70,
        bottom: 30,
        right: 30,
        backgroundColor: '#4CAF50',
        borderRadius: 100,
        elevation: 10,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.7,
    },
});
