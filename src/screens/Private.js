import React, { useContext } from 'react'
import { Text, View } from 'react-native';
import { AuthContext } from './../context'

export const Private = () => {
    const { currentUser } = useContext(AuthContext)

    return (
        <View style={{
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Text style={{ fontSize: 25 }}>
                Private page
            </Text>
            {currentUser &&
                <Text style={{ fontSize: 15 }}>
                    hello: {currentUser.email}
                </Text>
            }
        </View>
    )
}