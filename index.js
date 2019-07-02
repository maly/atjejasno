window.$ = window.jQuery = require("./node_modules/jquery/dist/jquery.min.js");
require("./node_modules/bootstrap/dist/js/bootstrap.min");

var fire = require("./firebase.js");

var manageUser = function(user) {
  console.log(user);
  if (user) {
    // photoURL
    $("body").addClass("auth");
    $("body").removeClass("noauth");
    $("#nouser").html("<img src=" + user.photoURL + ">");
    $("#profil").attr("href", "?" + user.alias);
  } else {
    $("body").addClass("noauth");
    $("body").removeClass("auth");
    $("#nouser").html('<i class="far fa-user-circle"></i>');
    $("#profil").attr("href", "#");
  }
};

//initialization
$(document).ready(function() {
  fire.onUserChange(manageUser);
  fire.init();

  $(".signfb").click(fire.signfb);
  $(".signtw").click(fire.signtw);
});

window.onhashchange = function locationHashChanged(e) {
  //console.log( location.hash );
  console.log(e.oldURL, e.newURL);
  //console.log(e.newURL,location.hash)
  if (e.oldURL == e.newURL) return;
  if (location.hash === "#logout") {
    firebase.auth().signOut();
    location.hash = "";
    return;
  }
};
