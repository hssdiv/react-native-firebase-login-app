import React, {
    useEffect, useContext, useLayoutEffect, useCallback, useState,
} from 'react';
import { BackHandler, ToastAndroid } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from './context';
import {
    Login, Registration, Public, Private, Next, Planets, Dogs,
} from './screens';
import { DrawerContent, StackNavigatorTemplate } from './components';

export const Drawer = createDrawerNavigator();

export const MainApp = () => {
    const { currentUser, authMethods } = useContext(AuthContext);

    const [backButtonPressed, setBackButtonPressed] = useState(false);

    const privateScreens = [
        { name: 'Private', component: Private, icon: 'shield-home-outline' },
        { name: 'Next', component: Next, icon: 'page-next' },
        { name: 'Planets', component: Planets, icon: 'earth' },
        { name: 'Dogs', component: Dogs, icon: 'dog-side' },
    ];

    const publicScreens = [
        { name: 'Public', component: Public, icon: 'home' },
        { name: 'Login', component: Login, icon: 'login' },
        { name: 'Registration', component: Registration, icon: 'login-variant' },
    ];

    useEffect(() => {
        const listener = authMethods.enableAuthStateListener();
        return listener;
    }, []);

    useLayoutEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (backButtonPressed) {
                    setBackButtonPressed(false);
                    return false;
                }
                ToastAndroid.showWithGravityAndOffset(
                    'Press Back again to exit',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50,
                );
                setBackButtonPressed(true);
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }), [backButtonPressed, setBackButtonPressed],
    );

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                {currentUser
                    ? (
                        <Drawer.Navigator
                            initialRouteName="Private"
                            drawerContent={(props) => (
                                <DrawerContent
                                    {...props}
                                    user={currentUser}
                                />
                            )}
                        >
                            {privateScreens.map((screen) => (
                                <Drawer.Screen
                                    key={screen.name}
                                    name={screen.name}
                                    options={{
                                        drawerIcon: () => (
                                            <Icon
                                                name={screen.icon}
                                                size={20}
                                            />
                                        ),
                                    }}
                                >
                                    {(props) => (
                                        <StackNavigatorTemplate
                                            name={screen.name}
                                            component={screen.component}
                                            {...props}
                                        />
                                    )}
                                </Drawer.Screen>
                            ))}
                        </Drawer.Navigator>
                    )
                    : (
                        <Drawer.Navigator
                            initialRouteName="Login"
                        >
                            {publicScreens.map((screen) => (
                                <Drawer.Screen
                                    key={screen.name}
                                    name={screen.name}
                                    options={{
                                        drawerIcon: () => (
                                            <Icon
                                                name={screen.icon}
                                                size={20}
                                            />
                                        ),
                                    }}
                                >
                                    {(props) => (
                                        <StackNavigatorTemplate
                                            name={screen.name}
                                            component={screen.component}
                                            {...props}
                                        />
                                    )}
                                </Drawer.Screen>
                            ))}
                        </Drawer.Navigator>
                    )}
            </NavigationContainer>
        </SafeAreaProvider>
    );
};
