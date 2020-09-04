/* eslint-disable no-undef */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("./User");
const Auth = require("../../Middlewares/Authorization");

router.get("/admin/users", Auth, (req, res) => {
    User.findAll().then((users) => {
        res.render("admin/users/index", { users: users });
    });
});

router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/new");
});

router.post("/users/create", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    User.findAll({ where: { email: email } }).then((user) => {
        if (user == undefined) {
            User.create({
                email: email,
                password: hash,
            })
                .then(() => {
                    res.redirect("/admin/users");
                })
                .catch((Error) => {
                    console.log(Error);
                    res.redirect("/admin/users");
                });
        } else {
            res.redirect("/admin/users/create");
        }
    });
});

router.get("/admin/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/admin/authenticate", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ where: { email: email } }).then((user) => {
        if (user != undefined) {
            const correct = bcrypt.compareSync(password, user.password);

            if (correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email,
                };
                res.redirect("/admin/articles");
            } else {
                res.redirect("/");
            }
        } else {
            res.redirect("/login");
        }
    });
});

router.get("/admin/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;
