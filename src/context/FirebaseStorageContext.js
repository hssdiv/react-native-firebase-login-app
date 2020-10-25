import React, { useReducer, createContext } from 'react';
import { firebaseAuth as auth, firebaseStorage as storage } from '../config/Firebase';
import { UniqueIdGenerator } from '../util/UniqueIdGenerator';

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'DOG_PICTURE_UPLOADED':
            console.log('storage reducer: DOG_PICTURE_UPLOADED');
            return {
                ...prevState,
                type: 'DOG_PICTURE_UPLOADED',
            };
        case 'DOG_PICTURE_DELETED':
            console.log('storage reducer: DOG_PICTURE_DELETED');
            return {
                ...prevState,
                spinnerIsVisible: false,
                type: 'DELETED',
            };
        case 'ADD_CUSTOM_DOG_TO_FIRESTORE':
            return {
                ...prevState,
                type: 'ADD_CUSTOM_DOG_TO_FIRESTORE',
                spinnerIsVisible: false,
                dogToAdd: action.dogToAdd,
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
                    dispatch({ type: 'DOG_PICTURE_UPLOADED' });
                    const fileUrl = await fileRef.getDownloadURL();

                    const addCustomdDog = {
                        breed: result.breed,
                        subBreed: result.subBreed,
                        imageUrl: fileUrl,
                        custom: true,
                    };
                    dispatch({
                        type: 'ADD_CUSTOM_DOG_TO_FIRESTORE',
                        dogToAdd: addCustomdDog,
                    });
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
                const imageRef = storage.refFromURL(url);
                await storage.ref(imageRef.fullPath).delete();
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
