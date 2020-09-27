import React from 'react';
import { Text, View } from 'react-native';

export const Next = () => (
    <View style={{
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }}
    >
        <Text style={{
            fontSize: 25,
        }}
        >
            Next page
        </Text>
    </View>
);
