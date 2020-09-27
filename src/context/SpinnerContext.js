import React, { useReducer, createContext } from 'react';

const reducer = (state, action) => {
    switch (action) {
    case 'SPINNER_IS_VISIBLE':
        return true;
    case 'SPINNER_IS_HIDDEN':
        return false;
    default:
        return state;
    }
};

export const SpinnerContext = createContext();

export const SpinnerProvider = ({ children }) => {
    const initialState = false;
    const [spinnerIsVisible, dispatch] = useReducer(reducer, initialState);

    const spinnerMethods = {
        showSpinner: () => {
            dispatch('SPINNER_IS_VISIBLE');
        },
        hideSpinner: () => {
            dispatch('SPINNER_IS_HIDDEN');
        },
    };

    return (
        <SpinnerContext.Provider
            value={{
                spinnerIsVisible,
                spinnerMethods,
            }}
        >
            {children}
        </SpinnerContext.Provider>
    );
};
