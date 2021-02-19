# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

<br>

## Getting Started

<br>

- Install all dependencies.
```
npm install
```
- Run the development web server using the following command.
```
node express_server.js
```

- Visit the following URL to start navigating the web application *after* running the server
```
http://localhost:8080/
```

### ***bcrypt issue possible solution***

After running `npm install` you might encounter an error regarding `bcrypt` depending on the system OS that you are running. 

A `bcryptjs` package is installed and commented at the start of `express_server.js` file. Please comment the import for `bcrypt` and comment-out the `bcryptjs` import.

<br>

## Final Product

!["Screenshot of Login page"](https://github.com/Just-Hosam/tinyapp/blob/master/docs/Login-page.png)
!["Screenshot of new URL page"](https://github.com/Just-Hosam/tinyapp/blob/master/docs/New_URL_page.png)
!["Screenshot of URL edit page"](https://github.com/Just-Hosam/tinyapp/blob/master/docs/URL_edit_page.png)
!["Screenshot of URLs table"](https://github.com/Just-Hosam/tinyapp/blob/master/docs/URLs_table.png)

## Known Issues/Bugs

- Compatability problems with some operating systems due to `bcrypt`. (see [bcrypt issue possible solution](#bcrypt-issue-possible-solution))

## Future Features

- Method overide implementation
- Tracking number of visits for each URL
- Tracking number of UNIQUE visits for each URL
- Add a timestamp to each time a URL is visited

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- bcryptjs

## Acknowledgments

This project was worked on intandem with [Nolan Eckert](https://github.com/Nolan-E/tinyapp).