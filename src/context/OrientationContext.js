import React, { createContext, useReducer, useEffect } from 'react'
import { Dimensions } from 'react-native';

const reducer = (state, action) => {
    switch (action) {
        case 'PORTRAIT_ORIENTATION':
            return state = 'PORTRAIT'
        case 'LANDSCAPE_ORIENTATION':
            return state = 'LANDSCAPE'
        default:
            return state
    }
}

export const OrientationContext = createContext();

export const OrientationProvider = ({ children }) => {
    const initialState = null;
    const [orientation, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        const listener = Dimensions.addEventListener('change', () => {
                isPortrait() 
                ? 
                    dispatch('PORTRAIT_ORIENTATION') 
                : 
                    dispatch('LANDSCAPE_ORIENTATION')
        });
        return listener;
    }, [])

    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
    };

    const orientationMethods = {
        checkOrientation: () => {
            const dim = Dimensions.get('screen');
            if (dim.height >= dim.width) {
                dispatch('PORTRAIT_ORIENTATION')
            } else {
                dispatch('LANDSCAPE_ORIENTATION')
            }
        }
    }

    return (
        <OrientationContext.Provider
            value={{
                orientation,
                orientationMethods
            }}
        >
            {children}
        </OrientationContext.Provider>
    )
}
