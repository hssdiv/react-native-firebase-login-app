import React, { useState, useEffect, useContext } from 'react';
import {
    View, StyleSheet, ScrollView, Dimensions,
} from 'react-native';
import {
    AddDogCard, DogsDeleteModal, DogAddModal, DogsCards,
} from '../components/DogCards';
import { cloudFirestore as firestore } from '../config/Firebase';
import { Spinner, SimpleErrorMessage } from '../components';
import {
    DogsScreenUIContext, DogsDataContext, FirebaseStorageContext,
    FirestoreContext, AddDogCardContext,
} from '../context';

export const Dogs = () => {
    const [firestoreDogs, setFirestoreDogs] = useState(null);
    const [dogs, setDogs] = useState(null);
    const [randomDog, setRandomDog] = useState({});
    const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
    const [deleteAllModalIsVisible, setDeleteAllModalIsVisible] = useState(false);
    const [dogAddModalVisible, setDogAddModalVisible] = useState(false);
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);
    const [simpleErrorMsg, setSimpleErrorMsg] = useState(null);
    const [orientation, setOrientation] = useState(null);

    const { dogsScreenUIStatus, dogsScreenUIMethods } = useContext(DogsScreenUIContext);
    const { dogsContextStatus, dogsMethods } = useContext(DogsDataContext);
    const { storageStatus, storageMethods } = useContext(FirebaseStorageContext);
    const { firestoreStatus, firestoreMethods } = useContext(FirestoreContext);
    const { addDogCardModalStatus } = useContext(AddDogCardContext);

    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        console.log('useEffect fetching Dogs from fs...');
        const dogListenerUnsubscribe = firestore.collection('dogs').onSnapshot((snapshot) => {
            const dogsData = [];
            snapshot.forEach((doc) => dogsData.push(({ id: doc.id, ...doc.data() })));
            setFirestoreDogs(dogsData);
        });
        return dogListenerUnsubscribe;
    }, []);

    useEffect(() => {
        const dim = Dimensions.get('screen');
        if (dim.height >= dim.width) {
            setOrientation('PORTRAIT');
        } else {
            setOrientation('LANDSCAPE');
        }
        const listener = Dimensions.addEventListener('change', () => {
            const dim2 = Dimensions.get('screen');
            if (dim2.height >= dim2.width) {
                setOrientation('PORTRAIT');
            } else {
                setOrientation('LANDSCAPE');
            }
        });

        return listener;
    }, []);

    useEffect(() => {
        if (storageStatus) {
            switch (storageStatus.status) {
                case 'ERROR':
                    setSimpleErrorMsg(storageStatus.errorMessage);
                    break;
                default:
                    break;
            }
        }
        if (firestoreStatus) {
            switch (firestoreStatus.status) {
                case 'ERROR':
                    setSimpleErrorMsg(firestoreStatus.errorMessage);
                    break;
                default:
                    break;
            }
        }
    }, [storageStatus, firestoreStatus]);

    useEffect(() => {
        if (dogsScreenUIStatus) {
            switch (dogsScreenUIStatus.type) {
                case 'SHOW_DELETE_SELECTED_MODAL':
                    setDeleteModalIsVisible(true);
                    break;
                case 'SHOW_DELETE_ALL_MODAL':
                    setDeleteAllModalIsVisible(true);
                    break;
                case 'MODAL_CLOSED':
                    setDeleteModalIsVisible(false);
                    setDeleteAllModalIsVisible(false);
                    break;
                case 'MODAL_DELETE_SELECTED_PRESSED':
                    setDeleteModalIsVisible(false);
                    firestoreMethods.deleteSelected(dogs);
                    break;
                case 'MODAL_DELETE_ALL_PRESSED':
                    setDeleteAllModalIsVisible(false);
                    firestoreMethods.deleteAll();
                    break;
                default:
                    break;
            }
        }
    }, [dogsScreenUIStatus]);

    useEffect(() => {
        if (dogsContextStatus) {
            switch (dogsContextStatus.type) {
                case 'DOG_LOADED':
                    setRandomDog(dogsContextStatus.dog);
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
                    dogsMethods.setDogs(dogsWithCheckedDog);
                    break;
                default:
                    break;
            }
        }
    }, [dogsContextStatus]);

    useEffect(() => {
        console.log('detected changes to Dogs list:');
        if (firestoreDogs) {
            console.log(`Dogs size: ${firestoreDogs.length}`);
            if (dogs) {
                const dogsMerged = firestoreDogs.map((firestoreDog) => {
                    const someDog = dogs.find((checkedDog) => checkedDog.id === firestoreDog.id);
                    if (someDog) {
                        return {
                            ...someDog,
                            ...firestoreDogs.find(
                                (someFirestoreDog) => someFirestoreDog.id === someDog.id,
                            ),
                        };
                    }
                    return firestoreDog;
                });
                dogsMethods.setDogs(dogsMerged);
            } else {
                const newFirestoreDogs = firestoreDogs.map((dog) => ({ ...dog, checked: false }));
                dogsMethods.setDogs(newFirestoreDogs);
            }
        }
    }, [firestoreDogs]);

    useEffect(() => {
        if ((dogs) && (dogs.find((checkedDog) => checkedDog.checked === true))) {
            dogsScreenUIMethods.deleteSelectedButtonEnabled();
        } else {
            dogsScreenUIMethods.deleteSelectedButtonDisabled();
        }
    }, [dogs]);

    useEffect(() => {
        const callRandomDogApi = async () => {
            setSpinnerIsVisible(true);
            const randomDogResult = await dogsMethods.getRandomDog(); // sets randomDog
            if (randomDogResult && randomDogResult.loaded) {
                setSimpleErrorMsg(null);
            } else {
                setSimpleErrorMsg('Coudn\'t get dogs from server');
            }
            setSpinnerIsVisible(false);
        };

        if (addDogCardModalStatus) {
            switch (addDogCardModalStatus.type) {
                case 'MODAL_ADD_DOG_CONFIRMED':
                    setDogAddModalVisible(false);
                    if (addDogCardModalStatus.addType === 'RANDOM') {
                        callRandomDogApi();
                    } else {
                        storageMethods.uploadPicture(addDogCardModalStatus);
                    }
                    break;
                case 'MODAL_ADD_DOG_CLOSED':
                    setDogAddModalVisible(false);
                    break;
                default:
                    break;
            }
        }
    }, [addDogCardModalStatus]);

    useEffect(() => {
        console.log('Getting random dog...');
        if ((randomDog.message) && (randomDog.message.includes('breeds'))) {
            const breedName = getFullBreedName(randomDog.message);
            let dog;
            if (breedName.includes('-')) {
                const [masterBreed, subBreed] = breedName.split('-');
                dog = { breed: masterBreed, subBreed, imageUrl: randomDog.message };
            } else {
                dog = { breed: breedName, imageUrl: randomDog.message };
            }
            firestoreMethods.addDogToFirestore(dog);
        } else if (randomDog.error) {
            setSimpleErrorMsg(randomDog.error);
        }
        setSpinnerIsVisible(false);
    }, [randomDog]);

    function getFullBreedName(url) {
        const position = url.indexOf('breeds');
        const BREED_AND_SLASH_LENGTH = 7;
        const start = position + BREED_AND_SLASH_LENGTH;
        const end = url.indexOf('/', start);
        return url.substring(start, end);
    }

    return (
        <View
            style={{
                height: screenHeight - 100,
            }}
        >
            <DogAddModal
                visible={dogAddModalVisible}
            />
            <DogsDeleteModal
                visible={deleteModalIsVisible}
                title="Delete dog(s)"
                text="Are you sure you want to delete selected dog(s)?"
                type="MODAL_DELETE_CHECKED_PRESSED"
            />
            <DogsDeleteModal
                visible={deleteAllModalIsVisible}
                title="Delete all dogs"
                text="Are you sure you want to delete all dogs?"
                type="MODAL_DELETE_ALL_PRESSED"
            />

            <SimpleErrorMessage
                error={simpleErrorMsg}
                onPress={() => { setSimpleErrorMsg(null); }}
            />
            {orientation === 'PORTRAIT'
                && (
                    <ScrollView
                        contentContainerStyle={styles.dogsContainerPortrait}
                    >
                        <AddDogCard
                            onClick={() => setDogAddModalVisible(true)}
                        />
                        <DogsCards dogs={dogs} />
                    </ScrollView>
                )}
            {orientation === 'LANDSCAPE'
                && (
                    <ScrollView
                        contentContainerStyle={styles.dogsContainerLandscape}
                    >
                        { console.log(orientation)}
                        <AddDogCard
                            onClick={() => setDogAddModalVisible(true)}
                        />
                        <DogsCards
                            dogs={dogs}
                        />
                    </ScrollView>
                )}
            {spinnerIsVisible
                && <Spinner />}
        </View>
    );
};

const styles = StyleSheet.create({
    dogsContainerPortrait: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'stretch',
    },
    dogsContainerLandscape: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
});
