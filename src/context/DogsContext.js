import React, { useReducer, createContext } from 'react';
import { getRandomDog } from '../api/DogApi';

const reducer = (state, action) => {
    switch (action.type) {
    case 'DOG_LOADED':
        console.log('reducer: dog loaded');
        return action.dogResult;
    default:
        return state;
    }
};

export const DogsContext = createContext();

export const DogsProvider = ({ children }) => {
    const initialState = null;
    const [dogResult, dispatch] = useReducer(reducer, initialState);

    const dogMethods = {
        getRandomDog: async () => {
            console.log('loading dog...');
            const result = await getRandomDog();

            if (result) {
                dispatch({ type: 'DOG_LOADED', dogResult: result });
                return { loaded: true };
            }
            return { loaded: false, errorMessage: 'error while loading dog' };
        },
    };

    return (
        <DogsContext.Provider
            value={{
                dogResult,
                dogMethods,
            }}
        >
            {children}
        </DogsContext.Provider>
    );
};
