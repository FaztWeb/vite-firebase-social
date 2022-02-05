import { db } from "../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

export const savePost = async (post) => {
  return await addDoc(collection(db, "posts"), post);
};

export const getPosts = async () => {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const posts = querySnapshot.docs.map((doc) => doc.data());
  return posts;
};
