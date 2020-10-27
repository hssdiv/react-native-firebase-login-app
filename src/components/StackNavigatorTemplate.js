import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { DrawerButton } from './DrawerButton';
import { DeleteAllDogsButton, DeleteSelectedDogsButton } from './DogCards';
import { FirebaseStorageContext } from '../context';

export const Stack = createStackNavigator();

export const StackNavigatorTemplate = ({ name, component }) => {
    const { storageStatus } = useContext(FirebaseStorageContext);

    const [progressWidth, setProgressWidth] = useState(0);

    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        if (storageStatus) {
            switch (storageStatus.type) {
                case 'UPDATE_PROGRESS_BAR':
                    console.log(`in pixel: ${(screenWidth / 100) * storageStatus.percentage}`);
                    setProgressWidth(screenWidth * storageStatus.percentage);
                    break;
                case 'DOG_PICTURE_UPLOADED':
                    setProgressWidth(0);
                    break;
                default:
                    break;
            }
        }
    }, [storageStatus]);

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'red',
                },
            }}
        >
            <Stack.Screen
                name={name}
                component={component}
                options={({ navigation }) => ({
                    headerLeft: () => (
                        <DrawerButton
                            navigation={navigation}
                        />
                    ),
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        color: 'white',
                    },
                    headerBackground: () => (
                        <View
                            style={{
                                backgroundColor: 'rgb(100, 107, 110)',
                                opacity: 1,
                                flex: 1,
                            }}
                        >
                            <SafeAreaView>
                                <View
                                    style={{
                                        width: progressWidth,
                                        height: 3,
                                        backgroundColor: 'red',
                                    }}
                                />
                            </SafeAreaView>
                        </View>
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
