import { firebaseStorage as storage } from '../config/Firebase';

export const storageDeleteByUrl = async (url) => {
    const imageRef = storage.refFromURL(url);
    await storage.ref(imageRef.fullPath).delete();
};