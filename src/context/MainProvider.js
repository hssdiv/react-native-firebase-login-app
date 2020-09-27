import React from 'react';
import {
    AuthProvider, FirebaseStorageProvider, FirestoreProvider, PlanetsProvider, DogsProvider,
} from '.';

export function MainProvider({ children }) {
    return (
        <AuthProvider>
            <FirebaseStorageProvider>
                <FirestoreProvider>
                    <PlanetsProvider>
                        <DogsProvider>
                            {children}
                        </DogsProvider>
                    </PlanetsProvider>
                </FirestoreProvider>
            </FirebaseStorageProvider>
        </AuthProvider>
    );
}
