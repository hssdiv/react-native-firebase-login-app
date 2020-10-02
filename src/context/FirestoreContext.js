import React, { useReducer, useContext, createContext } from 'react';
import { FirebaseStorageContext } from './FirebaseStorageContext';
import { cloudFirestore as firestore } from '../config/Firebase';

const reducer = (state, action) => {
    switch (action.type) {
        case 'FIRESTORE_CREATE':
            console.log('firestore reducer: DOG_COLECTION_CREATED');
            return { status: 'CREATED' };
        case 'FIRESTORE_DELETE':
            console.log('firestore reducer: DOG_COLECTION_DELETED');
            return { status: 'DELETED' };
        case 'FIRESTORE_BATCH_DELETE':
            console.log('firestore reducer: BATCH_DELETED');
            return { status: 'BATCH_DELETED' };
        case 'FIRESTORE_UPDATE':
            console.log('firestore reducer: DOG_COLLECTION_UPDATED');
            return { status: 'UPDATED' };
        case 'FIRESTORE_ERROR':
            console.log('firestore reducer: firebase storage error');
            return { status: 'ERROR', errorMessage: action.errorMessage };
        default:
            return state;
    }
};

export const FirestoreContext = createContext();

export const FirestoreProvider = ({ children }) => {
    const { storageMethods } = useContext(FirebaseStorageContext);

    const initialState = null;
    const [firestoreStatus, dispatch] = useReducer(reducer, initialState);

    const firestoreMethods = {
        addDogToFirestore: async (dogToAdd) => {
            try {
                firestore.collection('dogs').add(dogToAdd);
                dispatch({ type: 'FIRESTORE_CREATE' });
                return { result: true };
            } catch (error) {
                dispatch({ type: 'FIRESTORE_ERROR', error: error.message });
                return { result: false, errorMessage: error.message };
            }
        },
        deleteDogFromFirestore: (dogData) => {
            firestore.collection('dogs').doc(dogData.id).delete().then(() => {
                console.log('Dog successfully deleted!');
            })
                .catch((error) => {
                    console.error('Error removing dog: ', error);
                });
            storageMethods.deleteByUrl(dogData.imageUrl);
        },
        deleteSelected: (dogsChecked) => {
            firestore.collection('dogs').get().then((querySnapshot) => {
                const batch = firestore.batch();

                querySnapshot.forEach((doc) => {
                    if (dogsChecked.find((checkedDog) => ((doc.id === checkedDog.id))).checked) {
                        batch.delete(doc.ref);

                        storageMethods.deleteByUrl(doc.data().imageUrl);
                    }
                });
                dispatch({ type: 'FIRESTORE_BATCH_DELETE' });
                return batch.commit();
            }).then(() => {
                console.log('batch delete dog(s) completed');
            });
        },
        deleteAll: () => {
            firestore.collection('dogs').get().then((querySnapshot) => {
                const batch = firestore.batch();

                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                    storageMethods.deleteByUrl(doc.data().imageUrl);
                });
                dispatch({ type: 'FIRESTORE_BATCH_DELETE' });
                return batch.commit();
            }).then(() => {
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
