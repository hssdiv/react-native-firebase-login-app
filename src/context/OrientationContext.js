import React, { createContext, useReducer } from 'react';
import { Dimensions } from 'react-native';

const reducer = (state, action) => {
    switch (action) {
    case 'PORTRAIT_ORIENTATION':
        return 'PORTRAIT';
    case 'LANDSCAPE_ORIENTATION':
        return 'LANDSCAPE';
    default:
        return state;
    }
};

export const OrientationContext = createContext();

export const OrientationProvider = ({ children }) => {
    const initialState = null;
    const [orientation, dispatch] = useReducer(reducer, initialState);

    const orientationMethods = {
        checkOrientation: () => {
            const dim = Dimensions.get('screen');
            if (dim.height >= dim.width) {
                dispatch('PORTRAIT_ORIENTATION');
            } else {
                dispatch('LANDSCAPE_ORIENTATION');
            }
        },
    };

    return (
        <OrientationContext.Provider
            value={{
                orientation,
                orientationMethods,
            }}
        >
            {children}
        </OrientationContext.Provider>
    );
};
