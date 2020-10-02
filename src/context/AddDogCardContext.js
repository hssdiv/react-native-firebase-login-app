import React, { useReducer, createContext } from 'react';

const reducer = (state, action) => {
    switch (action.type) {
        case 'MODAL_ADD_DOG_CONFIRMED':
            switch (action.addType) {
                case 'RANDOM':
                    return { type: 'MODAL_ADD_DOG_CONFIRMED', addType: 'RANDOM' };
                case 'CUSTOM':
                    return {
                        type: 'MODAL_ADD_DOG_CONFIRMED',
                        addType: 'CUSTOM',
                        breed: action.breed,
                        subBreed: action.subBreed,
                        dogPicture: action.dogPicture,
                    };
                default:
                    return state;
            }
        case 'MODAL_ADD_DOG_CLOSED':
            return { type: 'MODAL_ADD_DOG_CLOSED' };
        default:
            return state;
    }
};

export const AddDogCardContext = createContext();

export const AddDogCardProvider = ({ children }) => {
    const initialState = null;
    const [addDogCardModalStatus, dispatch] = useReducer(reducer, initialState);

    const addDogCardModalMethods = {
        confirmAddRandom: () => {
            dispatch({ type: 'MODAL_ADD_DOG_CONFIRMED', addType: 'RANDOM' });
        },
        confirmAddCustom: (customDog) => {
            dispatch({
                type: 'MODAL_ADD_DOG_CONFIRMED',
                addType: 'CUSTOM',
                breed: customDog.breed,
                subBreed: customDog.subBreed,
                dogPicture: customDog.dogPicture,
            });
        },
        closeAddModal: () => {
            dispatch({ type: 'MODAL_ADD_DOG_CLOSED' });
        },
    };

    return (
        <AddDogCardContext.Provider
            value={{
                addDogCardModalStatus,
                addDogCardModalMethods,
            }}
        >
            {children}
        </AddDogCardContext.Provider>
    );
};
