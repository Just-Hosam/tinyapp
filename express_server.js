const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const { generateRandomString, urlsForUser, getUserByEmail } = require('./helpers');

// bcrypt issue solution, please have ONE active at a time.
const bcrypt = require('bcrypt');
// const bcrypt = require('bcryptjs');

const app = express();
const PORT = 8080; // default port 8080

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
    password: bcrypt.hashSync("goldenkamuy", 10) // kept for testing
  },
  "vqobij": {
    id: "vqobij",
    email: "firas_911@live.ca",
    password: bcrypt.hashSync("temppass123", 10) // kept for testing
  }
};

// middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['mynameishosam']
}));

// Root route GET
app.get('/', (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect('/urls');
    return;
  }
  res.redirect('/login');
});

// Login page GET
app.get('/login', (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect('/urls');
    return;
  }
  const templateVars = { user: users[req.session.user_id] };
  res.render('urls_login', templateVars);
});

// Login page POST
app.post('/login', (req, res) => {
  const curEmail = req.body.email;
  const curPassword = req.body.password;
  const curUser = getUserByEmail(curEmail, users);
  if (curUser) {
    if (bcrypt.compareSync(curPassword, curUser.password)) {
      req.session.user_id = curUser.id;
      res.redirect('/urls');
      return;
    }
  }
  res.status(403).redirect('/login');
});

// Logout POST
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

// Resgister page GET
app.get('/register', (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect('/urls');
    return;
  }
  const templateVars = { user: users[req.session.user_id] };
  res.render('urls_register', templateVars);
});

// Resgister page POST
app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Empty Fields!');
    return;
  }
  if (getUserByEmail(req.body.email, users)) {
    res.status(400).send('Email already present in our database.');
    return;
  }
  const newID = generateRandomString(users);
  users[newID] = {
    id: newID,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10)
  };
  req.session.user_id = newID;
  res.redirect('/urls');
});

// New longURL page GET
app.get('/urls/new', (req, res) => {
  if (users[req.session.user_id]) {
    const templateVars = { user: users[req.session.user_id] };
    res.render('urls_new', templateVars);
    return;
  }
  res.redirect('/login');
});

// New longURL page POST
app.post('/urls', (req, res) => {
  if (users[req.session.user_id]) {
    const longUrl = req.body.longURL;
    const shortUrl = generateRandomString(urlDatabase);
    urlDatabase[shortUrl] = { fullURL: longUrl , userID: req.session.user_id };
    res.redirect(`/urls/${shortUrl}`);
    return;
  }
  res.status(403).send('You need to be logged in to access this');
});

// URLs table GET
app.get('/urls', (req, res) => {
  const specificURLs = urlsForUser(req.session.user_id, urlDatabase);
  const templateVars = {
    urls: specificURLs,
    user: users[req.session.user_id]
  };
  res.render('urls_index', templateVars);
});

// URLs table POST
app.post('/urls/:shortURL/delete', (req, res) => {
  const shorty = req.params.shortURL;
  if (urlDatabase[shorty].userID === req.session.user_id) {
    delete urlDatabase[shorty];
    res.redirect('/urls');
    return;
  }
  res.status(403).send('Cannot delete another user\'s URL');
});

// Short URL edit page GET
app.get('/urls/:shortURL', (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
      const templateVars = { user: users[req.session.user_id] };
      templateVars.shortURL = req.params.shortURL;
      templateVars.longURL = urlDatabase[templateVars.shortURL].fullURL;
      res.render('urls_show', templateVars);
    } else {
      res.status(403).send('Not today');
    }
    return;
  }
  res.status(404).send('Not found');
});

// Short URL edit page POST
app.post('/urls/:shortURL/update', (req, res) => {
  const shorty = req.params.shortURL;
  if (urlDatabase[shorty].userID === req.session.user_id) {
    urlDatabase[shorty].fullURL = req.body.longURL;
    res.redirect('/urls');
    return;
  }
  res.status(403).send('Cannot edit another user\'s URL');
});

// Redirecting route for end user GET
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL]) {
    const longURL = urlDatabase[shortURL].fullURL;
    res.redirect(longURL);
    return;
  }
  res.status(404).send('Not found');
});

// Catch all route GET
app.get('*', (req, res) => {
  res.status(400).redirect('/login');
});

// Catch all route POST
app.post('*', (req, res) => {
  res.status(400).redirect('/login');
});

// Server port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});