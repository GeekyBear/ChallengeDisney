const { Sequelize } = require('sequelize');
const modelCharacter = require('./models/db/charsModel');
const modelMovie = require('./models/db/moviesModel');

const sequelize = new Sequelize('postgres://postgres:H3adsh0t@localhost:5432/disney') // Example for postgres

modelCharacter(db);
modelMovie(db);

module.exports = {
    ...db.models,
    db
}
