const express = require("express");
const app = express();
const PORT = 8080;

let cookieParser = require('cookie-parser');
app.use(cookieParser());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  let result = "";
  const alphaNumeric = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charLen = alphaNumeric.length;
  for(let i = 0; i < 6; i++) {
    result += alphaNumeric.charAt(Math.floor(Math.random() * charLen))
  }
  return result;
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
  response.redirect(`/urls`)
})
app.post("/urls/:shortURL", (request, response) => {
  console.log(request.body);
  urlDatabase[request.params.shortURL] = request.body.longURL;
  response.redirect(`/urls`);
})

app.post("/login", (request, response) => {
  response.cookie('username', request.body.username)
  response.redirect(`/urls`);
})

app.post("/logout", (request, response) => {
  response.clearCookie('username');
  response.redirect('/urls')

})

app.get("/", (request, response) => {
  response.send("Hello!");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase)
});

app.get("/hello", (request, response) => {
  response.send("<html><body>Hello<b>World</b></body></html>\n");
})

app.get("/urls", (request, response) => {
  let templateVars = {username: request.cookies["username"], urls: urlDatabase };
  response.render("urls_index", templateVars);
})

app.get("/urls/new", (request, response) => {
  let templateVars = {
    username: request.cookies["username"]}
  response.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (request, response) => {
  let templateVars = { username: request.cookies["username"], shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL]};
  response.render('urls_show', templateVars)
})



app.get("/u/:shortURL", (request, response) => {
  if(urlDatabase[request.params.shortURL]) {
    response.redirect(urlDatabase[request.params.shortURL])
  } else {
    response.send(404);
  }
  //response.redirect(longURL);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});

