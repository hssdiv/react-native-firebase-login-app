import React from 'react';
import {
    AuthProvider, FirebaseStorageProvider, FirestoreProvider,
    PlanetsProvider, DogsProvider,
} from '.';

export function MainProvider({ children }) {
    return (
        <AuthProvider>
            <FirestoreProvider>
                <FirebaseStorageProvider>
                    <PlanetsProvider>
                        <DogsProvider>
                            {children}
                        </DogsProvider>
                    </PlanetsProvider>
                </FirebaseStorageProvider>
            </FirestoreProvider>
        </AuthProvider>
    );
}
