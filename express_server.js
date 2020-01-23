const express = require("express");
const app = express();
const PORT = 8080;
const bcrypt = require('bcrypt');
const password = "purple-monkey-dinosaur";
const hashedPassword = bcrypt.hashSync(password, 10);

let cookieParser = require("cookie-parser");
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");



const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: 'aaa' },
  i3BoGr: { longURL: "https://www.google.ca", userID: 'user2RandomID' }
};

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
    if (users[element].email === email) {
      return users[element];
    }
  }
  return false;
}

// Returns the URLs where the userID is equal to the id of the currently logged in user
function urlsForUser(id) {
  let newDatabase = {}
  for (const item in urlDatabase) {
    if(urlDatabase[item].userID === id) {
      console.log(urlDatabase[item])
       newDatabase[item] = urlDatabase[item];
    }
  }
  return newDatabase;
}

app.post("/urls", (request, response) => {
      let randomString = generateRandomString();
      urlDatabase[randomString] = {"longURL": request.body.longURL, "userID": request.cookies.user_id}
      response.redirect('/urls')
});

app.post("/urls/:shortURL/delete", (request, response) => {
  if(request.cookies.user_id === urlDatabase[request.params.shortURL].userID){
    delete urlDatabase[request.params.shortURL];
  response.redirect(`/urls`);
  } else {
    response.status(403).send("no")
  }
  
});
app.post("/urls/:shortURL", (request, response) => {
  if(request.cookies.user_id === urlDatabase[request.params.shortURL].userID) {
     urlDatabase[request.params.shortURL] = request.body.longURL;
  response.redirect(`/urls`);
  }
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
    users[randomID] = { id: randomID, email: email, password: bcrypt.hashSync(password, 10)};
    response.cookie("user_id", randomID);
    response.redirect("/urls");
  }
});

app.post("/newLogin", (request, response) => {
  let user =  emailExistance(request.body.email, users)
  console.log(user)
  if (user === false) {
    response.status(403).send("Email Cannot be found")

  } else if (!(bcrypt.compareSync(request.body.password,user.password))) { //request.body.password !== user.password)

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
  
  if (request.cookies.user_id) { // if user exists
    let databaseForUser = urlsForUser(request.cookies.user_id);
    let templateVars = { user: users[request.cookies.user_id], urls: databaseForUser };
    response.render("urls_index", templateVars);
  } else {
    console.log("redirect to login cause u ain't logged in")
    response.redirect("/newLogin"); 
  }
});

app.get("/newLogin", (request, response) => {
    console.log("accessing newLogin page")
    let templateVars = { user: users[request.cookies.user_id], urls: urlDatabase };
    response.render("urls_login", templateVars)
})

app.get("/urls/new", (request, response) => {
  if(request.cookies.user_id) {
    let templateVars = {user: users[request.cookies.user_id]};
    response.render("urls_new", templateVars);

  } else {
    response.redirect("/newLogin");
  }
 
});

app.get("/urls/:shortURL", (request, response) => {
  if (request.cookies.user_id && urlDatabase[request.params.shortURL].userID === request.cookies.user_id) {
    let templateVars = {
    user: users[request.cookies.user_id],
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
    user: users[request.cookies.user_id]
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

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});
