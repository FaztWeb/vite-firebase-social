import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebase";

const storage = getStorage(app);

export const uploadPostImage = async (file) => {
  const storageRef = ref(storage, "photos/" + file.name);
  return await uploadBytes(storageRef, file);
};

export const getPostURL = async (fileRef) => {
  return await getDownloadURL(ref(fileRef));
};
