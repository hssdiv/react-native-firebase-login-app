import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { StatusBar } from 'react-native';
import { MainProvider } from './src/context/MainProvider';
import { MainApp } from './src/MainApp';

const App = () => {
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return (
        <MainProvider>
            <StatusBar barStyle="light-content" />
            <MainApp />
        </MainProvider>
    );
}
export default App;
