import React, { useState, useEffect, useContext } from 'react';
import {
    View, StyleSheet, Text, Platform, RefreshControl,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
    AddDogButton, DogsDeleteModal, DogAddModal, Dog,
} from '../components/DogCards';
import { Spinner, SimpleErrorMessage } from '../components';
import {
    DogsContext, FirebaseStorageContext, FirestoreContext,
    DogCardProvider,
} from '../context';
import { useScreenOrientation } from '../util/useScreenOrientation';
import { requestNotificationPermission, setUpNotificationEventListeners, displayNotification } from '../ui';

export const Dogs = () => {
    const [dogs, setDogs] = useState(null);
    const [simpleErrorMsg, setSimpleErrorMsg] = useState(null);

    const orientation = useScreenOrientation();
    const [dogsColumnsNumber, setDogsColumnsNumber] = useState(1);

    const { dogsContextStatus, dogsContextMethods } = useContext(DogsContext);

    const { storageStatus, storageMethods } = useContext(FirebaseStorageContext);
    const { firestoreStatus, firestoreMethods } = useContext(FirestoreContext);

    const dogsPerPage = 3;

    useEffect(() => {
        requestNotificationPermission();
        setUpNotificationEventListeners();
        console.log('loading Dogs from firestore...');
        firestoreMethods.loadDogsFromFirestore(dogsPerPage);
    }, []);

    useEffect(() => {
        if (orientation === 'PORTRAIT') {
            setDogsColumnsNumber(1);
        } else {
            setDogsColumnsNumber(2);
        }
    }, [orientation]);

    const loadMoreDogs = () => {
        // TODO show footer spinner
        firestoreMethods.loadDogsFromFirestore(firestoreStatus.currentDogsLoaded + dogsPerPage);
    };

    useEffect(() => {
        switch (dogsContextStatus?.type) {
            case 'DOGS_LOADED':
                setDogs(dogsContextStatus.dogs);
                // TODO is it possible to move dogs to context? create DOGS_CHANGED(updated?)
                // (helps to get rid of dog_check_box_clicked also)
                // to set them again or smth or just get them from context directly
                // TODO move error(s) to context also?
                break;
            case 'DOG_CHECKBOX_CLICKED':
                const { id } = dogsContextStatus;
                const { isSelected } = dogsContextStatus;
                const dogsWithSelectedDog = dogs.map((dog) => {
                    if (dog.id === id) {
                        return {
                            ...dog,
                            selected: isSelected,
                        };
                    }
                    return dog;
                });
                dogsContextMethods.updateDogs(dogsWithSelectedDog);
                break;
            case 'ERROR':
                setSimpleErrorMsg(dogsContextStatus.error);
                break;
            default:
                break;
        }
    }, [dogsContextStatus]);

    useEffect(() => {
        switch (storageStatus?.type) {
            case 'ADD_CUSTOM_DOG_TO_FIRESTORE':
                // TODO needed
                firestoreMethods.addDogToFirestore(storageStatus.dogToAdd);
                break;
            case 'ERROR':
                setSimpleErrorMsg(storageStatus.errorMessage);
                break;
            // TODO call notifications directly from context?
            // ask for permissions after custom add confirm button?
            case 'UPDATE_PROGRESS_BAR':
                if (Platform.OS === 'android') {
                    displayNotification('Custom dog picture:', '', 'PROGRESS', storageStatus.percentage);
                }
                break;
            case 'DOG_PICTURE_UPLOADED':
                displayNotification('Custom dog picture:', 'upload complete');
                break;
            default:
                break;
        }
    }, [storageStatus]);

    useEffect(() => {
        switch (firestoreStatus?.type) {
            case 'LOADED_DOGS_FROM_FIRESTORE':
                // TODO looks like it's needed also
                dogsContextMethods.setDogsFromFirestore(dogs, firestoreStatus.dogsFromFirestore);
                break;
            case 'ERROR':
                setSimpleErrorMsg(firestoreStatus.errorMessage);
                break;
            case 'FIRESTORE_BATCH_DELETE':
                // TODO probably needed
                dogsContextMethods.hideAllCheckboxes();
                refreshDogs();
                break;
            case 'DELETE_FROM_STORAGE':
                // TODO probably needed
                storageMethods.deleteByUrl(firestoreStatus.urlToDeleteFromStorage);
                break;
            default:
                break;
        }
    }, [firestoreStatus]);

    useEffect(() => {
        // TODO i guess this might be moved to context with dogs
        if ((dogs) && (dogs.find((selectedDog) => selectedDog.selected === true))) {
            dogsContextMethods.deleteSelectedButtonEnabled();
        } else {
            dogsContextMethods.deleteSelectedButtonDisabled();
            dogsContextMethods.hideAllCheckboxes();
        }
    }, [dogs]);

    const refreshDogs = () => {
        console.log('refreshing');
        firestoreMethods.loadDogsFromFirestore(firestoreStatus.currentDogsLoaded);
        // TODO on edit of dog, call refreshDogs() to see new edit
        // TODO update on delete all/selected, and update on add(random/custom)
    };

    return (
        <View
            style={{ flex: 1 }}
        >
            <DogAddModal
                visible={dogsContextStatus.addDogModalIsVisible}
            />
            <DogsDeleteModal
                visible={dogsContextStatus.deleteModalIsVisible}
                title="Delete dog(s)"
                text="Are you sure you want to delete selected dog(s)?"
                type="MODAL_DELETE_SELECTED_PRESSED"
            />
            <DogsDeleteModal
                visible={dogsContextStatus.deleteAllModalIsVisible}
                title="Delete all dogs"
                text="Are you sure you want to delete all dogs?"
                type="MODAL_DELETE_ALL_PRESSED"
            />
            <SimpleErrorMessage
                error={simpleErrorMsg}
                onPress={() => { setSimpleErrorMsg(null); }}
            />
            {
                dogs
                && (
                    dogs.length !== 0
                        ? (
                            <FlatList
                                contentContainerStyle={styles.dogsContainer}
                                numColumns={dogsColumnsNumber}
                                key={dogsColumnsNumber}
                                keyExtractor={(dog) => dog.id}
                                onEndReached={loadMoreDogs}
                                onEndReachedThreshold={0.1}
                                data={dogs}
                                ListFooterComponent={
                                    () => (
                                        <Spinner
                                            visible={dogsContextStatus.loadMoreSpinnerIsVisible}
                                        />
                                    )
                                }
                                ListFooterComponentStyle={{ marginTop: 20 }}
                                refreshControl={(
                                    <RefreshControl
                                        colors={['#9Bd35A', '#689F38']}
                                        refreshing={dogsContextStatus.refreshSpinnerIsVisible}
                                        onRefresh={refreshDogs}
                                    />
                                )}
                                renderItem={
                                    ({ item }) => (
                                        <DogCardProvider>
                                            <Dog
                                                dogData={item}
                                            />
                                        </DogCardProvider>
                                    )
                                }
                            />
                        )
                        : (
                            <View
                                style={styles.hint}
                            >
                                <Text>
                                    Add dog(s) to display.
                                </Text>
                            </View>
                        )
                )
            }
            <AddDogButton />
            <Spinner
                visible={
                    dogsContextStatus.spinnerIsVisible
                    || storageStatus.spinnerIsVisible
                    || firestoreStatus.spinnerIsVisible
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    dogsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        alignSelf: 'center',
        marginStart: 50,
        marginEnd: 50,
    },
    hint: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
