var loggedin = null;

var signtw = function() {
  var provider = new firebase.auth.TwitterAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      var token = result.credential.accessToken;
      var secret = result.credential.secret;
      // The signed-in user info.
      var user = result.user;
      //console.log(user)
      // ...
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
};

var signfb = function() {
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      var token = result.credential.accessToken;
      var secret = result.credential.secret;
      // The signed-in user info.
      var user = result.user;
      //console.log(user)
      // ...
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
};

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBtA8TMpA9hJI_akkYi2CKzVFevrbkjjuQ",
  authDomain: "jasno-853c1.firebaseapp.com",
  databaseURL: "https://jasno-853c1.firebaseio.com",
  projectId: "jasno-853c1",
  storageBucket: "",
  messagingSenderId: "351735967255",
  appId: "1:351735967255:web:9713d9135decf63b"
};

var userChangeCB = null;

// Initialize Firebase
var init = function() {
  firebase.initializeApp(firebaseConfig);

  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
      console.log("PERSOK");
    })
    .catch(function(e) {
      console.log("PERSERR", e);
    });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      //console.log("USER", user);
      loggedin = user;

      firebase
        .database()
        .ref("users/" + uid)
        .once("value")
        .then(function(snap) {
          snap = snap.val();
          if (!snap) {
            //zalozit!!!
            user.answers = [];
            user.alias = uid;
            firebase
              .database()
              .ref("users/" + uid)
              .set({
                username: user.displayName,
                email: user.email,
                profile_picture: user.photoURL,
                alias: user.alias,
                answers: user.answers
              });
          } else {
            user.answers = snap.answers;
            user.alias = snap.alias;
          }
          if (userChangeCB) userChangeCB(user);
        });

      /*
      firebase
        .database()
        .ref("users/" + uid)
        .set({
          username: displayName,
          email: email,
          profile_picture: photoURL
        });
        */
      // ...
    } else {
      if (userChangeCB) userChangeCB(null);
      //console.log("NOUSER");
      // User is signed out.
      // ...
    }
  });
};

var getUser = () => loggedin;

var onUserChange = cb => (userChangeCB = cb);

module.exports = { signtw, signfb, init, getUser, onUserChange };
