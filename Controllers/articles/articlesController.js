/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const Article = require("./Article");
const Category = require("../categories/Category");
const Auth = require("../../Middlewares/Authorization");

router.get("/admin/articles", Auth, (req, res) => {
    Article.findAll({
        include: [{ model: Category }],
    }).then((articles) => {
        res.render("admin/articles/index", { articles: articles });
    });
});

router.get("/admin/articles/new", Auth, (req, res) => {
    Category.findAll().then((categories) => {
        res.render("admin/articles/new", { categories: categories });
    });
});

router.post("/articles/save", Auth, (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category,
    })
        .then(() => {
            res.redirect("/admin/articles");
        })
        .catch((Error) => console.log(Error));
});

router.post("/articles/delete", Auth, (req, res) => {
    const id = req.body.id;

    function getBack() {
        return res.redirect("/admin/articles");
    }

    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
                where: {
                    id: id,
                },
            }).then(() => {
                getBack();
            });
        } else {
            getBack();
        }
    } else {
        getBack();
    }
});

router.get("/admin/articles/edit/:id", Auth, (req, res) => {
    const id = req.params.id;

    isNaN(id) && res.redirect("/admin/articles");

    Article.findByPk(id)
        .then((article) => {
            article != undefined
                ? Category.findAll().then((categories) => {
                      res.render("admin/articles/edit", {
                          categories: categories,
                          article: article,
                      });
                  })
                : redirect("/admin/articles");
        })
        .catch((Error) => {
            console.log(Error);
            redirect("/admin/articles");
        });
});

router.post("/articles/update", Auth, (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article.update(
        {
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category,
        },
        {
            where: {
                id: id,
            },
        }
    )
        .then(() => {
            res.redirect("/admin/articles");
        })
        .catch((Error) => {
            alert("Something went wrong! Please, refresh the page!");
            console.log(Error);
        });
});

router.get("/articles/page/:num", (req, res) => {
    const page = req.params.num;
    let offset = 0;
    isNaN(page) || page == 0 ? (offset = 0) : (offset = parseInt(page) * 5);

    Article.findAndCountAll({
        limit: 5,
        offset: offset,
        order: [["id", "ASC"]],
    }).then((articles) => {
        let next;
        offset + 5 >= articles.count ? (next = false) : (next = true);

        const result = {
            page: parseInt(page),
            next: next,
            articles: articles,
        };

        Category.findAll().then((categories) => {
            res.render("admin/articles/page", {
                result: result,
                categories: categories,
            });
        });
    });
});

module.exports = router;
