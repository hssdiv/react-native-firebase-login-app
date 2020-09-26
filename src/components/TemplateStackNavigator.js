import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { DrawerButton } from './DrawerButton'

export const Stack = createStackNavigator()

export const TemplateStackNavigator= ({ name, component }) => {
    return (
      <Stack.Navigator>
        <Stack.Screen 
          name={name}
          component={component} 
          options={({ navigation }) => ({
            headerStyle: {
              height: 80,
            },
            headerLeft: () => (
              <DrawerButton navigation={navigation}/>
            ),
          })}/>
      </Stack.Navigator>
    );
  }