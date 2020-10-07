import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { DrawerButton } from './DrawerButton';
import { DeleteAllDogsButton, DeleteSelectedDogsButton } from './DogCards';
import { FirebaseStorageContext } from '../context';

export const Stack = createStackNavigator();

export const TemplateStackNavigator = ({ name, component }) => {
    const { storageStatus } = useContext(FirebaseStorageContext);

    const [progressWidth, setProgressWidth] = useState(0);

    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        if (storageStatus) {
            switch (storageStatus.status) {
                case 'UPLOADED':
                    setProgressWidth(0);
                    break;
                case 'PROGRESS':
                    console.log(`in pixel: ${(screenWidth / 100) * storageStatus.percentage}`);
                    setProgressWidth(screenWidth * storageStatus.percentage);
                    break;
                default:
                    break;
            }
        }
    }, [storageStatus]);

    return (
        <Stack.Navigator>
            <Stack.Screen
                name={name}
                component={component}
                options={({ navigation }) => ({
                    headerLeft: () => (
                        <DrawerButton
                            navigation={navigation}
                        />
                    ),
                    headerBackground: () => (
                        <SafeAreaView>
                            <View
                                style={{
                                    width: progressWidth,
                                    height: 3,
                                    backgroundColor: 'red',
                                }}
                            />
                        </SafeAreaView>
                    ),
                    headerRight: () => (
                        (name === 'Dogs')
                        && (
                            <View style={{ flexDirection: 'row' }}>
                                <DeleteSelectedDogsButton />
                                <DeleteAllDogsButton />
                            </View>
                        )
                    ),
                })}
            />
        </Stack.Navigator>
    );
};
