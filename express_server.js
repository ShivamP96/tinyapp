const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const { emailExistance, generateRandomString, urlsForUser  } = require("./helpers.js");
let cookieSession = require('cookie-session');

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(cookieSession({ 
  name: 'session',
  keys: ['asdf'],
  maxAge: 24 * 60 * 60 * 1000 
}));

// Default Database
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: 'aaa' },
  i3BoGr: { longURL: "https://www.google.ca", userID: 'user2RandomID' }
};

// Default users database
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur",10)
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk",10)
  },
  aaa: {
    id: "aaa",
    email: "a@a",
    password: bcrypt.hashSync("a",10)
  }
};

// Beginning of all post requests to the server
app.post("/urls", (request, response) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = {"longURL": request.body.longURL, "userID" : request.session.user_id};
  response.redirect(`/urls/${randomString}`);
});

app.post("/urls/:shortURL/delete", (request, response) => {
  if(request.session.user_id === urlDatabase[request.params.shortURL].userID){
    delete urlDatabase[request.params.shortURL];
    response.redirect(`/urls`);
  } else {
    response.status(403).send("no stop");
  }
});

app.post("/urls/:shortURL", (request, response) => {
  if(request.session.user_id === urlDatabase[request.params.shortURL].userID) {
    urlDatabase[request.params.shortURL].longURL = request.body.longURL;
    response.redirect(`/urls`);
  }
});

app.post("/login", (request, response) => {
  let id =  emailExistance(request.body.user_id, users).id;
  request.session.user_id = id;
  response.redirect(`/urls`);
});

app.post("/logout", (request, response) => {
  request.session = null;
  response.redirect("/urls");
});

app.post("/register", (request, response) => {
  let randomID = generateRandomString();
  let { email, password } = request.body;

  if (email.length === 0 || password.length === 0) {
    response.status(400).send("error 400");
  } else if (emailExistance(email, users)) {
    response.status(400).send("email already exists");
  } else {
    users[randomID] = { id: randomID, email: email, password: bcrypt.hashSync(password, 10)};
    request.session.user_id = randomID;
    response.redirect("/urls");
  }
});

app.post("/newLogin", (request, response) => {
  let user =  emailExistance(request.body.email, users);
  if (user === undefined) {
    response.status(403).send("Email Cannot be found");
  } else if (!(bcrypt.compareSync(request.body.password,user.password))) {
    response.status(403).send("Passwords don't match");
  } else {
    request.session.user_id = user.id;
    response.redirect(`/urls`);
  }
})

// Begninnering of get requests
app.get("/", (request, response) => {
  response.send("Hello! You have reached the most basic homepage, please go to localhost:8080/urls");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

app.get("/urls", (request, response) => {
  if (request.session.user_id) { 
    let databaseForUser = urlsForUser(request.session.user_id,urlDatabase);
    let templateVars = { user: users[request.session.user_id], urls: databaseForUser };
    response.render("urls_index", templateVars);
  } else {
    response.redirect("/newLogin"); 
  }
});

app.get("/newLogin", (request, response) => {
  let templateVars = { user: users[request.session.user_id], urls: urlDatabase };
  response.render("urls_login", templateVars)
})

app.get("/urls/new", (request, response) => {
  if(request.session.user_id) {
    let templateVars = {user: users[request.session.user_id]};
    response.render("urls_new", templateVars);
  } else {
    response.redirect("/newLogin");
  }
});

app.get("/urls/:shortURL", (request, response) => {
  if (request.session.user_id && urlDatabase[request.params.shortURL].userID === request.session.user_id) {
    let templateVars = {
      user: users[request.session.user_id],
      shortURL: request.params.shortURL,
      longURL: urlDatabase[request.params.shortURL].longURL
    };
    response.render("urls_show", templateVars);
  } else {
    response.redirect('/newLogin')
  }
});

app.get("/register", (request, response) => {
  let templateVars = {
    user: users[request.session.user_id]
  };
  response.render("urls_register", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  if (urlDatabase[request.params.shortURL]) {
    response.redirect(urlDatabase[request.params.shortURL].longURL);
  } else {
    response.send(404);
  }
});

app.get("*", (request, response) => {
  response.send("cannot access page, it doesn't exist");
  console.log(request.params)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});
