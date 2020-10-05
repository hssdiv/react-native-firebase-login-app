import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { PlanetsTablePortrait } from './PlanetsTablePortrait';
import { PlanetsTableLandscape } from './PlanetsTableLandscape';

export const PlanetsTable = ({ planets }) => {
    const [orientation, setOrientation] = useState(null);

    useEffect(() => {
        const dim = Dimensions.get('screen');
        if (dim.height >= dim.width) {
            setOrientation('PORTRAIT');
        } else {
            setOrientation('LANDSCAPE');
        }
        const listener = Dimensions.addEventListener('change', () => {
            const dim2 = Dimensions.get('screen');
            if (dim2.height >= dim2.width) {
                setOrientation('PORTRAIT');
            } else {
                setOrientation('LANDSCAPE');
            }
        });

        return listener;
    }, []);

    return (
        orientation
            && orientation === 'PORTRAIT'
            ? (
                <PlanetsTablePortrait
                    planets={planets}
                />
            )
            : orientation === 'LANDSCAPE'
            && (
                <PlanetsTableLandscape
                    planets={planets}
                />
            )
    );
};
