import React, { useState, useContext } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DogDeleteModal, DogEditModal } from '.';
import { Spinner } from '..';
import { cloudFirestore as firestore } from '../../config/Firebase';
import { FirestoreContext } from '../../context';

export const Dog = ({ dogData, handleChecked }) => {
    const [deletionModalIsVisible, setDeletionModalIsVisible] = useState(false);
    const [editModalIsVisible, setEditModalIsVisible] = useState(false);
    const [deleteCheckBoxChecked, setDeleteCheckBoxChecked] = useState(dogData.checked);
    
    const { firestoreMethods } = useContext(FirestoreContext);

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);

    const handleDeleteDogButton = () => {
        setDeletionModalIsVisible(true);
    };

    const handleEditDogButton = () => {
        setEditModalIsVisible(true);
    };

    const handleDeleteCheckBox = () => {
        handleChecked(dogData.id, !deleteCheckBoxChecked);
        setDeleteCheckBoxChecked(!deleteCheckBoxChecked);
    };

    const modalDeleteCallback = (result) => {
        switch (result) {
        case 'MODAL_CLOSED':
            setDeletionModalIsVisible(false);
            break;
        case 'MODAL_DELETE_PRESSED':
            setSpinnerIsVisible(true);
            setDeletionModalIsVisible(false);

            firestoreMethods.deleteDogFromFirestore(dogData);
            break;
        default:
        }
    };

    const modalEditCallback = (result) => {
        switch (result.action) {
        case 'MODAL_CLOSED':
            setEditModalIsVisible(false);
            break;
        case 'MODAL_CONFIRM_PRESSED': {
            setEditModalIsVisible(false);
            const db = firestore();
            const updatedDog = {
                breed: result.breed,
                subBreed: result.subBreed,
                imageUrl: dogData.imageUrl,
            };
            db.collection('dogs').doc(dogData.id).set(updatedDog);
            break;
        }
        default:
        }
    };

    const deleteIcon = (
        <TouchableOpacity
            onPress={handleDeleteDogButton}
            style={{
                borderColor: 'white',
                borderWidth: 1,
                position: 'relative',
                top: -270,
                right: -110,
                alignSelf: 'center',
                backgroundColor: 'white',
            }}
        >
            <Icon
                name="delete"
                size={30}
                color="red"
            />
        </TouchableOpacity>
    );

    const editIcon = (
        <TouchableOpacity
            onPress={handleEditDogButton}
            style={{
                borderColor: 'white',
                borderWidth: 1,
                position: 'relative',
                top: -302,
                right: -70,
                alignSelf: 'center',
                backgroundColor: 'white',
            }}
        >
            <Icon
                name="pencil-outline"
                size={30}
                color="black"
            />
        </TouchableOpacity>
    );

    const checkboxIconUnchecked = (
        <TouchableOpacity
            onPress={handleDeleteCheckBox}
            style={{
                opacity: 0.7,
                borderColor: 'white',
                borderWidth: 1,
                position: 'relative',
                top: -238,
                right: 110,
                alignSelf: 'center',
                backgroundColor: 'white',
            }}
        >
            <Icon
                name="checkbox-blank-outline"
                size={30}
                color="black"
            />
        </TouchableOpacity>
    );

    const checkboxIconChecked = (
        <TouchableOpacity
            onPress={handleDeleteCheckBox}
            style={{
                borderColor: 'white',
                borderWidth: 1,
                position: 'relative',
                top: -238,
                right: 110,
                alignSelf: 'center',
                backgroundColor: 'white',
            }}
        >
            <Icon
                name="checkbox-marked-outline"
                size={30}
                color="green"
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.dogCard}>
            {/* {deletionModalIsVisible &&
                <DogDeleteModal
                    title='Deleting dog'
                    text='Do you really want to delete dog?'
                    type='MODAL_DELETE_PRESSED'
                    callback={modalDeleteCallback}
                />
            }
            {editModalIsVisible &&
                <DogEditModal
                    dogData={dogData}
                    callback={modalEditCallback}
                />
            } */}
            <View>
                <Image
                    style={styles.dogImage}
                    resizeMode="contain"
                    source={{
                        uri: dogData.imageUrl,
                    }}
                />
                {deleteCheckBoxChecked

                    ? checkboxIconChecked
                    // handleDeleteCheckBox
                    : checkboxIconUnchecked}

                {deleteIcon}
                {editIcon}
                <View
                    style={styles.dogCardText}
                >
                    {dogData && dogData.breed
                        && (
                            <Text style={styles.dogCardTextView}>
                                breed:
                                {' '}
                                {dogData.breed}
                            </Text>
                        )}
                    {dogData && dogData.subBreed
                        && (
                            <Text style={styles.dogCardTextView}>
                                sub-breed:
                                {' '}
                                {dogData.subBreed}
                            </Text>
                        )}
                </View>
                {spinnerIsVisible
                    && (
                        <Spinner
                            style={
                                {
                                    position: 'relative',
                                    top: 125,
                                    left: 125,
                                }
                            }
                        />
                    )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dogCard: {
        borderRadius: 5,
        marginStart: 50,
        marginEnd: 50,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: 'rgb(100, 107, 110)',
        borderColor: 'rgb(100, 107, 110)',
        height: 500,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.7,
    },
    dogCardText: {
        padding: 4,
        paddingTop: 12,
        color: 'white',
    },
    dogCardTextView: {
        padding: 4,
        paddingTop: 12,
        overflow: 'hidden',
        color: 'white',
        // flexShrink: 1 ??
    },
    dogImage: {
        marginTop: 0,
        paddingTop: 0,
        alignSelf: 'stretch',
        height: 250,
    },
    dogDeleteButton: {
        color: 'red',
        position: 'relative',
        left: 490,
        top: -260,
        opacity: 0.7,
        transform: [
            {
                scale: 3,
            }],
    },
    dogEditButton: {
        color: 'black',
    },
    dogDeleteCheckBox: {
        color: 'black',
    },
});
