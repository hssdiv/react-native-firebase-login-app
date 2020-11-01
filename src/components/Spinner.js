import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export const Spinner = ({ visible, footer }) => (

    footer
        ? (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
                <ActivityIndicator
                    animating={visible}
                    size="large"
                    color="black"
                />
            </View>
        )
        : (
            <View style={{
                position: 'absolute',
                top: '46%',
                left: '46%',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
                <ActivityIndicator
                    animating={visible}
                    size="large"
                    color="black"
                />
            </View>
        )
);
