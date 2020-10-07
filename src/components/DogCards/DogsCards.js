import React from 'react';
import { DogCardProvider } from '../../context';
import { Dog } from './Dog';

export const DogsCards = ({ dogs }) => (
    dogs
        && dogs.map((dog) => (
            <DogCardProvider
                key={dog.id}
            >
                <Dog
                    dogData={dog}
                />
            </DogCardProvider>
        ))
);
