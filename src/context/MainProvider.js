import React from 'react'
import { AuthProvider, SpinnerProvider } from './'
import { OrientationProvider } from './OrientationContext'

export function MainProvider({ children }) {
    return (
        <OrientationProvider>
            <AuthProvider>
                <SpinnerProvider>
                    {children}
                </SpinnerProvider>
            </AuthProvider>
        </OrientationProvider>
    )
}