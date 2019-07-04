window.$ = window.jQuery = require("./node_modules/jquery/dist/jquery.min.js");
require("./node_modules/bootstrap/dist/js/bootstrap.min");

var fire = require("./firebase.js");
var questions = require("./questions.js");

var ifWelcome = function() {
  if (!window.location.search) $("#welcome").show();
};

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
  ifWelcome();
  $("#loader").hide();
};

var showAnswers = function(usr) {
  var bold = usr.answers;
  $("#answers .container").append(
    "<h1 class='text-center'>" +
      usr.username +
      " to má takto:</h1>" +
      "<div class='row text-center'><div class='col'><img src='" +
      usr.profile_picture +
      "'></div></div>"
  );
  console.log("Odpovědi " + usr.username);
  for (var i = 0; i < questions.length; i++) {
    var q = questions[i];
    var a = bold[i];
    var out = "";
    if (a === 0) continue;

    out += "<div class='row mt-5'>";
    out += '<div class="col-5 text-center bg-warning rounded"><h3>';
    out += q.one;
    out += "</h3></div>";
    out += '<div class="col-2 text-center align-middle">nebo</div>';
    out += '<div class="col-5 text-center bg-info rounded"><h3>';
    out += q.two;
    out += "?</h3></div>";
    out += "</div>";

    var bg = a == 1 ? "bg-warning" : "bg-info";

    out += "<div class='row mt-2'>";
    out += '<div class="col text-center rounded  shadow ' + bg + '"><h2>';
    out += a == 1 ? q.one : q.two;
    out += "!</h2></div>";
    out += "</div><hr>";

    console.log(q.one + ", nebo " + q.two + "?", a == 1 ? q.one : q.two);
    $("#answers .container").append(out);
  }
  $("#loader").hide();
  $("#answers").show();
  $("#welcome").hide();
};

//initialization
$(document).ready(function() {
  fire.onUserChange(manageUser);
  fire.init();

  $(".signfb").click(fire.signfb);
  $(".signtw").click(fire.signtw);

  if (window.location.search) {
    //show user xyz
    var alias = window.location.search.substr(1);
    console.log("Fetching " + alias);
    fire.getUidByAlias(alias).then(q => {
      fire.getUserInfo(q).then(q => {
        if (!q) {
          console.log("BAD USER");
          return;
        }
        showAnswers(q);
      });
    });
  } else {
  }
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
