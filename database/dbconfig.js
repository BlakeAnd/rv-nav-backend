const knex = require('knex')

const knexconfig = require('../knexfile.js')

const env = process.env.DB_ENV || "development"
console.log("dee ee", process.env.DB_ENV);
module.exports = knex(knexconfig[env])