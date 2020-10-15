import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

export const firebaseAuth = auth();
export const firebaseStorage = storage();
export const cloudFirestore = firestore();
export const firebaseRef = firebase;
