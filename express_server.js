const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080

const urlDatabase = {

};

const generateRandomString = () => {
  const randomStr = Math.random().toString(36);
  return randomStr.slice(randomStr.length - 6);
};

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.post('/urls', (req, res) => {
  const longUrl = req.body.longURL;
  const shortUrl = generateRandomString();
  urlDatabase[shortUrl] = longUrl;
  res.redirect(`/urls/:${shortUrl}`);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {};
  templateVars.shortURL = req.params.shortURL.slice(1),
  templateVars.longURL = urlDatabase[templateVars.shortURL]
  res.render('urls_show', templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});