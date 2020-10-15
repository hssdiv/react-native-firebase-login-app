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
        dogsContextStatus.selectedDogsButtonIsVisible
                 && (
                     <View
                         style={{
                             marginEnd: 10,
                             color: 'red',
                             backgroundColor: 'white',
                             overflow: 'hidden',
                             borderColor: 'white',
                             borderWidth: 1,
                             borderRadius: 14,
                             width: 31,
                             alignItems: 'center',
                         }}
                     >
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
                     </View>
                 )
    );
};
