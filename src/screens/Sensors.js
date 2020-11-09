import React, { useState } from 'react';
import {
    Text, View, NativeModules,
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
        NativeModules.Sensor.showToast('Awesome');
    };

    const handleOnAccelerometerPress = () => {
        NativeModules.Sensor.getAccelerometerData((x, y, z) => {
            setAx(x.toFixed(2));
            setAy(y.toFixed(2));
            setAz(z.toFixed(2));
            console.log(`${x} ${y} ${z}`);
        });
    };

    const handleOnGyroscopePress = () => {
        NativeModules.Sensor.getGyroscopeData((x, y, z) => {
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
            <Text style={{
                fontSize: 25,
            }}
            >
                Sensors page
            </Text>
            <TouchableOpacity
                onPress={handleOnToastPress}
            >
                <Text style={{
                    fontSize: 25,
                }}
                >
                    Show navite toast
                </Text>
            </TouchableOpacity>
            <View>
                <TouchableOpacity
                    onPress={handleOnAccelerometerPress}
                >
                    <Text style={{
                        fontSize: 25,
                    }}
                    >
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
                    <Text style={{
                        fontSize: 25,
                    }}
                    >
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
