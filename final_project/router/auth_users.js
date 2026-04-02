const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  return !users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  return users.some(
    (user) => user.username === username && user.password === password,
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username: username }, "access", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = {
      accessToken,
    };

    return res.status(200).send("User successfully logged in");
  }

  return res
    .status(208)
    .json({ message: "Invalid Login. Check username and password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const isbn = req.params.isbn;
  const review = req.query.review;

  books[isbn].reviews[username] = review;
  return res
    .status(200)
    .json({ message: "Review added/modified successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.user.username;
  const isbn = req.params.isbn;

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  }

  return res
    .status(404)
    .json({ message: "Review does not exist for this user" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
