import React, { useReducer, createContext } from 'react';

const reducer = (state, action) => {
    switch (action.type) {
        case 'MODAL_DELETE_CONFIRMED':
            return { type: 'MODAL_DELETE_CONFIRMED' };
        case 'MODAL_EDIT_CONFIRMED':
            return { type: 'MODAL_EDIT_CONFIRMED', updatedDog: action.updatedDog };
        case 'MODAL_DELETE_CLOSED':
            return { type: 'MODAL_DELETE_CLOSED' };
        case 'MODAL_EDIT_CLOSED':
            return { type: 'MODAL_EDIT_CLOSED' };
        default:
            return state;
    }
};

export const DogCardContext = createContext();

export const DogCardProvider = ({ children }) => {
    const initialState = null;
    const [dogCardModalStatus, dispatch] = useReducer(reducer, initialState);

    const dogCardModalMethods = {
        confirmDelete: () => {
            dispatch({ type: 'MODAL_DELETE_CONFIRMED' });
        },
        confirmEdit: (updatedDog) => {
            dispatch({ type: 'MODAL_EDIT_CONFIRMED', updatedDog });
        },
        closeDeleteModal: () => {
            dispatch({ type: 'MODAL_DELETE_CLOSED' });
        },
        closeEditModal: () => {
            dispatch({ type: 'MODAL_EDIT_CLOSED' });
        },
    };

    return (
        <DogCardContext.Provider
            value={{
                dogCardModalStatus,
                dogCardModalMethods,
            }}
        >
            {children}
        </DogCardContext.Provider>
    );
};
