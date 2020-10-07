import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

export const Spinner = ({ visible }) => {
    const [innerVisibility, setInnerVisibility] = useState(visible);

    useEffect(() => {
        setInnerVisibility(visible);
        if (visible === undefined) {
            setInnerVisibility(true);
        }
    }, [visible]);

    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
        }}
        >
            {innerVisibility
                && <ActivityIndicator size="large" />}
        </View>
    );
};
