/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");

const categoriesController = require("./Controllers/categories/categoriesController");
const articlesController = require("./Controllers/articles/articlesController");
const usersController = require("./Controllers/users/usersController");

const Article = require("./Controllers/articles/Article");
const Category = require("./Controllers/categories/Category");
const User = require("./Controllers/users/User");

// View Engine
app.set("view engine", "ejs");

// Sessions
app.use(
    session({
        secret: "tshhquqiooajsadsg",
        cookie: { maxAge: 20000000 },
    })
);

// Static
app.use(
    express.static("public", {
        index: false,
        immutable: true,
        cacheControl: true,
    })
);

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database
connection
    .authenticate()
    .then(() => console.log("Successfully Connected."))
    .catch((Error) => console.log(Error));

// Routes
app.get("/", (req, res) => {
    Article.findAll({
        order: [["id", "ASC"]],
        limit: 5,
    }).then((articles) => {
        Category.findAll().then((categories) => {
            res.render("index", { articles: articles, categories: categories });
        });
    });
});

app.get("/:slug", (req, res) => {
    const slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug,
        },
    })
        .then((article) => {
            article != undefined
                ? Category.findAll().then((categories) => {
                      res.render("article", {
                          article: article,
                          categories: categories,
                      });
                  })
                : res.redirect("/");
        })
        .catch((Error) => {
            res.redirect("/");
            console.log(Error);
        });
});

app.get("/category/:slug", (req, res) => {
    const slug = req.params.slug;

    Category.findOne({
        where: { slug: slug },
        include: [{ model: Article }],
    }).then((category) => {
        category != undefined
            ? Category.findAll().then((categories) => {
                  res.render("index", {
                      articles: category.articles,
                      categories: categories,
                  });
              })
            : res.redirect("/");
    });
});

// Loading Controllers
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

// Start App
const door = 3000;
app.listen(door, () => console.log("App running on http://localhost:" + door));
