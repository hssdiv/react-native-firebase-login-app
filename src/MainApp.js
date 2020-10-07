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

    const privateScreens = [
        { name: 'Private', component: Private },
        { name: 'Next', component: Next },
        { name: 'Planets', component: Planets },
        { name: 'Dogs', component: Dogs },
    ];

    const publicScreens = [
        { name: 'Public', component: Public },
        { name: 'Login', component: Login },
        { name: 'Registration', component: Registration },
    ];

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
                            {privateScreens.map((screen) => (
                                <Drawer.Screen
                                    key={screen.name}
                                    name={screen.name}
                                >
                                    {(props) => (
                                        <TemplateStackNavigator
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
                                >
                                    {(props) => (
                                        <TemplateStackNavigator
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
