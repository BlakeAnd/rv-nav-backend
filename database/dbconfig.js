const knex = require('knex')

const knexconfig = require('../knexfile.js')

const env = process.env.DB_ENV || "development"
console.log("dee ee", process.env.DB_ENV);
console.log("env", env);
module.exports = knex(knexconfig[env])