const { assert } = require('chai');

const { emailExistance } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('emailExistance', function() {
  it('should return a user with valid email', function() {
    const user = emailExistance("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user.id, expectedOutput)
  });

  it('non-existant email is being searched up, it should return undefined', function() {
    const user = emailExistance("doesNotExist@example.com", testUsers)
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  })
});