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
        innerVisibility
            ? (
                <View style={{
                    position: 'absolute',
                    top: '46%',
                    left: '46%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                >
                    <ActivityIndicator
                        size="large"
                    />
                </View>
            )
            : null
    );
};
