import React, { useReducer, createContext } from 'react';
import { firebaseRef as firebase, cloudFirestore as firestore } from '../config/Firebase';

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'FIRESTORE_CREATE':
            console.log('firestore reducer: DOG_COLECTION_CREATED');
            return {
                ...prevState,
                spinnerIsVisible: false,
                type: 'CREATED',
            };
        case 'FIRESTORE_DELETE':
            console.log('firestore reducer: DOG_COLECTION_DELETED');
            return {
                ...prevState,
                spinnerIsVisible: false,
                type: 'FIRESTORE_DELETE',
            };
        case 'DELETE_FROM_STORAGE':
            return {
                ...prevState,
                spinnerIsVisible: false,
                urlToDeleteFromStorage: action.urlToDeleteFromStorage,
                type: 'DELETE_FROM_STORAGE',
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
                errorMessage: action.errorMessage,
            };
        case 'SHOW_SPINNER':
            return {
                ...prevState,
                type: 'SHOW_SPINNER',
                spinnerIsVisible: true,
            };
        default:
            return prevState;
    }
};

export const FirestoreContext = createContext();

export const FirestoreProvider = ({ children }) => {
    const initialState = {
        spinnerIsVisible: false,
    };
    const [firestoreStatus, dispatch] = useReducer(reducer, initialState);

    const firestoreMethods = {
        addDogToFirestore: async (dogToAdd) => {
            try {
                dispatch({ type: 'SHOW_SPINNER' });
                firestore.collection('dogs').add({ ...dogToAdd, timestamp: firebase.firestore.Timestamp.fromDate(new Date()) });

                // .add({...item, created: firebase.firestore.Timestamp.fromDate(new Date()) })
                dispatch({ type: 'FIRESTORE_CREATE' });
                return { result: true };
            } catch (error) {
                dispatch({ type: 'FIRESTORE_ERROR', errorMessage: error.message });
                return { result: false, errorMessage: error.message };
            }
        },
        deleteDogFromFirestore: (dogData) => {
            firestore.collection('dogs').doc(dogData.id).delete().then(() => {
                dispatch({ type: 'SHOW_SPINNER' });
                console.log('Dog successfully deleted!');
                if (dogData.custom) {
                    dispatch({
                        type: 'DELETE_FROM_STORAGE',
                        urlToDeleteFromStorage: dogData.imageUrl,
                    });
                } else {
                    dispatch({
                        type: 'FIRESTORE_DELETE',
                    });
                }
            })
                .catch((error) => {
                    console.error('Error removing dog: ', error);
                    dispatch({ type: 'FIRESTORE_ERROR', errorMessage: error.message });
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
                            dispatch({
                                type: 'DELETE_FROM_STORAGE',
                                urlToDeleteFromStorage: doc.data().imageUrl,
                            });
                        }
                    }
                });
                return batch.commit();
            }).then(() => {
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
                        dispatch({
                            type: 'DELETE_FROM_STORAGE',
                            urlToDeleteFromStorage: docData.imageUrl,
                        });
                    }
                });
                return batch.commit();
            }).then(() => {
                dispatch({ type: 'FIRESTORE_BATCH_DELETE' });
                console.log('batch delete dog(s) completed');
            });
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
