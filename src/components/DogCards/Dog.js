import React, { useState, useContext, useEffect } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DogDeleteModal } from './DogDeleteModal';
import { DogEditModal } from './DogEditModal';
import { Spinner } from '../Spinner';
import { cloudFirestore } from '../../config/Firebase';
import { FirestoreContext, DogCardContext } from '../../context';

export const Dog = ({ dogData, handleChecked }) => {
    const [deletionModalIsVisible, setDeletionModalIsVisible] = useState(false);
    const [editModalIsVisible, setEditModalIsVisible] = useState(false);
    const [deleteCheckBoxChecked, setDeleteCheckBoxChecked] = useState(dogData.checked);

    const { firestoreMethods } = useContext(FirestoreContext);

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);

    const { dogCardModalStatus } = useContext(DogCardContext);

    useEffect(() => {
        if (dogCardModalStatus) {
            switch (dogCardModalStatus.type) {
                case 'MODAL_DELETE_CONFIRMED':
                    setSpinnerIsVisible(true);
                    setDeletionModalIsVisible(false);
                    firestoreMethods.deleteDogFromFirestore(dogData);
                    break;
                case 'MODAL_DELETE_CLOSED':
                    setDeletionModalIsVisible(false);
                    break;
                case 'MODAL_EDIT_CONFIRMED': {
                    setEditModalIsVisible(false);
                    const { updatedDog } = dogCardModalStatus;
                    updatedDog.imageUrl = dogData.imageUrl;
                    cloudFirestore.collection('dogs').doc(dogData.id).set(updatedDog);
                    break;
                }
                case 'MODAL_EDIT_CLOSED':
                    setEditModalIsVisible(false);
                    break;
                default:
                    break;
            }
        }
    }, [dogCardModalStatus]);

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

    return (
        <View style={styles.dogCard}>
            <DogDeleteModal
                visible={deletionModalIsVisible}
                title="Deleting dog"
                text="Do you really want to delete dog?"
                type="DOG_MODAL_DELETE"
            />
            <DogEditModal
                visible={editModalIsVisible}
                dogData={dogData}
            />
            <View>
                <Image
                    style={styles.dogImage}
                    resizeMode="contain"
                    source={{
                        uri: dogData.imageUrl,
                    }}
                />
                {deleteCheckBoxChecked
                    ? (
                        <TouchableOpacity
                            onPress={handleDeleteCheckBox}
                            style={[styles.dogIcon, {
                                top: -238,
                                right: 110,
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
                            onPress={handleDeleteCheckBox}
                            style={[styles.dogIcon, {
                                opacity: 0.7,
                                top: -238,
                                right: 110,
                            }]}
                        >
                            <Icon
                                name="checkbox-blank-outline"
                                size={30}
                                color="black"
                            />
                        </TouchableOpacity>
                    )}

                <TouchableOpacity
                    onPress={handleDeleteDogButton}
                    style={[styles.dogIcon, {
                        top: -270,
                        right: -110,

                    }]}
                >
                    <Icon
                        name="delete"
                        size={30}
                        color="red"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleEditDogButton}
                    style={[styles.dogIcon, {
                        top: -302,
                        right: -70,
                    }]}
                >
                    <Icon
                        name="pencil-outline"
                        size={30}
                        color="black"
                    />
                </TouchableOpacity>
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
                        ? (
                            <Text style={styles.dogCardTextView}>
                                sub-breed:
                                {' '}
                                {dogData.subBreed}
                            </Text>
                        )
                        : (
                            <View />
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
        height: 400,
        flexBasis: 300,
        flexGrow: 0.5,
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
        color: 'white',
    },
    dogCardTextView: {
        padding: 4,
        overflow: 'hidden',
        color: 'white',
        alignSelf: 'center',
    },
    dogImage: {
        marginTop: 0,
        paddingTop: 0,
        alignSelf: 'stretch',
        height: 250,
    },
    dogIcon: {
        borderColor: 'white',
        borderWidth: 1,
        position: 'relative',
        alignSelf: 'center',
        backgroundColor: 'white',
    },
});
