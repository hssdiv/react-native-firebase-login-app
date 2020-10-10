import React, { useReducer, createContext } from 'react';
import { getRandomDogFromApi } from '../api/DogApi';

const reducer = (prevState, action) => {
    switch (action.type) {
        case 'SHOW_SPINNER':
            return {
                ...prevState,
                type: 'SHOW_SPINNER',
                spinnerIsVisible: true,
            };
        case 'DOGS_LOADED':
            return {
                ...prevState,
                type: 'DOGS_LOADED',
                spinnerIsVisible: false,
                dogs: action.dogs,
            };
        case 'DOG_CHECKBOX_CLICKED':
            return {
                ...prevState,
                type: 'DOG_CHECKBOX_CLICKED',
                id: action.id,
                isChecked: action.isChecked,
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
                dogToAdd: action.dog,
            }
        case 'MODAL_ADD_DOG_CONFIRMED_CUSTOM':
            return {
                ...prevState,
                type: 'MODAL_ADD_DOG_CONFIRMED_CUSTOM',
                addDogModalIsVisible: false,
                dogToAdd: action.dog,
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
                selectedDogsButtonIsVisible: true,
            };
        case 'DELETE_SELECTED_BUTTON_DISABLED':
            return {
                ...prevState,
                type: 'DELETE_SELECTED_BUTTON_DISABLED',
                selectedDogsButtonIsVisible: false,
            };
        case 'ERROR':
            return {
                ...prevState,
                type: 'ERROR',
                spinnerIsVisible: false,
                addDogModalIsVisible: false,
                error: action.error,
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
    selectedDogsButtonIsVisible: false,
    spinnerIsVisible: true,
    dog: {},
    type: '',
});

export const DogsProvider = ({ children }) => {
    const [dogsContextStatus, dispatch] = useReducer(reducer, initialState);

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
        },
        getRandomDog: async () => {
            dispatch({ type: 'SHOW_SPINNER' });
            const randomDog = await getRandomDogFromApi();

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
                    dog,
                });
            }
        },
        confirmAddCustom: (customDog) => {
            dispatch({ type: 'SHOW_SPINNER' });
            dispatch({
                type: 'MODAL_ADD_DOG_CONFIRMED_CUSTOM',
                dog: {
                    breed: customDog.breed,
                    subBreed: customDog.subBreed,
                    dogPicture: customDog.dogPicture,
                    custom: true,
                },
            });
        },
        closeModal: () => {
            dispatch({ type: 'MODAL_CLOSED' });
        },
        confirmDeleteSelectedPressed: () => {
            dispatch({ type: 'MODAL_DELETE_SELECTED_PRESSED' });
        },
        confirmDeleteAllPressed: () => {
            dispatch({ type: 'MODAL_DELETE_ALL_PRESSED' });
        },
        deleteSelectedButtonEnabled: () => {
            dispatch({ type: 'DELETE_SELECTED_BUTTON_ENABLED' });
        },
        deleteSelectedButtonDisabled: () => {
            dispatch({ type: 'DELETE_SELECTED_BUTTON_DISABLED' });
        },
        setDogsFromFirestore: (dogs, firestoreDogs) => {
            console.log('detected changes to Dogs list:');
            if (firestoreDogs) {
                console.log(`Dogs size: ${firestoreDogs.length}`);
                if (dogs) {
                    const dogsMerged = firestoreDogs.map((firestoreDog) => {
                        const someDog = dogs.find(
                            (checkedDog) => checkedDog.id === firestoreDog.id,
                        );
                        if (someDog) {
                            return {
                                ...someDog,
                                ...firestoreDogs.find(
                                    (someFirestoreDog) => someFirestoreDog.id === someDog.id,
                                ),
                            };
                        }
                        return firestoreDog;
                    });
                    dispatch({ type: 'DOGS_LOADED', dogs: dogsMerged });
                } else {
                    const newFirestoreDogs = firestoreDogs.map(
                        (dog) => ({ ...dog, checked: false }),
                    );
                    dispatch({ type: 'DOGS_LOADED', dogs: newFirestoreDogs });
                }
            }
        },
        updateDogs: (dogs) => {
            dispatch({ type: 'DOGS_LOADED', dogs });
        },
        handleDogCheckboxClick: (id, isChecked) => {
            dispatch({ type: 'DOG_CHECKBOX_CLICKED', id, isChecked });
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
