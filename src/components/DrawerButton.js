import React from 'react'
import { Button, View } from 'react-native'

export const DrawerButton = ({ navigation }) => {
    return (
        <View
            style={{ marginStart: 10 }}
        >
            <Button
                title='&#9776;'
                onPress={() => navigation.toggleDrawer()}
            />
        </View>

    )
}