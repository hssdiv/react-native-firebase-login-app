import { firebaseRef as firebase, cloudFirestore as firestore } from '../config/Firebase';

export const firestoreDogCollectionAdd = async (dogToAdd) => {
    await firestore.collection('dogs').add({
        ...dogToAdd,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
    });
};
