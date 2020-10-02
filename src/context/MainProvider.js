import React from 'react';
import {
    AuthProvider, FirebaseStorageProvider, FirestoreProvider,
    PlanetsProvider, DogsProvider, AddDogCardProvider,
} from '.';

export function MainProvider({ children }) {
    return (
        <AuthProvider>
            <FirebaseStorageProvider>
                <FirestoreProvider>
                    <PlanetsProvider>
                        <DogsProvider>
                            <AddDogCardProvider>
                                {children}
                            </AddDogCardProvider>
                        </DogsProvider>
                    </PlanetsProvider>
                </FirestoreProvider>
            </FirebaseStorageProvider>
        </AuthProvider>
    );
}
