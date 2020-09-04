/* eslint-disable no-undef */

function authorization(req, res, next) {
    req.session.user != undefined ? next() : res.redirect("/admin/login");
}

module.exports = authorization;
