import React, { useState, useEffect, useContext } from 'react';
import {
    View, StyleSheet, ScrollView,
} from 'react-native';
import {
    AddDogButton, DogsDeleteModal, DogAddModal, DogsCards,
} from '../components/DogCards';
import { cloudFirestore as firestore } from '../config/Firebase';
import { Spinner, SimpleErrorMessage } from '../components';
import {
    DogsContext, FirebaseStorageContext, FirestoreContext,
} from '../context';
import { useScreenOrientation } from '../util/useScreenOrientation';

export const Dogs = () => {
    const [dogs, setDogs] = useState(null);
    const [simpleErrorMsg, setSimpleErrorMsg] = useState(null);

    const orientation = useScreenOrientation();

    const { dogsContextStatus, dogsContextMethods } = useContext(DogsContext);

    const { storageStatus, storageMethods } = useContext(FirebaseStorageContext);
    const { firestoreStatus, firestoreMethods } = useContext(FirestoreContext);

    useEffect(() => {
        console.log('fetching Dogs from fs...');
        const dogListenerUnsubscribe = firestore.collection('dogs').onSnapshot((snapshot) => {
            const dogsData = [];
            snapshot.forEach((doc) => dogsData.push(({ id: doc.id, ...doc.data() })));
            dogsContextMethods.setDogsFromFirestore(dogs, dogsData);
        });
        return dogListenerUnsubscribe;
    }, []);

    useEffect(() => {
        switch (dogsContextStatus?.type) {
            case 'MODAL_ADD_DOG_CONFIRMED_RANDOM':
                dogsContextMethods.getRandomDog();
                break;
            case 'GOT_RANDOM_DOG_FROM_API':
                try {
                    firestoreMethods.addDogToFirestore(dogsContextStatus.dogToAdd);
                } catch (firestoreError) {
                    setSimpleErrorMsg(firestoreError);
                }
                break;
            case 'MODAL_ADD_DOG_CONFIRMED_CUSTOM':
                storageMethods.addCustomDog(dogsContextStatus.dogToAdd);
                break;
            case 'MODAL_DELETE_SELECTED_PRESSED':
                firestoreMethods.deleteSelected(dogs);
                break;
            case 'MODAL_DELETE_ALL_PRESSED':
                firestoreMethods.deleteAll();
                break;
            case 'DOGS_LOADED':
                setDogs(dogsContextStatus.dogs);
                break;
            case 'DOG_CHECKBOX_CLICKED':
                const { id } = dogsContextStatus;
                const { isChecked } = dogsContextStatus;
                const checkedDog = dogs.find((dog) => dog.id === id);
                checkedDog.checked = isChecked;
                const dogsWithCheckedDog = dogs.map((dog) => {
                    if (dog.id === checkedDog.id) {
                        return checkedDog;
                    }
                    return dog;
                });
                dogsContextMethods.updateDogs(dogsWithCheckedDog);
                break;
            case 'ERROR':
                setSimpleErrorMsg(dogsContextStatus.error);
                break;
            default:
                break;
        }
    }, [dogsContextStatus]);

    useEffect(() => {
        switch (storageStatus?.type) {
            case 'ADD_CUSTOM_DOG_TO_FIRESTORE':
                firestoreMethods.addDogToFirestore(storageStatus.dogToAdd);
                break;
            case 'ERROR':
                setSimpleErrorMsg(storageStatus.errorMessage);
                break;
            default:
                break;
        }
    }, [storageStatus]);

    useEffect(() => {
        switch (firestoreStatus?.type) {
            case 'ERROR':
                setSimpleErrorMsg(firestoreStatus.errorMessage);
                break;
            case 'DELETE_FROM_STORAGE':
                storageMethods.deleteByUrl(firestoreStatus.urlToDeleteFromStorage);
                break;
            default:
                break;
        }
    }, [firestoreStatus]);

    useEffect(() => {
        if ((dogs) && (dogs.find((checkedDog) => checkedDog.checked === true))) {
            dogsContextMethods.deleteSelectedButtonEnabled();
        } else {
            dogsContextMethods.deleteSelectedButtonDisabled();
        }
    }, [dogs]);

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
                type="MODAL_DELETE_CHECKED_PRESSED"
            />
            <DogsDeleteModal
                visible={dogsContextStatus.deleteAllModalIsVisible}
                title="Delete all dogs"
                text="Are you sure you want to delete all dogs?"
                type="MODAL_DELETE_ALL_PRESSED"
            />
            <SimpleErrorMessage
                error={simpleErrorMsg}
                onPress={() => { setSimpleErrorMsg(null); }}
            />
            {orientation === 'PORTRAIT'
                ? (
                    <ScrollView
                        contentContainerStyle={styles.dogsContainerPortrait}
                    >
                        <DogsCards dogs={dogs} />
                    </ScrollView>
                )
                : (
                    <ScrollView
                        contentContainerStyle={styles.dogsContainerLandscape}
                    >
                        <DogsCards
                            dogs={dogs}
                        />
                    </ScrollView>
                )}
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
    dogsContainerPortrait: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        marginStart: 50,
        marginEnd: 50,
    },
    dogsContainerLandscape: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
