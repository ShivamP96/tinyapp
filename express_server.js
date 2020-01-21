const express = require("express");
const app = express();
const PORT = 8080;

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

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.post("/urls", (request, response) => {
  console.log(request.body);
  response.send("Ok");
});

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
  let templateVars = { urls: urlDatabase };
  response.render("urls_index", templateVars);
})

app.get("/urls/new", (request, response) => {
  response.render("urls_new");
});

app.get("/urls/:shortURL", (request, response) => {
  let templateVars = { shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL]};
  response.render('urls_show', templateVars)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});

