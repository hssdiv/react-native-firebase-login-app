import React from 'react';
import {
    AuthProvider, FirebaseStorageProvider, FirestoreProvider,
    PlanetsProvider, DogsScreenUIProvider, DogsDataProvider, AddDogCardProvider,
} from '.';

export function MainProvider({ children }) {
    return (
        <AuthProvider>
            <FirebaseStorageProvider>
                <FirestoreProvider>
                    <PlanetsProvider>
                        <DogsScreenUIProvider>
                            <DogsDataProvider>
                                <AddDogCardProvider>
                                    {children}
                                </AddDogCardProvider>
                            </DogsDataProvider>
                        </DogsScreenUIProvider>
                    </PlanetsProvider>
                </FirestoreProvider>
            </FirebaseStorageProvider>
        </AuthProvider>
    );
}
