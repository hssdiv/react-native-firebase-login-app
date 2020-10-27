import React, { useReducer, createContext, useContext } from 'react';
import { getRandomDog } from '../api/DogApi';
import { FirestoreContext } from './FirestoreContext';
import { FirebaseStorageContext } from './FirebaseStorageContext';

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'SHOW_SPINNER':
            return {
                ...prevState,
                type: 'SHOW_SPINNER',
                spinnerIsVisible: true,
            };
        case 'SHOW_REFRESH_SPINNER':
            return {
                ...prevState,
                type: 'SHOW_REFRESH_SPINNER',
                refreshSpinnerIsVisible: true,
            };
        case 'SHOW_LOAD_MORE_SPINNER':
            return {
                ...prevState,
                type: 'SHOW_LOAD_MORE_SPINNER',
                loadMoreSpinnerIsVisible: true,
            };
        case 'DOGS_LOADED':
            return {
                ...prevState,
                type: 'DOGS_LOADED',
                spinnerIsVisible: false,
                loadMoreSpinnerIsVisible: false,
                dogs: action.dogs,
            };
        case 'SHOW_DELETE_SELECTED_MODAL':
            return {
                ...prevState,
                type: 'SHOW_DELETE_SELECTED_MODAL',
                deleteModalIsVisible: true,
            };
        case 'SHOW_DELETE_ALL_MODAL':
            return {
                ...prevState,
                type: 'SHOW_DELETE_ALL_MODAL',
                deleteAllModalIsVisible: true,
            };
        case 'SHOW_ADD_DOG_MODAL':
            return {
                ...prevState,
                type: 'SHOW_ADD_DOG_MODAL',
                addDogModalIsVisible: true,
            };
        case 'MODAL_ADD_DOG_CONFIRMED_RANDOM':
            return {
                ...prevState,
                type: 'MODAL_ADD_DOG_CONFIRMED_RANDOM',
                addDogModalIsVisible: false,
            };
        case 'GOT_RANDOM_DOG_FROM_API':
            return {
                ...prevState,
                type: 'GOT_RANDOM_DOG_FROM_API',
                spinnerIsVisible: false,
            };
        case 'MODAL_ADD_DOG_CONFIRMED_CUSTOM':
            return {
                ...prevState,
                type: 'MODAL_ADD_DOG_CONFIRMED_CUSTOM',
                addDogModalIsVisible: false,
            };
        case 'MODAL_CLOSED':
            return {
                ...prevState,
                type: 'MODAL_CLOSED',
                deleteModalIsVisible: false,
                deleteAllModalIsVisible: false,
                addDogModalIsVisible: false,
            };
        case 'MODAL_DELETE_SELECTED_PRESSED':
            return {
                ...prevState,
                deleteModalIsVisible: false,
                type: 'MODAL_DELETE_SELECTED_PRESSED',
            };
        case 'MODAL_DELETE_ALL_PRESSED':
            return {
                ...prevState,
                deleteAllModalIsVisible: false,
                type: 'MODAL_DELETE_ALL_PRESSED',
            };
        case 'DELETE_SELECTED_BUTTON_ENABLED':
            return {
                ...prevState,
                type: 'DELETE_SELECTED_BUTTON_ENABLED',
                deleteSelectedDogsButtonIsVisible: true,
            };
        case 'DELETE_SELECTED_BUTTON_DISABLED':
            return {
                ...prevState,
                type: 'DELETE_SELECTED_BUTTON_DISABLED',
                deleteSelectedDogsButtonIsVisible: false,
            };
        case 'SHOW_ALL_CHECKBOXES':
            return {
                ...prevState,
                type: 'SHOW_ALL_CHECKBOXES',
                checkboxesVisible: true,
            };
        case 'HIDE_ALL_CHECKBOXES':
            return {
                ...prevState,
                type: 'HIDE_ALL_CHECKBOXES',
                checkboxesVisible: false,
            };
        case 'ERROR':
            return {
                ...prevState,
                type: 'ERROR',
                spinnerIsVisible: false,
                addDogModalIsVisible: false,
                error: action.error,
            };
        case 'CLEAR_ERROR_MESSAGE':
            return {
                ...prevState,
                error: null,
            };
        default:
            return initialState;
    }
};

export const DogsContext = createContext();

const initialState = ({
    deleteModalIsVisible: false,
    deleteAllModalIsVisible: false,
    addDogModalIsVisible: false,
    deleteSelectedDogsButtonIsVisible: false,
    spinnerIsVisible: true,
    refreshSpinnerIsVisible: false,
    loadMoreSpinnerIsVisible: false,
    checkboxesVisible: false,
    type: '',
    dogs: null,
    error: null,
});

export const DogsProvider = ({ children }) => {
    const [dogsContextStatus, dispatch] = useReducer(reducer, initialState);

    const { firestoreMethods } = useContext(FirestoreContext);
    const { storageMethods } = useContext(FirebaseStorageContext);

    const dogsContextMethods = {
        showDeleteSelectedDogsModal: () => {
            dispatch({ type: 'SHOW_DELETE_SELECTED_MODAL' });
        },
        showDeleteAllDogsModal: () => {
            dispatch({ type: 'SHOW_DELETE_ALL_MODAL' });
        },
        showAddDogModal: () => {
            dispatch({ type: 'SHOW_ADD_DOG_MODAL' });
        },
        confirmAddRandom: () => {
            dispatch({ type: 'SHOW_SPINNER' });
            dispatch({
                type: 'MODAL_ADD_DOG_CONFIRMED_RANDOM',
            });
            dogsContextMethods.getRandomDogFromAPI();
        },
        getRandomDogFromAPI: async () => {
            dispatch({ type: 'SHOW_SPINNER' });
            const randomDog = await getRandomDog();

            if (!randomDog) {
                dispatch({
                    type: 'ERROR',
                    error: 'Dog API error',
                });
            }

            if ((randomDog.message) && (randomDog.message.includes('breeds'))) {
                const getFullBreedName = (url) => {
                    const position = url.indexOf('breeds');
                    const BREED_AND_SLASH_LENGTH = 7;
                    const start = position + BREED_AND_SLASH_LENGTH;
                    const end = url.indexOf('/', start);
                    return url.substring(start, end);
                };

                const breedName = getFullBreedName(randomDog.message);
                let dog;
                if (breedName.includes('-')) {
                    const [masterBreed, subBreed] = breedName.split('-');
                    dog = {
                        breed: masterBreed,
                        subBreed,
                        imageUrl: randomDog.message,
                        custom: false,
                    };
                } else {
                    dog = {
                        breed: breedName,
                        imageUrl: randomDog.message,
                        custom: false,
                    };
                }
                dispatch({
                    type: 'GOT_RANDOM_DOG_FROM_API',
                });
                try {
                    firestoreMethods.addDogToFirestore(dog);
                } catch (firestoreError) {
                    dispatch({
                        type: 'ERROR',
                        error: firestoreError,
                    });
                }
            }
        },
        confirmAddCustom: (customDog) => {
            dispatch({
                type: 'MODAL_ADD_DOG_CONFIRMED_CUSTOM',
            });
            const dog = {
                breed: customDog.breed,
                subBreed: customDog.subBreed,
                dogPicture: customDog.dogPicture,
                custom: true,
            };
            storageMethods.addCustomDog(dog);
        },
        closeModal: () => {
            dispatch({ type: 'MODAL_CLOSED' });
        },
        showLoadMoreSpinner: () => {
            dispatch({ type: 'SHOW_LOAD_MORE_SPINNER' });
        },
        confirmDeleteSelectedPressed: () => {
            dispatch({ type: 'MODAL_DELETE_SELECTED_PRESSED' });
            firestoreMethods.deleteSelected(dogsContextStatus.dogs);
            dogsContextMethods.hideAllCheckboxes();
        },
        confirmDeleteAllPressed: () => {
            dispatch({ type: 'MODAL_DELETE_ALL_PRESSED' });
            firestoreMethods.deleteAll();
            dogsContextMethods.hideAllCheckboxes();
        },
        deleteSelectedButtonEnabled: () => {
            dispatch({ type: 'DELETE_SELECTED_BUTTON_ENABLED' });
        },
        deleteSelectedButtonDisabled: () => {
            dispatch({ type: 'DELETE_SELECTED_BUTTON_DISABLED' });
        },
        setDogsFromFirestore: (firestoreDogs) => {
            if (firestoreDogs) {
                console.log(`Dogs size: ${firestoreDogs.length}`);
                if (dogsContextStatus.dogs) {
                    const dogsMerged = firestoreDogs.map((firestoreDog) => {
                        const someDog = dogsContextStatus.dogs.find(
                            (selectedDog) => selectedDog.id === firestoreDog.id,
                        );
                        if (someDog) {
                            return {
                                ...someDog,
                                ...firestoreDogs.find(
                                    (someFirestoreDog) => someFirestoreDog.id === someDog.id,
                                ),
                            };
                        }
                        return {
                            ...firestoreDog,
                            selected: false,
                        };
                    });
                    dogsContextMethods.setDogs(dogsMerged);
                } else {
                    const newFirestoreDogs = firestoreDogs.map(
                        (dog) => ({
                            ...dog,
                            selected: false,
                        }),
                    );
                    dogsContextMethods.setDogs(newFirestoreDogs);
                }
            }
        },
        setDogs: (newDogs) => {
            dogsContextMethods.updateDeleteSelectedButton(newDogs);
            dispatch({
                type: 'DOGS_LOADED',
                dogs: newDogs,
            });
        },
        showAllCheckboxes: () => {
            dispatch({ type: 'SHOW_ALL_CHECKBOXES' });
        },
        hideAllCheckboxes: () => {
            dispatch({ type: 'HIDE_ALL_CHECKBOXES' });
        },
        updateDeleteSelectedButton: (newDogs) => {
            if ((newDogs) && (newDogs.find(
                (selectedDog) => selectedDog.selected === true,
            ))
            ) {
                dogsContextMethods.deleteSelectedButtonEnabled();
            } else {
                dogsContextMethods.deleteSelectedButtonDisabled();
                dogsContextMethods.hideAllCheckboxes();
            }
        },
        handleDogCheckboxClick: (id, isSelected) => {
            const dogsWithSelectedDog = dogsContextStatus.dogs.map((dog) => {
                if (dog.id === id) {
                    return {
                        ...dog,
                        selected: isSelected,
                    };
                }
                return dog;
            });
            dogsContextMethods.setDogs(dogsWithSelectedDog);
        },
        clearErrorMessage: () => {
            dispatch({ type: 'CLEAR_ERROR_MESSAGE' });
            firestoreMethods.clearErrorMessage();
            storageMethods.clearErrorMessage();
        },
    };

    return (
        <DogsContext.Provider
            value={{
                dogsContextStatus,
                dogsContextMethods,
            }}
        >
            {children}
        </DogsContext.Provider>
    );
};
