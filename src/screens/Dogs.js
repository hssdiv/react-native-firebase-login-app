import React, { useState, useEffect, useContext } from 'react';
import {
    View, StyleSheet, Text, RefreshControl,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
    AddDogButton, DogsDeleteModal, DogAddModal, Dog,
} from '../components/DogCards';
import { Spinner, SimpleErrorMessage } from '../components';
import {
    DogsContext, FirebaseStorageContext, FirestoreContext,
    DogCardProvider,
} from '../context';
import { useScreenOrientation } from '../util/useScreenOrientation';
import { setUpNotificationsEventListeners } from '../ui';
import { DOGS_PER_PAGE } from '../constants';

export const Dogs = () => {
    const orientation = useScreenOrientation();
    const [dogCardsColumnsNumber, setDogCardsColumnsNumber] = useState(1);

    const { dogsContextStatus, dogsContextMethods } = useContext(DogsContext);
    const { storageStatus } = useContext(FirebaseStorageContext);
    const { firestoreStatus, firestoreMethods } = useContext(FirestoreContext);

    useEffect(() => {
        setUpNotificationsEventListeners();
        firestoreMethods.loadDogsFromFirestore(DOGS_PER_PAGE);
    }, []);

    useEffect(() => {
        if (orientation === 'PORTRAIT') {
            setDogCardsColumnsNumber(1);
        } else {
            setDogCardsColumnsNumber(2);
        }
    }, [orientation]);

    useEffect(() => {
        if (firestoreStatus?.type === 'LOADED_DOGS_FROM_FIRESTORE') {
            dogsContextMethods.setDogsFromFirestore(firestoreStatus.dogsFromFirestore);
        }
    }, [firestoreStatus]);

    const loadMoreDogsFromFirestore = () => {
        dogsContextMethods.showLoadMoreSpinner();
        firestoreMethods.loadDogsFromFirestore(firestoreStatus.currentNumberOfDogsLoaded
            + DOGS_PER_PAGE);
    };

    return (
        <View
            style={{ flex: 1 }}
        >
            <DogAddModal
                visible={dogsContextStatus.addDogModalIsVisible}
            />
            <DogsDeleteModal
                visible={dogsContextStatus.deleteModalIsVisible}
                title="Delete dog(s)"
                text="Are you sure you want to delete selected dog(s)?"
                type="MODAL_DELETE_SELECTED_PRESSED"
            />
            <DogsDeleteModal
                visible={dogsContextStatus.deleteAllModalIsVisible}
                title="Delete all dogs"
                text="Are you sure you want to delete all dogs?"
                type="MODAL_DELETE_ALL_PRESSED"
            />
            <SimpleErrorMessage
                error={dogsContextStatus.error || firestoreStatus.error || storageStatus.error}
                onPress={dogsContextMethods.clearErrorMessage}
            />
            {
                dogsContextStatus.dogs
                && (
                    dogsContextStatus.dogs.length !== 0
                        ? (
                            <FlatList
                                contentContainerStyle={styles.dogsContainer}
                                numColumns={dogCardsColumnsNumber}
                                key={dogCardsColumnsNumber}
                                keyExtractor={(dog) => dog.id}
                                onEndReached={loadMoreDogsFromFirestore}
                                onEndReachedThreshold={0.1}
                                data={dogsContextStatus.dogs}
                                ListFooterComponent={
                                    () => (
                                        <Spinner
                                            visible={dogsContextStatus.loadMoreSpinnerIsVisible}
                                        />
                                    )
                                }
                                ListFooterComponentStyle={{ marginTop: 20 }}
                                refreshControl={(
                                    <RefreshControl
                                        colors={['#9Bd35A', '#689F38']}
                                        refreshing={dogsContextStatus.refreshSpinnerIsVisible}
                                        onRefresh={firestoreMethods.refreshDogs}
                                    />
                                )}
                                renderItem={
                                    ({ item }) => (
                                        <DogCardProvider>
                                            <Dog
                                                dogData={item}
                                            />
                                        </DogCardProvider>
                                    )
                                }
                            />
                        )
                        : (
                            <View
                                style={styles.hint}
                            >
                                <Text>
                                    Add dog(s) to display.
                                </Text>
                            </View>
                        )
                )
            }
            <AddDogButton />
            <Spinner
                visible={
                    dogsContextStatus.spinnerIsVisible
                    || storageStatus.spinnerIsVisible
                    || firestoreStatus.spinnerIsVisible
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    dogsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        alignSelf: 'center',
        marginStart: 50,
        marginEnd: 50,
    },
    hint: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
