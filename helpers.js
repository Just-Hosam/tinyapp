const generateRandomString = (database) => {
  const randomStr = Math.random().toString(36);
  let newID = randomStr.slice(randomStr.length - 6);
  while (database[newID]) {
    newID = generateRandomString();
  }
  return newID;
};

const urlsForUser = (id, database) => {
  let specificURLs = {};
  for (const url in database) {
    if (database[url].userID === id) {
      specificURLs[url] = database[url];
    }
  }
  return specificURLs;
};

const getUserByEmail = (email, database) => {
  for (const elem in database) {
    if (email === database[elem].email) {
      return database[elem];
    }
  }
};

const isNotLoggedIn = (req, database, callback) => {
  if (!database[req.session.user_id]) {
    callback();
    return;
  }
}

module.exports = {
  generateRandomString,
  urlsForUser,
  getUserByEmail,
  isNotLoggedIn
};