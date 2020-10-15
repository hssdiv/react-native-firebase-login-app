import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DogCardContext } from '../../context';

export const DogCheckbox = ({ visible, isChecked }) => {
    const { dogCardModalMethods } = useContext(DogCardContext);

    return (
        visible && (
            isChecked
                ? (
                    <TouchableOpacity
                        onPress={dogCardModalMethods.handleCheckboxClick}
                        style={[styles.dogIcon, {
                            top: 5,
                            right: 225,
                        }]}
                    >
                        <Icon
                            name="checkbox-marked-outline"
                            size={30}
                            color="green"
                        />
                    </TouchableOpacity>
                )
                : (
                    <TouchableOpacity
                        onPress={dogCardModalMethods.handleCheckboxClick}
                        style={[styles.dogIcon, {
                            opacity: 0.7,
                            top: 5,
                            right: 225,
                        }]}
                    >
                        <Icon
                            name="checkbox-blank-outline"
                            size={30}
                            color="black"
                        />
                    </TouchableOpacity>
                )
        )
    );
};

const styles = StyleSheet.create({
    dogIcon: {
        borderColor: 'white',
        borderWidth: 1,
        position: 'absolute',
        alignSelf: 'center',
        borderRadius: 5,
        backgroundColor: 'white',
    },
});
