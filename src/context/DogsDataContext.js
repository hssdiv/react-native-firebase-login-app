import React, { useReducer, createContext } from 'react';
import { getRandomDog } from '../api/DogApi';

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_DOGS':
            return { type: 'DOGS_LOADED', dogs: action.dogs };
        case 'RANDOM_DOG':
            return { type: 'DOG_LOADED', dog: action.dogResult };
        case 'DOG_CHECKBOX_CLICKED':
            return { type: 'DOG_CHECKBOX_CLICKED', id: action.id, isChecked: action.isChecked}
        default:
            return state;
    }
};

export const DogsDataContext = createContext();

export const DogsDataProvider = ({ children }) => {
    const initialState = null;
    const [dogsContextStatus, dispatch] = useReducer(reducer, initialState);

    const dogsMethods = {
        setDogs: (dogs) => {
            dispatch({ type: 'SET_DOGS', dogs });
        },
        getRandomDog: async () => {
            console.log('loading dog...');
            const result = await getRandomDog();

            if (result) {
                dispatch({ type: 'RANDOM_DOG', dogResult: result });
                return { loaded: true };
            }
            return { loaded: false, errorMessage: 'error while loading dog' };
        },
        handleDogCheckboxClick: (id, isChecked) => {
            dispatch({ type: 'DOG_CHECKBOX_CLICKED', id, isChecked });
        },
    };

    return (
        <DogsDataContext.Provider
            value={{
                dogsContextStatus,
                dogsMethods,
            }}
        >
            {children}
        </DogsDataContext.Provider>
    );
};
