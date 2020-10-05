import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DogsContext } from '../../context';


export const DeleteAllDogsButton = () => {
    const { dogMethods } = useContext(DogsContext);

    const handleDeleteAllDogs = () => {
        dogMethods.showDeleteAllDogsModal();
    };
    return (
        <View
            style={{ marginEnd: 10 }}
        >
            <TouchableOpacity
                onPress={handleDeleteAllDogs}
            >
                <Icon
                    name="delete"
                    size={30}
                    color="red"
                />
            </TouchableOpacity>
        </View>
    );
};