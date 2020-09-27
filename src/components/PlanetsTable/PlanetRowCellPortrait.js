import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

export const PlanetRowCellPortrait = (props) => {
    return (
        <View style={styles.row}>
            <Text 
                style={styles.firstPlanetTableChild}
            >
                {props.name}
            </Text>
            <Text 
                style={styles.secondPlanetTableChild}
            >
                {props.value}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    firstPlanetTableChild: { 
        fontWeight: 'bold',
        padding: 5,
        flex: 1,
    },
    secondPlanetTableChild: {
        padding: 5,
        flex: 1,
        flexGrow: 2
    }
})