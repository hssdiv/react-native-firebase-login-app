import React, { useState } from 'react';
import {
    Text, View, NativeModules, StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const Sensors = () => {
    const [ax, setAx] = useState(null);
    const [ay, setAy] = useState(null);
    const [az, setAz] = useState(null);

    const [gx, setGx] = useState(null);
    const [gy, setGy] = useState(null);
    const [gz, setGz] = useState(null);

    const handleOnToastPress = () => {
        NativeModules.Sensors.showToast('Awesome');
    };

    const handleOnAccelerometerPress = () => {
        NativeModules.Sensors.getAccelerometerData((x, y, z) => {
            setAx(x.toFixed(2));
            setAy(y.toFixed(2));
            setAz(z.toFixed(2));
            console.log(`${x} ${y} ${z}`);
        });
    };

    const handleOnGyroscopePress = () => {
        NativeModules.Sensors.getGyroscopeData((x, y, z) => {
            setGx(x.toFixed(2));
            setGy(y.toFixed(2));
            setGz(z.toFixed(2));
            console.log(`${x} ${y} ${z}`);
        });
    };

    return (
        <View style={{
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}
        >
            <TouchableOpacity
                onPress={handleOnToastPress}
            >
                <Text style={styles.text}>
                    Show toast (android only)
                </Text>
            </TouchableOpacity>
            <View>
                <TouchableOpacity
                    onPress={handleOnAccelerometerPress}
                >
                    <Text style={styles.text}>
                        Get accelerometer data
                    </Text>
                </TouchableOpacity>
                {ax && ay && az
                    && (
                        <Text
                            style={{ alignSelf: 'center' }}
                        >
                            {'ax: '}
                            {ax}
                            ,
                            {' ay:'}
                            {ay}
                            ,
                            {' az:'}
                            {az}
                        </Text>
                    )}
            </View>
            <View>
                <TouchableOpacity
                    onPress={handleOnGyroscopePress}
                >
                    <Text style={styles.text}>
                        Get gyroscope data
                    </Text>
                </TouchableOpacity>
                {gx && gy && gz
                    && (
                        <Text
                            style={{ alignSelf: 'center' }}
                        >
                            {'gx: '}
                            {gx}
                            ,
                            {' gy:'}
                            {gy}
                            ,
                            {' gz:'}
                            {gz}
                        </Text>
                    )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 25,
        fontWeight: 'bold',
    },
});
