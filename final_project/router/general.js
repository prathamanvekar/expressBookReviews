const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user." });
  }

  if (users.some((user) => user.username === username)) {
    return res.status(404).json({ message: "User already exists!" });
  }

  users.push({ username: username, password: password });
  return res
    .status(200)
    .json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn], null, 4));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksArray = Object.keys(books);
  const getBooksByAuthor = [];

  booksArray.forEach((book) => {
    if (books[book].author === author) {
      getBooksByAuthor.push(books[book]);
    }
  });

  return res.send(JSON.stringify(getBooksByAuthor, null, 4));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksArray = Object.keys(books);
  const getBooksByTitle = [];

  booksArray.forEach((book) => {
    if (books[book].title === title) {
      getBooksByTitle.push(books[book]);
    }
  });

  return res.send(JSON.stringify(getBooksByTitle, null, 4));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

public_users.get("/async/books", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch books" });
  }
});

public_users.get("/async/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch book by ISBN" });
  }
});

public_users.get("/async/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch books by author" });
  }
});

public_users.get("/async/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch books by title" });
  }
});

module.exports.general = public_users;
