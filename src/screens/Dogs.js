import React, { useState, useEffect, useContext } from 'react';
import {
    View, StyleSheet, Text, Platform,
} from 'react-native';
import notifee, { IOSAuthorizationStatus, EventType } from '@notifee/react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
    AddDogButton, DogsDeleteModal, DogAddModal, Dog,
} from '../components/DogCards';
import { cloudFirestore as firestore } from '../config/Firebase';
import { Spinner, SimpleErrorMessage } from '../components';
import {
    DogsContext, FirebaseStorageContext, FirestoreContext,
    DogCardProvider,
} from '../context';
import { useScreenOrientation } from '../util/useScreenOrientation';

export const Dogs = () => {
    const [dogs, setDogs] = useState(null);
    const [simpleErrorMsg, setSimpleErrorMsg] = useState(null);

    const orientation = useScreenOrientation();
    const [dogsColumnsNumber, setDogsColumnsNumber] = useState(1);

    const { dogsContextStatus, dogsContextMethods } = useContext(DogsContext);

    const { storageStatus, storageMethods } = useContext(FirebaseStorageContext);
    const { firestoreStatus, firestoreMethods } = useContext(FirestoreContext);

    const [dogsListener, setDogsListener] = useState(null);

    const dogsPerPage = 3;
    const [currentDogsLoaded, setCurrentDogsLoaded] = useState(0);

    const [dogsListenerData, setDogsListenerData] = useState(null);

    useEffect(() => {
        requestNotificationPermission();
        console.log('loading Dogs from firestore...');
        loadMoreDogs();
    }, []);

    useEffect(() => {
        if (orientation === 'PORTRAIT') {
            setDogsColumnsNumber(1);
        } else {
            setDogsColumnsNumber(2);
        }
    }, [orientation]);

    const loadMoreDogs = () => {
        if (dogsListener) {
            dogsListener();
        }
        setDogsListener(() => getDogsListener(currentDogsLoaded + dogsPerPage));
    };

    const getDogsListener = (limit) => firestore.collection('dogs')
        .limit(limit)
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
            const dogsData = [];
            setCurrentDogsLoaded(snapshot.docs.length);

            snapshot.forEach(
                (doc) => (
                    dogsData.push(
                        {
                            id: doc.id, ...doc.data(),
                        },
                    )
                ),
            );

            // dogsContextMethods.setDogsFromFirestore(dogs, dogsData);
            setDogsListenerData(dogsData);
        });

    useEffect(() => {
        if (dogsListenerData) {
            dogsContextMethods.setDogsFromFirestore(dogs, dogsListenerData);
            setDogsListenerData(null);
        }
    }, [dogsListenerData]);

    useEffect(() => {
        switch (dogsContextStatus?.type) {
            case 'MODAL_ADD_DOG_CONFIRMED_RANDOM':
                dogsContextMethods.getRandomDogFromAPI();
                break;
            case 'GOT_RANDOM_DOG_FROM_API':
                try {
                    firestoreMethods.addDogToFirestore(dogsContextStatus.dogToAdd);
                } catch (firestoreError) {
                    setSimpleErrorMsg(firestoreError);
                }
                break;
            case 'MODAL_ADD_DOG_CONFIRMED_CUSTOM':
                storageMethods.addCustomDog(dogsContextStatus.dogToAdd);
                break;
            case 'MODAL_DELETE_SELECTED_PRESSED':
                firestoreMethods.deleteSelected(dogs);
                break;
            case 'MODAL_DELETE_ALL_PRESSED':
                firestoreMethods.deleteAll();
                break;
            case 'DOGS_LOADED':
                setDogs(dogsContextStatus.dogs);
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
                firestoreMethods.addDogToFirestore(storageStatus.dogToAdd);
                break;
            case 'ERROR':
                setSimpleErrorMsg(storageStatus.errorMessage);
                break;
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

    useEffect(() => notifee.onForegroundEvent(({ type }) => {
        if (type === EventType.PRESS) {
            notifee.cancelNotification('progressNotification');
        }
    }), []);

    useEffect(() => notifee.onBackgroundEvent(({ type }) => {
        if (type === EventType.PRESS) {
            notifee.cancelNotification('progressNotification');
        }
    }), []);

    const displayNotification = async (notificationTitle, notificationText, type, progress) => {
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        if (type === 'PROGRESS') {
            await notifee.displayNotification({
                title: notificationTitle,
                id: 'progressNotification',
                android: {
                    channelId,
                    progress: {
                        max: 100,
                        current: progress,
                    },
                },
            });
        } else {
            await notifee.displayNotification({
                id: 'progressNotification',
                title: notificationTitle,
                body: notificationText,
                android: {
                    channelId,
                },
            });
        }
    };
    const requestNotificationPermission = async () => {
        const settings = await notifee.requestPermission();
        if (settings.authorizationStatus >= IOSAuthorizationStatus.AUTHORIZED) {
            console.log('Permissions: IOSAuthorizationStatus.AUTHORIZED');
        } else {
            console.log('User declined permissions');
        }
    };

    useEffect(() => {
        switch (firestoreStatus?.type) {
            case 'ERROR':
                setSimpleErrorMsg(firestoreStatus.errorMessage);
                break;
            case 'FIRESTORE_BATCH_DELETE':
                dogsContextMethods.hideAllCheckboxes();
                break;
            case 'DELETE_FROM_STORAGE':
                storageMethods.deleteByUrl(firestoreStatus.urlToDeleteFromStorage);
                break;
            default:
                break;
        }
    }, [firestoreStatus]);

    useEffect(() => {
        if ((dogs) && (dogs.find((selectedDog) => selectedDog.selected === true))) {
            dogsContextMethods.deleteSelectedButtonEnabled();
        } else {
            dogsContextMethods.deleteSelectedButtonDisabled();
            dogsContextMethods.hideAllCheckboxes();
        }
    }, [dogs]);

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
        </View >
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
