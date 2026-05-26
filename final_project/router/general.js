const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({ username: username, password: password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user. Please provide username and password." });
});

// ======================================================
// Task 2 – 5: Sync implementations (used internally)
// ======================================================

// Get the book list available in the shop (sync)
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN (sync)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author (sync)
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(
        (book) => book.author.toLowerCase() === author.toLowerCase()
    );

    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    }
});

// Get book details based on title (sync)
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(
        (book) => book.title.toLowerCase() === title.toLowerCase()
    );

    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book review by ISBN (sync)
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


// ======================================================
// Tasks 11–14: Async implementations using Promise / Async-Await + Axios
// ======================================================

// Task 11: Get all books using an async callback with Axios (Promise-based)
public_users.get('/async/books', function (req, res) {
    const getAllBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getAllBooks
        .then((allBooks) => {
            return res.status(200).json(allBooks);
        })
        .catch((err) => {
            return res.status(500).json({ message: "Error fetching books", error: err });
        });
});

// Task 12: Get book by ISBN using Promises
public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const getBookByISBN = new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject({ message: "Book not found" });
        }
    });

    getBookByISBN
        .then((book) => {
            return res.status(200).json(book);
        })
        .catch((err) => {
            return res.status(404).json(err);
        });
});

// Task 13: Get books by Author using async-await
public_users.get('/async/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const booksByAuthor = await new Promise((resolve, reject) => {
            const filtered = Object.values(books).filter(
                (book) => book.author.toLowerCase() === author.toLowerCase()
            );
            if (filtered.length > 0) {
                resolve(filtered);
            } else {
                reject({ message: "No books found for this author" });
            }
        });
        return res.status(200).json(booksByAuthor);
    } catch (err) {
        return res.status(404).json(err);
    }
});

// Task 14: Get books by Title using async-await
public_users.get('/async/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const booksByTitle = await new Promise((resolve, reject) => {
            const filtered = Object.values(books).filter(
                (book) => book.title.toLowerCase() === title.toLowerCase()
            );
            if (filtered.length > 0) {
                resolve(filtered);
            } else {
                reject({ message: "No books found with this title" });
            }
        });
        return res.status(200).json(booksByTitle);
    } catch (err) {
        return res.status(404).json(err);
    }
});


module.exports.general = public_users;
