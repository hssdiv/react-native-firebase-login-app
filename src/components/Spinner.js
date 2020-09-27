import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export const Spinner = ({ visible }) => (
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
        {visible
                && <ActivityIndicator size="large" />}
    </View>
);
