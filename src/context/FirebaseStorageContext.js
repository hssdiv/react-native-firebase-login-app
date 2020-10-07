import React, { useReducer, createContext } from 'react';
import { firebaseAuth as auth, firebaseStorage as storage, cloudFirestore as firestore } from '../config/Firebase';
import { UniqueIdGenerator } from '../util/UniqueIdGenerator';

const reducer = (state, action) => {
    switch (action.type) {
        case 'DOG_PICTURE_UPLOADED':
            console.log('storage reducer: DOG_PICTURE_UPLOADED');
            return { status: 'UPLOADED' };
        case 'DOG_PICTURE_DELETED':
            console.log('storage reducer: DOG_PICTURE_DELETED');
            return { status: 'DELETED' };
        case 'FIREBASE_STORAGE_ERROR':
            console.log('storage reducer: firebase storage error');
            return { status: 'ERROR', errorMessage: action.errorMessage };
        case 'UPDATE_PROGRESS_BAR':
            return { status: 'PROGRESS', percentage: action.percentage };
        default:
            return state;
    }
};

export const FirebaseStorageContext = createContext();

export const FirebaseStorageProvider = ({ children }) => {
    const initialState = null;
    const [storageStatus, dispatch] = useReducer(reducer, initialState);

    const storageMethods = {
        uploadPicture: async (result) => {
            try {
                const storageRef = storage.ref();

                const uniqueGeneratedName = UniqueIdGenerator();
                const fileRef = storageRef.child(auth.currentUser.uid).child(uniqueGeneratedName);
                const task = fileRef.putFile(result.dogPicture);

                task.on('state_changed',
                    (snapshot) => {
                        const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`uploaded ${percentage}%`);
                        dispatch({ type: 'UPDATE_PROGRESS_BAR', percentage });
                    },

                    (err) => {
                        console.error(`upload progress error:${err}`);
                        dispatch({ type: 'FIREBASE_STORAGE_ERROR', errorMessage: err });
                    },

                    async () => {
                        console.log('storage: upload complete');
                        dispatch({ type: 'DOG_PICTURE_UPLOADED' });
                    });

                task.then(async () => {
                    console.log('storage upload task completed!');
                    const fileUrl = await fileRef.getDownloadURL();

                    const addCustomdDog = {
                        breed: result.breed,
                        subBreed: result.subBreed,
                        imageUrl: fileUrl,
                    };
                    firestore.collection('dogs').add(addCustomdDog);
                });

                return { result: true };
            } catch (error) {
                return { result: false, errorMessage: error.message };
            }
        },
        deleteByUrl: async (url) => {
            try {
                const imageRef = storage.refFromURL(url);
                await storage.ref(imageRef.fullPath).delete();

                dispatch({ type: 'DOG_PICTURE_DELETED' });
                console.log('deleted');
                return { result: true };
            } catch (error) {
                console.log('storage deletion error');
                console.log(error);
                // dispatch({ type: 'FIREBASE_STORAGE_ERROR', errorMessage: error.message });
                return { result: false, errorMessage: error.message };
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
