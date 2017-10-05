import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyDQiAP5PfSYOaPItrqLJRU50m4k3asw1Ys",
  authDomain: "minutes-vart.firebaseapp.com",
  databaseURL: "https://minutes-vart.firebaseio.com",
  projectId: "minutes-vart",
  storageBucket: "minutes-vart.appspot.com",
  messagingSenderId: "987319535932"
};

firebase.initializeApp(config);
export default firebase;