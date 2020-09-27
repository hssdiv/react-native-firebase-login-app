import React, { useState, useEffect, useContext } from 'react';
import {
    View, StyleSheet, Text, ScrollView, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Dog, AddDogCard, DogDeleteModal, DogAddModal,
} from '../components/DogCards';
import { cloudFirestore as firestore } from '../config/Firebase';
import { Spinner, SimpleErrorMessage } from '../components';
import { DogsContext, FirebaseStorageContext, FirestoreContext } from '../context';

export const Dogs = () => {
    // const currentScreenWidth = GetWidth()

    const [dogs, setDogs] = useState(null);
    const [dogsChecked, setDogsChecked] = useState(null);

    const [randomDog, setRandomDog] = useState({});

    const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
    const [deleteAllModalIsVisible, setDeleteAllModalIsVisible] = useState(false);
    const [dogAddModalVisible, setDogAddModalVisible] = useState(false);
    const [spinnerIsVisible, setSpinnerIsVisible] = useState(false);
    const [deleteCheckedEnabled, setDeleteCheckedEnabled] = useState(false);

    const [simpleErrorMsg, setSimpleErrorMsg] = useState(null);

    const { dogResult, dogMethods } = useContext(DogsContext);
    const { storageStatus, storageMethods } = useContext(FirebaseStorageContext);
    const { firestoreStatus, firestoreMethods } = useContext(FirestoreContext);

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
        if (dogResult) {
            setRandomDog(dogResult);
        }
    }, [dogResult]);

    useEffect(() => {
        console.log('detected changes to Dogs list:');
        if (dogs) {
            console.log(`Dogs size: ${dogs.length}`);
            console.log(dogs);
            if (dogsChecked) {
                const dogsMerged = dogs.map((dog) => {
                    const vauDog = dogsChecked.find((checkedDog) => checkedDog.id === dog.id);

                    if (vauDog) {
                        return { ...vauDog, ...dogs.find((dog) => dog.id === vauDog.id) };
                    }
                    return dog;
                });

                setDogsChecked(dogsMerged);
                console.log('dogsMerged');
                console.log(dogsMerged);
            } else {
                const newDogsChecked = dogs.map((dog) => ({ ...dog, checked: false }));
                setDogsChecked(newDogsChecked);
                console.log('newDogsChecked');
                console.log(newDogsChecked);
            }
        }
        // eslint-disable-next-line
    }, [dogs])

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
            setDeleteCheckedEnabled(true);
        } else {
            setDeleteCheckedEnabled(false);
        }
    }, [dogsChecked]);

    const handleAddDogOnClick = () => {
        setDogAddModalVisible(true);
    };

    const handleDeleteButton = () => {
        setDeleteModalIsVisible(true);
    };

    const handleDeleteAllButton = () => {
        setDeleteAllModalIsVisible(true);
    };

    const modalDeleteCallback = (result) => {
        switch (result) {
        case 'MODAL_CLOSED':
            setDeleteModalIsVisible(false);
            break;
        case 'MODAL_DELETE_CHECKED_PRESSED':
            setDeleteModalIsVisible(false);
            firestoreMethods.deleteSelected(dogsChecked);
            break;
        case 'MODAL_DELETE_ALL_PRESSED':
            setDeleteAllModalIsVisible(false);
            firestoreMethods.deleteAll();
            break;
        default:
        }
    };

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
        // eslint-disable-next-line
    }, [randomDog])

    function getFullBreedName(url) {
        const position = url.indexOf('breeds');
        const BREED_AND_SLASH_LENGTH = 7;
        const start = position + BREED_AND_SLASH_LENGTH;
        const end = url.indexOf('/', start);
        return url.substring(start, end);
    }

    const addModalCallback = async (result) => {
        setDogAddModalVisible(false);
        switch (result.action) {
        case 'MODAL_CLOSED':
            setDogAddModalVisible(false);
            break;
        case 'MODAL_CONFIRM_PRESSED':
            if (result.type === 'RANDOM') {
                setSpinnerIsVisible(true);

                const randomDogResult = await dogMethods.getRandomDog();
                if (randomDogResult) {
                    if (result.loaded) {
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
            } else {
                storageMethods.uploadPicture(result);
            }
            break;
        default:
        }
    };

    return (
        <View
            style={{
                height: screenHeight - 100,
            }}
        >

            {/* {deleteModalIsVisible &&
                <DogDeleteModal
                    callback={modalDeleteCallback}
                    title='Delete dog(s)'
                    text='Are you sure you want to delete dog(s)?'
                    type='MODAL_DELETE_CHECKED_PRESSED'
                />
            }
            {deleteAllModalIsVisible &&
                <DogDeleteModal
                    callback={modalDeleteCallback}
                    title='Delete all dogs'
                    text='Are you sure you want to delete all dogs?'
                    type='MODAL_DELETE_ALL_PRESSED'
                />}
            {dogAddModalVisible &&
                <DogAddModal callback={addModalCallback} />}
            <h1>
                Dogs page
            </h1>
            <div>
                {deleteCheckedEnabled ?
                    <button
                        className='deleteDogsButton'
                        onClick={handleDeleteButton}
                    >
                        Delete selected
                    </button>
                    :
                    <button
                        className='deleteDogsButton'
                        disabled style={{ opacity: '0.5' }}
                    >
                        Delete selected
                    </button>
                }
                <button
                    className='deleteAllDogsButton'
                    onClick={handleDeleteAllButton}
                >
                    Delete all
                </button>
            </div>

            <SimpleErrorMessage
                error={simpleErrorMsg}
            />
            */}
            <ScrollView
                contentContainerStyle={styles.dogCardContainer}
            >

                <AddDogCard onClick={handleAddDogOnClick} />
                {dogsChecked
                    && dogsChecked.map((dog) => (
                        <Dog
                            key={dog.id}
                            dogData={dog}
                            handleChecked={handleChecked}
                        />
                    ))}
            </ScrollView>
            {spinnerIsVisible
                && <Spinner />}
        </View>
    );
};

const styles = StyleSheet.create({
    dogCardContainer: {
        flexGrow: 1,
        alignItems: 'stretch',
    },
});
