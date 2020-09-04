/* eslint-disable no-undef */
const Sequelize = require("sequelize");
const connection = new Sequelize("blogx", "rafaelm", "Rafaelgomes1", {
    host: "mysql669.umbler.com",
    dialect: "mysql",
    timezone: "-03:00",
});

module.exports = connection;
