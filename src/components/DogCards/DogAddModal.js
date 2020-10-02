import React, { useState, useRef, useContext } from 'react';
import {
    Modal, StyleSheet, Text, TextInput, View, TouchableOpacity, Button,
    Image, Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { SimpleErrorMessage } from '..';
import { RadioButton } from '../../util/RadioButton';
import { AddDogCardContext } from '../../context';

export const DogAddModal = ({ visible }) => {
    const [breed, setBreed] = useState(null);
    const [subBreed, setSubBreed] = useState(null);
    const [dogPicture, setDogPicture] = useState(null);

    const [dogPictureThumbnailUri, setDogPictureThumbnailUri] = useState(null);

    const [formEnabled, setFormEnabled] = useState(false);

    const [randomSelected, setRandomSelected] = useState(true);

    // const { errorMessageMethods } = useContext(DogCardErrorContext);
    const [error, setError] = useState(null);
    const { addDogCardModalMethods } = useContext(AddDogCardContext);

    const imagePreviewRef = useRef(null);

    const [addType, setAddType] = useState('RANDOM');

    const handleCancelButton = () => {
        setDogPictureThumbnailUri(null);
        setDogPicture(null);
        addDogCardModalMethods.closeAddModal();
    };

    /* React.useEffect(() => {
        console.log(dogPictureUri)
    }, [dogPictureUri])
 */
    const launchImageLibrary = () => {
        const options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                const source = { uri: response.uri };
                // console.log('response', JSON.stringify(response));
                const { uri } = response;
                const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
                // setDogPictureThumbnailUri(source);
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

                /* callback({
                    action: 'MODAL_CONFIRM_PRESSED', type: addType, breed, subBreed, dogPicture,
                }); */
                // }
            }
        } else {
            setError(null);

            addDogCardModalMethods.confirmAddRandom();

            /* callback({
                action: 'MODAL_CONFIRM_PRESSED', type: addType, breed, subBreed, dogPicture,
            }); */
        }
    };

    const errorCallback = (result) => {
        setError(result);
    };

    const handleCustomAddChange = (event) => {
        if (event.target.value === 'RANDOM') {
            setFormEnabled(false);
        } else {
            setFormEnabled(true);
        }
        setAddType(event.target.value);
    };

    const uploadFile = async ({ target: { files } }) => {
        console.log(`dogAddModal files[0]:${files[0]}`);

        if (files[0]) {
            setDogPicture(files[0]);

            const fr = new FileReader();
            fr.onload = function () {
                imagePreviewRef.current.src = fr.result;
            };
            fr.readAsDataURL(files[0]);
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
        >
            <View
                style={styles.container}
            >
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
            </View>
        </Modal>
        /*

                <form
                    onSubmit={handleConfirmButton}
                    className='modalContent'>
                    <div className='modalContainer'>
                        <h1>Add Dog</h1>
                        <p>Add dog data</p>

                        <div className="radio">
                            <label>
                                <input type="radio" value="RANDOM"
                                    checked={addType === 'RANDOM'}
                                    onChange={handleCustomAddChange} />
                                Random dog
                            </label>
                        </div>
                        <div className="radio">
                            <label>
                                <input type="radio" value="CUSTOM"
                                    checked={addType === 'CUSTOM'}
                                    onChange={handleCustomAddChange} />
                                Custom dog
                            </label>
                        </div>

                        <SimpleErrorMessage
                            callback={errorCallback}
                            error={error}
                        />

                        {formEnabled &&
                            <>
                                <label className='inputLabel'>
                                    Breed:
                                </label>
                                <input
                                    className='dogInput'
                                    type='text'
                                    onChange={newValue => setBreed(newValue.target.value)}
                                    name='dogsBreed'

                                />
                                <label
                                    className='inputLabel'
                                >
                                    Sub-breed:
                                </label>
                                <input
                                    className='dogInput'
                                    type='text'
                                    onChange={newValue => setSubBreed(newValue.target.value)}
                                    name='dogsSubBreed' />

                                <label className="dogInput">
                                    {dogPicture &&
                                        <img
                                            alt='selected'
                                            ref={imagePreviewRef}
                                            style={{ width: '40px', height: '40px', paddingRight: '15px' }}
                                        />
                                    }
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="form-control profile-pic-uploader"
                                        onChange={uploadFile}
                                    />
                                </label>
                            </>
                        }
                        <div
                            className='modalClearfix'
                        >
                            <button
                                className='modalConfirmButton'
                                type='button'
                                onClick={handleConfirmButton}
                            >
                                Confirm
                            </button>
                            <button
                                className='modalCancelButton'
                                type='button'
                                onClick={handleCancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            } */
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
