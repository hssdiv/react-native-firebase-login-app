import React, { useReducer, createContext } from 'react';
import { firebaseAuth as auth } from '../config/Firebase';

const reducer = (state, action) => {
    switch (action.type) {
    case 'USER_LOGGED_IN':
        return { email: action.email };
    case 'USER_REGISTERED':
        return { email: action.email };
    case 'USER_LOGGED_OUT':
        return null;
    default:
        return state;
    }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const initialState = null;
    const [currentUser, dispatch] = useReducer(reducer, initialState);

    const authMethods = {
        signIn: async (login, password) => {
            try {
                const res = await auth.signInWithEmailAndPassword(login, password);
                dispatch({ type: 'USER_LOGGED_IN', email: res.user.email });
                return { result: true };
            } catch (error) {
                return { result: false, errorMessage: error.message };
            }
        },
        signUp: async (login, password) => {
            try {
                const res = await auth.createUserWithEmailAndPassword(login, password);
                dispatch({ type: 'USER_REGISTERED', email: res.user.email });
                return { result: true };
            } catch (error) {
                return { result: false, errorMessage: error.message };
            }
        },
        logOut: async () => {
            await auth.signOut();
            dispatch({ type: 'USER_LOGGED_OUT' });
        },
        enableAuthStateListener: () => {
            const listener = auth.onAuthStateChanged((user) => {
                if (user) {
                    dispatch({ type: 'USER_LOGGED_IN', email: user.email });
                }
            });
            return listener;
        },
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                authMethods,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
