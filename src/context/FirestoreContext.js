import React, { useReducer, createContext } from 'react';
import { cloudFirestore as firestore } from '../config/Firebase';
import { firestoreDogCollectionAdd, storageDeleteByUrl } from '../api';
import { DOGS_PER_PAGE } from '../constants';

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'LOADED_DOGS_FROM_FIRESTORE':
            return {
                ...prevState,
                type: 'LOADED_DOGS_FROM_FIRESTORE',
                dogsFromFirestore: action.dogsFromFirestore,
                currentNumberOfDogsLoaded: action.currentNumberOfDogsLoaded,
            };
        case 'FIRESTORE_DOG_ADDED':
            return {
                ...prevState,
                spinnerIsVisible: false,
                type: 'FIRESTORE_DOG_ADDED',
            };
        case 'FIRESTORE_DOG_DELETED':
            return {
                ...prevState,
                spinnerIsVisible: false,
                type: 'FIRESTORE_DOG_DELETED',
            };
        case 'DELETED_FROM_STORAGE':
            return {
                ...prevState,
                spinnerIsVisible: false,
                type: 'DELETED_FROM_STORAGE',
            };
        case 'FIRESTORE_BATCH_DELETE':
            console.log('firestore reducer: BATCH_DELETED');
            return {
                ...prevState,
                spinnerIsVisible: false,
                type: 'FIRESTORE_BATCH_DELETE',
            };
        case 'FIRESTORE_UPDATE':
            console.log('firestore reducer: DOG_COLLECTION_UPDATED');
            return {
                ...prevState,
                type: 'UPDATED',
            };
        case 'FIRESTORE_ERROR':
            console.log('firestore reducer: firebase storage error');
            return {
                ...prevState,
                type: 'ERROR',
                spinnerIsVisible: false,
                error: action.error,
            };
        case 'SHOW_SPINNER':
            return {
                ...prevState,
                type: 'SHOW_SPINNER',
                spinnerIsVisible: true,
            };
        case 'CLEAR_ERROR_MESSAGE':
            return {
                ...prevState,
                error: null,
            };
        default:
            return prevState;
    }
};

export const FirestoreContext = createContext();

export const FirestoreProvider = ({ children }) => {
    const initialState = {
        spinnerIsVisible: false,
        currentNumberOfDogsLoaded: 0,
    };
    const [firestoreStatus, dispatch] = useReducer(reducer, initialState);

    const firestoreMethods = {
        loadDogsFromFirestore: (amount) => {
            firestore.collection('dogs')
                .limit(amount)
                .orderBy('timestamp', 'desc')
                .get()
                .then((snapshot) => {
                    const dogsData = [];
                    const currentNumberOfDogsLoaded = snapshot.docs.length;

                    snapshot.forEach(
                        (doc) => (
                            dogsData.push(
                                {
                                    id: doc.id, ...doc.data(),
                                },
                            )
                        ),
                    );
                    dispatch({
                        type: 'LOADED_DOGS_FROM_FIRESTORE',
                        currentNumberOfDogsLoaded,
                        dogsFromFirestore: dogsData,
                    });
                });
        },
        addDogToFirestore: async (dogToAdd) => {
            try {
                dispatch({ type: 'SHOW_SPINNER' });

                firestoreDogCollectionAdd(dogToAdd);

                firestoreMethods.refreshDogs();

                dispatch({ type: 'FIRESTORE_DOG_ADDED' });
                return { result: true };
            } catch (error) {
                dispatch({
                    type: 'FIRESTORE_ERROR',
                    error: error.message,
                });
                return {
                    result: false,
                    error: error.message,
                };
            }
        },
        refreshDogs: () => {
            console.log('refreshing');
            if (firestoreStatus.currentNumberOfDogsLoaded > DOGS_PER_PAGE) {
                firestoreMethods.loadDogsFromFirestore(firestoreStatus.currentNumberOfDogsLoaded);
            } else {
                firestoreMethods.loadDogsFromFirestore(DOGS_PER_PAGE);
            }
        },
        deleteDogFromFirestore: (dogData) => {
            firestore.collection('dogs').doc(dogData.id).delete().then(async () => {
                dispatch({ type: 'SHOW_SPINNER' });
                console.log('Dog successfully deleted!');
                if (dogData.custom) {
                    await storageDeleteByUrl(dogData.imageUrl);
                    dispatch({
                        type: 'DELETED_FROM_STORAGE',
                    });
                }

                firestoreMethods.refreshDogs();

                dispatch({
                    type: 'FIRESTORE_DOG_DELETED',
                });
            })
                .catch((error) => {
                    console.error('Error removing dog: ', error);
                    dispatch({
                        type: 'FIRESTORE_ERROR',
                        error: error.message,
                    });
                });
        },
        deleteSelected: (dogs) => {
            const selectedDogs = dogs.filter((dog) => dog.selected);
            firestore.collection('dogs').get().then((querySnapshot) => {
                dispatch({ type: 'SHOW_SPINNER' });
                const batch = firestore.batch();

                querySnapshot.forEach((doc) => {
                    if (selectedDogs.find((selectedDog) => (doc.id === selectedDog.id))) {
                        batch.delete(doc.ref);

                        if (doc.custom) {
                            try {
                                storageDeleteByUrl(doc.data().imageUrl);
                            } catch (error) {
                                dispatch({
                                    type: 'FIRESTORE_ERROR',
                                    error: error.message,
                                });
                            }
                        }
                    }
                });
                return batch.commit();
            }).then(() => {
                firestoreMethods.refreshDogs();
                dispatch({ type: 'FIRESTORE_BATCH_DELETE' });
                console.log('batch delete dog(s) completed');
            });
        },
        deleteAll: () => {
            firestore.collection('dogs').get().then((querySnapshot) => {
                dispatch({ type: 'SHOW_SPINNER' });
                const batch = firestore.batch();

                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                    const docData = doc.data();
                    if (docData.custom) {
                        try {
                            storageDeleteByUrl(docData.imageUrl);
                        } catch (error) {
                            dispatch({
                                type: 'FIRESTORE_ERROR',
                                error: error.message,
                            });
                        }
                    }
                });
                return batch.commit();
            }).then(() => {
                firestoreMethods.refreshDogs();
                dispatch({ type: 'FIRESTORE_BATCH_DELETE' });
                console.log('batch delete dog(s) completed');
            });
        },
        clearErrorMessage: () => {
            dispatch({ type: 'CLEAR_ERROR_MESSAGE' });
        },
    };

    return (
        <FirestoreContext.Provider
            value={{
                firestoreStatus,
                firestoreMethods,
            }}
        >
            {children}
        </FirestoreContext.Provider>
    );
};
