import React from 'react'
import { Button } from 'react-native'

export const DrawerButton = ({ navigation }) => {
    return (
        <Button
            title='&#9776;'
            onPress={() => navigation.toggleDrawer()} 
        />
    )
}