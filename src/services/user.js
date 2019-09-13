import Parse from 'parse'
import { notification } from 'antd'
// import 'firebase/auth'
// import 'firebase/database'
// import 'firebase/storage'

// const firebaseConfig = {
//   // apiKey: 'AIzaSyAE5G0RI2LwzwTBizhJbnRKIKbiXQIA1dY',
//   apiKey: 'asdfdasdf',
//   authDomain: 'cleanui-72a42.firebaseapp.com',
//   databaseURL: 'https://cleanui-72a42.firebaseio.com',
//   projectId: 'cleanui-72a42',
//   storageBucket: 'cleanui-72a42.appspot.com',
//   messagingSenderId: '583382839121',
// }

// const firebaseApp = firebase.initializeApp(firebaseConfig)
// const firebaseAuth = firebase.auth
// export default firebaseApp
Parse.initialize("51y2vAkNlpb8Kztg9WjLeXt2wBUOlH3h");
Parse.serverURL = 'http://localhost:4040/parse/'

export async function login(email, password) {
  // return firebaseAuth()
  //   .signInWithEmailAndPassword(email, password)
  //   .then(() => true)
  //   .catch(error => {
  //     notification.warning({
  //       message: error.code,
  //       description: error.message,
  //     })
  //   });
  return Parse.User.logIn(email, password)
    .then(() => true)
    .catch(error => {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    });
}

export async function currentAccount() {
  // let userLoaded = false
  // function getCurrentUser(auth) {
  //   return new Promise((resolve, reject) => {
  //     if (userLoaded) {
  //       resolve(firebaseAuth.currentUser)
  //     }
  //     const unsubscribe = auth.onAuthStateChanged(user => {
  //       userLoaded = true
  //       unsubscribe()
  //       resolve(user)
  //     }, reject)
  //   })
  // }


  // return getCurrentUser(firebaseAuth())
  function getCurrentUser() {
    return new Promise((resolve) => {
      if (!Parse.User.current()) resolve(false);
      
      Parse.User.current().fetch().then((user) => {
        resolve({
          id: user.id,
          email: user.getEmail(),
          username: user.getUsername(),
          // eslint-disable-next-line no-underscore-dangle
          profilePhoto: user.attributes.profilePhoto ? user.attributes.profilePhoto._url : null,
        });
      }).catch(() => resolve(false));
    });
  }


  return getCurrentUser();
}

export async function logout() {
  // return firebaseAuth()
  //   .signOut()
  //   .then(() => true)
  return Parse.User.logOut().then(() => true).catch(() => true);
}
