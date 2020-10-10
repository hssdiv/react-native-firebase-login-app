import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
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
