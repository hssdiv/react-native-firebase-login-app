import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export const PlanetRowLandscape = (props) => {
    return (
        <View style={styles.row}>
            <View 
                style={styles.planetTd}>
                <Text
                    style={styles.planetTdName}
                >
                    {props.name}
                </Text>
            </View>
            <View 
                style={styles.planetTd}
            >
                <Text>
                    {props.population}
                </Text>
            </View>
            <View 
                style={styles.planetTd}
            >
                <Text>
                    {props.climate}
                </Text>
            </View>
            <View 
                style={styles.planetTd}
            >
                <Text>
                    {props.gravity}
                </Text>
            </View>
            <View 
                style={styles.planetTd}
            >
                <Text>
                    {props.terrain}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    planetTd: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        flex: 1,
        alignSelf: 'stretch'
    },
    planetTdName: {
        fontWeight: "bold",
    },
    row: { 
        flex: 1, 
        alignSelf: 'stretch', 
        flexDirection: 'row' 
    }
})
