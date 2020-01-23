// const users = {
//   userRandomID: {
//     id: "userRandomID",
//     email: "user@example.com",
//     password: "purple-monkey-dinosaur"
//   },
//   user2RandomID: {
//     id: "user2RandomID",
//     email: "user2@example.com",
//     password: "dishwasher-funk"
//   }
// };
// //console.log(users)

// //console.log(Object.keys(users)[0][]);

// function emailExistance(email, users) {
//   let keys = Object.keys(users);

//   for (const element in users) {
//     console.log(users[element].email);
//     if (users[element].email === email) {
//       return true;
//     }
//   }
//   return false;
// }

// console.log(emailExistance("user2@example.com", users));
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" }
};

    for (let url in urlDatabase) {
      console.log("This is URL",urlDatabase[url].longURL)
      //console.log("this is urlDatabase", urlDatabase[url])
    }

    
    