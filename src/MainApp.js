import React, { useEffect, useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext } from './context';
import {
    Login, Registration, Public, Private, Next, Planets, Dogs,
} from './screens';
import { CustomDrawerContent, TemplateStackNavigator } from './components';

export const Drawer = createDrawerNavigator();

export const MainApp = () => {
    const { currentUser, authMethods } = useContext(AuthContext);

    useEffect(() => {
        const listener = authMethods.enableAuthStateListener();
        return listener;
    }, []);

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                {currentUser
                    ? (
                        <Drawer.Navigator
                            initialRouteName="Private"
                            drawerContent={(props) => (
                                <CustomDrawerContent
                                    {...props}
                                    user={currentUser}
                                />
                            )}
                        >
                            <Drawer.Screen
                                name="Private"
                            >
                                {(props) => (
                                    <TemplateStackNavigator
                                        name="Private"
                                        component={Private}
                                        {...props}
                                    />
                                )}
                            </Drawer.Screen>
                            <Drawer.Screen
                                name="Next"
                            >
                                {(props) => (
                                    <TemplateStackNavigator
                                        name="Next"
                                        component={Next}
                                        {...props}
                                    />
                                )}
                            </Drawer.Screen>
                            <Drawer.Screen
                                name="Planets"
                            >
                                {(props) => (
                                    <TemplateStackNavigator
                                        name="Planets"
                                        component={Planets}
                                        {...props}
                                    />
                                )}
                            </Drawer.Screen>
                            <Drawer.Screen
                                name="Dogs"
                            >
                                {(props) => (
                                    <TemplateStackNavigator
                                        name="Dogs"
                                        component={Dogs}
                                        {...props}
                                    />
                                )}
                            </Drawer.Screen>
                        </Drawer.Navigator>
                    )
                    : (
                        <Drawer.Navigator
                            initialRouteName="Login"
                        >
                            <Drawer.Screen
                                name="Login"
                            >
                                {(props) => (
                                    <TemplateStackNavigator
                                        name="Login"
                                        component={Login}
                                        {...props}
                                    />
                                )}
                            </Drawer.Screen>
                            <Drawer.Screen
                                name="Public"
                            >
                                {(props) => (
                                    <TemplateStackNavigator
                                        name="Public"
                                        component={Public}
                                        {...props}
                                    />
                                )}
                            </Drawer.Screen>
                            <Drawer.Screen
                                name="Registration"
                            >
                                {(props) => (
                                    <TemplateStackNavigator
                                        name="Registration"
                                        component={Registration}
                                        {...props}
                                    />
                                )}
                            </Drawer.Screen>
                        </Drawer.Navigator>
                    )}
            </NavigationContainer>
        </SafeAreaProvider>
    );
};
