import React from 'react'
import { PlanetRowLandscape } from './PlanetRowLandscape'
import { formatBigNumber } from './../../util/BigNumberFormat'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'

export const PlanetsTableLandscape = ({ planets }) => {
    return (
        <SafeAreaView>
            <View style={styles.planetTable}>
                <View style={styles.row}>
                    <Text style={styles.planetTh}>Name</Text>
                    <Text style={styles.planetTh}>Population</Text>
                    <Text style={styles.planetTh}>Climate</Text>
                    <Text style={styles.planetTh}>Gravity</Text>
                    <Text style={styles.planetTh}>Terrain</Text>
                </View>
                {planets.map(planet =>
                    <PlanetRowLandscape
                        key={planet.name}
                        name={planet.name}
                        population={formatBigNumber(planet.population)}
                        climate={planet.climate}
                        gravity={planet.gravity}
                        terrain={planet.terrain}
                    />
                )}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    planetTh: {
        padding: 5,
        color: 'white',
        backgroundColor: 'rgb(73, 79, 82)',
        
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row'
    },
    row: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    planetTable: {
        borderRadius: 10,
        overflow: "hidden",
        margin: 8,
        textAlign: "left",
        borderColor: "black",
        borderWidth: 1,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
