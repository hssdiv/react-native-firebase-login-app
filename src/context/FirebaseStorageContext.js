import React, { useReducer, createContext, useContext } from 'react';
import { Platform } from 'react-native';
import { firebaseAuth as auth, firebaseStorage as storage } from '../config/Firebase';
import { UniqueIdGenerator } from '../util/UniqueIdGenerator';
import { firestoreDogCollectionAdd, storageDeleteByUrl } from '../api';
import { displayNotification } from '../ui';
import { FirestoreContext } from './FirestoreContext';

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'DOG_PICTURE_UPLOADED':
            console.log('storage reducer: DOG_PICTURE_UPLOADED');
            return {
                ...prevState,
                type: 'DOG_PICTURE_UPLOADED',
                spinnerIsVisible: false,
            };
        case 'DOG_PICTURE_DELETED':
            console.log('storage reducer: DOG_PICTURE_DELETED');
            return {
                ...prevState,
                spinnerIsVisible: false,
                type: 'DOG_PICTURE_DELETED',
            };
        case 'UPDATE_PROGRESS_BAR':
            return {
                ...prevState,
                type: 'UPDATE_PROGRESS_BAR',
                percentage: action.percentage,
            };
        case 'SHOW_SPINNER':
            return {
                ...prevState,
                type: 'SHOW_SPINNER',
                spinnerIsVisible: true,
            };
        case 'ERROR':
            return {
                ...prevState,
                type: 'ERROR',
                spinnerIsVisible: false,
                errorMessage: action.errorMessage,
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

export const FirebaseStorageContext = createContext();

export const FirebaseStorageProvider = ({ children }) => {
    const initialState = {
        spinnerIsVisible: false,
    };
    const [storageStatus, dispatch] = useReducer(reducer, initialState);

    const { firestoreMethods } = useContext(FirestoreContext);

    const storageMethods = {
        addCustomDog: async (result) => {
            try {
                dispatch({ type: 'SHOW_SPINNER' });
                const storageRef = storage.ref();

                const uniqueGeneratedName = UniqueIdGenerator();
                const fileRef = storageRef.child(auth.currentUser.uid).child(uniqueGeneratedName);
                // const task = fileRef.putFile(result.dogPicture);
                const task = fileRef.putString(result.dogPicture);
                task.on('state_changed',
                    (snapshot) => {
                        const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`uploaded ${percentage}%`);

                        if (Platform.OS === 'android') {
                            const notification = {
                                title: 'Custom picture upload:',
                                type: 'PROGRESS',
                                progress: percentage,
                            };
                            displayNotification(notification);
                        }

                        dispatch({
                            type: 'UPDATE_PROGRESS_BAR',
                            percentage,
                        });
                    },

                    (err) => {
                        console.error(`upload progress error:${err}`);
                        dispatch({
                            type: 'ERROR',
                            errorMessage: err.message,
                        });
                    });

                task.then(async () => {
                    console.log('storage upload task completed!');
                    const fileUrl = await fileRef.getDownloadURL();

                    const addCustomdDog = {
                        breed: result.breed,
                        subBreed: result.subBreed,
                        imageUrl: fileUrl,
                        custom: true,
                    };
                    await firestoreDogCollectionAdd(addCustomdDog);
                    const notification = {
                        title: 'Custom picture upload:',
                        text: 'completed',
                    };
                    await displayNotification(notification);

                    firestoreMethods.refreshDogs();
                    dispatch({ type: 'DOG_PICTURE_UPLOADED' });
                });
                return { result: true };
            } catch (error) {
                dispatch({
                    type: 'ERROR',
                    errorMessage: error.message,
                });
                return {
                    result: false,
                    errorMessage: error.message,
                };
            }
        },
        deleteByUrl: async (url) => {
            try {
                dispatch({ type: 'SHOW_SPINNER' });
                storageDeleteByUrl(url);
                dispatch({ type: 'DOG_PICTURE_DELETED' });
                console.log('deleted');
                return { result: true };
            } catch (error) {
                dispatch({
                    type: 'ERROR',
                    errorMessage: error.message,
                });
                return { result: false };
            }
        },
        clearErrorMessage: () => {
            dispatch({ type: 'CLEAR_ERROR_MESSAGE' });
        },
    };

    return (
        <FirebaseStorageContext.Provider
            value={{
                storageStatus,
                storageMethods,
            }}
        >
            {children}
        </FirebaseStorageContext.Provider>
    );
};
