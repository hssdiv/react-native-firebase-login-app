import React, { useReducer, createContext } from 'react';
import { getRandomDog } from '../api/DogApi';

const reducer = (state, action) => {
    switch (action.type) {
        case 'DOG_LOADED':
            console.log('reducer: dog loaded');
            return { type: 'DOG_LOADED', dog: action.dogResult };
        case 'SHOW_DELETE_SELECTED_MODAL':
            return { type: 'SHOW_DELETE_SELECTED_MODAL' };
        case 'SHOW_DELETE_ALL_MODAL':
            return { type: 'SHOW_DELETE_ALL_MODAL' };
        case 'MODAL_CLOSED':
            return { type: 'MODAL_CLOSED' };
        case 'MODAL_DELETE_SELECTED_PRESSED':
            return { type: 'MODAL_DELETE_SELECTED_PRESSED' };
        case 'MODAL_DELETE_ALL_PRESSED':
            return { type: 'MODAL_DELETE_ALL_PRESSED' };
        case 'DELETE_SELECTED_BUTTON_ENABLED':
            return { type: 'DELETE_SELECTED_BUTTON_ENABLED' };
        case 'DELETE_SELECTED_BUTTON_DISABLED':
            return { type: 'DELETE_SELECTED_BUTTON_DISABLED' };
        default:
            return state;
    }
};

export const DogsContext = createContext();

export const DogsProvider = ({ children }) => {
    const initialState = null;
    const [dogContextStatus, dispatch] = useReducer(reducer, initialState);

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
        showDeleteSelectedDogsModal: () => {
            dispatch({ type: 'SHOW_DELETE_SELECTED_MODAL' });
        },
        showDeleteAllDogsModal: () => {
            dispatch({ type: 'SHOW_DELETE_ALL_MODAL' });
        },
        closeDeleteModal: () => {
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
    };

    return (
        <DogsContext.Provider
            value={{
                dogContextStatus,
                dogMethods,
            }}
        >
            {children}
        </DogsContext.Provider>
    );
};
