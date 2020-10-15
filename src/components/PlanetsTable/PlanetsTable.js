import React from 'react';
import { useScreenOrientation } from '../../util/useScreenOrientation';
import { PlanetsTablePortrait } from './PlanetsTablePortrait';
import { PlanetsTableLandscape } from './PlanetsTableLandscape';

export const PlanetsTable = ({ planets }) => {
    const orientation = useScreenOrientation();

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
