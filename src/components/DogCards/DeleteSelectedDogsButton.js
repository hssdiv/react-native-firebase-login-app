import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DogsContext } from '../../context';

export const DeleteSelectedDogsButton = () => {
    const { dogsContextStatus, dogsContextMethods } = useContext(DogsContext);

    const handleDeleteSelectedDogs = () => {
        dogsContextMethods.showDeleteSelectedDogsModal();
    };
    return (
        <View
            style={{ marginEnd: 10 }}
        >
            {dogsContextStatus.selectedDogsButtonIsVisible
                 && (
                     <TouchableOpacity
                         onPress={handleDeleteSelectedDogs}
                     >

                         <Icon
                             name="checkbox-marked-outline"
                             size={10}
                             color="red"
                         />
                         <Icon
                             name="delete"
                             size={20}
                             color="red"
                         />
                     </TouchableOpacity>
                 )}
        </View>
    );
};
