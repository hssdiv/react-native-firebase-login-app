import React from 'react'
import { PlanetRowPortrait }from './PlanetRowPortrait'
import { formatBigNumber } from '../../util/BigNumberFormat'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export const PlanetsTablePortrait = ({ planets }) => {
    return (
        <SafeAreaView>
            <View style={styles.planetTable}>
                    {planets.map(planet =>
                        <PlanetRowPortrait
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
    planetTable: { 
        borderRadius: 10,
        overflow: "hidden",
        margin: 8,
        textAlign: "left",
        borderColor: "black",
        borderWidth: 1,
    }
})