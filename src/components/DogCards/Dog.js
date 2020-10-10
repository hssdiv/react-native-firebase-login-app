import React, { useState, useContext, useEffect } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DogDeleteModal } from './DogDeleteModal';
import { DogEditModal } from './DogEditModal';
import { cloudFirestore } from '../../config/Firebase';
import { FirestoreContext, DogCardContext, DogsContext } from '../../context';

export const Dog = ({ dogData }) => {
    const [deletionModalIsVisible, setDeletionModalIsVisible] = useState(false);
    const [editModalIsVisible, setEditModalIsVisible] = useState(false);
    const [deleteCheckBoxChecked, setDeleteCheckBoxChecked] = useState(dogData.checked);
    const [imageUrlFromStorage, setImageUrlFromStorage] = useState(null);

    const [checkboxVisible, setCheckboxVisible] = useState(false);

    const { firestoreMethods } = useContext(FirestoreContext);
    const { dogCardModalStatus } = useContext(DogCardContext);
    const { dogsContextMethods } = useContext(DogsContext);

    useEffect(() => {
        const call = async () => {
            if (dogData.imageUrl.includes('firebasestorage')) {
                const response = await fetch(dogData.imageUrl);
                const blob = await response.blob();
                const string = await new Response(blob).text();
                setImageUrlFromStorage(string);
            }
        };
        call();
    }, []);

    useEffect(() => {
        if (dogCardModalStatus) {
            switch (dogCardModalStatus.type) {
                case 'MODAL_DELETE_CONFIRMED':
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
        dogsContextMethods.handleDogCheckboxClick(dogData.id, !deleteCheckBoxChecked);
        setDeleteCheckBoxChecked(!deleteCheckBoxChecked);
    };

    const SelectDogAndShowAllCheckboxes = () => {
        setCheckboxVisible(true);
        // TODO
    };

    return (
        <TouchableOpacity
            onLongPress={SelectDogAndShowAllCheckboxes}
        >
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
                    {imageUrlFromStorage
                        ? (
                            <Image
                                style={styles.dogImage}
                                resizeMode="contain"
                                source={{
                                    uri: `data:image/png;base64,${imageUrlFromStorage}`,
                                }}
                            />
                        )
                        : (
                            <Image
                                style={styles.dogImage}
                                resizeMode="contain"
                                source={{
                                    uri: dogData.imageUrl,
                                }}
                            />
                        )}
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
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    dogCard: {
        borderRadius: 5,
        margin: 10,
        backgroundColor: 'rgb(100, 107, 110)',
        borderColor: 'rgb(100, 107, 110)',
        height: 400,
        minWidth: 260,
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
        height: 240,
    },
    dogIcon: {
        borderColor: 'white',
        borderWidth: 1,
        position: 'relative',
        alignSelf: 'center',
        borderRadius: 5,
        backgroundColor: 'white',
    },
});
