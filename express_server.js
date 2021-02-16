const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = () => {
  const randomStr = Math.random().toString(36);
  return randomStr.slice(randomStr.length - 6);
};

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.post('/login', (req, res) => {
  const newUsername = req.body.username;
  res.cookie('username', newUsername);
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
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
    username: req.cookies.username
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
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
    username: req.cookies.username
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