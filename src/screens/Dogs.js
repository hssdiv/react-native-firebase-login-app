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
import { requestNotificationPermission, setUpNotificationsEventListeners, displayNotification } from '../ui';

export const Dogs = () => {
    const [simpleErrorMsg, setSimpleErrorMsg] = useState(null);

    const orientation = useScreenOrientation();
    const [dogCardsColumnsNumber, setDogCardsColumnsNumber] = useState(1);

    const { dogsContextStatus, dogsContextMethods } = useContext(DogsContext);
    const { storageStatus, storageMethods } = useContext(FirebaseStorageContext);
    const { firestoreStatus, firestoreMethods } = useContext(FirestoreContext);

    const DOGS_PER_PAGE = 3;

    useEffect(() => {
        requestNotificationPermission();
        setUpNotificationsEventListeners();
        console.log('loading Dogs from firestore...');
        firestoreMethods.loadDogsFromFirestore(DOGS_PER_PAGE);
    }, []);

    // TODO delete unneeded dispatch types that don't change anything and only emit signal
    // TODO refreshes everywhere, is that ok?

    useEffect(() => {
        if (orientation === 'PORTRAIT') {
            setDogCardsColumnsNumber(1);
        } else {
            setDogCardsColumnsNumber(2);
        }
    }, [orientation]);

    const loadMoreDogsFromFirestore = () => {
        dogsContextMethods.showLoadMoreSpinner();
        firestoreMethods.loadDogsFromFirestore(firestoreStatus.currentNumberOfDogsLoaded
            + DOGS_PER_PAGE);
    };

    useEffect(() => {
        switch (dogsContextStatus?.type) {
            // TODO move error(s) to context also?
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
            // TODO possible to move this?
            case 'LOADED_DOGS_FROM_FIRESTORE':
                dogsContextMethods.setDogsFromFirestore(firestoreStatus.dogsFromFirestore);
                break;
            case 'ERROR':
                setSimpleErrorMsg(firestoreStatus.errorMessage);
                break;
            case 'FIRESTORE_BATCH_DELETE':
                // TODO probably needed
                dogsContextMethods.hideAllCheckboxes();
                refreshDogs();
                break;
            case 'FIRESTORE_DOG_DELETED':
                refreshDogs();
                break;
            case 'DELETE_FROM_STORAGE':
                // TODO probably needed
                refreshDogs();
                storageMethods.deleteByUrl(firestoreStatus.urlToDeleteFromStorage);
                break;
            case 'FIRESTORE_DOG_ADDED':
                refreshDogs();
                break;
            default:
                break;
        }
    }, [firestoreStatus]);

    const refreshDogs = () => {
        console.log('refreshing');
        if (firestoreStatus.currentNumberOfDogsLoaded > DOGS_PER_PAGE) {
            firestoreMethods.loadDogsFromFirestore(firestoreStatus.currentNumberOfDogsLoaded);
        } else {
            firestoreMethods.loadDogsFromFirestore(DOGS_PER_PAGE);
        }
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
                dogsContextStatus.dogs
                && (
                    dogsContextStatus.dogs.length !== 0
                        ? (
                            <FlatList
                                contentContainerStyle={styles.dogsContainer}
                                numColumns={dogCardsColumnsNumber}
                                key={dogCardsColumnsNumber}
                                keyExtractor={(dog) => dog.id}
                                onEndReached={loadMoreDogsFromFirestore}
                                onEndReachedThreshold={0.1}
                                data={dogsContextStatus.dogs}
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
