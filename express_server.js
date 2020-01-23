const express = require("express");
const app = express();
const PORT = 8080;

let cookieParser = require("cookie-parser");
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

function generateRandomString() {
  let result = "";
  const alphaNumeric =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charLen = alphaNumeric.length;
  for (let i = 0; i < 6; i++) {
    result += alphaNumeric.charAt(Math.floor(Math.random() * charLen));
  }
  return result;
}

function emailExistance(email, users) {
  let keys = Object.keys(users);

  for (const element of keys) {
    console.log(users[element].email);
    if (users[element].email === email) {
      return users[element];
    }
  }
  return false;
}

app.post("/urls", (request, response) => {
  
  let randomString = generateRandomString();
  //console.log(randomString);
  urlDatabase[randomString] = request.body.longURL;
  //console.log(request.body);
  response.redirect(`/urls/${randomString}`);
});

app.post("/urls/:shortURL/delete", (request, response) => {
  // console.log(request.params.shortURL)
  // console.log(urlDatabase)
  delete urlDatabase[request.params.shortURL];
  response.redirect(`/urls`);
});
app.post("/urls/:shortURL", (request, response) => {
  //console.log(request.body);
  urlDatabase[request.params.shortURL] = request.body.longURL;
  response.redirect(`/urls`);
});

app.post("/login", (request, response) => {

 let id =  emailExistance(request.body.user_id, users).id
  response.cookie("user_id", id);
  response.redirect(`/urls`);
});

app.post("/logout", (request, response) => {
  response.clearCookie("user_id");
  response.redirect("/urls");
});

app.post("/register", (request, response) => {
  let randomID = generateRandomString();
  let { email, password } = request.body;

  if (email.length === 0 || password.length === 0) {
    response.status(400).send("error 400");
  } else if (emailExistance(email, users)) {
    console.log(emailExistance(email, users));
    response.status(400).send("email already exists");
  } else {
    users[randomID] = { id: randomID, email: email, password: password };
    response.cookie("user_id", randomID);
    response.redirect("/urls");
  }
});

app.post("/newLogin", (request, response) => {
console.log(request.body)
  let user =  emailExistance(request.body.email, users)
  

  if (user === false) {
    response.status(403).send("Email Cannot be found")
  } else if (request.body.password !== user.password) {
    response.status(403).send("Passwords don't match")
  } else {
    response.cookie("user_id", user.id);
    response.redirect(`/urls`);
  }
})

app.get("/", (request, response) => {
  response.send("Hello!");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

app.get("/hello", (request, response) => {
  response.send("<html><body>Hello<b>World</b></body></html>\n");
});

app.get("/urls", (request, response) => {
  // does cookie exist with a value, that means someones logged in, then redirect
  let templateVars = { user: users[request.cookies.user_id], urls: urlDatabase };
  response.render("urls_index", templateVars);
});

app.get("/newLogin", (request, response) => {
    console.log("accessing newLogin page")
    let templateVars = { user: users[request.cookies.user_id], urls: urlDatabase };
    response.render("urls_login", templateVars)
})

app.get("/urls/new", (request, response) => {
  if(request.cookies.user_id) {
    let templateVars = {
      user: users[request.cookies.user_id]
    };
    response.render("urls_new", templateVars);
  } else {
    response.redirect("/newLogin");
  }
 
});

app.get("/urls/:shortURL", (request, response) => {
  let templateVars = {
    user: users[request.cookies.user_id],
    shortURL: request.params.shortURL,
    longURL: urlDatabase[request.params.shortURL]
  };
  response.render("urls_show", templateVars);
});

app.get("/register", (request, response) => {
  let templateVars = {
    user: users[request.cookies.user_id]
  };
  response.render("urls_register", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  if (urlDatabase[request.params.shortURL]) {
    response.redirect(urlDatabase[request.params.shortURL]);
  } else {
    response.send(404);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});
