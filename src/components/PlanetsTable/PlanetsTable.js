import React, { useEffect, useState } from 'react'
import { PlanetsTablePortrait } from './PlanetsTablePortrait'
import { PlanetsTableLandscape } from './PlanetsTableLandscape'
import { Dimensions } from 'react-native'

export const PlanetsTable = ({ planets }) => {
    const [orientation, setOrientation] = useState(null);

    useEffect(() => {
        const dim = Dimensions.get('screen');
            if (dim.height >= dim.width) {
                setOrientation('PORTRAIT')
            } else {
                setOrientation('LANDSCAPE')
            }
        const listener = Dimensions.addEventListener('change', () => {
            const dim = Dimensions.get('screen');
            if (dim.height >= dim.width) {
                setOrientation('PORTRAIT')
            } else {
                setOrientation('LANDSCAPE')
            }
        });

        return listener;
    }, [])

    return (
        orientation &&
            orientation === 'PORTRAIT' ?
            <PlanetsTablePortrait
                planets={planets}
            />
            :
            orientation === 'LANDSCAPE' &&
            <PlanetsTableLandscape
                planets={planets}
            />
    )
}