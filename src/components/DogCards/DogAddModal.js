import React, { useState, useRef, useContext } from 'react';
import {
    Modal, StyleSheet, Text, TextInput, View, TouchableOpacity, Button,
    Image, Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { SimpleErrorMessage } from '../SimpleErrorMessage';
import { RadioButton } from '../../util/RadioButton';
import { AddDogCardContext } from '../../context';

export const DogAddModal = ({ visible }) => {
    const [breed, setBreed] = useState(null);
    const [subBreed, setSubBreed] = useState(null);
    const [dogPicture, setDogPicture] = useState(null);

    const [dogPictureThumbnailUri, setDogPictureThumbnailUri] = useState(null);

    const [formEnabled, setFormEnabled] = useState(false);

    const [randomSelected, setRandomSelected] = useState(true);

    const [error, setError] = useState(null);
    const { addDogCardModalMethods } = useContext(AddDogCardContext);

    const handleCancelButton = () => {
        setDogPictureThumbnailUri(null);
        setDogPicture(null);
        addDogCardModalMethods.closeAddModal();
    };

    const launchImageLibrary = () => {
        const options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                const { uri } = response;
                const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
                setDogPictureThumbnailUri(source);
                setDogPicture(uploadUri);
            }
        });
    };

    const handleConfirmButton = () => {
        if (formEnabled) {
            if ((breed === null) || (breed === '')) {
                setError('You must type in breed');
            } else if (dogPicture === null) {
                setError('You must uplaod dog picture');
            } else {
                setError(null);
                addDogCardModalMethods.confirmAddCustom(
                    { breed, subBreed, dogPicture },
                );
                setDogPicture(null);
                setDogPictureThumbnailUri(null);
            }
        } else {
            setError(null);
            addDogCardModalMethods.confirmAddRandom();
        }
    };

    const handleRandomRadioButton = () => {
        setFormEnabled(false);
        if (!randomSelected) {
            setRandomSelected(true);
        }
    };
    const handleCustomRadioButton = () => {
        setFormEnabled(true);
        if (randomSelected) {
            setRandomSelected(false);
        }
    };

    return (
        <Modal
            visible={visible}
            supportedOrientations={['portrait', 'landscape']}
        >
            <ScrollView contentContainerStyle={styles.container}>

                <Text
                    style={styles.title}
                >
                    Add Dog
                </Text>
                <Text
                    style={styles.text}
                >
                    Select dog type
                </Text>
                <TouchableOpacity
                    onPress={handleRandomRadioButton}
                    style={styles.radioButton}
                >
                    <RadioButton
                        selected={randomSelected}
                    />
                    <Text>Random</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleCustomRadioButton}
                    style={styles.radioButton}
                >
                    <RadioButton
                        selected={!randomSelected}
                    />
                    <Text>Custom</Text>
                </TouchableOpacity>

                <SimpleErrorMessage
                    error={error}
                    onPress={() => { setError(null); }}
                />

                {!randomSelected
                    && (
                        <View
                            style={{ alignItems: 'center' }}
                        >
                            <Text
                                style={styles.label}
                            >
                                Breed:
                            </Text>
                            <TextInput
                                onChangeText={(val) => setBreed(val)}
                                style={styles.input}
                            />
                            <Text
                                style={styles.label}
                            >
                                Sub-breed:
                            </Text>
                            <TextInput
                                onChangeText={(val) => setSubBreed(val)}
                                style={styles.input}
                            />
                            {dogPictureThumbnailUri
                                && (
                                    <Image
                                        source={dogPictureThumbnailUri}
                                        style={styles.image}
                                    />
                                )}
                            <TouchableOpacity
                                onPress={launchImageLibrary}
                                style={styles.selectImageButton}
                            >
                                <Text
                                    style={styles.selectButtonText}
                                >
                                    Select dog picture from Image Library
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                <TouchableOpacity
                    style={styles.ComfirmButton}
                >
                    <Button
                        onPress={handleConfirmButton}
                        color="white"
                        title="Confirm"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.cancelButton}
                >
                    <Button
                        onPress={handleCancelButton}
                        color="white"
                        title="Cancel"
                    />
                </TouchableOpacity>
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        padding: 5,
        fontSize: 24,
    },
    text: {
        padding: 5,
        fontSize: 16,
    },
    label: {
        padding: 5,
    },
    input: {
        borderWidth: 1,
        padding: 8,
        width: 200,
    },
    ComfirmButton: {
        height: 40,
        width: 160,
        borderRadius: 10,
        backgroundColor: 'green',
        marginLeft: 50,
        marginRight: 50,
        marginTop: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.7,
    },
    cancelButton: {
        height: 40,
        width: 160,
        borderRadius: 10,
        backgroundColor: 'grey',
        marginLeft: 50,
        marginRight: 50,
        marginTop: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.7,
    },
    selectImageButton: {
        height: 40,
        width: 220,
        borderRadius: 10,
        backgroundColor: 'lightgrey',
        marginLeft: 50,
        marginRight: 50,
        marginTop: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowRadius: 5,
        shadowOpacity: 0.7,
    },
    selectButtonText: {
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        padding: 3,
    },
    radioButton: {
        flexDirection: 'row', alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderColor: 'black',
        borderWidth: 1,
        marginHorizontal: 3,
        margin: 10,
    },
});
