import React, { useState, useEffect, useContext } from 'react';
import {
    View, StyleSheet, ScrollView, Dimensions,
} from 'react-native';
import {
    Dog, AddDogCard, DogsDeleteModal, DogAddModal,
} from '../components/DogCards';
import { cloudFirestore as firestore } from '../config/Firebase';
import { Spinner, SimpleErrorMessage } from '../components';
import {
    DogsContext, FirebaseStorageContext, FirestoreContext, DogCardProvider, AddDogCardContext,
} from '../context';

export const Dogs = () => {
    const [dogs, setDogs] = useState(null);
    const [dogsChecked, setDogsChecked] = useState(null);

    const [randomDog, setRandomDog] = useState({});

    const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
    const [deleteAllModalIsVisible, setDeleteAllModalIsVisible] = useState(false);
    const [dogAddModalVisible, setDogAddModalVisible] = useState(false);
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);

    const [simpleErrorMsg, setSimpleErrorMsg] = useState(null);

    const [orientation, setOrientation] = useState(null);

    const { dogContextStatus, dogMethods } = useContext(DogsContext);
    const { storageStatus, storageMethods } = useContext(FirebaseStorageContext);
    const { firestoreStatus, firestoreMethods } = useContext(FirestoreContext);
    const { addDogCardModalStatus } = useContext(AddDogCardContext);

    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        console.log('useEffect fetching Dogs from fs...');
        const dogListenerUnsubscribe = firestore.collection('dogs').onSnapshot((snapshot) => {
            const dogsData = [];
            snapshot.forEach((doc) => dogsData.push(({ id: doc.id, ...doc.data() })));
            setDogs(dogsData);
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
        if (dogContextStatus) {
            switch (dogContextStatus.type) {
                case 'DOG_LOADED':
                    setRandomDog(dogContextStatus.dog);
                    break;
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
                    firestoreMethods.deleteSelected(dogsChecked);
                    break;
                case 'MODAL_DELETE_ALL_PRESSED':
                    setDeleteAllModalIsVisible(false);
                    firestoreMethods.deleteAll();
                    break;
                default:
                    break;
            }
        }
    }, [dogContextStatus]);

    useEffect(() => {
        console.log('detected changes to Dogs list:');
        if (dogs) {
            console.log(`Dogs size: ${dogs.length}`);
            if (dogsChecked) {
                const dogsMerged = dogs.map((dog) => {
                    const vauDog = dogsChecked.find((checkedDog) => checkedDog.id === dog.id);

                    if (vauDog) {
                        return { ...vauDog, ...dogs.find((someDog) => someDog.id === vauDog.id) };
                    }
                    return dog;
                });

                setDogsChecked(dogsMerged);
            } else {
                const newDogsChecked = dogs.map((dog) => ({ ...dog, checked: false }));
                setDogsChecked(newDogsChecked);
            }
        }
    }, [dogs]);

    const handleChecked = (id, isChecked) => {
        const checkedDog = dogsChecked.find((dog) => dog.id === id);
        checkedDog.checked = isChecked;
        const dogsWithCheckedDog = dogsChecked.map((dog) => {
            if (dog.id === checkedDog.id) {
                return checkedDog;
            }
            return dog;
        });
        setDogsChecked(dogsWithCheckedDog);
    };

    useEffect(() => {
        if ((dogsChecked) && (dogsChecked.find((checkedDog) => checkedDog.checked === true))) {
            dogMethods.deleteSelectedButtonEnabled();
        } else {
            dogMethods.deleteSelectedButtonDisabled();
        }
    }, [dogsChecked]);

    useEffect(() => {
        const callRandomDogApi = async () => {
            setSpinnerIsVisible(true);

            const randomDogResult = await dogMethods.getRandomDog();
            if (randomDogResult) {
                if (randomDogResult.loaded) {
                    setSpinnerIsVisible(false);
                    setSimpleErrorMsg(null);
                } else {
                    setSpinnerIsVisible(false);
                    setSimpleErrorMsg('Coudn\'t get dogs from server');
                }
            } else {
                setSpinnerIsVisible(false);
                setSimpleErrorMsg('Coudn\'t get dogs from server');
            }
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

            if (breedName.includes('-')) {
                const [masterBreed, subBreed] = breedName.split('-');
                const dog = { breed: masterBreed, subBreed, imageUrl: randomDog.message };
                console.log(`adding dog${dog.breed}to firestore`);

                firestoreMethods.addDogToFirestore(dog);
            } else {
                const dog = { breed: breedName, imageUrl: randomDog.message };
                console.log(`adding dog ${dog.breed} to firestore`);
                firestoreMethods.addDogToFirestore(dog);
            }

            setSpinnerIsVisible(false);
        } else if (randomDog.error) {
            setSimpleErrorMsg(randomDog.error);
            setSpinnerIsVisible(false);
        }
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
                ? (
                    <ScrollView
                        contentContainerStyle={styles.dogCardContainerPortrait}
                    >
                        <AddDogCard
                            onClick={() => setDogAddModalVisible(true)}
                        />
                        {dogsChecked
                            && dogsChecked.map((dog) => (
                                <DogCardProvider
                                    key={dog.id}
                                >
                                    <Dog
                                        dogData={dog}
                                        handleChecked={handleChecked}
                                    />
                                </DogCardProvider>
                            ))}
                    </ScrollView>
                )
                : (
                    <ScrollView
                        contentContainerStyle={styles.dogCardContainerLandScape}
                    >
                        { console.log(orientation) }
                        <AddDogCard
                            onClick={() => setDogAddModalVisible(true)}
                        />
                        {dogsChecked
                            && dogsChecked.map((dog) => (
                                <DogCardProvider
                                    key={dog.id}
                                >
                                    <Dog
                                        dogData={dog}
                                        handleChecked={handleChecked}
                                    />
                                </DogCardProvider>
                            ))}
                    </ScrollView>
                )}
            {
                spinnerIsVisible
                && <Spinner />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    dogCardContainerPortrait: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'stretch',
    },
    dogCardContainerLandScape: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
});
