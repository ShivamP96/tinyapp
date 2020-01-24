
// Helper functions 

function emailExistance(email, users) {
  let keys = Object.keys(users);

  for (const element of keys) {
    if (users[element].email === email) {
      return users[element];
    }
  }
  return undefined;
}

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

// Returns the URLs where the userID is equal to the id of the currently logged in user
function urlsForUser(id, urlDatabase) {
  let newDatabase = {}
  for (const item in urlDatabase) {
    if(urlDatabase[item].userID === id) {
      //console.log(urlDatabase[item])
       newDatabase[item] = urlDatabase[item];
    }
  }
  return newDatabase;
}


module.exports = { emailExistance, generateRandomString, urlsForUser }





