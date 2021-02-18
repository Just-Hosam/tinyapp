const assert = require('chai').assert;
const { generateRandomString, urlsForUser, getUserByEmail } = require('../helpers.js');

const urlDatabase = {
  "b2xVn2": { fullURL: "http://www.lighthouselabs.ca", userID: 'g9vqph' },
  "9sm5xK": { fullURL: "http://www.google.com", userID: 'g9vqph' },
  "90dbtr": { fullURL: "https://www.apple.com/ca/", userID: 'vqobij' },
  "cs95y6": { fullURL: "http://www.compass.com", userID: 'vqobij' }
};

const users = {
  "g9vqph": {
    id: "g9vqph", 
    email: "hosam_firas@hotmail.com", 
    password: "goldenkamuy"
  },
 "vqobij": {
    id: "vqobij",
    email: "firas_911@live.ca", 
    password: "temppass123"
  }
};

describe('Tests for generateRandomString', () => {
  it('should return a string of length 6', () => {
    const newStr = generateRandomString(urlDatabase);

    assert.strictEqual(newStr.length, 6);
  })

  it('should return 2 different strings when ran twice', () => {
    const firstStr = generateRandomString(urlDatabase);
    const secondStr = generateRandomString(urlDatabase);

    assert.isFalse(firstStr === secondStr);
  });
});