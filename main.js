import { savePost, getPosts } from "./models/Post";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { getPostURL, uploadPostImage } from "./storage";

import Toastify from "toastify-js";

import "bootswatch/dist/lux/bootstrap.min.css";
import "./style.css";
import "toastify-js/src/toastify.css";

const postForm = document.getElementById("postForm");

postForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let post = {
    content: postForm["content"].value,
  };

  try {
    const fileInput = document.getElementById("imagePost");
    if (fileInput.files[0]) {
      const snapshot = await uploadPostImage(fileInput.files[0]);
      post.photoURL = await getPostURL(snapshot.ref);
    }
    await savePost(post);
    Toastify({ text: "New Post Saved", close: true }).showToast();
    postForm["content"].value = "";
  } catch (error) {
    console.error(error);
  }
});

const renderPosts = (posts = []) => {
  const postsList = document.getElementById("postsList");
  posts.forEach((post) => {
    postsList.innerHTML += `
      <div class="card px-4 mb-2">
        ${
          post.photoURL
            ? `<img src="${post.photoURL}" alt="${post.content}" />`
            : ""
        }
        <div className="card-body">
          <p>${post.content}</p>
        </div>
      </div>
    `;
  });
};

const btnLoginGoogle = document.getElementById("btn-login-google");
btnLoginGoogle.addEventListener("click", async (e) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

const btnLogout = document.getElementById("logout");
btnLogout.addEventListener("click", async (e) => {
  await signOut(auth);
});

const renderProfile = (user) => {
  const username = document.getElementById("username");
  const img = document.getElementById("userProfileImage");
  username.innerText = user.displayName;
  img.src = user.photoURL;
};

const loggedIn = document.querySelectorAll(".loggedIn");
const loggedOut = document.querySelectorAll(".loggedOut");
onAuthStateChanged(auth, async (user) => {
  console.log(user);
  if (user) {
    loggedOut.forEach((link) => (link.style.display = "block"));
    loggedIn.forEach((link) => (link.style.display = "none"));
    const posts = await getPosts();
    renderPosts(posts);
    renderProfile(user);
  } else {
    loggedOut.forEach((link) => (link.style.display = "none"));
    loggedIn.forEach((link) => (link.style.display = "block"));
    renderPosts([]);
  }
});
