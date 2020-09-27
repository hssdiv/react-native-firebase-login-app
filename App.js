import 'react-native-gesture-handler';
import React from 'react';
import { MainProvider } from './src/context/MainProvider';
import { MainApp } from './src/MainApp';

const App = () => (
    <MainProvider>
        <MainApp />
    </MainProvider>
);

export default App;
