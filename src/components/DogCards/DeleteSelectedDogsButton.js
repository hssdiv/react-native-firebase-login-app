import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DogsContext } from '../../context';

export const DeleteSelectedDogsButton = () => {
    const { dogContextStatus, dogMethods } = useContext(DogsContext);

    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (dogContextStatus) {
            switch (dogContextStatus.type) {
                case 'DELETE_SELECTED_BUTTON_ENABLED':
                    setDisabled(false);
                    break;
                case 'DELETE_SELECTED_BUTTON_DISABLED':
                    setDisabled(true);
                    break;
                default:
                    break;
            }
        }
    }, [dogContextStatus]);

    const handleDeleteSelectedDogs = () => {
        dogMethods.showDeleteSelectedDogsModal();
    };
    return (
        <View
            style={{ marginEnd: 10 }}
        >
            {disabled
                ? (
                    <TouchableOpacity>
                        <Icon
                            name="checkbox-marked-outline"
                            size={10}
                            color="red"
                            style={{ opacity: 0.5 }}
                        />
                        <Icon
                            name="delete"
                            size={20}
                            color="red"
                            style={{ opacity: 0.5 }}
                        />
                    </TouchableOpacity>
                )
                : (
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
