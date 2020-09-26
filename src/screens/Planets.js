import React, { useContext, useEffect } from 'react'
import { Text, View } from 'react-native';
import { OrientationContext } from '../context';
import { Dimensions } from 'react-native';

export const Planets = () => {
    const { orientation, orientationMethods } = useContext(OrientationContext)

    useEffect(() => {
        orientationMethods.checkOrientation();
        const listener = Dimensions.addEventListener('change', () => {
            orientationMethods.checkOrientation();
        });
        return listener;
    }, [])

    return (
        <View
            style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            {orientation === 'PORTRAIT' &&
                <Text
                    style={{
                        fontSize: 25,
                    }}>
                    Planets page (portrait)
                </Text> }
            {orientation === 'LANDSCAPE' &&
                <Text
                    style={{
                        fontSize: 25,
                    }}>
                    Planets page (landscape)
                </Text>}
        </View>
    )
}