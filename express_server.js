const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

const userCreator = (req, res) => {
  let newID = generateRandomString();
  if (users[newID]) {
    newID = generateRandomString();
  }
  for (const user in users) {
    if (users[user].email === req.body.email) {
      return;
    }
  }
  users[newID] = {
    id: newID,
    email: req.body.email, 
    password: req.body.password
  }

  return newID;
};

const generateRandomString = () => {
  const randomStr = Math.random().toString(36);
  return randomStr.slice(randomStr.length - 6);
};

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

// app.post('/login', (req, res) => {
//   const newUsername = req.body.username;
//   res.cookie('username', newUsername);
//   res.redirect('/urls');
// });

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post('/register', (req, res) => {
  const newID = userCreator(req, res);
  res.cookie('user_id', newID);
  res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shorty = req.params.shortURL;
  delete urlDatabase[shorty];
  res.redirect('/urls');
});

app.post('/urls/:shortURL/update', (req, res) => {
  const shorty = req.params.shortURL;
  urlDatabase[shorty] = req.body.longURL;
  res.redirect('/urls');
});

app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id]
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render('urls_new', templateVars);
});

app.get('/register', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render('urls_register', templateVars);
});

app.post('/urls', (req, res) => {
  const longUrl = req.body.longURL;
  let shortUrl = generateRandomString();
  while (urlDatabase[shortUrl]) {
    shortUrl = generateRandomString();
  }
  urlDatabase[shortUrl] = longUrl;
  res.redirect(`/urls/${shortUrl}`);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  templateVars.shortURL = req.params.shortURL;
  templateVars.longURL = urlDatabase[templateVars.shortURL];
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    res.status(404).send('Not found');
  } else {
    const longURL = urlDatabase[shortURL];
    res.redirect(longURL);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});