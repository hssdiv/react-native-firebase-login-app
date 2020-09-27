import React from 'react'
import { StyleSheet, View } from 'react-native'
import { PlanetRowCellPortrait } from './PlanetRowCellPortrait'

export const PlanetRowPortrait = (props) => {
    return (
        <View style={styles.planetTd}>
            <PlanetRowCellPortrait 
                name='Name' 
                value={props.name} 
            />
            <PlanetRowCellPortrait 
                name='Population' 
                value={props.population} 
            />
            <PlanetRowCellPortrait 
                name='Climate' 
                value={props.climate} 
            />
            <PlanetRowCellPortrait 
                name='Gravity' 
                value={props.gravity} 
            />
            <PlanetRowCellPortrait 
                name='Terrain' 
                value={props.terrain} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    planetTd: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        flex: 1,
        alignItems: 'stretch'
    },
})
