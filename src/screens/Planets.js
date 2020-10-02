import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { PlanetsContext } from '../context';
import { Spinner, SimpleErrorMessage } from '../components';
import { PlanetsTable } from '../components/PlanetsTable/PlanetsTable';

export const Planets = () => {
    const { planetsResult, planetsMethods } = useContext(PlanetsContext);

    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const call = async () => {
            setSpinnerIsVisible(true);
            const result = await planetsMethods.fetchPlanets();
            if (result) {
                if (result.loaded) {
                    setSpinnerIsVisible(false);
                    setError(null);
                } else {
                    setSpinnerIsVisible(false);
                    setError(result.errorMessage);
                }
            } else {
                setSpinnerIsVisible(false);
                setError(null);
            }
        };
        call();
    }, []);

    return (
        <View
            style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'stretch',
            }}
        >
            <Spinner
                visible={spinnerIsVisible}
            />
            <SimpleErrorMessage
                error={error}
                onPress={() => { setError(null); }}
            />
            {planetsResult
                && (
                    <ScrollView>
                        <PlanetsTable
                            planets={planetsResult}
                        />
                    </ScrollView>
                )}
        </View>
    );
};
