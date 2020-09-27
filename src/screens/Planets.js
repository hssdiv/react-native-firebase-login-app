import React, { useContext, useEffect, useState } from 'react'
import { View, ScrollView } from 'react-native';
import { PlanetsContext } from '../context';
import { Spinner, SimpleErrorMessage } from './../components'
import { PlanetsTable } from './../components/PlanetsTable/PlanetsTable'

export const Planets = () => {
    const { planetsResult, planetsMethods } = useContext(PlanetsContext)

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        const call = async () => {
            setSpinnerIsVisible(true)
            const result = await planetsMethods.fetchPlanets();
            if (result) {
                if (result.loaded) {
                    setSpinnerIsVisible(false);
                    setErrorMessage(null);
                } else {
                    setSpinnerIsVisible(false);
                    setErrorMessage(result.errorMessage);
                }
            } else {
                setSpinnerIsVisible(false);
                setErrorMessage(null);
            }
        }
        call();
    }, [])

    return (
        <View
            style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'stretch',
            }}>
            <Spinner
                visible={spinnerIsVisible}
            />
            {errorMessage &&
                <SimpleErrorMessage
                    error={errorMessage}
                />}
            {planetsResult &&
                <ScrollView>
                    <PlanetsTable

                        planets={planetsResult}
                    />
                </ScrollView>
            }
        </View>
    )
}