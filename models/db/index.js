const { Sequelize, Op } = require('sequelize');
const modelCharacter = require('./models/charModel.js');
const modelMovie = require('./models/movieModel');
const modelGenre = require('./models/genreModel');

const db = new Sequelize('postgres://postgres:H3adsh0t@localhost:5432/disney', {
    logging: false
}) // Example for postgres

modelCharacter(db);
modelMovie(db);
modelGenre(db);

module.exports = {
    ...db.models,
    db,
    Op
}