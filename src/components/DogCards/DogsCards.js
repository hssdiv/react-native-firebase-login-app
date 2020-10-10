import React from 'react';
import { DogCardProvider } from '../../context';
import { Dog } from './Dog';

export const DogsCards = ({ dogs }) => {
    if (dogs) {
        return (dogs.map((dog) => (
            <DogCardProvider
                key={dog.id}
            >
                <Dog
                    dogData={dog}
                />
            </DogCardProvider>
        )));
    }
    return null;
};
