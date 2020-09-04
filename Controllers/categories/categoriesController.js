/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const Category = require("./Category");
const Auth = require("../../Middlewares/Authorization");

router.get("/admin/categories/new", Auth, (req, res) => {
    res.render("admin/categories/new");
});

router.post("/categories/save", Auth, (req, res) => {
    const title = req.body.title;

    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title),
        })
            .then(() => res.redirect("/admin/categories"))
            .catch((Error) => console.log(Error));
    } else {
        res.redirect("/admin/categories/new");
    }
});

router.get("/admin/categories", Auth, (req, res) => {
    Category.findAll()
        .then((categories) => {
            res.render("admin/categories/index", { categories: categories });
        })
        .catch((Error) => console.log(Error));
});

router.post("/categories/delete", Auth, (req, res) => {
    const id = req.body.id;

    function getBack() {
        return res.redirect("/admin/categories");
    }

    if (id != undefined) {
        if (!isNaN(id)) {
            Category.destroy({
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

router.get("/admin/categories/edit/:id", Auth, (req, res) => {
    const id = req.params.id;

    isNaN(id) && res.redirect("/admin/categories");

    Category.findByPk(id)
        .then((category) => {
            if (category != undefined) {
                res.render("admin/categories/edit", { category: category });
            } else {
                redirect("/admin/categories");
            }
        })
        .catch((Error) => {
            console.log(Error);
            redirect("/admin/categories");
        });
});

router.post("/categories/update", Auth, (req, res) => {
    const id = req.body.id;
    const title = req.body.title;

    Category.update(
        { title: title, slug: slugify(title) },
        {
            where: {
                id: id,
            },
        }
    )
        .then(() => {
            res.redirect("/admin/categories");
        })
        .catch((Error) => console.log(Error));
});

module.exports = router;
