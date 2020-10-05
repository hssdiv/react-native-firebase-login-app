import React, { useReducer, createContext } from 'react';

const reducer = (state, action) => {
    switch (action.type) {
        case 'SHOW_ERROR_MESSAGE':
            return { type: 'SHOW_ERROR_MESSAGE', errorMessage: action.errorMessage };
        case 'CLEAR_ERROR_MESSAGE':
            return { type: 'CLEAR_ERROR_MESSAGE' };
        default:
            return state;
    }
};

export const DogCardErrorContext = createContext();

export const DogCardErrorProvider = ({ children }) => {
    const initialState = null;
    const [errorMessageStatus, dispatch] = useReducer(reducer, initialState);

    const errorMessageMethods = {
        showError: (error) => {
            dispatch({ type: 'SHOW_ERROR_MESSAGE', errorMessage: error });
        },
        hideError: () => {
            dispatch({ type: 'CLEAR_ERROR_MESSAGE' });
        },
    };

    return (
        <DogCardErrorContext.Provider
            value={{
                errorMessageStatus,
                errorMessageMethods,
            }}
        >
            {children}
        </DogCardErrorContext.Provider>
    );
};