import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export const useScreenOrientation = () => {
    const [orientation, setOrientation] = useState(null);

    useEffect(() => {
        const updateState = () => {
            const { height, width } = Dimensions.get('window');
            if (height >= width) {
                // console.log('PORTRAIT');
                setOrientation('PORTRAIT');
            } else {
                // console.log('LANDSCAPE');
                setOrientation('LANDSCAPE');
            }
        };

        updateState();
        Dimensions.addEventListener('change', updateState);
        return () => Dimensions.removeEventListener('change', updateState);
    }, []);

    return orientation;
};
