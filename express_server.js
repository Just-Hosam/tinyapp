const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

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
    password: "goldenkamuy"
  },
 "vqobij": {
    id: "vqobij",
    email: "firas_911@live.ca", 
    password: "temppass123"
  }
};

const generateRandomString = () => {
  const randomStr = Math.random().toString(36);
  return randomStr.slice(randomStr.length - 6);
};

const urlsForUser = id => {
  let specificURLs = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      specificURLs[url] = urlDatabase[url];
    }
  }
  return specificURLs;
};

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render('urls_login', templateVars);
});

app.post('/login', (req, res) => {
  for (const user in users) {
    if (users[user].email === req.body.email) {
      if (users[user].password === req.body.password) {
        res.cookie('user_id', users[user].id);
        res.redirect('/urls');
        return;
      }
    }
  }
  res.status(403).redirect('/login');
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Empty Fields!');
    return;
  }
  let newID = generateRandomString();
  while (users[newID]) {
    newID = generateRandomString();
  }
  for (const user in users) {
    if (users[user].email === req.body.email) {
      res.status(400).send('Email already present in our database.');
      return;
    }
  }
  users[newID] = {
    id: newID,
    email: req.body.email, 
    password: req.body.password
  }

  res.cookie('user_id', newID);
  res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shorty = req.params.shortURL;
  if (urlDatabase[shorty].userID === req.cookies.user_id) {
    delete urlDatabase[shorty];
    res.redirect('/urls');
  } else {
    res.status(403).send('Not happening');
  }
});

app.post('/urls/:shortURL/update', (req, res) => {
  const shorty = req.params.shortURL;
  if (urlDatabase[shorty].userID === req.cookies.user_id) {
    urlDatabase[shorty].fullURL = req.body.longURL;
    res.redirect('/urls');
  } else {
    res.status(403).send('Not Editing');
  }
});

app.get('/urls', (req, res) => {
  const specificURLs = urlsForUser(req.cookies.user_id);
  const templateVars = {
    urls: specificURLs,
    user: users[req.cookies.user_id]
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  if (users[req.cookies.user_id]) {
    const templateVars = {
      user: users[req.cookies.user_id]
    };
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
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
  urlDatabase[shortUrl] = { fullURL: longUrl , userID: req.cookies.user_id };
  res.redirect(`/urls/${shortUrl}`);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };

  if (req.cookies.user_id === urlDatabase[req.params.shortURL].userID) {
    templateVars.shortURL = req.params.shortURL;
    templateVars.longURL = urlDatabase[templateVars.shortURL].fullURL;
    res.render('urls_show', templateVars);
  } else {
    res.status(403).send('Not today');
  }
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    res.status(404).send('Not found');
  } else {
    const longURL = urlDatabase[shortURL].fullURL;
    res.redirect(longURL);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});