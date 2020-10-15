import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { PlanetsContext } from '../context';
import { Spinner, SimpleErrorMessage } from '../components';
import { PlanetsTable } from '../components/PlanetsTable/PlanetsTable';

export const Planets = () => {
    const { planetsResult, planetsMethods } = useContext(PlanetsContext);

    const [error, setError] = useState(null);

    useEffect(() => {
        const call = async () => {
            const result = await planetsMethods.fetchPlanets();
            if (result) {
                if (result.loaded) {
                    setError(null);
                } else {
                    setError(result.errorMessage);
                }
            } else {
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
            <SimpleErrorMessage
                error={error}
                onPress={() => { setError(null); }}
            />
            { planetsResult
                ? (
                    <ScrollView>
                        <PlanetsTable
                            planets={planetsResult}
                        />
                    </ScrollView>
                )
                : (
                    <Spinner
                        visible={!error}
                    />
                )}
        </View>
    );
};
